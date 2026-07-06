-- RLS hardening for public.learning_items
-- ==========================================================================
-- Run in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).
-- Idempotent: safe to run more than once.
--
-- Model:
--   * The catalog is public-readable, but ONLY rows with status = 'active'.
--   * anon / authenticated roles can never write.
--   * The sync route writes with SUPABASE_SERVICE_ROLE_KEY, which bypasses
--     RLS entirely — that key must never leave the server.
--   * Lifecycle statuses follow the platform decision log: never hard-delete;
--     archive/retire/hide instead.
--
-- IMPORTANT for future tables: any table that will hold learner data
-- (bar_number, upl_acknowledged_date, engagement events, ...) must get an
-- RLS design like this BEFORE the first row is inserted, not after.
-- ==========================================================================

-- 1) Lifecycle status column (default keeps existing rows visible).
alter table public.learning_items
  add column if not exists status text not null default 'active';

do $$
begin
  alter table public.learning_items
    add constraint learning_items_status_check
    check (status in ('active', 'archived', 'retired', 'hidden_from_learners'));
exception
  when duplicate_object then null; -- constraint already exists
end $$;

-- 2) Make sure RLS is on (no-op if already enabled).
alter table public.learning_items enable row level security;

-- 3) Browser-facing roles: read-only at the SQL-grant level, on top of RLS.
revoke insert, update, delete, truncate, references, trigger
  on table public.learning_items
  from anon, authenticated;

grant select on table public.learning_items to anon, authenticated;

-- 4) The only policy: everyone may read active items. No write policies
--    exist, so writes are service-role-only by construction.
drop policy if exists "Public can read active learning items" on public.learning_items;

create policy "Public can read active learning items"
  on public.learning_items
  for select
  to anon, authenticated
  using (status = 'active');

-- ==========================================================================
-- Verification (run after applying):
--   1. As service role (SQL editor default): select count(*) from learning_items;
--        -> sees every row regardless of status.
--   2. Simulate the browser role:
--        set local role anon;                -- inside a transaction
--        select count(*) from learning_items; -- only status='active' rows
--        insert into learning_items (item_type, title)
--          values ('course', 'x');            -- must FAIL (permission denied)
-- ==========================================================================
