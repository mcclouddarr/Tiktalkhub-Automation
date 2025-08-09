import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

export type ProxyType = 'HTTP' | 'HTTPS' | 'SOCKS4' | 'SOCKS5' | 'Residential' | 'Datacenter' | 'Mobile';

export async function listProxies(filters?: { type?: ProxyType; status?: string }) {
  let q = supabase.from('proxies').select('*').order('updated_at', { ascending: false });
  if (filters?.status) q = q.eq('status', filters.status);
  if (filters?.type) q = q.or(`proxy_type.ilike.${filters.type},location_metadata->>network_label.ilike.${filters.type}`);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function addProxy(p: { ip: string; port: number; username?: string | null; password?: string | null; proxy_type: ProxyType; network_label?: string | null }) {
  const { data, error } = await supabase.from('proxies').insert({
    ip: p.ip,
    port: p.port,
    username: p.username || null,
    password: p.password || null,
    proxy_type: p.proxy_type,
    status: 'active',
    location_metadata: { network_label: p.network_label || null }
  }).select('*').single();
  if (error) throw error;
  return data;
}

export async function checkProxyHealth(proxy: any) {
  const { data, error } = await supabase.functions.invoke('checkProxyHealth', {
    body: {
      id: proxy.id,
      ip: proxy.ip,
      port: proxy.port,
      username: proxy.username,
      password: proxy.password,
      proxy_type: proxy.proxy_type,
      network_label: proxy.location_metadata?.network_label || null,
    }
  });
  if (error) throw error;
  return data;
}

export async function autoSwitchProxy(currentProxyId: string, hint?: { type?: ProxyType; country?: string }) {
  // Mark current as flagged if not already
  await supabase.from('proxies').update({ status: 'flagged' }).eq('id', currentProxyId);

  // Pick next
  let { data: proxies } = await supabase.from('proxies').select('*').eq('status', 'active').order('updated_at', { ascending: false }).limit(200);
  proxies = (proxies || []).filter((p: any) => {
    if (hint?.type && !(p.proxy_type || '').includes(hint.type)) return false;
    if (hint?.country && (p.location_metadata?.country || '') !== hint.country) return false;
    return true;
  });
  return proxies?.[0] || null;
}