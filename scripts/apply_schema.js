/* eslint-disable */
import { readFileSync } from 'fs';
import pg from 'pg';

const { Client } = pg;

const DB_HOST = process.env.SUPABASE_DB_HOST; // e.g. db.hcngpvqnsrftuntnnwye.supabase.co
const DB_PORT = process.env.SUPABASE_DB_PORT || 5432;
const DB_NAME = process.env.SUPABASE_DB_NAME || 'postgres';
const DB_USER = process.env.SUPABASE_DB_USER || 'postgres';
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD; // required

if (!DB_HOST || !DB_PASSWORD) {
  console.error('Missing DB connection envs. Required: SUPABASE_DB_HOST, SUPABASE_DB_PASSWORD. Optional: SUPABASE_DB_PORT, SUPABASE_DB_NAME, SUPABASE_DB_USER');
  process.exit(1);
}

async function main() {
  const sql = readFileSync('supabase/schema.sql', 'utf-8');
  const client = new Client({
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  console.log('Connected. Applying schema...');
  await client.query(sql);
  await client.end();
  console.log('Schema applied.');
}

main().catch((e) => { console.error(e); process.exit(1); });