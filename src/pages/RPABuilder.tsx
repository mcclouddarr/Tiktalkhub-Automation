import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const defaultOps = ['Access Website','Click','Type','Wait','Scroll','Screenshot','Go Back','Refresh','Close Tab']

export default function RPABuilder(){
  const [name, setName] = useState('')
  const [group, setGroup] = useState('Ungrouped')
  const [steps, setSteps] = useState<any[]>([])

  function addStep(action: string){
    const s: any = { action }
    if (action === 'Access Website') s.url = ''
    if (action === 'Click') s.selector = ''
    if (action === 'Type') { s.selector = ''; s.text = '' }
    if (action === 'Wait') s.ms = 1000
    setSteps(prev => [...prev, s])
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>RPA Builder</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Process name</Label>
                  <Input value={name} onChange={(e)=> setName(e.target.value)} placeholder="Please fill in the task title" />
                </div>
                <div>
                  <Label>Group</Label>
                  <Input value={group} onChange={(e)=> setGroup(e.target.value)} />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {defaultOps.map(op => (
                  <Button key={op} variant="outline" size="sm" onClick={()=> addStep(op)}>{op}</Button>
                ))}
              </div>

              <div className="space-y-2">
                {steps.map((s, idx) => (
                  <div key={idx} className="border rounded p-3 grid grid-cols-4 gap-3">
                    <div className="col-span-1 text-sm font-medium">{s.action}</div>
                    {s.url !== undefined && (
                      <div className="col-span-3"><Input placeholder="https://..." value={s.url} onChange={(e)=>{
                        const copy=[...steps]; copy[idx].url=e.target.value; setSteps(copy)
                      }} /></div>
                    )}
                    {s.selector !== undefined && (
                      <div className="col-span-3"><Input placeholder="#selector" value={s.selector} onChange={(e)=>{
                        const copy=[...steps]; copy[idx].selector=e.target.value; setSteps(copy)
                      }} /></div>
                    )}
                    {s.text !== undefined && (
                      <div className="col-span-3"><Input placeholder="text..." value={s.text} onChange={(e)=>{
                        const copy=[...steps]; copy[idx].text=e.target.value; setSteps(copy)
                      }} /></div>
                    )}
                    {s.ms !== undefined && (
                      <div className="col-span-3"><Input placeholder="1000" value={s.ms} onChange={(e)=>{
                        const copy=[...steps]; copy[idx].ms=parseInt(e.target.value||'0'); setSteps(copy)
                      }} /></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button className="bg-gradient-primary">Save</Button>
                <Button variant="outline">Run</Button>
              </div>
            </div>

            <div className="col-span-1">
              <Card>
                <CardHeader><CardTitle>On-error policy</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm">Skip</Button>
                  <Button variant="outline" size="sm">Retry</Button>
                  <Button variant="outline" size="sm">Abort</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}