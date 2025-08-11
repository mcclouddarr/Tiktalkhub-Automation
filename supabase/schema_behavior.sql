-- Behavior datasets for Vanta engine
CREATE TABLE IF NOT EXISTS public.behavior_datasets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  persona_id UUID REFERENCES public.personas(id) ON DELETE CASCADE,
  browsing_patterns JSONB,
  typing_patterns JSONB,
  mouse_movement JSONB,
  mobile_touch_data JSONB,
  timezone_locale JSONB,
  device_usage_timeline JSONB,
  fingerprint_markers JSONB,
  search_navigation JSONB,
  google_account_behavior JSONB,
  source_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.behavior_datasets ENABLE ROW LEVEL SECURITY;

-- Select Policy
CREATE POLICY "Allow read for authenticated users" ON public.behavior_datasets 
FOR SELECT USING (auth.role() = 'authenticated');

-- Insert Policy
CREATE POLICY "Allow insert for authenticated users" ON public.behavior_datasets 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Optional: Update Policy
CREATE POLICY "Allow update for authenticated users" ON public.behavior_datasets 
FOR UPDATE USING (auth.role() = 'authenticated');

-- Optional: Delete Policy
CREATE POLICY "Allow delete for authenticated users" ON public.behavior_datasets 
FOR DELETE USING (auth.role() = 'authenticated');

-- Force PostgREST to reload schema
SELECT pg_notify('pgrst', 'reload schema');
