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

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

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
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", platform: "", target_url: "", notes: "" });

  async function loadCampaigns(){
    const { data } = await supabase.from('referral_campaigns').select('*').order('created_at', { ascending: false });
    setCampaigns(data || []);
  }
  useEffect(() => { loadCampaigns(); }, []);

  async function createCampaign(){
    if (!form.name || !form.platform) return;
    await supabase.from('referral_campaigns').insert({ name: form.name, traffic_source: form.platform, notes: form.notes });
    setShowCreateDialog(false);
    setForm({ name: "", platform: "", target_url: "", notes: "" });
    await loadCampaigns();
  }

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
                    <Input id="campaign-name" placeholder="TikTok Creator Program" className="mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v })}>
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
                  <Input id="target-url" placeholder="https://creators.tiktok.com/signup?ref=abc123" className="mt-2" value={form.target_url} onChange={(e) => setForm({ ...form, target_url: e.target.value })} />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Instructions..." className="mt-2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>

                <div className="text-right">
                  <Button onClick={createCampaign}>Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{c.id}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlatformColor(c.traffic_source)}>{c.traffic_source}</Badge>
                  </TableCell>
                  <TableCell>{new Date(c.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedCampaign(c)}>View</Button>
                      <Button size="sm" variant="outline">Start Tasks</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}