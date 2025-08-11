-- Vanta AI schema

-- Fingerprint Scores Table
CREATE TABLE IF NOT EXISTS public.vanta_fingerprint_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
  success_rate NUMERIC DEFAULT 0.5,
  total_runs INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  platform_meta JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS vanta_fp_scores_device_idx ON public.vanta_fingerprint_scores(device_id);

-- Proxy Scores Table
CREATE TABLE IF NOT EXISTS public.vanta_proxy_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proxy_id UUID REFERENCES public.proxies(id) ON DELETE CASCADE,
  success_rate NUMERIC DEFAULT 0.5,
  total_runs INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  geo_meta JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS vanta_proxy_scores_proxy_idx ON public.vanta_proxy_scores(proxy_id);

-- Behavior Profiles Table
CREATE TABLE IF NOT EXISTS public.vanta_behavior_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  parameters JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session Feedback Table (Removed reference to non-existent task_runs)
CREATE TABLE IF NOT EXISTS public.vanta_session_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id UUID, -- Removed foreign key reference
  persona_id UUID REFERENCES public.personas(id) ON DELETE SET NULL,
  device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
  proxy_id UUID REFERENCES public.proxies(id) ON DELETE SET NULL,
  outcome TEXT, -- pass|fail|blocked
  signals JSONB, -- captcha, 403, redirect, blank, timings
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS vanta_feedback_run_idx ON public.vanta_session_feedback(run_id);

-- Enable Row Level Security
ALTER TABLE public.vanta_fingerprint_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vanta_proxy_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vanta_behavior_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vanta_session_feedback ENABLE ROW LEVEL SECURITY;

-- Policies for Fingerprint Scores
CREATE POLICY "Allow read for authenticated users" ON public.vanta_fingerprint_scores 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON public.vanta_fingerprint_scores 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON public.vanta_fingerprint_scores 
FOR UPDATE USING (auth.role() = 'authenticated');

-- Policies for Proxy Scores
CREATE POLICY "Allow read for authenticated users" ON public.vanta_proxy_scores 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON public.vanta_proxy_scores 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON public.vanta_proxy_scores 
FOR UPDATE USING (auth.role() = 'authenticated');

-- Policies for Behavior Profiles
CREATE POLICY "Allow read for authenticated users" ON public.vanta_behavior_profiles 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON public.vanta_behavior_profiles 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON public.vanta_behavior_profiles 
FOR UPDATE USING (auth.role() = 'authenticated');

-- Policies for Session Feedback
CREATE POLICY "Allow read for authenticated users" ON public.vanta_session_feedback 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON public.vanta_session_feedback 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON public.vanta_session_feedback 
FOR UPDATE USING (auth.role() = 'authenticated');

-- Force PostgREST to reload schema
SELECT pg_notify('pgrst', 'reload schema');
