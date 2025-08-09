import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Calendar, Clock, Play, Pause, Square, Plus, Edit, Copy, Trash2, Filter, Settings as SettingsIcon, Zap } from "lucide-react";

export type TaskType = "gmail_import" | "youtube_subscribe" | "referral_join" | "playwright";

interface Task {
  id: string;
  name: string;
  type: TaskType;
  personaId: string;
  proxyId: string;
  cookieId: string;
  deviceId: string;
  scriptId?: string;
  status: "idle" | "running" | "paused" | "stopped" | "completed" | "failed";
  scheduleMode: "now" | "later";
  scheduledFor?: string; // ISO string
  parallel: boolean;
  bulkCount?: number;
  createdAt: string;
}

const mockPersonas = ["Emma_21_iOS", "Jake_19_Android", "Alex_Desktop", "Sarah_iPad"]; 
const mockProxies = ["US-East-01", "EU-West-02", "JP-Tokyo-01", "Rotating-Mobile-NA"]; 
const mockCookies = ["Chrome-Profile-12", "Firefox-Profile-7", "Playwright-Session-A"]; 
const mockDevices = ["iPhone 16 Pro", "Pixel 8", "MacBook Pro M3", "iPad Pro M4"]; 
const mockScripts = [
  { id: "sc_gmail", name: "Gmail Importer", type: "gmail_import" },
  { id: "sc_yt_sub", name: "YouTube Subscribe", type: "youtube_subscribe" },
  { id: "sc_ref_join", name: "Referral Joiner", type: "referral_join" },
  { id: "sc_generic", name: "Arbitrary Playwright Script", type: "playwright" },
];

const initialTasks: Task[] = [
  {
    id: "tsk_001",
    name: "Warm Gmail - Emma",
    type: "gmail_import",
    personaId: "Emma_21_iOS",
    proxyId: "US-East-01",
    cookieId: "Chrome-Profile-12",
    deviceId: "iPhone 16 Pro",
    scriptId: "sc_gmail",
    status: "idle",
    scheduleMode: "now",
    parallel: false,
    createdAt: new Date().toISOString(),
  },
];

export default function Scheduler() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [query, setQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [bulkMode, setBulkMode] = useState(false);

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) =>
      [t.name, t.personaId, t.proxyId, t.deviceId, t.status].join(" ").toLowerCase().includes(q)
    );
  }, [tasks, query]);

  const upsertTask = (next: Task) => {
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === next.id);
      if (idx >= 0) {
        const copy = prev.slice();
        copy[idx] = next;
        return copy;
      }
      return [next, ...prev];
    });
  };

  const createNewTask = () => {
    setEditing({
      id: `tsk_${Math.random().toString(36).slice(2, 8)}`,
      name: "New Task",
      type: "gmail_import",
      personaId: mockPersonas[0],
      proxyId: mockProxies[0],
      cookieId: mockCookies[0],
      deviceId: mockDevices[0],
      scriptId: mockScripts[0].id,
      status: "idle",
      scheduleMode: "now",
      parallel: false,
      bulkCount: bulkMode ? 10 : undefined,
      createdAt: new Date().toISOString(),
    });
    setShowDialog(true);
  };

  const duplicateTask = (task: Task) => {
    const copy: Task = { ...task, id: `tsk_${Math.random().toString(36).slice(2, 8)}`, status: "idle", createdAt: new Date().toISOString() };
    setTasks((prev) => [copy, ...prev]);
    toast({ title: "Task duplicated", description: `${task.name} copied` });
  };

  const deleteTask = (task: Task) => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    toast({ title: "Task deleted", description: task.name });
  };

  const setStatus = (task: Task, status: Task["status"]) => {
    upsertTask({ ...task, status });
    toast({ title: `Task ${status}`, description: task.name });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Task Scheduler & Control Panel
          </h1>
          <p className="text-muted-foreground mt-1">
            Create, schedule, and orchestrate automation tasks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch id="bulk" checked={bulkMode} onCheckedChange={setBulkMode} />
            <Label htmlFor="bulk" className="text-sm">Bulk mode</Label>
          </div>
          <Button className="bg-gradient-primary" onClick={createNewTask}>
            <Plus className="h-4 w-4 mr-2" /> New Task
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="settings">Defaults</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Filter className="h-5 w-5"/>Tasks</span>
                <div className="flex items-center gap-2">
                  <Input placeholder="Search tasks..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-64"/>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Persona</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Proxy</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{t.type.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell>{t.personaId}</TableCell>
                      <TableCell>{t.deviceId}</TableCell>
                      <TableCell>{t.proxyId}</TableCell>
                      <TableCell>
                        <span className="capitalize">{t.status}</span>
                      </TableCell>
                      <TableCell>
                        {t.scheduleMode === "now" ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground"><Zap className="h-4 w-4"/> Now</div>
                        ) : (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-4 w-4"/> {new Date(t.scheduledFor || "").toLocaleString()}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="sm" variant="outline" onClick={() => setStatus(t, "running")}> 
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setStatus(t, "paused")}>
                          <Pause className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setStatus(t, "stopped")}>
                          <Square className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setEditing(t); setShowDialog(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => duplicateTask(t)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteTask(t)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5"/>Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{tasks.filter(t => t.status === "running" || t.status === "paused").length} active tasks in queue.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><SettingsIcon className="h-5 w-5"/>Scheduler Defaults</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Task Type</Label>
                <Select defaultValue="gmail_import">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gmail_import">Gmail import</SelectItem>
                    <SelectItem value="youtube_subscribe">YouTube subscribe</SelectItem>
                    <SelectItem value="referral_join">Referral join</SelectItem>
                    <SelectItem value="playwright">Playwright script</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Max Parallel Tasks</Label>
                <Select defaultValue="10">
                  <SelectTrigger>
                    <SelectValue placeholder="Select max" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TaskDialog
        open={showDialog}
        task={editing}
        onOpenChange={(o) => setShowDialog(o)}
        onSave={(t) => { upsertTask(t); setShowDialog(false); setEditing(null); }}
      />
    </div>
  );
}

