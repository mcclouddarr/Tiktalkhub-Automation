import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function sb(path: string, init: RequestInit) {
  const headers = new Headers(init.headers || {});
  headers.set("apikey", SUPABASE_SERVICE_ROLE_KEY);
  headers.set("Authorization", `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`);
  return fetch(`${SUPABASE_URL}${path}`, { ...init, headers });
}

async function fetchLaunchPayload(task_id: string) {
  // Task + persona cookies and a naive device/proxy selection can be done client-side.
  // Here we assume the client sent payload already.
  return null;
}

serve(async (req) => {
  try {
    const body = await req.json();
    const { action, task_id, run_id, payload } = body;

    if (action === 'start') {
      let resp = await sb(`/rest/v1/task_runs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
        body: JSON.stringify({ task_id, status: 'queued', started_at: new Date().toISOString() }),
      });
      const runData = await resp.json();
      const run = Array.isArray(runData) ? runData[0] : runData;

      // Forward to local runner (adjust URL as needed)
      if (payload) {
        await fetch('http://localhost:4000/launch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ run_id: run.id, ...payload })
        });
      }

      await sb(`/rest/v1/task_runs?id=eq.${run.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
        body: JSON.stringify({ status: 'running' }),
      });
      return new Response(JSON.stringify({ ok: true, run_id: run.id }), { status: 200 });
    }

    if (action === 'pause') {
      await sb(`/rest/v1/task_runs?id=eq.${run_id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'paused' }),
      });
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    if (action === 'resume') {
      await sb(`/rest/v1/task_runs?id=eq.${run_id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'running' }),
      });
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    if (action === 'terminate') {
      await sb(`/rest/v1/task_runs?id=eq.${run_id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'terminated', finished_at: new Date().toISOString() }),
      });
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ ok: false, error: 'Unknown action' }), { status: 400 });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
});