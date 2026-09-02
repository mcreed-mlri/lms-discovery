-- Verification script for learning_items RLS.
-- Run after migrations in a transaction in the Supabase SQL editor.
begin;

insert into public.learning_items (
  provider,
  provider_course_id,
  item_type,
  title,
  status
) values
  ('rls-test', 'active', 'course', 'RLS active test item', 'active'),
  ('rls-test', 'hidden', 'course', 'RLS hidden test item', 'hidden_from_learners')
on conflict (provider, provider_course_id) do update
set title = excluded.title,
    status = excluded.status;

set local role anon;

do $$
declare
  visible_count integer;
  hidden_count integer;
begin
  select count(*) into visible_count
  from public.learning_items
  where provider = 'rls-test';

  select count(*) into hidden_count
  from public.learning_items
  where provider = 'rls-test'
    and status <> 'active';

  if visible_count <> 1 then
    raise exception 'Expected anon to see exactly one active rls-test row, saw %', visible_count;
  end if;

  if hidden_count <> 0 then
    raise exception 'Anon can see non-active learning_items rows';
  end if;
end $$;

do $$
begin
  insert into public.learning_items (provider, provider_course_id, item_type, title)
  values ('rls-test', 'must-fail', 'course', 'Anon write should fail');

  raise exception 'Anon unexpectedly inserted a learning_items row';
exception
  when insufficient_privilege then null;
end $$;

rollback;
