/* eslint-disable */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

function makeBackstory(p) {
  const roles = ['software engineer','designer','student','marketer','analyst','content creator','researcher','operator'];
  const interests = ['tech','music','fitness','travel','gaming','finance','photography','AI','education'];
  const role = roles[Math.floor(Math.random()*roles.length)];
  const interest = interests[Math.floor(Math.random()*interests.length)];
  const ageStr = p.age ? `${p.age}-year-old` : 'adult';
  return `${p.name} is a ${ageStr} ${p.gender?.toLowerCase() || ''} ${role} who enjoys ${interest}. They typically browse on ${p.tags?.[0] || 'their device'} during the ${['morning','afternoon','evening'][Math.floor(Math.random()*3)]}, focusing on ${interest}-related sites.`;
}

async function main() {
  const pageSize = 500; let total = 0;
  while (true) {
    const { data, error } = await supabase
      .from('personas')
      .select('id, name, age, gender, tags')
      .is('backstory', null)
      .limit(pageSize);
    if (error) { console.error(error.message); process.exit(1); }
    if (!data?.length) break;

    for (const p of data) {
      const backstory = makeBackstory(p);
      const { error: upErr } = await supabase.from('personas').update({ backstory }).eq('id', p.id);
      if (upErr) { console.error(upErr.message); process.exit(1); }
      total++;
    }
    console.log(`Backfilled ${total} backstories...`);
  }
  console.log('Backstory backfill complete.');
}

main().catch((e) => { console.error(e); process.exit(1); });