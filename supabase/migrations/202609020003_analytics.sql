-- LACE analytics layer.
create extension if not exists pgcrypto;

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references public.learning_items(id) on delete set null,
  rating int check (rating between 1 and 5),
  flag text,
  notes text check (char_length(notes) <= 600),
  created_at timestamptz not null default now(),
  constraint feedback_signal_check check (rating is not null or flag is not null)
);

alter table public.feedback drop constraint if exists feedback_flag_check;
alter table public.feedback
  add constraint feedback_flag_check check (flag in (
    'outdated', 'unclear', 'not_relevant',
    'too_busy', 'too_long', 'need_help'
  ));

alter table public.feedback enable row level security;

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  survey_key text not null,
  question_key text not null,
  user_id uuid,
  item_id uuid references public.learning_items(id) on delete set null,
  response_value text not null,
  response_numeric int check (response_numeric between 1 and 5),
  kirkpatrick_level smallint check (kirkpatrick_level in (1, 2, 3)),
  source text not null check (source in ('brightspace_export', 'followup_email', 'in_hub')),
  collected_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_survey_responses_item
  on public.survey_responses (item_id, survey_key, question_key);

alter table public.survey_responses enable row level security;

create table if not exists public.org_rosters (
  id uuid primary key default gen_random_uuid(),
  org text not null,
  role text not null check (role in ('licensed_attorney', 'paralegal', 'law_student', 'other_advocate')),
  headcount int not null check (headcount > 0),
  as_of date not null,
  created_at timestamptz not null default now(),
  constraint org_rosters_snapshot_key unique (org, role, as_of)
);

alter table public.org_rosters enable row level security;
