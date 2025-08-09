create table if not exists public.task_templates (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  steps jsonb not null,
  created_at timestamptz default now()
);

alter table public.task_templates enable row level security;
create policy if not exists "r:templates" on public.task_templates for select using (auth.role() = 'authenticated');
create policy if not exists "i:templates" on public.task_templates for insert with check (auth.role() = 'authenticated');

select pg_notify('pgrst', 'reload schema');