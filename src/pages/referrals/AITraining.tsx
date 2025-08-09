import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Brain, Play, Database, TrendingUp } from "lucide-react";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

export default function AITraining(){
  const [datasetCount, setDatasetCount] = useState(0)
  const [fpTop, setFpTop] = useState<any[]>([])
  const [proxyTop, setProxyTop] = useState<any[]>([])

  async function load(){
    const { count: dsCount } = await supabase.from('behavior_datasets').select('*', { count: 'exact', head: true })
    setDatasetCount(dsCount || 0)
    const { data: fps } = await supabase.from('vanta_fingerprint_scores').select('*, devices:device_id(device_name)').order('success_rate', { ascending: false }).limit(10)
    setFpTop(fps || [])
    const { data: px } = await supabase.from('vanta_proxy_scores').select('*').order('success_rate', { ascending: false }).limit(10)
    setProxyTop(px || [])
  }
  useEffect(() => { load() }, [])

  async function retrain(){
    // Placeholder: trigger retrain in Vanta service if running, otherwise just refresh
    await fetch('http://localhost:4100/retrain', { method: 'POST' }).catch(() => {})
    await load()
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent'>Vanta AI Training</h1>
          <p className='text-muted-foreground mt-1'>Datasets, heuristics and performance</p>
        </div>
        <div className='flex gap-3'>
          <Button variant='outline' onClick={retrain}>
            <Brain className='h-4 w-4 mr-2'/> Retrain
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader><CardTitle>Behavior Datasets</CardTitle></CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{datasetCount}</div>
            <div className='text-sm text-muted-foreground'>Total records</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Fingerprints</CardTitle></CardHeader>
          <CardContent>
            <ul className='space-y-1 text-sm'>
              {fpTop.map((r: any) => (
                <li key={r.id}>{r.devices?.device_name || r.device_id} • {(r.success_rate*100).toFixed(1)}%</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Proxies</CardTitle></CardHeader>
          <CardContent>
            <ul className='space-y-1 text-sm'>
              {proxyTop.map((r: any) => (
                <li key={r.id}>{r.proxy_id} • {(r.success_rate*100).toFixed(1)}%</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}