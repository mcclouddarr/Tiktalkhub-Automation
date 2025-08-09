import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

type Callback = (payload: any) => void;

export function subscribeTaskRuns(cb: Callback) {
  const channel = supabase
    .channel('public:task_runs')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'task_runs' }, (payload) => cb(payload))
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export function subscribeTaskLogs(runId: string, cb: Callback) {
  const channel = supabase
    .channel(`public:task_logs:${runId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'task_logs', filter: `run_id=eq.${runId}` }, (payload) => cb(payload))
    .subscribe();
  return () => supabase.removeChannel(channel);
}