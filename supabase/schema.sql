-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- 1. devices
create table if not exists public.devices (
  id uuid primary key default uuid_generate_v4(),
  device_name text not null,
  browser_type text not null,
  viewport text,
  os text,
  user_agent text,
  platform text,
  fingerprint_config jsonb,
  real_device_emulation_profile_url text,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. proxies
create table if not exists public.proxies (
  id uuid primary key default uuid_generate_v4(),
  ip text not null,
  port integer not null,
  username text,
  password text,
  proxy_type text not null,
  status text default 'active',
  last_check_time timestamptz,
  health_score numeric,
  location_metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. cookies
create table if not exists public.cookies (
  id uuid primary key default uuid_generate_v4(),
  persona_id uuid,
  cookie_blob jsonb,
  expires_at timestamptz,
  created_at timestamptz default now(),
  foreign key (persona_id) references public.personas(id) on delete set null
);

-- 4. personas
create table if not exists public.personas (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  age integer,
  gender text,
  backstory text,
  profile_picture text,
  device_id uuid,
  cookie_id uuid,
  proxy_id uuid,
  tags text[],
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  foreign key (device_id) references public.devices(id) on delete set null,
  foreign key (cookie_id) references public.cookies(id) on delete set null,
  foreign key (proxy_id) references public.proxies(id) on delete set null
);

-- 5. sessions
create table if not exists public.sessions (
  id uuid primary key default uuid_generate_v4(),
  persona_id uuid not null,
  device_id uuid,
  start_time timestamptz default now(),
  end_time timestamptz,
  session_type text,
  proxy_id uuid,
  activity_log jsonb,
  status text,
  created_at timestamptz default now(),
  foreign key (persona_id) references public.personas(id) on delete cascade,
  foreign key (device_id) references public.devices(id) on delete set null,
  foreign key (proxy_id) references public.proxies(id) on delete set null
);

-- 6. referrals
create table if not exists public.referrals (
  id uuid primary key default uuid_generate_v4(),
  source_persona_id uuid,
  target_link text not null,
  click_time timestamptz,
  conversion_time timestamptz,
  status text,
  created_at timestamptz default now(),
  foreign key (source_persona_id) references public.personas(id) on delete set null
);

-- 7. tasks
create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  persona_id uuid,
  task_type text,
  execution_mode text,
  target_url text,
  scheduled_time timestamptz,
  status text,
  created_at timestamptz default now(),
  foreign key (persona_id) references public.personas(id) on delete set null
);

-- 8. vanta_updates
create table if not exists public.vanta_updates (
  id uuid primary key default uuid_generate_v4(),
  change_type text,
  payload jsonb,
  model_version text,
  update_notes text,
  updated_at timestamptz default now()
);

-- Storage buckets (to be created via storage API/UI): cookies, screenshots, logs
-- Realtime publication
alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.personas;

-- Updated timestamps triggers
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_devices_updated_at
before update on public.devices
for each row execute procedure public.set_updated_at();

create trigger set_personas_updated_at
before update on public.personas
for each row execute procedure public.set_updated_at();

create trigger set_proxies_updated_at
before update on public.proxies
for each row execute procedure public.set_updated_at();

-- Basic RLS enabling and policies
alter table public.personas enable row level security;
alter table public.devices enable row level security;
alter table public.sessions enable row level security;
alter table public.proxies enable row level security;
alter table public.cookies enable row level security;
alter table public.referrals enable row level security;
alter table public.tasks enable row level security;
alter table public.vanta_updates enable row level security;

create policy "Allow read for all auth users" on public.personas for select using (auth.role() = 'authenticated');
create policy "Allow read for all auth users" on public.devices for select using (auth.role() = 'authenticated');
create policy "Allow read for all auth users" on public.sessions for select using (auth.role() = 'authenticated');
create policy "Allow read for all auth users" on public.proxies for select using (auth.role() = 'authenticated');
create policy "Allow read for all auth users" on public.cookies for select using (auth.role() = 'authenticated');
create policy "Allow read for all auth users" on public.referrals for select using (auth.role() = 'authenticated');
create policy "Allow read for all auth users" on public.tasks for select using (auth.role() = 'authenticated');
create policy "Allow read for all auth users" on public.vanta_updates for select using (auth.role() = 'authenticated');

-- Basic insert/update for authenticated users
create policy "Allow insert for all auth users" on public.personas for insert with check (auth.role() = 'authenticated');
create policy "Allow insert for all auth users" on public.devices for insert with check (auth.role() = 'authenticated');
create policy "Allow insert for all auth users" on public.sessions for insert with check (auth.role() = 'authenticated');
create policy "Allow insert for all auth users" on public.proxies for insert with check (auth.role() = 'authenticated');
create policy "Allow insert for all auth users" on public.cookies for insert with check (auth.role() = 'authenticated');
create policy "Allow insert for all auth users" on public.referrals for insert with check (auth.role() = 'authenticated');
create policy "Allow insert for all auth users" on public.tasks for insert with check (auth.role() = 'authenticated');
create policy "Allow insert for all auth users" on public.vanta_updates for insert with check (auth.role() = 'authenticated');

create policy "Allow update for all auth users" on public.personas for update using (auth.role() = 'authenticated');
create policy "Allow update for all auth users" on public.devices for update using (auth.role() = 'authenticated');
create policy "Allow update for all auth users" on public.sessions for update using (auth.role() = 'authenticated');
create policy "Allow update for all auth users" on public.proxies for update using (auth.role() = 'authenticated');
create policy "Allow update for all auth users" on public.cookies for update using (auth.role() = 'authenticated');
create policy "Allow update for all auth users" on public.referrals for update using (auth.role() = 'authenticated');
create policy "Allow update for all auth users" on public.tasks for update using (auth.role() = 'authenticated');
create policy "Allow update for all auth users" on public.vanta_updates for update using (auth.role() = 'authenticated');