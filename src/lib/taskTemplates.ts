import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

type TaskTemplate = {
  id: string;
  name: string;
  description?: string | null;
  steps: any[]; // e.g. [{ action: 'open', url: '...' }, { action: 'click', selector: '...' }]
}

export async function listTemplates() {
  const { data, error } = await supabase.from('task_templates').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createTemplate(t: { name: string; description?: string; steps: any[] }) {
  const { data, error } = await supabase.from('task_templates').insert(t).select('*').single();
  if (error) throw error;
  return data as TaskTemplate;
}

export function expandTemplateToFlow(template: TaskTemplate, vars: Record<string, any>) {
  // very simple variable expansion
  const steps = template.steps.map((s: any) => {
    const copy = JSON.parse(JSON.stringify(s))
    Object.keys(vars).forEach((k) => {
      const v = vars[k]
      const json = JSON.stringify(copy)
      const replaced = json.replaceAll(`{{${k}}}`, String(v))
      Object.assign(copy, JSON.parse(replaced))
    })
    return copy
  })
  return steps
}