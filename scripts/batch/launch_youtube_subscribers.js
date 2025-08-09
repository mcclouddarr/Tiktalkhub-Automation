#!/usr/bin/env node
/* eslint-disable */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY){ console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

const CHANNEL_URL = process.env.YT_CHANNEL_URL || 'https://youtube.com/watch?v=dQw4w9WgXcQ'
const LIMIT = parseInt(process.env.BATCH_LIMIT || '1000')

async function main(){
  const { data: persons } = await supabase.from('personas').select('id').limit(LIMIT)
  if (!persons || persons.length === 0){ console.log('No personas'); return }
  // Find YouTube template
  const { data: tpl } = await supabase.from('task_templates').select('*').ilike('name','%YouTube Watch + Subscribe%').maybeSingle()
  for (const p of persons){
    const { data: task } = await supabase.from('tasks').insert({ persona_id: p.id, task_type: 'script', execution_mode: 'manual', target_url: CHANNEL_URL }).select('*').single()
    // No immediate start. Scheduler can pick up by setting scheduled_time; or start via Edge Function here if desired
    await supabase.from('task_runs').insert({ task_id: task.id, status: 'queued', started_at: new Date().toISOString() })
  }
  console.log('Enqueued', persons.length, 'tasks')
}

main().catch(e => { console.error(e); process.exit(1) })