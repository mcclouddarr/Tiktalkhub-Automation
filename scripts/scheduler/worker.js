/* eslint-disable */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

const BATCH_SIZE = parseInt(process.env.SCHEDULER_BATCH_SIZE || '10')
const INTERVAL_MS = parseInt(process.env.SCHEDULER_INTERVAL_MS || '5000')

async function pickProxy() {
  const { data } = await supabase.from('proxies').select('*').eq('status','active').order('updated_at', { ascending: false }).limit(200)
  const pool = data || []
  if (pool.length === 0) return null
  const p = pool[Math.floor(Math.random() * pool.length)]
  return { server: `${(p.proxy_type||'HTTP').toLowerCase().includes('socks')?'socks5':'http'}://${p.ip}:${p.port}`, username: p.username || undefined, password: p.password || undefined, protocol: (p.proxy_type||'HTTP').toLowerCase().includes('socks')?'socks5':'http' }
}

async function buildPayload(task){
  // Minimal launch config; runner adds fingerprint init
  const proxy = await pickProxy()
  const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36', 'Accept-Language': 'en-US,en;q=0.9' }
  const launchConfig = {
    headless: true,
    viewport: [1280, 800],
    headers,
    proxy,
    fingerprint: { languages: ['en-US','en'], hardwareConcurrency: 8, deviceMemory: 8, timezoneOffset: 0 },
  }
  // basic cookies preload
  let cookies = []
  if (task.persona_id){
    const { data: ck } = await supabase.from('cookies').select('cookie_blob').eq('persona_id', task.persona_id).order('created_at', { ascending: false }).limit(1).maybeSingle()
    if (ck?.cookie_blob){
      const blob = ck.cookie_blob
      const arr = Array.isArray(blob?.cookies) ? blob.cookies : []
      cookies = arr
    }
  }
  return { launchConfig, cookies, target: task.target_url || null, steps: [] }
}

async function dequeueAndStart(){
  const now = new Date().toISOString()
  const { data: due, error } = await supabase
    .from('tasks')
    .select('*')
    .lte('scheduled_time', now)
    .in('status', ['pending','scheduled'])
    .order('scheduled_time', { ascending: true })
    .limit(BATCH_SIZE)
  if (error) { console.error('Fetch due tasks error', error); return }
  for (const t of (due || [])){
    try{
      await supabase.from('tasks').update({ status: 'queued' }).eq('id', t.id)
      const payload = await buildPayload(t)
      await supabase.functions.invoke('taskController', { body: { action: 'start', task_id: t.id, payload } })
      await supabase.from('tasks').update({ status: 'running' }).eq('id', t.id)
    } catch(e){
      console.error('Start task failed', t.id, e)
      await supabase.from('tasks').update({ status: 'failed' }).eq('id', t.id)
    }
    await new Promise(r => setTimeout(r, 500)) // small stagger
  }
}

console.log('Scheduler started. Interval(ms)=', INTERVAL_MS, 'Batch=', BATCH_SIZE)
setInterval(dequeueAndStart, INTERVAL_MS)