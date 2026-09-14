-- RLS hardening for public.learning_items.
alter table public.learning_items
  add column if not exists status text not null default 'active';

do $$
begin
  alter table public.learning_items
    add constraint learning_items_status_check
    check (status in ('active', 'archived', 'retired', 'hidden_from_learners'));
exception
  when duplicate_object then null;
end $$;

alter table public.learning_items enable row level security;

revoke insert, update, delete, truncate, references, trigger
  on table public.learning_items
  from anon, authenticated;

grant select on table public.learning_items to anon, authenticated;

drop policy if exists "Public can read active learning items" on public.learning_items;

create policy "Public can read active learning items"
  on public.learning_items
  for select
  to anon, authenticated
  using (status = 'active');
