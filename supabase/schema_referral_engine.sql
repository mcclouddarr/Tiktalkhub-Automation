-- Referral Engine schema

-- Campaigns
create table if not exists public.referral_campaigns (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  persona_id uuid references public.personas(id) on delete set null,
  device_shell_id uuid references public.devices(id) on delete set null,
  proxy_id uuid references public.proxies(id) on delete set null,
  cookie_id uuid references public.cookies(id) on delete set null,
  traffic_source text not null, -- tiktok, facebook, instagram, x, whatsapp, custom
  notes text,
  created_at timestamptz default now()
);

create index if not exists referral_campaigns_persona_id_idx on public.referral_campaigns(persona_id);

-- Tasks
create table if not exists public.referral_tasks (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid references public.referral_campaigns(id) on delete cascade,
  persona_id uuid references public.personas(id) on delete set null,
  status text default 'pending', -- pending|running|complete|failed
  session_id uuid references public.sessions(id) on delete set null,
  vanta_config_snapshot jsonb,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists referral_tasks_campaign_id_idx on public.referral_tasks(campaign_id);
create index if not exists referral_tasks_status_idx on public.referral_tasks(status);

-- Sessions per referral task
create table if not exists public.referral_sessions (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid references public.referral_tasks(id) on delete cascade,
  entry_point_url text,
  user_actions jsonb, -- clicks, scrolls, durations, pauses, cta
  exit_path text,
  converted boolean default false,
  replay_log_url text,
  created_at timestamptz default now()
);

create index if not exists referral_sessions_task_id_idx on public.referral_sessions(task_id);

-- Aggregated analytics snapshots
create table if not exists public.referral_analytics_snapshots (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid references public.referral_campaigns(id) on delete cascade,
  date date not null,
  clicks integer default 0,
  conversions integer default 0,
  bounce_rate numeric,
  referral_depth integer,
  ip_distribution jsonb,
  platform_performance jsonb,
  created_at timestamptz default now()
);

create index if not exists referral_analytics_campaign_date_idx on public.referral_analytics_snapshots(campaign_id, date);

-- Vanta AI referral configuration
create table if not exists public.referral_ai_config (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid references public.referral_campaigns(id) on delete cascade,
  training_dataset_id uuid,
  platform_behavior_config jsonb,
  fraud_detection_config jsonb,
  created_at timestamptz default now()
);

-- RLS
alter table public.referral_campaigns enable row level security;
alter table public.referral_tasks enable row level security;
alter table public.referral_sessions enable row level security;
alter table public.referral_analytics_snapshots enable row level security;
alter table public.referral_ai_config enable row level security;

create policy if not exists "r:campaigns" on public.referral_campaigns for select using (auth.role() = 'authenticated');
create policy if not exists "i:campaigns" on public.referral_campaigns for insert with check (auth.role() = 'authenticated');
create policy if not exists "u:campaigns" on public.referral_campaigns for update using (auth.role() = 'authenticated');

create policy if not exists "r:ref_tasks" on public.referral_tasks for select using (auth.role() = 'authenticated');
create policy if not exists "i:ref_tasks" on public.referral_tasks for insert with check (auth.role() = 'authenticated');
create policy if not exists "u:ref_tasks" on public.referral_tasks for update using (auth.role() = 'authenticated');

create policy if not exists "r:ref_sessions" on public.referral_sessions for select using (auth.role() = 'authenticated');
create policy if not exists "i:ref_sessions" on public.referral_sessions for insert with check (auth.role() = 'authenticated');

create policy if not exists "r:ref_analytics" on public.referral_analytics_snapshots for select using (auth.role() = 'authenticated');
create policy if not exists "i:ref_analytics" on public.referral_analytics_snapshots for insert with check (auth.role() = 'authenticated');

create policy if not exists "r:ref_ai" on public.referral_ai_config for select using (auth.role() = 'authenticated');
create policy if not exists "i:ref_ai" on public.referral_ai_config for insert with check (auth.role() = 'authenticated');
create policy if not exists "u:ref_ai" on public.referral_ai_config for update using (auth.role() = 'authenticated');

-- Realtime on referral tasks for live dashboards
alter publication supabase_realtime add table public.referral_tasks;
alter publication supabase_realtime add table public.referral_sessions;

-- Reload API cache
select pg_notify('pgrst', 'reload schema');