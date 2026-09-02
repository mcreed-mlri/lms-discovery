-- Catalog table for Brightspace-backed learning items.
create extension if not exists pgcrypto;

create table if not exists public.learning_items (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'brightspace',
  provider_course_id text not null,
  item_type text not null check (item_type in ('course', 'path', 'resource')),
  title text not null,
  description text,
  practice_area text,
  level text,
  duration_label text,
  brightspace_url text,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint learning_items_provider_course_key unique (provider, provider_course_id)
);

create index if not exists idx_learning_items_provider_course
  on public.learning_items (provider, provider_course_id);

create index if not exists idx_learning_items_title
  on public.learning_items (title);
