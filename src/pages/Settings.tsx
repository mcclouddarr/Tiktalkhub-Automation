import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Key, Globe, Monitor, FileText, Download, Trash2 } from "lucide-react";
import { getAutomationDefaults, setAutomationDefaults } from "@/lib/automationDefaults";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
  component: string;
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-10 10:30:15",
    level: "info",
    message: "Persona 'Sarah Johnson' task completed successfully",
    component: "TaskEngine"
  },
  {
    id: "2",
    timestamp: "2024-01-10 10:25:42",
    level: "warning",
    message: "Proxy US-East-01 showing high latency (850ms)",
    component: "ProxyManager"
  },
  {
    id: "3",
    timestamp: "2024-01-10 10:20:08",
    level: "error",
    message: "Failed to establish connection to TikTok API",
    component: "APIConnector"
  }
];

export default function Settings() {
  const [supabaseApiKey, setSupabaseApiKey] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [headless, setHeadless] = useState(false);
  const [persistPath, setPersistPath] = useState("");
  const [countryHint, setCountryHint] = useState("");
  const [devicePreference, setDevicePreference] = useState<'mobile' | 'desktop' | 'any'>("any");
  const [vantaWorkerUrl, setVantaWorkerUrl] = useState('')
  const [delayMultiplier, setDelayMultiplier] = useState(1.0)
  const [randomness, setRandomness] = useState(0.2)

  useEffect(() => {
    const d = getAutomationDefaults();
    setHeadless(d.headless);
    setPersistPath(d.persistPath || "");
    setCountryHint(d.countryHint || "");
    setDevicePreference(d.devicePreference);
    const saved = window.localStorage.getItem('tiktalkhub:vantaWorkerUrl')
    if (saved) setVantaWorkerUrl(saved)
    setDelayMultiplier(d.behavior?.delayMultiplier ?? 1.0)
    setRandomness(d.behavior?.randomness ?? 0.2)
  }, []);

  function saveDefaults() {
    setAutomationDefaults({
      headless,
      persistPath: persistPath || null,
      countryHint: countryHint || null,
      devicePreference,
      behavior: { delayMultiplier, randomness }
    });
    window.localStorage.setItem('tiktalkhub:vantaWorkerUrl', vantaWorkerUrl || '')
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "info":
        return <Badge className="bg-blue-500 text-white">Info</Badge>;
      case "warning":
        return <Badge className="bg-warning text-warning-foreground">Warning</Badge>;
      case "error":
        return <Badge className="bg-destructive text-destructive-foreground">Error</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const handleSaveApiKey = () => {
    console.log("Saving Supabase API key...");
  };

  const handleExportLogs = () => {
    console.log("Exporting logs...");
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleExportSettings = () => {
    const settings = {
      supabaseApiKey: supabaseApiKey ? "***" : "",
      darkMode,
      autoBackup,
      notificationsEnabled
    };
    console.log("Exporting settings:", settings);
  };

  const handleImportSettings = () => {
    console.log("Importing settings...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure application settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportSettings}>
            <Download className="h-4 w-4 mr-2 rotate-180" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="api" className="space-y-4">
        <TabsList>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
          <TabsTrigger value="app">App Options</TabsTrigger>
          <TabsTrigger value="logs">Logs & Diagnostics</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supabase-key">Supabase API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="supabase-key"
                    type="password"
                    placeholder="Enter your Supabase API key..."
                    value={supabaseApiKey}
                    onChange={(e) => setSupabaseApiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSaveApiKey}>Save</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your Supabase API key is used for backend operations and data storage
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vanta-url">Vanta Worker URL</Label>
                <Input id="vanta-url" placeholder="https://your-worker.workers.dev" value={vantaWorkerUrl} onChange={(e)=> setVantaWorkerUrl(e.target.value)} />
                <p className="text-sm text-muted-foreground">Used to fetch Playwright plans. If empty, automated steps will be minimal.</p>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Connection Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Supabase</div>
                      <div className="text-sm text-muted-foreground">Database & Auth</div>
                    </div>
                    <Badge className="bg-success text-success-foreground">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Vanta AI</div>
                      <div className="text-sm text-muted-foreground">AI Training Model</div>
                    </div>
                    <Badge className="bg-success text-success-foreground">Online</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="app" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                App-Wide Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Appearance</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark theme across the application</p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Automation</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-backup">Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">Automatically backup settings and data</p>
                  </div>
                  <Switch
                    id="auto-backup"
                    checked={autoBackup}
                    onCheckedChange={setAutoBackup}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show desktop notifications for important events</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Performance</h4>
                <div className="space-y-2">
                  <Label>Default Proxy Region</Label>
                  <Select defaultValue="auto">
                    <SelectTrigger>
                      <SelectValue placeholder="Select default region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto Select</SelectItem>
                      <SelectItem value="us-east">US East</SelectItem>
                      <SelectItem value="us-west">US West</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Max Concurrent Tasks</Label>
                  <Select defaultValue="10">
                    <SelectTrigger>
                      <SelectValue placeholder="Select max tasks" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 tasks</SelectItem>
                      <SelectItem value="10">10 tasks</SelectItem>
                      <SelectItem value="20">20 tasks</SelectItem>
                      <SelectItem value="50">50 tasks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Logs & Diagnostics
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExportLogs}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleClearLogs}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">248</div>
                      <p className="text-xs text-muted-foreground">Total Log Entries</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-warning">12</div>
                      <p className="text-xs text-muted-foreground">Warnings Today</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-destructive">3</div>
                      <p className="text-xs text-muted-foreground">Errors Today</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Recent Log Entries</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {logs.map((log) => (
                      <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          {getLevelBadge(log.level)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{log.message}</p>
                            <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Component: {log.component}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">System Diagnostics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Memory Usage</Label>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "67%" }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground">67% of available memory</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Active Connections</Label>
                      <div className="text-2xl font-bold">23</div>
                      <p className="text-xs text-muted-foreground">Proxy & API connections</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Automation Defaults</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <div className="font-medium">Headless Mode</div>
                <div className="text-sm text-muted-foreground">Run browsers without UI for better performance</div>
              </div>
              <Switch checked={headless} onCheckedChange={setHeadless} />
            </div>
            <div className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <div className="font-medium">Persona Persist Path</div>
                <div className="text-sm text-muted-foreground">Where browser profiles are stored</div>
              </div>
              <Input value={persistPath} onChange={(e)=> setPersistPath(e.target.value)} className="max-w-[300px]" />
            </div>
            <div className="flex items-center justify-between border rounded-lg p-3 col-span-2">
              <div>
                <div className="font-medium">Behavior Delay Multiplier</div>
                <div className="text-sm text-muted-foreground">Scale waits and pacing (e.g., 1.2 = slower)</div>
              </div>
              <Input type="number" step="0.1" min="0.1" value={delayMultiplier} onChange={(e)=> setDelayMultiplier(parseFloat(e.target.value)||1)} className="max-w-[140px]" />
            </div>
            <div className="flex items-center justify-between border rounded-lg p-3 col-span-2">
              <div>
                <div className="font-medium">Behavior Randomness</div>
                <div className="text-sm text-muted-foreground">Variability for human-like timing (0-1)</div>
              </div>
              <Input type="number" step="0.05" min="0" max="1" value={randomness} onChange={(e)=> setRandomness(Math.max(0, Math.min(1, parseFloat(e.target.value)||0)))} className="max-w-[140px]" />
            </div>
          </div>
          <div className="text-right">
            <Button onClick={saveDefaults}>Save Defaults</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}