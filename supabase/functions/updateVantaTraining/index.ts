import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  try {
    const payload = await req.json();

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const resp = await fetch(`${SUPABASE_URL}/rest/v1/vanta_updates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        change_type: payload.change_type || "unknown",
        payload,
        model_version: payload.model_version || "unknown",
        update_notes: payload.update_notes || null,
        updated_at: new Date().toISOString(),
      }),
    });

    const data = await resp.json();
    return new Response(JSON.stringify({ ok: true, data }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
});