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

export async function fetchPersonas() {
  return supabase
    .from("personas")
    .select("*, devices:device_id(id, device_name, os, browser_type), proxies:proxy_id(id, ip, proxy_type)")
    .order("created_at", { ascending: false });
}

export async function fetchDevices() {
  return supabase
    .from("devices")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function fetchSessions() {
  return supabase
    .from("sessions")
    .select("*, personas:persona_id(name), devices:device_id(device_name), proxies:proxy_id(ip)")
    .order("start_time", { ascending: false })
    .limit(200);
}

export async function createPersona(payload: Partial<PersonaRow>) {
  return supabase.from("personas").insert(payload).select("*").single();
}

export async function createDevice(payload: Partial<DeviceRow>) {
  return supabase.from("devices").insert(payload).select("*").single();
}

export async function createSession(payload: Partial<SessionRow>) {
  return supabase.from("sessions").insert(payload).select("*").single();
}