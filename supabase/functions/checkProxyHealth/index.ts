import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  try {
    const { ip, port, username, password, id } = await req.json();
    // Simulate a health check; replace with real TCP/HTTP probe
    const healthy = Math.random() > 0.1;
    const pingMs = Math.floor(Math.random() * 80) + 10;

    // Update Supabase (Service role key should be attached in function env)
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const resp = await fetch(`${SUPABASE_URL}/rest/v1/proxies?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: healthy ? "active" : "dead",
        last_check_time: new Date().toISOString(),
        health_score: healthy ? 0.9 : 0.1,
        location_metadata: { ping: `${pingMs}ms` },
      }),
    });

    const data = await resp.json();

    return new Response(JSON.stringify({ ok: true, data }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
});