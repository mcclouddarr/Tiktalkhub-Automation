/* eslint-disable */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

async function ensureBucket(name, isPublic = false) {
  const { data: list } = await supabase.storage.listBuckets();
  const exists = (list || []).some((b) => b.name === name);
  if (exists) {
    console.log(`Bucket '${name}' exists`);
    return;
  }
  const { error } = await supabase.storage.createBucket(name, { public: isPublic, fileSizeLimit: 104857600 });
  if (error) {
    console.error(`Failed to create bucket ${name}:`, error.message);
    process.exit(1);
  }
  console.log(`Created bucket '${name}'`);
}

(async () => {
  await ensureBucket('cookies', false);
  await ensureBucket('screenshots', true);
  await ensureBucket('logs', false);
  console.log('Buckets ensured.');
})();