-- Run once in the Supabase SQL Editor. Login tracking starts after deployment.
create table if not exists public.demo_logins (
  google_sub text primary key,
  email text not null,
  first_login_at timestamptz not null default now(),
  last_login_at timestamptz not null default now(),
  login_count bigint not null default 1 check (login_count > 0)
);

alter table public.demo_logins enable row level security;
revoke all on public.demo_logins from public, anon, authenticated;
grant select, insert, update on public.demo_logins to service_role;

-- Increment atomically so simultaneous logins cannot overwrite each other.
create or replace function public.record_demo_login(p_google_sub text, p_email text)
returns void
language sql
security invoker
set search_path = ''
as $$
  insert into public.demo_logins (google_sub, email)
  values (p_google_sub, p_email)
  on conflict (google_sub) do update
    set email = excluded.email,
        last_login_at = greatest(public.demo_logins.last_login_at, now()),
        login_count = public.demo_logins.login_count + 1;
$$;

revoke all on function public.record_demo_login(text, text) from public, anon, authenticated;
grant execute on function public.record_demo_login(text, text) to service_role;

-- One row per person is visible in Table Editor > demo_logins.
-- Summary (run whenever needed):
-- select count(*) as people, coalesce(sum(login_count), 0) as total_logins
-- from public.demo_logins;
