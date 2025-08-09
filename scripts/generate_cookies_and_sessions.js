/* eslint-disable */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

function chunk(arr, size) { const out = []; for (let i=0;i<arr.length;i+=size) out.push(arr.slice(i,i+size)); return out; }
function randInt(min, max) { return Math.floor(Math.random()*(max-min+1))+min; }
function pick(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

function makeCookieBlob(domain) {
  return {
    domain,
    cookies: [
      { name: 'sessionid', value: Math.random().toString(36).slice(2), domain: `.${domain}`, path: '/', httpOnly: true, secure: true, expires: Date.now()+86400*1000*randInt(7,90) },
      { name: 'csrf_token', value: Math.random().toString(36).slice(2), domain: `.${domain}`, path: '/', httpOnly: false, secure: true, expires: Date.now()+86400*1000*randInt(7,90) },
    ],
    localStorage: { theme: pick(['light','dark']), prefs: '{}' }
  };
}

async function fetchPersonasMissingCookies(page = 0, pageSize = 1000) {
  const from = page * pageSize;
  const to = from + pageSize - 1;
  const { data, error } = await supabase
    .from('personas')
    .select('id, cookie_id')
    .is('cookie_id', null)
    .range(from, to);
  if (error) throw error;
  return data || [];
}

async function main() {
  // Page through all personas missing cookies
  const pageSize = 1000;
  let page = 0;
  let totalCookies = 0;
  let totalSessions = 0;

  while (true) {
    const batch = await fetchPersonasMissingCookies(page, pageSize);
    if (!batch.length) break;

    const cookieRows = batch.map(p => ({
      persona_id: p.id,
      cookie_blob: makeCookieBlob(pick(['tiktok.com','youtube.com','google.com','reddit.com'])),
      expires_at: new Date(Date.now()+86400*1000*randInt(7,90)).toISOString()
    }));

    console.log(`Inserting ${cookieRows.length} cookies (page ${page})...`);
    const { data: inserted, error: insErr } = await supabase.from('cookies').insert(cookieRows).select('id, persona_id');
    if (insErr) { console.error(insErr.message); process.exit(1); }

    // link cookie_id in personas
    for (const row of inserted) {
      const { error: upErr } = await supabase.from('personas').update({ cookie_id: row.id }).eq('id', row.persona_id);
      if (upErr) { console.error(upErr.message); process.exit(1); }
    }

    totalCookies += cookieRows.length;

    // Optional: create 0-2 sessions per persona in this page
    const sessionRows = [];
    for (const p of batch) {
      const num = randInt(0,2);
      for (let i=0;i<num;i++) {
        sessionRows.push({
          persona_id: p.id,
          device_id: null,
          start_time: new Date(Date.now()-randInt(0,7)*86400000).toISOString(),
          end_time: null,
          session_type: pick(['manual','Vanta-controlled']),
          proxy_id: null,
          activity_log: { target: pick(['tiktok.com','youtube.com','instagram.com','news.com']), success: pick([true,true,true,false]) },
          status: pick(['running','completed','failed'])
        });
      }
    }
    if (sessionRows.length) {
      const { error: sessErr } = await supabase.from('sessions').insert(sessionRows, { returning: 'minimal' });
      if (sessErr) { console.error(sessErr.message); process.exit(1); }
      totalSessions += sessionRows.length;
    }

    page++;
  }

  console.log(`Cookie linking complete. Cookies inserted: ${totalCookies}. Sessions inserted: ${totalSessions}.`);
}

main().catch((e) => { console.error(e); process.exit(1); });