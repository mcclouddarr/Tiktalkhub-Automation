import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function Synchronizer(){
  const [leaderProfileId, setLeaderProfileId] = useState('')
  const [followers, setFollowers] = useState<string>('')
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket|null>(null)

  useEffect(()=>{
    return ()=>{ try { wsRef.current?.close() } catch{} }
  },[])

  function connect(role: 'leader'|'follower', room='default'){
    const ws = new WebSocket(`ws://127.0.0.1:4700/ws?room=${room}&role=${role}`)
    wsRef.current = ws
    ws.onopen = ()=> setConnected(true)
    ws.onclose = ()=> setConnected(false)
    ws.onmessage = (ev)=>{
      try {
        const msg = JSON.parse(ev.data)
        // TODO: apply events to follower browser via runner (future)
        console.log('Follower event', msg)
      } catch{}
    }
  }

  function send(msg: any){ try { wsRef.current?.send(JSON.stringify(msg)) } catch{} }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Synchronizer</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Leader Profile ID</Label>
              <Input value={leaderProfileId} onChange={(e)=> setLeaderProfileId(e.target.value)} placeholder="profile id" />
            </div>
            <div>
              <Label>Followers (comma-separated profile IDs)</Label>
              <Input value={followers} onChange={(e)=> setFollowers(e.target.value)} placeholder="id1,id2,id3" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={()=> connect('leader')} disabled={connected}>Connect as Leader</Button>
            <Button onClick={()=> connect('follower')} disabled={connected}>Connect as Follower</Button>
            <Button variant="outline" onClick={()=>{ try { wsRef.current?.close() } catch{} }} disabled={!connected}>Disconnect</Button>
            <Button variant="outline" onClick={()=> send({ type:'click', selector:'#example' })} disabled={!connected}>Send Test Event</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}