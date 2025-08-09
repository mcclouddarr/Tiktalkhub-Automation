/* eslint-disable */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

async function wipe(table) {
  let page = 0; const pageSize = 1000; let total = 0;
  while (true) {
    const { data, error } = await supabase.from(table).select('id').range(page*pageSize, page*pageSize + pageSize - 1);
    if (error) throw error;
    if (!data?.length) break;
    const ids = data.map(r => r.id);
    const { error: delErr } = await supabase.from(table).delete().in('id', ids);
    if (delErr) throw delErr;
    total += ids.length; page++;
    console.log(`Deleted ${ids.length} from ${table} (total ${total})`);
  }
}

async function main() {
  // dependency order: sessions -> cookies -> personas -> devices -> proxies
  for (const table of ['sessions','cookies','personas','devices','proxies']) {
    console.log(`Wiping ${table}...`);
    await wipe(table);
  }
  console.log('All data wiped.');
}

main().catch((e) => { console.error(e); process.exit(1); });