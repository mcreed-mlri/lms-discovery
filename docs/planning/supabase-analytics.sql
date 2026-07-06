-- LACE analytics layer — DRAFT, not applied to the live database.
-- Companion to supabase-learning-items.sql (catalog) and the proposed
-- events/feedback/profiles tables in platform-wiki/supabase-schema.html.
-- Canonical metric definitions: Brightspace-Manager/docs/planning/metrics-framework.md
--
-- What this adds:
--   1. survey_responses — landing zone for Brightspace survey exports,
--      30/60-day follow-up surveys, and any future instrument.
--   2. org_rosters — hand-maintained reach denominators (updated ~quarterly).
--   3. feedback.flag extension — abandonment reasons from the in-hub
--      stalled-course nudge (too_busy, too_long, need_help).
--   4. The allowed event_type registry for the events table, including the
--      course-wrapper beacon types (page_view, video_progress, session_heartbeat).
--
-- FERPA rules carried over from the schema doc: minimum necessary columns,
-- no names/emails in payloads, reporting views must suppress cells with n < 5.

-- 1. SURVEY RESPONSES ------------------------------------------------------
-- One row per answered question. survey_key + question_key map to the
-- instruments in Brightspace-Manager/docs/planning/survey-instruments.md,
-- so dashboards can be built before the first real response arrives.
create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  -- e.g. 'end_of_course_v1', 'pre_course_v1', 'followup_30d_v1'
  survey_key text not null,
  -- e.g. 'worth_my_time', 'confidence_post', 'applied_in_practice'
  question_key text not null,
  -- FK to profiles.id once profiles exists; nullable — anonymous responses
  -- (Brightspace anonymous surveys export without identity) stay anonymous.
  user_id uuid,
  item_id uuid references public.learning_items(id) on delete set null,
  -- Raw answer as text; response_numeric doubles it for 1–5 scale items so
  -- aggregates never parse strings.
  response_value text not null,
  response_numeric int check (response_numeric between 1 and 5),
  -- 1 = reaction, 2 = learning, 3 = application (Kirkpatrick)
  kirkpatrick_level smallint check (kirkpatrick_level in (1, 2, 3)),
  source text not null check (source in ('brightspace_export', 'followup_email', 'in_hub')),
  -- When the learner answered (from the export), not when we imported it.
  collected_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_survey_responses_item
  on public.survey_responses (item_id, survey_key, question_key);

alter table public.survey_responses enable row level security;
-- Write path: service role only (import scripts / server routes). Learners
-- never read raw survey rows; aggregates are computed server-side with the
-- n >= 5 suppression rule.

-- 2. ORG ROSTERS -----------------------------------------------------------
-- The reach denominator: how many people *could* be using LACE, per org and
-- role. Maintained by hand from program contact lists, refreshed quarterly.
-- Without this, "74 active learners" has no meaning.
create table if not exists public.org_rosters (
  id uuid primary key default gen_random_uuid(),
  org text not null,
  -- Mirrors profiles.license_status vocabulary.
  role text not null check (role in ('licensed_attorney', 'paralegal', 'law_student', 'other_advocate')),
  headcount int not null check (headcount > 0),
  -- Snapshot date; keep history (new row per refresh) so reach trends are honest.
  as_of date not null,
  created_at timestamptz not null default now(),
  constraint org_rosters_snapshot_key unique (org, role, as_of)
);

alter table public.org_rosters enable row level security;
-- Read/write: service role + admin only. Headcounts are not sensitive per se,
-- but small numbers here are exactly the n < 5 cells reporting must suppress.

-- 3. FEEDBACK FLAG EXTENSION ------------------------------------------------
-- The stalled-course nudge ("Still working on X?") writes abandonment reasons
-- into the existing proposed feedback.flag column. Content-quality flags and
-- abandonment reasons share the column; they are distinguished by value.
-- If feedback already exists with the original check, replace it:
--   alter table public.feedback drop constraint if exists feedback_flag_check;
alter table public.feedback
  add constraint feedback_flag_check check (flag in (
    -- content-quality flags (item page)
    'outdated', 'unclear', 'not_relevant',
    -- abandonment reasons (stalled-course nudge)
    'too_busy', 'too_long', 'need_help'
  ));
-- 'need_help' rows are surfaced in the Brightspace Manager needs-attention
-- feed for human follow-up — they are a support request, not just a metric.

-- 4. EVENT TYPE REGISTRY -----------------------------------------------------
-- The events table stays schemaless on event_type by design, but the API
-- route MUST enforce this allowlist (and per-type allowed metadata keys)
-- server-side before inserting. Documented here as the single reference.
--
--   hub (learning-hub client):
--     search              metadata: { result_count, filter_count }  -- never the query text with PII
--     catalog_click       metadata: { }
--     course_start        metadata: { }
--     page_exit           metadata: { seconds_on_page }
--   course-wrapper beacon (brightspace-courses templates):
--     page_view           metadata: { topic_key }
--     video_progress      metadata: { topic_key, video_key, pct }   -- pct in {25,50,75,90,100}
--     session_heartbeat   metadata: { topic_key, interval_seconds }
--
-- Beacon events may arrive without a Supabase user_id (learners are inside
-- Brightspace, not the hub). They carry item-level identity only; do not
-- add bs_user_id to beacon payloads without legal sign-off on the
-- user-attributes matrix.
