import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Brain, Wand2, ShieldAlert, CheckCircle2, ThumbsUp, ThumbsDown, Play, Pause, RefreshCw, Activity } from "lucide-react";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  action: string;
  persona?: string;
}

const mockSuggestions: Suggestion[] = [
  {
    id: "sg_1",
    title: "Warm Gmail mailbox",
    description: "Run 50 low-risk interactions to reduce cold-start flags.",
    impact: "high",
    action: "Run warmup on persona",
    persona: "Emma_21_iOS",
  },
  {
    id: "sg_2",
    title: "Rotate proxy pool",
    description: "US-East pool shows mild degradation. Switch to EU-West for next 2 hours.",
    impact: "medium",
    action: "Rotate proxy regions",
  },
  {
    id: "sg_3",
    title: "Increase dwell time",
    description: "Short dwell time detected on referral flows. Increase delay by 20%.",
    impact: "low",
    action: "Adjust timing heuristics",
  },
];

export default function AITrainer() {
  const [autoRepair, setAutoRepair] = useState(true);
  const [training, setTraining] = useState(true);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState(mockSuggestions);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return suggestions;
    return suggestions.filter((s) => `${s.title} ${s.description} ${s.persona ?? ""}`.toLowerCase().includes(q));
  }, [suggestions, search]);

  const accept = (s: Suggestion) => {
    toast({ title: "Applied", description: s.title });
    setSuggestions((prev) => prev.filter((x) => x.id !== s.id));
  };

  const reject = (s: Suggestion) => {
    toast({ title: "Dismissed", description: s.title });
    setSuggestions((prev) => prev.filter((x) => x.id !== s.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Vanta AI Panel</h1>
          <p className="text-muted-foreground mt-1">AI-suggested actions, detection repair, and training controls</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch id="auto-repair" checked={autoRepair} onCheckedChange={setAutoRepair} />
            <Label htmlFor="auto-repair" className="text-sm">Auto-repair flags</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="training" checked={training} onCheckedChange={setTraining} />
            <Label htmlFor="training" className="text-sm">AI training</Label>
          </div>
        </div>
      </div>

      <Tabs defaultValue="suggestions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="detections">Detections</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Wand2 className="h-5 w-5"/>AI Suggestions</span>
                <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Persona</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="text-right">Controls</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.title}</TableCell>
                      <TableCell>
                        <Badge variant={s.impact === "high" ? "default" : "secondary"} className={s.impact === "high" ? "bg-warning text-warning-foreground" : undefined}>
                          {s.impact}
                        </Badge>
                      </TableCell>
                      <TableCell>{s.persona ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{s.action}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="sm" variant="outline" onClick={() => accept(s)}><CheckCircle2 className="h-4 w-4"/></Button>
                        <Button size="sm" variant="outline" onClick={() => reject(s)}><ShieldAlert className="h-4 w-4"/></Button>
                        <Button size="sm" variant="outline" onClick={() => toast({ title: "Feedback recorded" })}><ThumbsUp className="h-4 w-4"/></Button>
                        <Button size="sm" variant="outline" onClick={() => toast({ title: "Feedback recorded" })}><ThumbsDown className="h-4 w-4"/></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detections">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-5 w-5"/>Auto-Repair & Flags</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Metric title="Proxy health" value="96%" trend="good" />
              <Metric title="Account flags repaired" value="37" trend="good" />
              <Metric title="Anomalies detected" value="5" trend="warn" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5"/>Training Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => toast({ title: "Training resumed" })}><Play className="h-4 w-4 mr-2"/>Resume</Button>
                <Button variant="outline" onClick={() => toast({ title: "Training paused" })}><Pause className="h-4 w-4 mr-2"/>Pause</Button>
                <Button className="bg-gradient-primary" onClick={() => toast({ title: "Model retraining started" })}><RefreshCw className="h-4 w-4 mr-2"/>Retrain</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5"/>Live Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <Metric title="Accuracy" value="89%" trend="good" />
                    <Metric title="Coverage" value="72%" trend="good" />
                    <Metric title="Latency" value="320ms" trend="warn" />
                    <Metric title="Retrain ETA" value="14m" trend="good" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input placeholder="Add a note for this training round (saved locally)" />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Metric({ title, value, trend }: { title: string; value: string; trend: "good" | "warn" | "bad" }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs mt-1 {trend === 'good' ? 'text-success' : trend === 'warn' ? 'text-warning' : 'text-destructive'}">
        {trend === "good" ? "healthy" : trend === "warn" ? "monitor" : "issue"}
      </div>
    </div>
  );
}