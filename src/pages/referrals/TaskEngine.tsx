import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Zap,
  Plus,
  Play,
  Pause,
  Square,
  RotateCcw,
  Eye,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Smartphone,
  Shield
} from "lucide-react";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

const platforms = [
  "tiktok", "facebook", "instagram", "twitter", "youtube", "whatsapp"
];

export default function TaskEngine() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [filter, setFilter] = useState("all");
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState({ campaign_id: '', persona_id: '' });

  async function load(){
    const { data } = await supabase.from('referral_tasks').select('*, referral_campaigns:campaign_id(name, traffic_source)').order('created_at', { ascending: false }).limit(200);
    setRows(data || []);
  }
  useEffect(() => { load(); }, []);

  async function createRefTask(){
    if (!form.campaign_id) return;
    await supabase.from('referral_tasks').insert({ campaign_id: form.campaign_id, persona_id: form.persona_id || null, status: 'pending' });
    setShowCreateDialog(false);
    setForm({ campaign_id: '', persona_id: '' });
    await load();
  }

  async function startRefTask(taskId: string){
    await supabase.functions.invoke('taskController', { body: { action: 'start', task_id: taskId } });
    await load();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-warning text-warning-foreground";
      case "completed":
        return "bg-success text-success-foreground";
      case "failed":
        return "bg-error text-error-foreground";
      case "queued":
        return "bg-muted text-muted-foreground";
      case "paused":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Play className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
      case "queued":
        return <Clock className="h-4 w-4" />;
      case "paused":
        return <Pause className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      tiktok: "bg-pink-500/10 text-pink-500",
      facebook: "bg-blue-500/10 text-blue-500",
      instagram: "bg-purple-500/10 text-purple-500",
      twitter: "bg-cyan-500/10 text-cyan-500",
      youtube: "bg-red-500/10 text-red-500",
      whatsapp: "bg-green-500/10 text-green-500"
    };
    return colors[platform] || "bg-secondary text-secondary-foreground";
  };

  const filteredTasks = rows.filter(task => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Referral Task Engine
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and control automated referral tasks across platforms
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Square className="h-4 w-4 mr-2" />
            Stop All
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Launch Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Launch Referral Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Campaign ID</Label>
                  <Input placeholder="campaign uuid" value={form.campaign_id} onChange={(e) => setForm({ ...form, campaign_id: e.target.value })} />
                </div>
                <div>
                  <Label>Persona ID (optional)</Label>
                  <Input placeholder="persona uuid" value={form.persona_id} onChange={(e) => setForm({ ...form, persona_id: e.target.value })} />
                </div>
                <div className="text-right">
                  <Button onClick={createRefTask}>Create</Button>
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
              <Zap className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Active Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">87</p>
                <p className="text-sm text-muted-foreground">Completed Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">In Queue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-error" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Failed Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{t.referral_campaigns?.name || '-'}</div>
                    <Badge variant="outline" className="text-xxs">{t.referral_campaigns?.traffic_source || '-'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(t.status)}>{t.status}</Badge>
                  </TableCell>
                  <TableCell>{t.started_at ? new Date(t.started_at).toLocaleString() : '-'}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size='sm' variant='outline' onClick={() => startRefTask(t.id)}>Start</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Task Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Task Details - {selectedTask?.id}</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <div className="mt-1 flex items-center gap-2">
                    {getStatusIcon(selectedTask.status)}
                    <Badge className={getStatusColor(selectedTask.status)}>
                      {selectedTask.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Progress</Label>
                  <div className="mt-1 font-medium">{selectedTask.progress}%</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Session Depth</Label>
                  <div className="mt-1 font-medium">{selectedTask.sessionDepth}</div>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Current Step</Label>
                <p className="mt-1">{selectedTask.currentStep}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Performance</Label>
                  <div className="mt-1 space-y-1">
                    <div>Clicks: {selectedTask.clicks}</div>
                    <div>Conversions: {selectedTask.conversions}</div>
                    <div>Errors: {selectedTask.errors}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Timing</Label>
                  <div className="mt-1 space-y-1">
                    <div>Started: {selectedTask.startTime}</div>
                    <div>ETA: {selectedTask.estimatedCompletion}</div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Session Trail</Label>
                <div className="mt-2 bg-muted rounded-lg p-4 space-y-2 max-h-32 overflow-y-auto">
                  <div className="text-sm font-mono">
                    [14:30:22] Started referral session<br/>
                    [14:30:25] Clicked initial referral link<br/>
                    [14:30:28] Navigated to signup page<br/>
                    [14:31:05] Filled form fields (name, email)<br/>
                    [14:31:42] Currently processing captcha...
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Session
                </Button>
                {selectedTask.status === "running" && (
                  <Button className="bg-gradient-primary hover:opacity-90">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Task
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}