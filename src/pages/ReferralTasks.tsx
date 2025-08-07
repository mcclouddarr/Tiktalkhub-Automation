import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Link as LinkIcon,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Download,
  Eye,
  Settings,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";

const tasks = [
  {
    id: "task_001",
    url: "https://tiktok.com/@user123/video/abc",
    personas: ["Emma_21_iOS", "Jake_19_Android"],
    runs: 50,
    completed: 47,
    success: 44,
    status: "running",
    created: "2024-01-15 14:30:22",
    lastRun: "2 min ago",
    retries: 2,
    priority: "high"
  },
  {
    id: "task_002", 
    url: "https://youtube.com/watch?v=xyz123",
    personas: ["Sarah_25_iPad"],
    runs: 25,
    completed: 25,
    success: 23,
    status: "completed",
    created: "2024-01-15 13:15:10",
    lastRun: "1 hour ago",
    retries: 0,
    priority: "medium"
  },
  {
    id: "task_003",
    url: "https://instagram.com/p/def456",
    personas: ["Alex_23_Desktop", "Emma_21_iOS"],
    runs: 100,
    completed: 100,
    success: 89,
    status: "completed",
    created: "2024-01-15 12:45:30",
    lastRun: "3 hours ago",
    retries: 1,
    priority: "low"
  },
  {
    id: "task_004",
    url: "https://twitter.com/user/status/ghi789",
    personas: ["Jake_19_Android"],
    runs: 30,
    completed: 15,
    success: 12,
    status: "failed",
    created: "2024-01-15 11:20:45",
    lastRun: "30 min ago",
    retries: 3,
    priority: "high"
  }
];

const personas = [
  "Emma_21_iOS",
  "Jake_19_Android", 
  "Sarah_25_iPad",
  "Alex_23_Desktop",
  "Maria_26_Chrome",
  "David_22_Firefox"
];

export default function ReferralTasks() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    url: "",
    personas: [] as string[],
    runs: 10,
    priority: "medium"
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-warning text-warning-foreground";
      case "completed":
        return "bg-success text-success-foreground";
      case "failed":
        return "bg-error text-error-foreground";
      case "paused":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-error text-error-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-success text-success-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Referral Task Bridge
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor URL automation tasks across personas
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Task Settings
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Referral Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="task-url">Target URL</Label>
                  <Input
                    id="task-url"
                    placeholder="https://tiktok.com/@user/video/123"
                    value={newTask.url}
                    onChange={(e) => setNewTask({...newTask, url: e.target.value})}
                    className="mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="task-runs">Number of Runs</Label>
                    <Input
                      id="task-runs"
                      type="number"
                      placeholder="10"
                      value={newTask.runs}
                      onChange={(e) => setNewTask({...newTask, runs: parseInt(e.target.value) || 0})}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="task-priority">Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Assign Personas</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {personas.map((persona) => (
                      <div key={persona} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={persona}
                          checked={newTask.personas.includes(persona)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewTask({...newTask, personas: [...newTask.personas, persona]});
                            } else {
                              setNewTask({...newTask, personas: newTask.personas.filter(p => p !== persona)});
                            }
                          }}
                          className="rounded border-border"
                        />
                        <Label htmlFor={persona} className="text-sm">{persona}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    Create Task
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
              <LinkIcon className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">24</p>
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
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Runs Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">94.2%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">In Queue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Task Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task ID</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Personas</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-mono text-sm">{task.id}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={task.url}>
                      {task.url}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {task.personas.map((persona) => (
                        <Badge key={persona} variant="secondary" className="text-xs">
                          {persona.split('_')[0]}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{task.completed}/{task.runs}</span>
                        <span>{Math.round((task.completed / task.runs) * 100)}%</span>
                      </div>
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(task.completed / task.runs) * 100}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span className="text-sm font-medium">
                        {task.completed > 0 ? Math.round((task.success / task.completed) * 100) : 0}%
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {task.success}/{task.completed}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {task.status === "running" ? (
                        <Button variant="ghost" size="sm">
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {task.status === "failed" && (
                        <Button variant="ghost" size="sm">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
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
    </div>
  );
}