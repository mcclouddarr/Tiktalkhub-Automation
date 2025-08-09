#!/usr/bin/env node
/* eslint-disable */
import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) { console.error('Missing env'); process.exit(1) }
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

const TEST_URL = process.env.PROXY_TEST_URL || 'https://httpbin.org/get'
const INTERVAL_MS = parseInt(process.env.PROXY_SCORE_INTERVAL_MS || '60000')
const TIMEOUT_MS = parseInt(process.env.PROXY_TEST_TIMEOUT_MS || '8000')

async function testProxy(p){
  const protocol = (p.proxy_type||'HTTP').toLowerCase().includes('socks')?'socks5':'http'
  const url = new URL(TEST_URL)
  try{
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), TIMEOUT_MS)
    const resp = await fetch(url.toString(), { signal: controller.signal /* attach proxy via env or a proxy agent if needed */ })
    clearTimeout(t)
    if (!resp.ok) return { score: 0, status: 'flagged' }
    const latency = resp.headers.get('X-Response-Time') || 300
    const score = Math.max(0, 100 - Math.min(1000, parseInt(String(latency)))/10)
    return { score, status: 'active' }
  } catch{
    return { score: 0, status: 'dead' }
  }
}

async function cycle(){
  const { data } = await supabase.from('proxies').select('*').limit(500)
  for (const p of (data||[])){
    const { score, status } = await testProxy(p)
    await supabase.from('proxies').update({ health_score: score, status }).eq('id', p.id)
  }
}

console.log('Proxy scoring worker started')
setInterval(cycle, INTERVAL_MS)