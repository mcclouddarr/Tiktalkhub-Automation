import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

type Persona = {
  name: string;
  age?: number;
  gender?: string;
  backstory?: string;
  tags?: string[];
  status?: string;
};

function chunk<T>(arr: T[], size = 1000) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

serve(async (req) => {
  try {
    const body = await req.json();
    const personas: Persona[] = body?.personas || body;
    if (!Array.isArray(personas) || personas.length === 0) {
      return new Response(JSON.stringify({ ok: false, error: "No personas provided" }), { status: 400 });
    }

    const rows = personas.map((p) => ({
      name: p.name,
      age: p.age ?? null,
      gender: p.gender ?? null,
      backstory: p.backstory ?? null,
      tags: p.tags ?? [],
      status: p.status ?? "active",
    }));

    const batches = chunk(rows, 1000);
    for (const b of batches) {
      const { error } = await supabase.from("personas").upsert(b, {
        onConflict: "name",
        returning: "minimal",
      });
      if (error) throw error;
    }

    return new Response(JSON.stringify({ ok: true, inserted: rows.length }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
});