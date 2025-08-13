import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function Synchronizer(){
  const [leaderProfileId, setLeaderProfileId] = useState('')
  const [followers, setFollowers] = useState<string>('')
  const [connected, setConnected] = useState(false)

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
            <Button onClick={()=> setConnected(true)} disabled={connected}>Connect</Button>
            <Button variant="outline" onClick={()=> setConnected(false)} disabled={!connected}>Disconnect</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}