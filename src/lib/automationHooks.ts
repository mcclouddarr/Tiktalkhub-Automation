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

function domainFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

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
    .limit(100);
  const pool = (devices || []).filter((d: any) => (d.fingerprint_config?.type || "").includes(preferredType));
  return pool[Math.floor(Math.random() * pool.length)] || devices?.[0];
}

export async function pickHealthyProxy(countryHint?: string) {
  const { data: proxies } = await supabase
    .from("proxies")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(500);
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

import { getAutomationDefaults } from "./automationDefaults";

export async function buildLaunchForPersona(personaId: string, opts?: { headless?: boolean; persistPath?: string | null; countryHint?: string | null }) {
  const device = await pickDeviceForPersona(personaId);
  const proxy = await pickHealthyProxy(opts?.countryHint || undefined);
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
  const defaults = getAutomationDefaults();
  return buildLaunchConfig(deviceShell, { proxy, headless: opts?.headless ?? defaults.headless, persistPath: opts?.persistPath ?? defaults.persistPath });
}

export async function getPersonaCookieBlob(personaId: string) {
  // latest cookie row for persona
  const { data, error } = await supabase
    .from("cookies")
    .select("id, cookie_blob, expires_at")
    .eq("persona_id", personaId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

export function normalizeCookiesForDomain(cookieBlob: any, targetDomain: string) {
  if (!cookieBlob) return [] as any[];
  const domain = targetDomain.replace(/^www\./, "");
  const cookies = Array.isArray(cookieBlob?.cookies) ? cookieBlob.cookies : [];
  return cookies
    .filter((c: any) => typeof c?.name === "string")
    .map((c: any) => ({
      name: c.name,
      value: c.value,
      domain: c.domain || `.${domain}`,
      path: c.path || "/",
      httpOnly: !!c.httpOnly,
      secure: c.secure !== false,
      expires: c.expires ? Math.floor(c.expires / 1000) : undefined,
    }));
}

export async function buildLaunchForTask(personaId: string, targetUrl: string, opts?: { headless?: boolean; persistPath?: string | null; countryHint?: string | null }) {
  const launchConfig = await buildLaunchForPersona(personaId, opts);
  const dom = domainFromUrl(targetUrl);
  let preCookies: any[] = [];
  if (dom) {
    const cookieRow = await getPersonaCookieBlob(personaId);
    preCookies = normalizeCookiesForDomain(cookieRow?.cookie_blob || cookieRow, dom);
  }
  return { launchConfig, preCookies };
}

export async function buildLaunchForReferral(personaId: string, referralLink: string, opts?: { headless?: boolean; persistPath?: string | null; countryHint?: string | null }) {
  // Same as task, but you might choose to select countryHint based on campaign geo
  return buildLaunchForTask(personaId, referralLink, opts);
}