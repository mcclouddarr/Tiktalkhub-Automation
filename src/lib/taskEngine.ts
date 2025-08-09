import { createClient } from "@supabase/supabase-js";
import { buildLaunchForTask } from "./automationHooks";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

type Task = {
  id: string;
  persona_id?: string | null;
  task_type: string;
  execution_mode: string; // manual|vanta
  target_url?: string | null;
  scheduled_time?: string | null;
  status?: string | null;
}

export async function createTask(payload: Partial<Task>) {
  const { data, error } = await supabase.from('tasks').insert(payload).select('*').single();
  if (error) throw error;
  return data;
}

export async function updateTask(id: string, patch: Partial<Task>) {
  const { data, error } = await supabase.from('tasks').update(patch).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}

export async function startTask(taskId: string) {
  // create run row
  const { data: task, error: tErr } = await supabase.from('tasks').select('*').eq('id', taskId).single();
  if (tErr) throw tErr;

  const { data: run, error: rErr } = await supabase.from('task_runs').insert({ task_id: taskId, status: 'queued', started_at: new Date().toISOString() }).select('*').single();
  if (rErr) throw rErr;

  // matching & launch payload
  const { launchConfig, preCookies } = await buildLaunchForTask(task.persona_id, task.target_url || '', { headless: false });

  // TODO: send launchConfig + preCookies to Phantom/Playwright controller via local API
  // e.g., await fetch('http://localhost:4000/launch', { method: 'POST', body: JSON.stringify({ run_id: run.id, launchConfig, cookies: preCookies, target: task.target_url }) })

  await supabase.from('task_runs').update({ status: 'running' }).eq('id', run.id);
  return run;
}

export async function pauseRun(runId: string) {
  await supabase.from('task_runs').update({ status: 'paused' }).eq('id', runId);
}

export async function resumeRun(runId: string) {
  await supabase.from('task_runs').update({ status: 'running' }).eq('id', runId);
}

export async function terminateRun(runId: string) {
  await supabase.from('task_runs').update({ status: 'terminated', finished_at: new Date().toISOString() }).eq('id', runId);
}

export async function logRun(runId: string, level: 'info'|'warn'|'error'|'debug', message: string, data?: any) {
  await supabase.from('task_logs').insert({ run_id: runId, level, message, data: data || null });
}