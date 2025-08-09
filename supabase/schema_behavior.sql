-- Behavior datasets for Vanta engine
create table if not exists public.behavior_datasets (
  id uuid primary key default uuid_generate_v4(),
  persona_id uuid references public.personas(id) on delete cascade,
  browsing_patterns jsonb,
  typing_patterns jsonb,
  mouse_movement jsonb,
  mobile_touch_data jsonb,
  timezone_locale jsonb,
  device_usage_timeline jsonb,
  fingerprint_markers jsonb,
  search_navigation jsonb,
  google_account_behavior jsonb,
  source_metadata jsonb,
  created_at timestamptz default now()
);

alter table public.behavior_datasets enable row level security;
create policy if not exists "r:behavior" on public.behavior_datasets for select using (auth.role() = 'authenticated');
create policy if not exists "i:behavior" on public.behavior_datasets for insert with check (auth.role() = 'authenticated');

select pg_notify('pgrst', 'reload schema');