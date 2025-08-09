-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- 1. Devices Table
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

-- 2. Proxies Table
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

-- 3. Personas Table
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
  updated_at timestamptz default now()
);

-- 4. Cookies Table
create table if not exists public.cookies (
  id uuid primary key default uuid_generate_v4(),
  persona_id uuid,
  cookie_blob jsonb,
  expires_at timestamptz,
  created_at timestamptz default now(),
  foreign key (persona_id) references public.personas(id) on delete set null
);

-- 5. Sessions Table
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

-- 6. Referrals Table
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

-- 7. Tasks Table
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

-- 8. Vanta Updates Table
create table if not exists public.vanta_updates (
  id uuid primary key default uuid_generate_v4(),
  change_type text,
  payload jsonb,
  model_version text,
  update_notes text,
  updated_at timestamptz default now()
);

-- Final Foreign Key Constraints for Personas Table
alter table public.personas 
  add foreign key (device_id) references public.devices(id) on delete set null,
  add foreign key (cookie_id) references public.cookies(id) on delete set null,
  add foreign key (proxy_id) references public.proxies(id) on delete set null;
