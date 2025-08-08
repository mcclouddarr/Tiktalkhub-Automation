import { useState } from "react";
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

const tasks = [
  {
    id: "task_ref_001",
    campaignId: "camp_001",
    campaignName: "TikTok Creator Program",
    platform: "tiktok",
    persona: "Emma_21_iOS",
    device: "iPhone 16 Pro",
    proxy: "US-Mobile-1",
    status: "running",
    progress: 75,
    clicks: 12,
    conversions: 3,
    currentStep: "Filling signup form",
    startTime: "2024-01-15 14:30:22",
    estimatedCompletion: "2 min",
    sessionDepth: 2,
    errors: 0
  },
  {
    id: "task_ref_002",
    campaignId: "camp_002",
    campaignName: "YouTube Partner Referral",
    platform: "youtube",
    persona: "Jake_19_Android",
    device: "Galaxy S24",
    proxy: "CA-WiFi-1",
    status: "completed",
    progress: 100,
    clicks: 8,
    conversions: 1,
    currentStep: "Task completed successfully",
    startTime: "2024-01-15 13:45:10",
    estimatedCompletion: "Completed",
    sessionDepth: 3,
    errors: 0
  },
  {
    id: "task_ref_003",
    campaignId: "camp_001",
    campaignName: "TikTok Creator Program",
    platform: "tiktok",
    persona: "Sarah_25_iPad",
    device: "iPad Pro M4",
    proxy: "UK-Residential-2",
    status: "failed",
    progress: 45,
    clicks: 5,
    conversions: 0,
    currentStep: "Error: Captcha detection",
    startTime: "2024-01-15 12:20:45",
    estimatedCompletion: "Failed",
    sessionDepth: 1,
    errors: 3
  },
  {
    id: "task_ref_004",
    campaignId: "camp_003",
    campaignName: "Instagram Creator Fund",
    platform: "instagram",
    persona: "Alex_23_Desktop",
    device: "MacBook Pro M3",
    proxy: "US-Residential-1",
    status: "queued",
    progress: 0,
    clicks: 0,
    conversions: 0,
    currentStep: "Waiting in queue",
    startTime: "Not started",
    estimatedCompletion: "5 min",
    sessionDepth: 0,
    errors: 0
  }
];

const platforms = [
  "tiktok", "facebook", "instagram", "twitter", "youtube", "whatsapp"
];

export default function TaskEngine() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [filter, setFilter] = useState("all");

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

  const filteredTasks = tasks.filter(task => {
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
                <DialogTitle>Launch New Referral Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="campaign">Campaign</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select campaign" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="camp_001">TikTok Creator Program</SelectItem>
                        <SelectItem value="camp_002">YouTube Partner Referral</SelectItem>
                        <SelectItem value="camp_003">Instagram Creator Fund</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem key={platform} value={platform}>
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="persona">Persona</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select persona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emma">Emma_21_iOS</SelectItem>
                        <SelectItem value="jake">Jake_19_Android</SelectItem>
                        <SelectItem value="sarah">Sarah_25_iPad</SelectItem>
                        <SelectItem value="alex">Alex_23_Desktop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="device">Device Shell</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select device" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iphone16">iPhone 16 Pro</SelectItem>
                        <SelectItem value="galaxy24">Galaxy S24</SelectItem>
                        <SelectItem value="ipad">iPad Pro M4</SelectItem>
                        <SelectItem value="macbook">MacBook Pro M3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="proxy">Proxy/IP</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select proxy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-mobile-1">US-Mobile-1</SelectItem>
                        <SelectItem value="ca-wifi-1">CA-WiFi-1</SelectItem>
                        <SelectItem value="uk-res-1">UK-Residential-1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max-depth">Max Session Depth</Label>
                    <Input
                      id="max-depth"
                      type="number"
                      placeholder="3"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="delay">Random Delay (seconds)</Label>
                    <Input
                      id="delay"
                      placeholder="30-120"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="outline">
                    Schedule Later
                  </Button>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    <Play className="h-4 w-4 mr-2" />
                    Launch Now
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

      {/* Task Queue */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Task Queue</CardTitle>
            <div className="flex gap-3">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="queued">Queued</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Logs
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Persona & Device</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <div className="font-mono text-sm">{task.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {task.currentStep}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{task.campaignName}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlatformColor(task.platform)}>
                      {task.platform}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Smartphone className="h-3 w-3" />
                        {task.persona}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-3 w-3" />
                        {task.proxy}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{task.progress}%</span>
                        <span>Depth: {task.sessionDepth}</span>
                      </div>
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {task.clicks} clicks • {task.conversions} conv.
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {task.errors} errors
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {task.status === "running" ? (
                        <Button variant="ghost" size="sm">
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : task.status === "paused" ? (
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      ) : task.status === "failed" ? (
                        <Button variant="ghost" size="sm">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      ) : null}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedTask(task);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
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