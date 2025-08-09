import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  try {
    const { ip, port, username, password, id, proxy_type, network_label } = await req.json();
    // Simulated health metrics; replace with real probe logic if available
    const latencyMs = Math.floor(Math.random() * 120) + 10; // 10-130ms
    const failure = Math.random() < 0.08; // 8% outright failure
    const warned = !failure && latencyMs > 90; // warn on high latency

    let status: string = "active";
    if (failure) status = "down";
    else if (warned) status = "warning";

    // Escalate to 'flagged' sometimes to simulate bans/blocks
    const flagged = Math.random() < 0.05 || status === "down";
    if (flagged) status = "flagged";

    const health_score = status === "active" ? 0.95 : status === "warning" ? 0.6 : status === "flagged" ? 0.2 : 0.1;

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
        status,
        last_check_time: new Date().toISOString(),
        health_score,
        location_metadata: {
          ping: `${latencyMs}ms`,
          network_label: network_label || null,
        },
      }),
    });

    const data = await resp.json();

    return new Response(JSON.stringify({ ok: true, status, latencyMs, data }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
});