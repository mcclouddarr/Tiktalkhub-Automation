/* eslint-disable */
import http from 'http'
import { launchSession } from './playwrightController.js'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

async function updateRun(runId, patch){
  await supabase.from('task_runs').update(patch).eq('id', runId)
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health'){
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true }))
    return
  }
  if (req.method === 'POST' && req.url === '/launch'){
    try{
      const chunks=[]; for await (const c of req) chunks.push(c)
      const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'))
      const { run_id, payload } = body
      if (payload?.launchConfig?.headless !== undefined){ body.launchConfig = { ...(body.launchConfig||{}), headless: !!payload.launchConfig.headless } }
      // Pass behavior tuning via a global for the process
      try {
        const d = JSON.parse(process.env.BEHAVIOR_DEFAULTS || '{"delayMultiplier":1,"randomness":0.2}')
        // @ts-ignore
        globalThis.__BEHAVIOR__ = d
      } catch{}
      await updateRun(run_id, { status: 'running' })
      await launchSession(body)
      await updateRun(run_id, { status: 'completed', finished_at: new Date().toISOString() })
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true }))
    } catch(e){
      console.error('Launch error', e)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: String(e) }))
    }
    return
  }
  res.writeHead(404)
  res.end()
})

function shutdown(){
  try{ server.close(() => process.exit(0)) } catch { process.exit(0) }
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

const PORT = process.env.PORT || 4000
server.listen(PORT, () => console.log('Runner listening on', PORT))