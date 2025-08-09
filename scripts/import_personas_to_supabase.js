/* eslint-disable */
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  console.error('Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/import_personas_to_supabase.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

function uaFrom(os, browser) {
  if (/iOS|iPadOS/.test(os)) return `Mozilla/5.0 (iPhone; CPU iPhone OS like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) ${browser}/17.0 Mobile/15E148 Safari/604.1`;
  if (os.includes('Android')) return `Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) ${browser}/120.0 Safari/537.36`;
  if (os.includes('macOS')) return `Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) ${browser}/120.0 Safari/537.36`;
  if (os.includes('Windows')) return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ${browser}/120.0 Safari/537.36`;
  return `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) ${browser}/120.0 Safari/537.36`;
}

function platformFrom(os) {
  if (/iOS/.test(os)) return 'iPhone';
  if (/iPadOS/.test(os)) return 'iPad';
  if (/Android/.test(os)) return 'Linux armv8l';
  if (/macOS/.test(os)) return 'MacIntel';
  if (/Windows/.test(os)) return 'Win32';
  return 'Linux x86_64';
}

function chunk(arr, size) { const out = []; for (let i=0;i<arr.length;i+=size) out.push(arr.slice(i,i+size)); return out; }

async function main() {
  const raw = JSON.parse(readFileSync('data/personas.json', 'utf-8'));
  console.log(`Importing ${raw.length} personas...`);

  // Prepare rows
  const deviceRows = [];
  const proxyRows = [];
  const personaRows = [];

  for (const p of raw) {
    const device_id = randomUUID();
    const proxy_id = randomUUID();

    deviceRows.push({
      id: device_id,
      device_name: p.device,
      browser_type: p.browser,
      viewport: p.screen_resolution,
      os: p.os,
      user_agent: uaFrom(p.os, p.browser),
      platform: platformFrom(p.os),
      fingerprint_config: {
        webgl_vendor: p.webgl_vendor,
        canvas_hash: p.canvas_hash,
        audio_hash: p.audio_hash,
        fonts: p.fonts,
        plugins: p.plugins,
        dnt: p.dnt,
        timezone_offset: p.timezone_offset,
        languages: p.languages,
        touch_support: p.touch_support,
        hardware_concurrency: p.hardware_concurrency,
        device_memory: p.device_memory
      },
      real_device_emulation_profile_url: null,
      status: 'active'
    });

    proxyRows.push({
      id: proxy_id,
      ip: p.ip_address,
      port: 8000 + Math.floor(Math.random()*1000),
      username: null,
      password: null,
      proxy_type: p.proxy_type,
      status: 'active',
      last_check_time: null,
      health_score: 0.8,
      location_metadata: {
        country: p.country,
        state: p.state,
        city: p.city,
        isp: p.isp,
        connection_type: p.connection_type
      }
    });

    personaRows.push({
      id: p.persona_id,
      name: p.name,
      age: p.age,
      gender: p.gender,
      backstory: null,
      profile_picture: null,
      device_id,
      cookie_id: null,
      proxy_id,
      tags: [p.device_type, p.personality, p.task_group],
      status: p.status
    });
  }

  // Insert in chunks
  for (const [label, rows, table] of [
    ['devices', deviceRows, 'devices'],
    ['proxies', proxyRows, 'proxies'],
    ['personas', personaRows, 'personas']
  ]) {
    console.log(`Inserting ${rows.length} into ${table}...`);
    const batches = chunk(rows, 500);
    let inserted = 0;
    for (const b of batches) {
      const { error } = await supabase.from(table).insert(b, { returning: 'minimal' });
      if (error) {
        console.error(`Error inserting batch into ${table}:`, error.message);
        process.exit(1);
      }
      inserted += b.length;
      process.stdout.write(`  ${inserted}/${rows.length}\r`);
    }
    process.stdout.write('\n');
  }

  console.log('Import complete.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});