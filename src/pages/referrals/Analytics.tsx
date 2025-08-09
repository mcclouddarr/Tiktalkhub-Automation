import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  MousePointer,
  Users,
  Target,
  Download,
  Calendar,
  Eye,
  BarChart3,
  PieChart
} from "lucide-react";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

export default function Analytics() {
  const [period, setPeriod] = useState<'24h'|'7d'|'30d'|'90d'>('7d')
  const [snapshots, setSnapshots] = useState<any[]>([])

  useEffect(() => { (async () => {
    const now = new Date()
    const map: Record<string, number> = { '24h': 1, '7d': 7, '30d': 30, '90d': 90 }
    const days = map[period]
    const start = new Date(now.getTime() - days*24*60*60*1000).toISOString()
    const { data } = await supabase
      .from('referral_analytics_snapshots')
      .select('*')
      .gte('created_at', start)
      .order('created_at', { ascending: false })
      .limit(500)
    setSnapshots(data || [])
  })() }, [period])

  const overview = useMemo(() => {
    const totalClicks = snapshots.reduce((a, s) => a + (s.clicks||0), 0)
    const totalConversions = snapshots.reduce((a, s) => a + (s.conversions||0), 0)
    const conversionRate = totalClicks ? Math.round((totalConversions/totalClicks)*1000)/10 : 0
    const bounceRate = Math.round((snapshots.reduce((a,s)=> a + (s.bounce_rate || 0), 0) / (snapshots.length||1)) * 10)/10
    const uniqueDevices = snapshots.reduce((acc, s) => acc.add(s.device_fingerprint || 'unknown'), new Set()).size
    const avgSessionDepth = Math.round((snapshots.reduce((a,s)=> a + (s.avg_depth||0), 0) / (snapshots.length||1)) * 10)/10
    return { totalClicks, totalConversions, conversionRate, bounceRate, uniqueDevices, avgSessionDepth }
  }, [snapshots])

  const byPlatform = useMemo(() => {
    const m = new Map<string, { clicks: number; conversions: number }>()
    for (const s of snapshots){
      const k = s.traffic_source || s.platform || 'unknown'
      const v = m.get(k) || { clicks: 0, conversions: 0 }
      v.clicks += (s.clicks||0)
      v.conversions += (s.conversions||0)
      m.set(k, v)
    }
    return Array.from(m.entries()).map(([name, v]) => ({ name, clicks: v.clicks, conversions: v.conversions, rate: v.clicks ? Math.round((v.conversions/v.clicks)*1000)/10 : 0 }))
  }, [snapshots])

  const recentPaths = useMemo(() => (snapshots.slice(0, 10)), [snapshots])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Referral Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Track performance metrics and conversion patterns
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <Select value={period} onValueChange={(v:any)=> setPeriod(v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MousePointer className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{overview.totalClicks.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{overview.totalConversions}</p>
                <p className="text-sm text-muted-foreground">Conversions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">{overview.conversionRate}%</p>
                <p className="text-sm text-muted-foreground">Conv. Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{overview.bounceRate}%</p>
                <p className="text-sm text-muted-foreground">Bounce Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{overview.avgSessionDepth}</p>
                <p className="text-sm text-muted-foreground">Avg Depth</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-cyan-500" />
              <div>
                <p className="text-2xl font-bold">{overview.uniqueDevices}</p>
                <p className="text-sm text-muted-foreground">Unique Devices</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Platform Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {byPlatform.map((platform) => (
                <div key={platform.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{platform.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{platform.clicks.toLocaleString()} clicks</div>
                    <div className="text-sm text-muted-foreground">
                      {platform.conversions} conv. • {platform.rate}% rate
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Performance (simplified from snapshots) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Device Fingerprint Trail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              Data sourced from snapshots per device fingerprint (unique count above).
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Paths from snapshots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recent Referral Paths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPaths.map((s: any, index: number) => (
              <div key={`${s.id}-${index}`} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{(s.traffic_source || 'unknown').toUpperCase()}</Badge>
                    <span className="font-medium">{s.campaign_id || '—'}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{s.steps || s.path_steps || '-'} steps</span>
                    <span>{s.avg_time || s.avg_duration || '-'} avg time</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, 100 - (s.dropoff_rate || 0))) }%` }} />
                  </div>
                  <span className="text-sm font-medium">{(s.conversions || 0)} conversions</span>
                </div>
                <div className="flex gap-2">
                  {s.run_id ? (
                    <Link to={`/runs/${s.run_id}`} className="underline text-sm">Replay</Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity (optional) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Snapshot Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            Loaded {snapshots.length} snapshot rows for period {period}.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}