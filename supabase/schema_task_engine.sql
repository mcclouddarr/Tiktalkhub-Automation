-- Task Engine supplemental schema

-- 1) Task runs (each execution attempt of a task)
create table if not exists public.task_runs (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid references public.tasks(id) on delete cascade,
  persona_id uuid references public.personas(id) on delete set null,
  device_id uuid references public.devices(id) on delete set null,
  proxy_id uuid references public.proxies(id) on delete set null,
  status text default 'queued', -- queued|running|paused|completed|failed|terminated
  started_at timestamptz,
  finished_at timestamptz,
  meta jsonb,
  created_at timestamptz default now()
);

create index if not exists task_runs_task_id_idx on public.task_runs(task_id);
create index if not exists task_runs_status_idx on public.task_runs(status);

-- 2) Task logs (structured logs per run)
create table if not exists public.task_logs (
  id bigserial primary key,
  run_id uuid references public.task_runs(id) on delete cascade,
  level text default 'info', -- info|warn|error|debug
  ts timestamptz default now(),
  message text,
  data jsonb
);

create index if not exists task_logs_run_id_idx on public.task_logs(run_id);
create index if not exists task_logs_ts_idx on public.task_logs(ts);

-- RLS
alter table public.task_runs enable row level security;
alter table public.task_logs enable row level security;

create policy if not exists "r:runs" on public.task_runs for select using (auth.role() = 'authenticated');
create policy if not exists "i:runs" on public.task_runs for insert with check (auth.role() = 'authenticated');
create policy if not exists "u:runs" on public.task_runs for update using (auth.role() = 'authenticated');

create policy if not exists "r:logs" on public.task_logs for select using (auth.role() = 'authenticated');
create policy if not exists "i:logs" on public.task_logs for insert with check (auth.role() = 'authenticated');

-- Realtime on tasks and runs
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.task_runs;

select pg_notify('pgrst', 'reload schema');