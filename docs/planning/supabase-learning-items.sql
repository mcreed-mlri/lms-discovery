create table if not exists public.learning_items (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'brightspace',
  provider_course_id text,
  provider_module_id text,
  item_type text not null check (item_type in ('course', 'module', 'path')),
  title text not null,
  description text,
  practice_area text,
  level text,
  duration_label text,
  brightspace_url text,
  metadata jsonb not null default '{}',
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.learning_items
  add constraint learning_items_provider_course_id_key
  unique (provider_course_id);

alter table public.learning_items enable row level security;

grant usage on schema public to service_role;
grant select, insert, update, delete on table public.learning_items to service_role;

insert into public.learning_items (
  item_type,
  title,
  description,
  practice_area,
  level,
  duration_label,
  brightspace_url,
  metadata
) values (
  'course',
  'Brightspace API Test Course',
  'Temporary row for testing LACE/Supabase connectivity.',
  'All Practice Areas',
  'Foundations',
  '30 min',
  'https://mlri.brightspace.com/d2l/home',
  '{"audience":["Program staff"],"status":"Test"}'
);

-- Keep browser/anon access closed during the spike.
-- The Next.js health route uses SUPABASE_SERVICE_ROLE_KEY server-side.

-- NEXT STEP: apply supabase-rls-learning-items.sql (same folder) before any
-- production use — it adds the status lifecycle column, read-only grants,
-- and the active-items-only read policy.
