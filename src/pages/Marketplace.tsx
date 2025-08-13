import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { listTemplates } from '@/lib/taskTemplates'

export default function Marketplace(){
  const [search, setSearch] = useState('')
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function refresh(){
    setLoading(true)
    try {
      const data = await listTemplates(search)
      setTemplates(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=> { refresh() }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input placeholder="Search templates" value={search} onChange={(e)=> setSearch(e.target.value)} />
        <Button onClick={refresh} disabled={loading}>Search</Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {templates.map((t) => (
          <Card key={t.id}>
            <CardHeader><CardTitle className="truncate">{t.name}</CardTitle></CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground h-12 overflow-hidden">{t.description || 'No description'}</div>
              <div className="mt-3 flex gap-2">
                <Button size="sm">Import</Button>
                <Button size="sm" variant="outline">Preview</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}