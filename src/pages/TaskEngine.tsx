import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { subscribeTaskRuns, subscribeTaskLogs } from '@/lib/realtime'
import { getAutomationDefaults } from '@/lib/automationDefaults'
import { Link } from 'react-router-dom'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!)

export default function TaskEnginePage(){
  const [tasks, setTasks] = useState<any[]>([])
  const [runs, setRuns] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [newTask, setNewTask] = useState({ persona_id: '', task_type: 'referral', execution_mode: 'manual', target_url: '', headless: false })

  async function load(){
    const { data: t } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
    setTasks(t || [])
    const { data: r } = await supabase.from('task_runs').select('*').order('created_at', { ascending: false }).limit(200)
    setRuns(r || [])
  }

  useEffect(() => { load(); }, [])
  useEffect(() => {
    const unsub = subscribeTaskRuns(() => load())
    return unsub
  }, [])

  async function createTask(){
    await supabase.from('tasks').insert({ ...newTask, headless: newTask.headless ? 'true' : 'false' } as any)
    setNewTask({ persona_id: '', task_type: 'referral', execution_mode: 'manual', target_url: '' })
    await load()
  }

  async function startTask(id: string){
    // Build launch payload on client: device/proxy/cookies and Vanta plan
    const { data: task } = await supabase.from('tasks').select('*').eq('id', id).single()
    if (!task) return
    const { buildLaunchForTask } = await import('@/lib/automationHooks')
    const { planSteps } = await import('@/lib/vanta')
    const defaults = getAutomationDefaults()
    const { launchConfig, preCookies } = await buildLaunchForTask(task.persona_id, task.target_url || '', { headless: defaults.headless })
    const steps = await planSteps(task.target_url || null, null)
    await supabase.functions.invoke('taskController', { body: { action: 'start', task_id: id, payload: { launchConfig, cookies: preCookies, target: task.target_url, steps } } })
  }
  async function pauseRun(runId: string){ await supabase.functions.invoke('taskController', { body: { action: 'pause', run_id: runId } }) }
  async function resumeRun(runId: string){ await supabase.functions.invoke('taskController', { body: { action: 'resume', run_id: runId } }) }
  async function terminateRun(runId: string){ await supabase.functions.invoke('taskController', { body: { action: 'terminate', run_id: runId } }) }

  const selectedRun = runs[0]
  useEffect(() => {
    if (!selectedRun?.id) return;
    const unsub = subscribeTaskLogs(selectedRun.id, async () => {
      const { data } = await supabase.from('task_logs').select('*').eq('run_id', selectedRun.id).order('ts', { ascending: true }).limit(300)
      setLogs(data || [])
    })
    return unsub
  }, [runs[0]?.id])

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader><CardTitle>Create Task</CardTitle></CardHeader>
        <CardContent className='space-y-3'>
          <div className='grid grid-cols-4 gap-3'>
            <Input placeholder='Persona ID' value={newTask.persona_id} onChange={(e) => setNewTask({ ...newTask, persona_id: e.target.value })} />
            <Input placeholder='Task Type (referral, browsing, ...)' value={newTask.task_type} onChange={(e) => setNewTask({ ...newTask, task_type: e.target.value })} />
            <Input placeholder='Mode (manual|vanta)' value={newTask.execution_mode} onChange={(e) => setNewTask({ ...newTask, execution_mode: e.target.value })} />
            <Input placeholder='Target URL' value={newTask.target_url} onChange={(e) => setNewTask({ ...newTask, target_url: e.target.value })} />
            <div className='flex items-center gap-2'>
              <label className='text-sm text-muted-foreground'>Headless</label>
              <input type='checkbox' checked={newTask.headless} onChange={(e)=> setNewTask({ ...newTask, headless: e.target.checked })} />
            </div>
          </div>
          <Button onClick={createTask}>Create</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Tasks</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Persona</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Logs (live)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(t => (
                <TableRow key={t.id}>
                  <TableCell className='font-mono text-xs'>{t.id}</TableCell>
                  <TableCell className='font-mono text-xs'>{t.persona_id || '-'}</TableCell>
                  <TableCell>{t.task_type}</TableCell>
                  <TableCell>{t.execution_mode}</TableCell>
                  <TableCell className='truncate max-w-[240px]'>{t.target_url}</TableCell>
                  <TableCell>
                    <Button size='sm' onClick={() => startTask(t.id)}>Start</Button>
                    <Button size='sm' variant='outline' className='ml-2' onClick={() => {
                      const r = runs.find(r=> r.task_id === t.id)
                      if (!r) return
                      const el = document.getElementById(`run-${r.id}`)
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}>View Run</Button>
                  </TableCell>
                  <TableCell className='text-xs text-muted-foreground'>
                    {(runs.find(r=> r.task_id === t.id) ? logs.slice(-5).map(l=> l.message).join(' | ') : '-')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader><CardTitle>Runs</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Run</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className='font-mono text-xs'><Link className='underline' to={`/runs/${r.id}`}>{r.id}</Link></TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell>{r.started_at ? new Date(r.started_at).toLocaleString() : '-'}</TableCell>
                    <TableCell>{r.finished_at ? new Date(r.finished_at).toLocaleString() : '-'}</TableCell>
                    <TableCell className='space-x-2'>
                      <Button size='sm' variant='outline' onClick={() => pauseRun(r.id)}>Pause</Button>
                      <Button size='sm' variant='outline' onClick={() => resumeRun(r.id)}>Resume</Button>
                      <Button size='sm' variant='outline' onClick={() => terminateRun(r.id)}>Terminate</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Logs (selected latest run)</CardTitle></CardHeader>
          <CardContent>
            <div className='h-64 overflow-auto space-y-1 text-xs font-mono'>
              {logs.map((l) => (
                <div key={`${l.id}-${l.ts}`}>
                  <span className='text-muted-foreground'>{new Date(l.ts).toLocaleTimeString()} </span>
                  <span>[{l.level}] </span>
                  <span>{l.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}