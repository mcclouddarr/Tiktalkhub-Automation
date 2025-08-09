import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { subscribeTaskRuns, subscribeTaskLogs } from '@/lib/realtime'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!)

export default function TaskEnginePage(){
  const [tasks, setTasks] = useState<any[]>([])
  const [runs, setRuns] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [newTask, setNewTask] = useState({ persona_id: '', task_type: 'referral', execution_mode: 'manual', target_url: '' })

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
    await supabase.from('tasks').insert(newTask)
    setNewTask({ persona_id: '', task_type: 'referral', execution_mode: 'manual', target_url: '' })
    await load()
  }

  async function startTask(id: string){
    await supabase.functions.invoke('taskController', { body: { action: 'start', task_id: id } })
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
                    <TableCell className='font-mono text-xs'>{r.id}</TableCell>
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