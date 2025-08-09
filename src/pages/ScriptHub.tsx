import { useEffect, useMemo, useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@supabase/supabase-js";
import { listTemplates, createTemplate, expandTemplateToFlow } from "@/lib/taskTemplates";
import { buildLaunchForTask } from "@/lib/automationHooks";

import {
  Code,
  Plus,
  Play,
  Download,
  Upload,
  Edit,
  Copy,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

const defaultTemplates = [
  {
    name: "SERP Dwell (Google)",
    description: "Search keyword, click result, dwell and scroll",
    steps: [
      { action: "open", url: "https://www.google.com" },
      { action: "wait", ms: 1200 },
      { action: "type", selector: "input[name=q]", text: "{{query}}" },
      { action: "wait", ms: 500 },
      { action: "click", selector: "input[type=submit]" },
      { action: "wait", ms: 2000 },
      { action: "click", selector: "a h3" },
      { action: "wait", ms: 8000 },
      { action: "scroll" },
      { action: "wait", ms: 4000 }
    ]
  },
  {
    name: "Referral Click Path",
    description: "Open referral source and click through",
    steps: [
      { action: "open", url: "{{ref_source}}" },
      { action: "wait", ms: 2000 },
      { action: "scroll" },
      { action: "wait", ms: 1500 },
      { action: "open", url: "{{ref_target}}" },
      { action: "wait", ms: 5000 }
    ]
  },
  {
    name: "YouTube Watch + Subscribe",
    description: "Open channel/video, watch, subscribe",
    steps: [
      { action: "open", url: "{{video_url}}" },
      { action: "wait", ms: 3000 },
      { action: "click", selector: "button[aria-label*=Subscribe]" },
      { action: "wait", ms: 60000 }
    ]
  },
  {
    name: "Form Fill",
    description: "Fill generic contact form",
    steps: [
      { action: "open", url: "{{form_url}}" },
      { action: "wait", ms: 1200 },
      { action: "type", selector: "input[name=name]", text: "{{name}}" },
      { action: "type", selector: "input[name=email]", text: "{{email}}" },
      { action: "type", selector: "textarea[name=message]", text: "{{message}}" },
      { action: "wait", ms: 500 },
      { action: "click", selector: "button[type=submit],input[type=submit]" },
      { action: "wait", ms: 3000 }
    ]
  }
]

export default function ScriptHub() {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showLaunchDialog, setShowLaunchDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [personas, setPersonas] = useState<any[]>([]);
  const [personaId, setPersonaId] = useState("");
  const [varsJson, setVarsJson] = useState("{}");
  const [search, setSearch] = useState('')

  async function load() {
    const list = await listTemplates();
    setTemplates(list);
    const { data: ps } = await supabase.from('personas').select('id,name').limit(500);
    setPersonas(ps || []);
  }
  useEffect(() => { load(); }, []);

  async function seedDefaults() {
    try {
      for (const t of defaultTemplates) {
        await createTemplate(t as any);
      }
      toast({ title: 'Templates added', description: `${defaultTemplates.length} defaults created.` })
      await load();
    } catch (e: any) {
      toast({ title: 'Seed failed', description: String(e) })
    }
  }

  async function launchTemplate(tpl: any) {
    try {
      if (!personaId) return toast({ title: 'Select a persona' });
      let vars: any = {};
      try { vars = JSON.parse(varsJson || '{}') } catch { return toast({ title: 'Invalid variables JSON' }) }
      const steps = expandTemplateToFlow(tpl, vars);
      const target = vars.target_url || vars.ref_target || vars.video_url || vars.form_url || null;
      // create a task row to track the run
      const { data: task, error: tErr } = await supabase
        .from('tasks')
        .insert({ persona_id: personaId, task_type: 'script', execution_mode: 'manual', target_url: target })
        .select('*').single();
      if (tErr) throw tErr;
      const { launchConfig, preCookies } = await buildLaunchForTask(personaId, target || '', { headless: false });
      await supabase.functions.invoke('taskController', {
        body: { action: 'start', task_id: task.id, payload: { launchConfig, cookies: preCookies, target, steps } }
      });
      toast({ title: 'Launched', description: tpl.name })
      setShowLaunchDialog(false)
    } catch (e: any) {
      toast({ title: 'Launch failed', description: String(e) })
    }
  }

  const filtered = useMemo(() => (templates || []).filter((t:any) => (t.name||'').toLowerCase().includes(search.toLowerCase())), [templates, search]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "draft":
        return "bg-warning text-warning-foreground";
      case "error":
        return "bg-error text-error-foreground";
      case "paused":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Automation Script Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and deploy Playwright automation scripts
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={seedDefaults}>Add Default Templates</Button>
          <Button variant="outline" asChild>
            <label className="inline-flex items-center cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              <span>Import Template</span>
              <input type="file" accept="application/json" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0]; if (!file) return; const text = await file.text();
                try { const obj = JSON.parse(text); await createTemplate(obj); await load(); toast({ title: 'Imported', description: obj.name || 'Template' }) } catch (err:any) { toast({ title: 'Import failed', description: String(err) }) }
              }} />
            </label>
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <Label>Name</Label>
                  <Input id="tpl-name" placeholder="Template name" className="mt-2" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input id="tpl-desc" placeholder="Short description" className="mt-2" />
                </div>
                <div>
                  <Label>Tags (comma separated)</Label>
                  <Input id="tpl-tags" placeholder="youtube, subscribe" className="mt-2" />
                </div>
                <div>
                  <Label>Steps (JSON)</Label>
                  <Textarea id="tpl-steps" placeholder='[ { "action":"open", "url":"https://example.com" } ]' className="mt-2 h-48" />
                </div>
                <div className="text-right">
                  <Button onClick={async () => {
                    const name = (document.getElementById('tpl-name') as HTMLInputElement)?.value || ''
                    const description = (document.getElementById('tpl-desc') as HTMLInputElement)?.value || ''
                    const tagsRaw = (document.getElementById('tpl-tags') as HTMLInputElement)?.value || ''
                    const stepsRaw = (document.getElementById('tpl-steps') as HTMLTextAreaElement)?.value || '[]'
                    try {
                      const steps = JSON.parse(stepsRaw)
                      const tags = tagsRaw.split(',').map(s=> s.trim()).filter(Boolean)
                      await createTemplate({ name, description, steps, tags })
                      setShowCreateDialog(false)
                      await load()
                      toast({ title: 'Template created', description: name })
                    } catch (e: any) {
                      toast({ title: 'Invalid steps JSON', description: String(e) })
                    }
                  }}>Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Templates</CardTitle>
            <Input placeholder="Search templates..." value={search} onChange={(e)=> setSearch(e.target.value)} className="max-w-[240px]" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tpl: any) => (
                <TableRow key={tpl.id}>
                  <TableCell>
                    <div className="font-medium">{tpl.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{tpl.id}</div>
                  </TableCell>
                  <TableCell className="truncate max-w-[520px]">{tpl.description}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => { setSelectedTemplate(tpl); setShowLaunchDialog(true); }}>Launch</Button>
                    <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(JSON.stringify(tpl.steps, null, 2)); toast({ title: 'Copied steps JSON' }) }}>Copy Steps</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showLaunchDialog} onOpenChange={setShowLaunchDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Launch: {selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Persona</Label>
              <Select value={personaId} onValueChange={setPersonaId}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select persona" />
                </SelectTrigger>
                <SelectContent>
                  {personas.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Variables (JSON)</Label>
              <Textarea value={varsJson} onChange={(e)=> setVarsJson(e.target.value)} className="h-40" placeholder='{"query":"best shoes", "ref_source":"https://tiktok.com", "ref_target":"https://example.com"}' />
            </div>
            <div className="text-right">
              <Button onClick={() => selectedTemplate && launchTemplate(selectedTemplate)}>Start</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}