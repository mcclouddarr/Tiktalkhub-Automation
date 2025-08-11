-- Enable RLS if table exists
DO $do$ 
BEGIN 
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'task_templates') THEN
        EXECUTE 'ALTER TABLE public.task_templates ENABLE ROW LEVEL SECURITY';
        
        -- Read policy
        EXECUTE '
        CREATE POLICY "task_templates_read" 
        ON public.task_templates 
        FOR SELECT 
        TO authenticated 
        USING (true)';
        
        -- Insert policy
        EXECUTE '
        CREATE POLICY "task_templates_insert" 
        ON public.task_templates 
        FOR INSERT 
        TO authenticated 
        WITH CHECK (true)';
        
        -- Update policy
        EXECUTE '
        CREATE POLICY "task_templates_update" 
        ON public.task_templates 
        FOR UPDATE 
        TO authenticated 
        USING (true) 
        WITH CHECK (true)';
        
        -- Delete policy
        EXECUTE '
        CREATE POLICY "task_templates_delete" 
        ON public.task_templates 
        FOR DELETE 
        TO authenticated 
        USING (true)';
    END IF;
END $do$;