function TaskDialog({ open, onOpenChange, task, onSave }: { open: boolean; onOpenChange: (o: boolean) => void; task: Task | null; onSave: (t: Task) => void; }) {
  const [local, setLocal] = useState<Task | null>(task);

  // keep dialog in sync when editing changes
  if (open && task && local?.id !== task.id) {
    // initialize on new open/edit
    setLocal(task);
  }

  const update = (patch: Partial<Task>) => setLocal((cur) => (cur ? { ...cur, ...patch } : cur));
  const disabled = !local;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        {local && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Task Name</Label>
              <Input value={local.name} onChange={(e) => update({ name: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Task Type</Label>
              <Select value={local.type} onValueChange={(v: TaskType) => update({ type: v, scriptId: matchScriptForType(v) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gmail_import">Gmail import</SelectItem>
                  <SelectItem value="youtube_subscribe">YouTube subscribe</SelectItem>
                  <SelectItem value="referral_join">Referral join</SelectItem>
                  <SelectItem value="playwright">Playwright script</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Persona</Label>
              <Select value={local.personaId} onValueChange={(v) => update({ personaId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select persona" />
                </SelectTrigger>
                <SelectContent>
                  {mockPersonas.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Device</Label>
              <Select value={local.deviceId} onValueChange={(v) => update({ deviceId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select device" />
                </SelectTrigger>
                <SelectContent>
                  {mockDevices.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Proxy</Label>
              <Select value={local.proxyId} onValueChange={(v) => update({ proxyId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select proxy" />
                </SelectTrigger>
                <SelectContent>
                  {mockProxies.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cookie/Session</Label>
              <Select value={local.cookieId} onValueChange={(v) => update({ cookieId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cookie/session" />
                </SelectTrigger>
                <SelectContent>
                  {mockCookies.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Script</Label>
              <Select value={local.scriptId} onValueChange={(v) => update({ scriptId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select script" />
                </SelectTrigger>
                <SelectContent>
                  {mockScripts.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Run Mode</Label>
              <Select value={local.scheduleMode} onValueChange={(v: "now" | "later") => update({ scheduleMode: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Run now</SelectItem>
                  <SelectItem value="later">Schedule later</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {local.scheduleMode === "later" && (
              <div className="space-y-2">
                <Label>Scheduled for</Label>
                <Input type="datetime-local" value={local.scheduledFor?.slice(0, 16) || ""} onChange={(e) => update({ scheduledFor: new Date(e.target.value).toISOString() })} />
              </div>
            )}

            <div className="col-span-1 md:col-span-2 flex items-center justify-between border-t pt-4 mt-2">
              <div className="flex items-center gap-2">
                <Switch id="parallel" checked={local.parallel} onCheckedChange={(v) => update({ parallel: v })} />
                <Label htmlFor="parallel" className="text-sm">Parallel mode</Label>
                {local.parallel && (
                  <div className="flex items-center gap-2 ml-4">
                    <Label className="text-sm">Bulk count</Label>
                    <Input className="w-24" type="number" value={local.bulkCount ?? 10} onChange={(e) => update({ bulkCount: Number(e.target.value) })} />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button onClick={() => local && onSave(local)} className="bg-gradient-primary">Save</Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function matchScriptForType(type: TaskType): string | undefined {
  return mockScripts.find((s) => s.type === type)?.id;
}