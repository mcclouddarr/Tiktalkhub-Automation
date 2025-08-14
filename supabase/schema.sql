-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. devices
CREATE TABLE IF NOT EXISTS public.devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_name TEXT NOT NULL,
  browser_type TEXT NOT NULL,
  engine TEXT DEFAULT 'chromium',
  viewport TEXT,
  os TEXT,
  user_agent TEXT,
  platform TEXT,
  fingerprint_config JSONB,
  real_device_emulation_profile_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. proxies
CREATE TABLE IF NOT EXISTS public.proxies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip TEXT NOT NULL,
  port INTEGER NOT NULL,
  username TEXT,
  password TEXT,
  proxy_type TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  last_check_time TIMESTAMPTZ,
  health_score NUMERIC,
  location_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. personas (before cookies to avoid FK cycle)
CREATE TABLE IF NOT EXISTS public.personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  backstory TEXT,
  profile_picture TEXT,
  device_id UUID,
  cookie_id UUID, -- optional link (no FK to avoid cycle with cookies)
  proxy_id UUID,
  tags TEXT[],
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (device_id) REFERENCES public.devices(id) ON DELETE SET NULL,
  FOREIGN KEY (proxy_id) REFERENCES public.proxies(id) ON DELETE SET NULL
);

-- 4. cookies (after personas)
CREATE TABLE IF NOT EXISTS public.cookies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  persona_id UUID,
  cookie_blob JSONB,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (persona_id) REFERENCES public.personas(id) ON DELETE SET NULL
);

-- 5. sessions
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  persona_id UUID NOT NULL,
  device_id UUID,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  session_type TEXT,
  proxy_id UUID,
  activity_log JSONB,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (persona_id) REFERENCES public.personas(id) ON DELETE CASCADE,
  FOREIGN KEY (device_id) REFERENCES public.devices(id) ON DELETE SET NULL,
  FOREIGN KEY (proxy_id) REFERENCES public.proxies(id) ON DELETE SET NULL
);

-- 6. referrals
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_persona_id UUID,
  target_link TEXT NOT NULL,
  click_time TIMESTAMPTZ,
  conversion_time TIMESTAMPTZ,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (source_persona_id) REFERENCES public.personas(id) ON DELETE SET NULL
);

-- 7. tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  persona_id UUID,
  task_type TEXT,
  execution_mode TEXT,
  target_url TEXT,
  scheduled_time TIMESTAMPTZ,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (persona_id) REFERENCES public.personas(id) ON DELETE SET NULL
);

-- 8. vanta_updates
CREATE TABLE IF NOT EXISTS public.vanta_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  change_type TEXT,
  payload JSONB,
  model_version TEXT,
  update_notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Groups for profiles
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "r:groups" ON public.groups FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "i:groups" ON public.groups FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Profile to group mapping (many-to-one simplified via personas.group_id)
ALTER TABLE IF NOT EXISTS public.personas ADD COLUMN IF NOT EXISTS group_id UUID;
ALTER TABLE public.personas ADD CONSTRAINT personas_group_fk FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE SET NULL;

-- Tags: store as array on personas
ALTER TABLE IF NOT EXISTS public.personas ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Schedules
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cron TEXT NOT NULL,
  engine TEXT DEFAULT 'chromium',
  template_id UUID,
  group_id UUID,
  variables JSONB,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (template_id) REFERENCES public.task_templates(id) ON DELETE SET NULL,
  FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE SET NULL
);
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "r:schedules" ON public.schedules FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "i:schedules" ON public.schedules FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "u:schedules" ON public.schedules FOR UPDATE USING (auth.role() = 'authenticated');

-- Action logs
CREATE TABLE IF NOT EXISTS public.action_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor TEXT,
  action TEXT,
  target_type TEXT,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.action_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "r:action_logs" ON public.action_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "i:action_logs" ON public.action_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Marketplace categories (optional)
CREATE TABLE IF NOT EXISTS public.template_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.template_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "r:template_categories" ON public.template_categories FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "i:template_categories" ON public.template_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Optional relation table
CREATE TABLE IF NOT EXISTS public.template_category_map (
  template_id UUID REFERENCES public.task_templates(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.template_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (template_id, category_id)
);
ALTER TABLE public.template_category_map ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "r:template_category_map" ON public.template_category_map FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "i:template_category_map" ON public.template_category_map FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.personas;

-- Updated timestamps triggers
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_devices_updated_at
BEFORE UPDATE ON public.devices
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_personas_updated_at
BEFORE UPDATE ON public.personas
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_proxies_updated_at
BEFORE UPDATE ON public.proxies
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Basic RLS enabling
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proxies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cookies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vanta_updates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Select Policies
CREATE POLICY "Allow read for authenticated users" ON public.personas 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read for authenticated users" ON public.devices 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read for authenticated users" ON public.sessions 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read for authenticated users" ON public.proxies 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read for authenticated users" ON public.cookies 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read for authenticated users" ON public.referrals 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read for authenticated users" ON public.tasks 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read for authenticated users" ON public.vanta_updates 
FOR SELECT USING (auth.role() = 'authenticated');

-- Insert Policies
CREATE POLICY "Allow insert for authenticated users" ON public.personas 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON public.devices 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON public.sessions 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON public.proxies 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON public.cookies 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON public.referrals 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON public.tasks 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON public.vanta_updates 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Update Policies
CREATE POLICY "Allow update for authenticated users" ON public.personas 
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON public.devices 
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON public.sessions 
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON public.proxies 
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON public.cookies 
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON public.referrals 
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON public.tasks 
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON public.vanta_updates 
FOR UPDATE USING (auth.role() = 'authenticated');

-- Delete Policies (Optional, but recommended for completeness)
CREATE POLICY "Allow delete for authenticated users" ON public.personas 
FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow delete for authenticated users" ON public.devices 
FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow delete for authenticated users" ON public.sessions 
FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow delete for authenticated users" ON public.proxies 
FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow delete for authenticated users" ON public.cookies 
FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow delete for authenticated users" ON public.referrals 
FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow delete for authenticated users" ON public.tasks 
FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow delete for authenticated users" ON public.vanta_updates 
FOR DELETE USING (auth.role() = 'authenticated');

-- Force PostgREST to reload schema
SELECT pg_notify('pgrst', 'reload schema');
