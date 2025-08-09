import { createClient } from "@supabase/supabase-js";
import type { ProxyConfig, DeviceShell } from "./deviceRenderEngine";
import { buildLaunchConfig } from "./deviceRenderEngine";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnon);

export type PersonaLite = {
  id: string;
  name: string;
  tags: string[] | null;
};

export async function pickDeviceForPersona(personaId: string) {
  // fetch persona + linked device if any
  const { data: persona, error } = await supabase
    .from("personas")
    .select("id, name, tags, device_id, devices:device_id(*)")
    .eq("id", personaId)
    .single();
  if (error) throw error;

  // prefer linked device; else pick a random matching type from devices
  if (persona.devices) return persona.devices;
  const preferredType = persona.tags?.find((t: string) => t === "mobile" || t === "desktop") || "mobile";
  const { data: devices } = await supabase
    .from("devices")
    .select("*")
    .limit(50);
  const pool = (devices || []).filter((d: any) => (d.fingerprint_config?.type || "").includes(preferredType));
  return pool[Math.floor(Math.random() * pool.length)] || devices?.[0];
}

export async function pickHealthyProxy(countryHint?: string) {
  const { data: proxies } = await supabase
    .from("proxies")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(200);
  let pool = proxies || [];
  if (countryHint) pool = pool.filter((p: any) => (p.location_metadata?.country || "") === countryHint);
  pool = pool.filter((p: any) => (p.status || "").toLowerCase() === "active");
  const p = pool[Math.floor(Math.random() * pool.length)] || proxies?.[0];
  if (!p) return null;
  return {
    host: p.ip,
    port: p.port,
    username: p.username,
    password: p.password,
    protocol: (p.proxy_type || "HTTP").toLowerCase().includes("socks") ? "socks5" : "http",
  } as ProxyConfig;
}

export async function buildLaunchForPersona(personaId: string, opts?: { headless?: boolean; persistPath?: string | null }) {
  const device = await pickDeviceForPersona(personaId);
  const proxy = await pickHealthyProxy();
  const deviceShell: DeviceShell = {
    type: (device.fingerprint_config?.type || "") as any,
    browser: device.browser_type,
    viewport: device.viewport,
    user_agent: device.user_agent,
    fingerprint: {
      canvas_hash: device.fingerprint_config?.canvas_hash,
      audio_hash: device.fingerprint_config?.audio_hash,
      webgl: device.fingerprint_config?.webgl,
      fonts: device.fingerprint_config?.fonts,
      plugins: device.fingerprint_config?.plugins,
      languages: device.fingerprint_config?.languages,
      timezone_offset: device.fingerprint_config?.timezone_offset,
      hardware_concurrency: device.fingerprint_config?.hardware_concurrency,
      device_memory: device.fingerprint_config?.device_memory,
      touch_support: device.fingerprint_config?.touch_support,
      pixel_ratio: device.fingerprint_config?.pixel_ratio,
      screen: device.fingerprint_config?.screen,
    },
  };
  return buildLaunchConfig(deviceShell, { proxy, headless: opts?.headless ?? false, persistPath: opts?.persistPath || null });
}