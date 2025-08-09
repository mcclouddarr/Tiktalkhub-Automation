import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  try {
    const { device_name, os, browser_type } = await req.json();
    const profile = {
      device_name,
      os,
      browser_type,
      viewport: "1280x800",
      timezone: "UTC",
      languages: ["en-US", "en"],
      platform: os?.toLowerCase().includes("ios") ? "iPhone" : "Win32",
      user_agent: `Mozilla/5.0 (${os || "Unknown OS"}) AppleWebKit/537.36 (KHTML, like Gecko) ${browser_type || "Chrome"}/120.0.0 Safari/537.36`,
      webgl: {
        vendor: "Google Inc.",
        renderer: "ANGLE (NVIDIA Tesla T4 Direct3D11 vs_5_0 ps_5_0)",
      },
      canvas: crypto.randomUUID(),
      audio_context: Math.random().toString(36).slice(2),
    };

    return new Response(JSON.stringify({ ok: true, profile }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
});