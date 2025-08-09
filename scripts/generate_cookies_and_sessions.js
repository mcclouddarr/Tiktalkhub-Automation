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

async function main() {
  // fetch personas list
  const { data: personas, error } = await supabase.from('personas').select('id');
  if (error) { console.error(error.message); process.exit(1); }

  // generate one cookie + 0-2 sessions per persona
  const cookieRows = personas.map(p => ({
    persona_id: p.id,
    cookie_blob: makeCookieBlob(pick(['tiktok.com','youtube.com','google.com','reddit.com'])),
    expires_at: new Date(Date.now()+86400*1000*randInt(7,90)).toISOString()
  }));

  console.log(`Inserting ${cookieRows.length} cookies...`);
  for (const b of chunk(cookieRows, 500)) {
    const { data, error } = await supabase.from('cookies').insert(b).select('id, persona_id');
    if (error) { console.error(error.message); process.exit(1); }
    // link cookie_id in personas
    for (const row of data) {
      await supabase.from('personas').update({ cookie_id: row.id }).eq('id', row.persona_id);
    }
  }

  // sessions
  const sessionRows = [];
  for (const p of personas) {
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
  console.log(`Inserting ${sessionRows.length} sessions...`);
  for (const b of chunk(sessionRows, 500)) {
    const { error } = await supabase.from('sessions').insert(b, { returning: 'minimal' });
    if (error) { console.error(error.message); process.exit(1); }
  }

  console.log('Cookie linking and session generation complete.');
}

main().catch((e) => { console.error(e); process.exit(1); });