/* eslint-disable */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

async function main() {
  const { data: all, error } = await supabase.from('personas').select('id, name, created_at');
  if (error) { console.error(error.message); process.exit(1); }

  const byName = new Map();
  for (const p of all) {
    if (!byName.has(p.name)) byName.set(p.name, []);
    byName.get(p.name).push(p);
  }

  const toDelete = [];
  byName.forEach((arr) => {
    if (arr.length <= 1) return;
    arr.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const keep = arr[0];
    for (let i = 1; i < arr.length; i++) toDelete.push(arr[i].id);
  });

  console.log(`Duplicates to delete: ${toDelete.length}`);
  while (toDelete.length) {
    const chunk = toDelete.splice(0, 500);
    const { error: delErr } = await supabase.from('personas').delete().in('id', chunk);
    if (delErr) { console.error(delErr.message); process.exit(1); }
    console.log(`Deleted ${chunk.length}`);
  }
  console.log('De-duplication complete.');
}

main().catch((e) => { console.error(e); process.exit(1); });