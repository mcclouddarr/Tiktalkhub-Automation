import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { getSignedUrl } from '@/lib/storage'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!)

export default function RunDetails(){
  const { id } = useParams()
  const [run, setRun] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [traceFile, setTraceFile] = useState<string>('')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => { (async () => {
    if (!id) return
    const { data: r } = await supabase.from('task_runs').select('*').eq('id', id).single()
    setRun(r || null)
    const { data: ls } = await supabase.from('task_logs').select('*').eq('run_id', id).order('ts', { ascending: true }).limit(1000)
    setLogs(ls || [])
    const lastTrace = (ls || []).filter((l:any) => l.message === 'trace_uploaded').pop()
    if (lastTrace?.data?.file) setTraceFile(lastTrace.data.file)
  })() }, [id])

  async function downloadTrace(){
    if (!traceFile) return
    try{
      setDownloading(true)
      const url = await getSignedUrl('logs', traceFile, 120)
      window.open(url, '_blank')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader><CardTitle>Run {id}</CardTitle></CardHeader>
        <CardContent>
          <div className='grid grid-cols-4 gap-3 text-sm'>
            <div><div className='text-muted-foreground'>Status</div><div>{run?.status || '-'}</div></div>
            <div><div className='text-muted-foreground'>Started</div><div>{run?.started_at ? new Date(run.started_at).toLocaleString() : '-'}</div></div>
            <div><div className='text-muted-foreground'>Finished</div><div>{run?.finished_at ? new Date(run.finished_at).toLocaleString() : '-'}</div></div>
            <div>
              <div className='text-muted-foreground'>Trace</div>
              <Button size='sm' variant='outline' onClick={downloadTrace} disabled={!traceFile || downloading}>{downloading ? 'Preparing...' : (traceFile ? 'Download' : 'Unavailable')}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Logs</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map(l => (
                <TableRow key={l.id}>
                  <TableCell className='text-xs'>{new Date(l.ts).toLocaleTimeString()}</TableCell>
                  <TableCell className='text-xs'>{l.level}</TableCell>
                  <TableCell className='text-xs'>{l.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}