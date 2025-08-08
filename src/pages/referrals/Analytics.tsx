import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const analyticsData = {
  overview: {
    totalClicks: 2847,
    totalConversions: 342,
    conversionRate: 12.0,
    bounceRate: 23.5,
    avgSessionDepth: 2.8,
    uniqueDevices: 156
  },
  platforms: [
    {
      name: "TikTok Ads",
      clicks: 1247,
      conversions: 156,
      rate: 12.5,
      bounce: 18.2,
      trend: "up"
    },
    {
      name: "Instagram Ads", 
      clicks: 892,
      conversions: 98,
      rate: 11.0,
      bounce: 22.1,
      trend: "up"
    },
    {
      name: "Facebook Ads",
      clicks: 456,
      conversions: 52,
      rate: 11.4,
      bounce: 28.9,
      trend: "down"
    },
    {
      name: "YouTube Ads",
      clicks: 252,
      conversions: 36,
      rate: 14.3,
      bounce: 15.7,
      trend: "up"
    }
  ],
  devices: [
    { type: "iPhone", sessions: 1234, conversions: 168, rate: 13.6 },
    { type: "Android", sessions: 987, conversions: 98, rate: 9.9 },
    { type: "Desktop", sessions: 456, conversions: 52, rate: 11.4 },
    { type: "iPad", sessions: 170, conversions: 24, rate: 14.1 }
  ],
  referralPaths: [
    {
      id: "path_001",
      origin: "TikTok Ad → Landing Page",
      steps: 4,
      completions: 156,
      dropoffRate: 12.5,
      avgTime: "3m 24s"
    },
    {
      id: "path_002", 
      origin: "Instagram Story → Signup",
      steps: 3,
      completions: 98,
      dropoffRate: 18.7,
      avgTime: "2m 45s"
    },
    {
      id: "path_003",
      origin: "WhatsApp Link → Form",
      steps: 5,
      completions: 67,
      dropoffRate: 22.1,
      avgTime: "4m 12s"
    }
  ]
};

export default function Analytics() {
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
        <div className="flex gap-3">
          <Select defaultValue="7d">
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
            Export Report
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
                <p className="text-2xl font-bold">{analyticsData.overview.totalClicks.toLocaleString()}</p>
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
                <p className="text-2xl font-bold">{analyticsData.overview.totalConversions}</p>
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
                <p className="text-2xl font-bold">{analyticsData.overview.conversionRate}%</p>
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
                <p className="text-2xl font-bold">{analyticsData.overview.bounceRate}%</p>
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
                <p className="text-2xl font-bold">{analyticsData.overview.avgSessionDepth}</p>
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
                <p className="text-2xl font-bold">{analyticsData.overview.uniqueDevices}</p>
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
              {analyticsData.platforms.map((platform) => (
                <div key={platform.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{platform.name}</div>
                      {platform.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-error" />
                      )}
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

        {/* Device Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Device Fingerprint Trail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.devices.map((device) => (
                <div key={device.type} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{device.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{device.sessions.toLocaleString()} sessions</div>
                    <div className="text-sm text-muted-foreground">
                      {device.conversions} conv. • {device.rate}% rate
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Tree */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Referral Tree (Visual Session Path)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.referralPaths.map((path, index) => (
              <div key={path.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">Path {index + 1}</Badge>
                    <span className="font-medium">{path.origin}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{path.steps} steps</span>
                    <span>{path.avgTime} avg time</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${100 - path.dropoffRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{path.completions} completions</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center p-2 bg-primary/10 rounded">
                    <div className="font-medium">Start</div>
                    <div className="text-muted-foreground">100%</div>
                  </div>
                  <div className="text-center p-2 bg-primary/20 rounded">
                    <div className="font-medium">Click</div>
                    <div className="text-muted-foreground">85%</div>
                  </div>
                  <div className="text-center p-2 bg-primary/30 rounded">
                    <div className="font-medium">Form</div>
                    <div className="text-muted-foreground">68%</div>
                  </div>
                  <div className="text-center p-2 bg-primary/40 rounded">
                    <div className="font-medium">Convert</div>
                    <div className="text-muted-foreground">{Math.round(100 - path.dropoffRate)}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Referral Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "2 min ago", event: "New conversion from TikTok campaign", persona: "Emma_21_iOS", value: "$45" },
              { time: "5 min ago", event: "High bounce rate detected on Instagram path", persona: "Jake_19_Android", value: "Alert" },
              { time: "12 min ago", event: "Campaign reached 1000 clicks milestone", persona: "Multiple", value: "Milestone" },
              { time: "18 min ago", event: "Device fingerprint flagged as suspicious", persona: "Sarah_25_iPad", value: "Warning" },
              { time: "25 min ago", event: "New referral path discovered", persona: "Alex_23_Desktop", value: "Insight" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div>
                    <div className="font-medium">{activity.event}</div>
                    <div className="text-sm text-muted-foreground">
                      {activity.persona} • {activity.time}
                    </div>
                  </div>
                </div>
                <Badge variant={
                  activity.value.startsWith('$') ? 'default' :
                  activity.value === 'Alert' || activity.value === 'Warning' ? 'destructive' :
                  'secondary'
                }>
                  {activity.value}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}