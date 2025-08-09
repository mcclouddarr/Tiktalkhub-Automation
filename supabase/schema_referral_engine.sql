-- Schema: Referral Engine
-- Contains tables, indexes, RLS policies, and realtime configuration

-- Ensure uuid-ossp extension is available for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Referral Campaigns
CREATE TABLE IF NOT EXISTS public.referral_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  persona_id UUID REFERENCES public.personas(id) ON DELETE SET NULL,
  device_shell_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
  proxy_id UUID REFERENCES public.proxies(id) ON DELETE SET NULL,
  cookie_id UUID REFERENCES public.cookies(id) ON DELETE SET NULL,
  traffic_source TEXT NOT NULL CHECK (
    traffic_source IN ('tiktok', 'facebook', 'instagram', 'x', 'whatsapp', 'custom')
  ),
  notes TEXT,
  status TEXT DEFAULT 'draft' CHECK (
    status IN ('draft', 'active', 'paused', 'completed')
  ),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Referral Campaigns
CREATE INDEX IF NOT EXISTS referral_campaigns_persona_id_idx ON public.referral_campaigns(persona_id);
CREATE INDEX IF NOT EXISTS referral_campaigns_status_idx ON public.referral_campaigns(status);
CREATE INDEX IF NOT EXISTS referral_campaigns_traffic_source_idx ON public.referral_campaigns(traffic_source);

-- Referral Tasks
CREATE TABLE IF NOT EXISTS public.referral_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES public.referral_campaigns(id) ON DELETE CASCADE,
  persona_id UUID REFERENCES public.personas(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'running', 'complete', 'failed')
  ),
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  vanta_config_snapshot JSONB,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  error_log TEXT
);

-- Indexes for Referral Tasks
CREATE INDEX IF NOT EXISTS referral_tasks_campaign_id_idx ON public.referral_tasks(campaign_id);
CREATE INDEX IF NOT EXISTS referral_tasks_status_idx ON public.referral_tasks(status);
CREATE INDEX IF NOT EXISTS referral_tasks_persona_id_idx ON public.referral_tasks(persona_id);

-- Referral Sessions
CREATE TABLE IF NOT EXISTS public.referral_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES public.referral_tasks(id) ON DELETE CASCADE,
  entry_point_url TEXT,
  user_actions JSONB, -- clicks, scrolls, durations, pauses, cta
  exit_path TEXT,
  converted BOOLEAN DEFAULT FALSE,
  replay_log_url TEXT,
  performance_metrics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Referral Sessions
CREATE INDEX IF NOT EXISTS referral_sessions_task_id_idx ON public.referral_sessions(task_id);
CREATE INDEX IF NOT EXISTS referral_sessions_converted_idx ON public.referral_sessions(converted);

-- Referral Analytics Snapshots
CREATE TABLE IF NOT EXISTS public.referral_analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES public.referral_campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  bounce_rate NUMERIC(5,2) CHECK (bounce_rate BETWEEN 0 AND 100),
  referral_depth INTEGER,
  ip_distribution JSONB,
  platform_performance JSONB,
  unique_visitors INTEGER DEFAULT 0,
  total_engagement_time INTERVAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Referral Analytics Snapshots
CREATE INDEX IF NOT EXISTS referral_analytics_campaign_date_idx ON public.referral_analytics_snapshots(campaign_id, date);
CREATE INDEX IF NOT EXISTS referral_analytics_date_idx ON public.referral_analytics_snapshots(date);

-- Vanta AI Referral Configuration
CREATE TABLE IF NOT EXISTS public.referral_ai_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES public.referral_campaigns(id) ON DELETE CASCADE,
  training_dataset_id UUID,
  platform_behavior_config JSONB,
  fraud_detection_config JSONB,
  ai_model_name TEXT,
  confidence_threshold NUMERIC(4,2) CHECK (confidence_threshold BETWEEN 0 AND 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Referral AI Config
CREATE INDEX IF NOT EXISTS referral_ai_config_campaign_id_idx ON public.referral_ai_config(campaign_id);

-- Row Level Security (RLS) Enablement
ALTER TABLE public.referral_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_ai_config ENABLE ROW LEVEL SECURITY;

-- Role-Based Policies
-- Campaigns Policies
CREATE POLICY IF NOT EXISTS "r:campaigns" ON public.referral_campaigns 
    FOR SELECT 
    USING (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY IF NOT EXISTS "i:campaigns" ON public.referral_campaigns 
    FOR INSERT 
    WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY IF NOT EXISTS "u:campaigns" ON public.referral_campaigns 
    FOR UPDATE 
    USING (auth.role() IN ('authenticated', 'service_role'));

-- Tasks Policies
CREATE POLICY IF NOT EXISTS "r:ref_tasks" ON public.referral_tasks 
    FOR SELECT 
    USING (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY IF NOT EXISTS "i:ref_tasks" ON public.referral_tasks 
    FOR INSERT 
    WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY IF NOT EXISTS "u:ref_tasks" ON public.referral_tasks 
    FOR UPDATE 
    USING (auth.role() IN ('authenticated', 'service_role'));

-- Sessions Policies
CREATE POLICY IF NOT EXISTS "r:ref_sessions" ON public.referral_sessions 
    FOR SELECT 
    USING (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY IF NOT EXISTS "i:ref_sessions" ON public.referral_sessions 
    FOR INSERT 
    WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

-- Analytics Snapshots Policies
CREATE POLICY IF NOT EXISTS "r:ref_analytics" ON public.referral_analytics_snapshots 
    FOR SELECT 
    USING (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY IF NOT EXISTS "i:ref_analytics" ON public.referral_analytics_snapshots 
    FOR INSERT 
    WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

-- AI Config Policies
CREATE POLICY IF NOT EXISTS "r:ref_ai" ON public.referral_ai_config 
    FOR SELECT 
    USING (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY IF NOT EXISTS "i:ref_ai" ON public.referral_ai_config 
    FOR INSERT 
    WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY IF NOT EXISTS "u:ref_ai" ON public.referral_ai_config 
    FOR UPDATE 
    USING (auth.role() IN ('authenticated', 'service_role'));

-- Realtime Publication for Live Dashboards
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime 
    FOR TABLE public.referral_tasks, public.referral_sessions;
  ELSE
    ALTER PUBLICATION supabase_realtime ADD TABLE 
    public.referral_tasks, public.referral_sessions;
  END IF;
END $$;

-- Reload API cache
SELECT pg_notify('pgrst', 'reload schema');
