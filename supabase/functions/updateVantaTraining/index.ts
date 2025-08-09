import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SRK = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

async function sb(path: string, init: RequestInit){
  const h = new Headers(init.headers || {});
  h.set('apikey', SRK); h.set('Authorization', `Bearer ${SRK}`);
  return fetch(`${SUPABASE_URL}${path}`, { ...init, headers: h });
}

serve(async (req) => {
  try{
    const payload = await req.json();
    const { run_id, persona_id, device_id, proxy_id, outcome, signals } = payload;

    // Insert session feedback
    await sb('/rest/v1/vanta_session_feedback', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ run_id, persona_id, device_id, proxy_id, outcome, signals })
    });

    // Update device score (very naive increment)
    await sb(`/rest/v1/vanta_fingerprint_scores`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ device_id, total_runs: 1, success_rate: outcome === 'pass' ? 0.9 : 0.4, last_used_at: new Date().toISOString() })
    });

    // Update proxy score
    await sb(`/rest/v1/vanta_proxy_scores`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ proxy_id, total_runs: 1, success_rate: outcome === 'pass' ? 0.85 : 0.3, last_used_at: new Date().toISOString() })
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch(e){
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
});