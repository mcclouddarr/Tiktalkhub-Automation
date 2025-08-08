import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Target,
  Plus,
  QrCode,
  Link as LinkIcon,
  Users,
  Smartphone,
  Shield,
  Clock,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  Eye
} from "lucide-react";

const campaigns = [
  {
    id: "camp_001",
    name: "TikTok Creator Program",
    platform: "tiktok",
    targetUrl: "https://creators.tiktok.com/signup?ref=abc123",
    personas: ["Emma_21_iOS", "Jake_19_Android"],
    devices: ["iPhone 16 Pro", "Galaxy S24"],
    proxies: ["US-Mobile-1", "US-Mobile-2"],
    status: "active",
    clicks: 247,
    conversions: 23,
    conversionRate: 9.3,
    created: "2024-01-10",
    lastRun: "5 min ago"
  },
  {
    id: "camp_002",
    name: "YouTube Partner Referral",
    platform: "youtube",
    targetUrl: "https://youtube.com/partner/signup?referral=xyz789",
    personas: ["Sarah_25_iPad"],
    devices: ["iPad Pro M4"],
    proxies: ["CA-WiFi-1"],
    status: "paused",
    clicks: 89,
    conversions: 12,
    conversionRate: 13.5,
    created: "2024-01-12",
    lastRun: "2 hours ago"
  },
  {
    id: "camp_003",
    name: "Instagram Creator Fund",
    platform: "instagram",
    targetUrl: "https://business.instagram.com/creators?ref=def456",
    personas: ["Alex_23_Desktop", "Maria_26_Chrome"],
    devices: ["MacBook Pro M3", "Windows Desktop"],
    proxies: ["UK-Residential-1", "UK-Residential-2"],
    status: "draft",
    clicks: 0,
    conversions: 0,
    conversionRate: 0,
    created: "2024-01-15",
    lastRun: "Never"
  }
];

const platforms = [
  { name: "TikTok Ads", value: "tiktok", color: "bg-pink-500/10 text-pink-500" },
  { name: "Facebook Ads", value: "facebook", color: "bg-blue-500/10 text-blue-500" },
  { name: "Instagram Ads", value: "instagram", color: "bg-purple-500/10 text-purple-500" },
  { name: "X (Twitter) Ads", value: "twitter", color: "bg-cyan-500/10 text-cyan-500" },
  { name: "YouTube Ads", value: "youtube", color: "bg-red-500/10 text-red-500" },
  { name: "WhatsApp", value: "whatsapp", color: "bg-green-500/10 text-green-500" }
];

export default function CampaignBuilder() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "paused":
        return "bg-warning text-warning-foreground";
      case "draft":
        return "bg-muted text-muted-foreground";
      case "completed":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getPlatformColor = (platform: string) => {
    const platformConfig = platforms.find(p => p.value === platform);
    return platformConfig?.color || "bg-secondary text-secondary-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Campaign Builder
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage referral campaigns across platforms
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <QrCode className="h-4 w-4 mr-2" />
            QR Generator
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input
                      id="campaign-name"
                      placeholder="TikTok Creator Program"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem key={platform.value} value={platform.value}>
                            {platform.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="target-url">Target URL</Label>
                  <Input
                    id="target-url"
                    placeholder="https://creators.tiktok.com/signup?ref=abc123"
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="max-depth">Max Depth</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select depth" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Level</SelectItem>
                        <SelectItem value="2">2 Levels</SelectItem>
                        <SelectItem value="3">3 Levels</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="delay-min">Min Delay (seconds)</Label>
                    <Input
                      id="delay-min"
                      type="number"
                      placeholder="30"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="delay-max">Max Delay (seconds)</Label>
                    <Input
                      id="delay-max"
                      type="number"
                      placeholder="120"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label>Assign Personas</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["Emma_21_iOS", "Jake_19_Android", "Sarah_25_iPad", "Alex_23_Desktop", "Maria_26_Chrome", "David_22_Firefox"].map((persona) => (
                      <div key={persona} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={persona}
                          className="rounded border-border"
                        />
                        <Label htmlFor={persona} className="text-sm">{persona}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Click-through Behavior</Label>
                  <Textarea
                    placeholder="Define the click path behavior, delays, and interaction patterns..."
                    className="mt-2 h-24"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="random-intervals" />
                    <Label htmlFor="random-intervals">Random intervals</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="generate-qr" />
                    <Label htmlFor="generate-qr">Generate QR code</Label>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="outline">
                    Save as Draft
                  </Button>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    Create Campaign
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <LinkIcon className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Conversions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <QrCode className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">12.5%</p>
                <p className="text-sm text-muted-foreground">Avg Conv. Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Target URL</TableHead>
                <TableHead>Personas</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {campaign.id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlatformColor(campaign.platform)}>
                      {campaign.platform}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={campaign.targetUrl}>
                      {campaign.targetUrl}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {campaign.personas.map((persona) => (
                        <Badge key={persona} variant="outline" className="text-xs">
                          {persona.split('_')[0]}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{campaign.clicks} clicks</span>
                        <span>{campaign.conversions} conv.</span>
                      </div>
                      <div className="text-sm font-medium">
                        {campaign.conversionRate}% rate
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {campaign.lastRun}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {campaign.status === "active" ? (
                        <Button variant="ghost" size="sm">
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setShowQrDialog(true);
                        }}
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-error hover:text-error">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code & Referral Link</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm text-muted-foreground">Campaign</Label>
                <p className="font-medium">{selectedCampaign.name}</p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Referral URL</Label>
                <div className="flex gap-2 mt-2">
                  <Input value={selectedCampaign.targetUrl} readOnly />
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-muted rounded-lg p-8 inline-block">
                  <div className="w-48 h-48 bg-background rounded border-2 border-dashed border-border flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">QR Code</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowQrDialog(false)}>
                  Close
                </Button>
                <Button variant="outline">
                  Download QR
                </Button>
                <Button className="bg-gradient-primary hover:opacity-90">
                  Generate New
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}