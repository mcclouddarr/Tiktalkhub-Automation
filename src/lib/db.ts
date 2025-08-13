import { supabase } from "@/lib/supabaseClient";

export type PersonaRow = {
  id: string;
  name: string;
  age: number | null;
  gender: string | null;
  backstory: string | null;
  profile_picture: string | null;
  device_id: string | null;
  cookie_id: string | null;
  proxy_id: string | null;
  tags: string[] | null;
  status: string | null;
  created_at: string;
  updated_at: string;
};

export type DeviceRow = {
  id: string;
  device_name: string;
  browser_type: string;
  engine: string | null;
  viewport: string | null;
  os: string | null;
  user_agent: string | null;
  platform: string | null;
  fingerprint_config: any | null;
  real_device_emulation_profile_url: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
};

export type SessionRow = {
  id: string;
  persona_id: string;
  device_id: string | null;
  start_time: string | null;
  end_time: string | null;
  session_type: string | null;
  proxy_id: string | null;
  activity_log: any | null;
  status: string | null;
  created_at: string;
};

export type ProxyRow = {
  id: string;
  ip: string;
  port: number;
  username: string | null;
  password: string | null;
  proxy_type: string;
  status: string | null;
  last_check_time: string | null;
  health_score: number | null;
  location_metadata: any | null;
  created_at: string;
  updated_at: string;
};

export type CookieRow = {
  id: string;
  persona_id: string | null;
  cookie_blob: any | null;
  expires_at: string | null;
  created_at: string;
};

export type TaskRunRow = {
  id: string
  task_id: string
  status: string | null
  started_at: string | null
  finished_at: string | null
  created_at: string
}

export type TaskLogRow = {
  id: string
  run_id: string
  level: 'info'|'warn'|'error'|'debug'
  message: string
  data: any | null
  ts: string
}

export type ReferralCampaignRow = {
  id: string
  name: string
  traffic_source: string
  notes: string | null
  created_at: string
}

export type ReferralTaskRow = {
  id: string
  campaign_id: string
  persona_id: string | null
  status: string | null
  created_at: string
}

// Queries
export async function fetchPersonas(limit = 50, offset = 0, search = '') {
  let query = supabase
    .from("personas")
    .select("*, devices:device_id(id, device_name, os, browser_type), proxies:proxy_id(id, ip, proxy_type)", { count: 'exact' })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (search) query = query.ilike('name', `%${search}%`)
  return query;
}

export async function fetchDevices(limit = 50, offset = 0, filterType = '') {
  let query = supabase
    .from("devices")
    .select("*", { count: 'exact' })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (filterType) query = query.ilike('browser_type', `%${filterType}%`)
  return query;
}

export async function fetchSessions() {
  return supabase
    .from("sessions")
    .select("*, personas:persona_id(name), devices:device_id(device_name), proxies:proxy_id(ip)")
    .order("start_time", { ascending: false })
    .limit(200);
}

export async function fetchProxies(limit = 50, offset = 0, country = '', status = '') {
  let query = supabase
    .from("proxies")
    .select("*", { count: 'exact' })
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (country) query = query.ilike('location_metadata->>country', `%${country}%`)
  if (status) query = query.eq('status', status)
  return query;
}

// Create
export async function createPersona(payload: Partial<PersonaRow>) {
  return supabase.from("personas").insert(payload).select("*").single();
}

export async function createDevice(payload: Partial<DeviceRow>) {
  return supabase.from("devices").insert(payload).select("*").single();
}

export async function createSession(payload: Partial<SessionRow>) {
  return supabase.from("sessions").insert(payload).select("*").single();
}

export async function createProxy(payload: Partial<ProxyRow>) {
  return supabase.from("proxies").insert(payload).select("*").single();
}

export async function createCookie(payload: Partial<CookieRow>) {
  return supabase.from("cookies").insert(payload).select("*").single();
}

// Update
export async function updatePersona(id: string, patch: Partial<PersonaRow>) {
  return supabase.from("personas").update(patch).eq("id", id).select("*").single();
}

export async function updateDevice(id: string, patch: Partial<DeviceRow>) {
  return supabase.from("devices").update(patch).eq("id", id).select("*").single();
}

export async function updateSession(id: string, patch: Partial<SessionRow>) {
  return supabase.from("sessions").update(patch).eq("id", id).select("*").single();
}

export async function updateProxy(id: string, patch: Partial<ProxyRow>) {
  return supabase.from("proxies").update(patch).eq("id", id).select("*").single();
}

// Delete
export async function deletePersona(id: string) {
  return supabase.from("personas").delete().eq("id", id);
}

export async function deleteDevice(id: string) {
  return supabase.from("devices").delete().eq("id", id);
}

export async function deleteSession(id: string) {
  return supabase.from("sessions").delete().eq("id", id);
}

export async function deleteProxy(id: string) {
  return supabase.from("proxies").delete().eq("id", id);
}