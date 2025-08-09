-- RLS/security tightening for Tiktalkhub
-- Apply in Supabase SQL editor or via scripts/apply_schema.js

-- Ensure RLS is enabled (already set, re-assert safe)
alter table if exists public.personas enable row level security;
alter table if exists public.devices enable row level security;
alter table if exists public.sessions enable row level security;
alter table if exists public.proxies enable row level security;
alter table if exists public.cookies enable row level security;
alter table if exists public.tasks enable row level security;
alter table if exists public.task_runs enable row level security;
alter table if exists public.task_logs enable row level security;
alter table if exists public.task_templates enable row level security;
alter table if exists public.referral_campaigns enable row level security;
alter table if exists public.referral_tasks enable row level security;
alter table if exists public.referral_analytics_snapshots enable row level security;

-- Replace broad policies with authenticated-only access
-- Read-only for all authenticated
create policy if not exists personas_read on public.personas for select to authenticated using (true);
create policy if not exists devices_read on public.devices for select to authenticated using (true);
create policy if not exists sessions_read on public.sessions for select to authenticated using (true);
create policy if not exists proxies_read on public.proxies for select to authenticated using (true);
create policy if not exists cookies_read on public.cookies for select to authenticated using (true);
create policy if not exists tasks_read on public.tasks for select to authenticated using (true);
create policy if not exists task_runs_read on public.task_runs for select to authenticated using (true);
create policy if not exists task_logs_read on public.task_logs for select to authenticated using (true);
create policy if not exists task_templates_read on public.task_templates for select to authenticated using (true);
create policy if not exists referral_campaigns_read on public.referral_campaigns for select to authenticated using (true);
create policy if not exists referral_tasks_read on public.referral_tasks for select to authenticated using (true);
create policy if not exists referral_analytics_read on public.referral_analytics_snapshots for select to authenticated using (true);

-- Inserts/updates restricted to authenticated; for sensitive ops prefer service role in Edge Functions
create policy if not exists personas_write on public.personas for insert to authenticated with check (true);
create policy if not exists personas_update on public.personas for update to authenticated using (true) with check (true);
create policy if not exists devices_write on public.devices for insert to authenticated with check (true);
create policy if not exists devices_update on public.devices for update to authenticated using (true) with check (true);
create policy if not exists proxies_write on public.proxies for insert to authenticated with check (true);
create policy if not exists proxies_update on public.proxies for update to authenticated using (true) with check (true);
create policy if not exists cookies_write on public.cookies for insert to authenticated with check (true);
create policy if not exists tasks_write on public.tasks for insert to authenticated with check (true);
create policy if not exists tasks_update on public.tasks for update to authenticated using (true) with check (true);
create policy if not exists task_templates_write on public.task_templates for insert to authenticated with check (true);
create policy if not exists task_templates_update on public.task_templates for update to authenticated using (true) with check (true);

-- Storage policies: require authenticated for objects in private buckets
-- Replace bucket names if different
-- Run in Storage policies area or via SQL:
-- create policy "authenticated read" on storage.objects for select to authenticated using (bucket_id in ('cookies','logs','screenshots'));
-- create policy "authenticated upload" on storage.objects for insert to authenticated with check (bucket_id in ('cookies','logs','screenshots'));
-- create policy "authenticated update" on storage.objects for update to authenticated using (bucket_id in ('cookies','logs','screenshots')) with check (bucket_id in ('cookies','logs','screenshots'));
-- create policy "authenticated delete" on storage.objects for delete to authenticated using (bucket_id in ('cookies','logs','screenshots'));

-- After updating policies
select pg_notify('pgrst', 'reload schema');