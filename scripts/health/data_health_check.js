#!/usr/bin/env node
/* eslint-disable */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY){ console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

async function count(table, filter){
  let q = supabase.from(table).select('*', { count: 'exact', head: true })
  if (filter) q = q.match(filter)
  const { count: c } = await q
  return c || 0
}

async function verify(){
  const personas = await count('personas')
  const devices = await count('devices')
  const proxies = await count('proxies')
  const cookies = await count('cookies')
  const sessions = await count('sessions')

  const personasNoDevice = await count('personas', { device_id: null })
  const personasNoCookie = await count('personas', { cookie_id: null })
  const sessionsNoProxy = await count('sessions', { proxy_id: null })

  console.log('Totals:', { personas, devices, proxies, cookies, sessions })
  console.log('Gaps:', { personasNoDevice, personasNoCookie, sessionsNoProxy })
}

async function backfillCookies(limit = 100){
  const { data: ps } = await supabase.from('personas').select('id').is('cookie_id', null).limit(limit)
  for (const p of (ps||[])){
    const { data: ck } = await supabase.from('cookies').select('id').eq('persona_id', p.id).order('created_at', { ascending: false }).limit(1).maybeSingle()
    if (ck?.id){ await supabase.from('personas').update({ cookie_id: ck.id }).eq('id', p.id) }
  }
}

async function main(){
  await verify()
  if (process.env.BACKFILL_COOKIES === '1'){
    await backfillCookies(parseInt(process.env.LIMIT || '100'))
    console.log('Backfill cookies done')
  }
}

main().catch(e => { console.error(e); process.exit(1) })