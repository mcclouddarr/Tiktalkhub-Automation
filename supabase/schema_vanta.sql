-- Vanta AI schema

create table if not exists public.vanta_fingerprint_scores (
  id uuid primary key default uuid_generate_v4(),
  device_id uuid references public.devices(id) on delete cascade,
  success_rate numeric default 0.5,
  total_runs integer default 0,
  last_used_at timestamptz,
  platform_meta jsonb,
  created_at timestamptz default now()
);
create index if not exists vanta_fp_scores_device_idx on public.vanta_fingerprint_scores(device_id);

create table if not exists public.vanta_proxy_scores (
  id uuid primary key default uuid_generate_v4(),
  proxy_id uuid references public.proxies(id) on delete cascade,
  success_rate numeric default 0.5,
  total_runs integer default 0,
  last_used_at timestamptz,
  geo_meta jsonb,
  created_at timestamptz default now()
);
create index if not exists vanta_proxy_scores_proxy_idx on public.vanta_proxy_scores(proxy_id);

create table if not exists public.vanta_behavior_profiles (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  parameters jsonb not null,
  created_at timestamptz default now()
);

create table if not exists public.vanta_session_feedback (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid references public.task_runs(id) on delete cascade,
  persona_id uuid references public.personas(id) on delete set null,
  device_id uuid references public.devices(id) on delete set null,
  proxy_id uuid references public.proxies(id) on delete set null,
  outcome text, -- pass|fail|blocked
  signals jsonb, -- captcha, 403, redirect, blank, timings
  created_at timestamptz default now()
);
create index if not exists vanta_feedback_run_idx on public.vanta_session_feedback(run_id);

alter table public.vanta_fingerprint_scores enable row level security;
alter table public.vanta_proxy_scores enable row level security;
alter table public.vanta_behavior_profiles enable row level security;
alter table public.vanta_session_feedback enable row level security;

create policy if not exists "r:w" on public.vanta_fingerprint_scores for select using (auth.role() = 'authenticated');
create policy if not exists "i:w" on public.vanta_fingerprint_scores for insert with check (auth.role() = 'authenticated');
create policy if not exists "u:w" on public.vanta_fingerprint_scores for update using (auth.role() = 'authenticated');

create policy if not exists "r:wp" on public.vanta_proxy_scores for select using (auth.role() = 'authenticated');
create policy if not exists "i:wp" on public.vanta_proxy_scores for insert with check (auth.role() = 'authenticated');
create policy if not exists "u:wp" on public.vanta_proxy_scores for update using (auth.role() = 'authenticated');

create policy if not exists "r:bp" on public.vanta_behavior_profiles for select using (auth.role() = 'authenticated');
create policy if not exists "i:bp" on public.vanta_behavior_profiles for insert with check (auth.role() = 'authenticated');

create policy if not exists "r:fb" on public.vanta_session_feedback for select using (auth.role() = 'authenticated');
create policy if not exists "i:fb" on public.vanta_session_feedback for insert with check (auth.role() = 'authenticated');

select pg_notify('pgrst', 'reload schema');