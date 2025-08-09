import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, Eye, Link2, Chrome, Globe, Code } from "lucide-react";
import { uploadCookieBlob, listCookieFiles, getPublicFileUrl, getSignedUrl } from "@/lib/storage";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from '@/components/ui/use-toast'

interface CookieSession {
  id: string;
  personaName: string;
  domain: string;
  cookieCount: number;
  sessionSize: string;
  lastUpdated: string;
  status: "active" | "expired" | "pending";
}

const mockSessions: CookieSession[] = [
  {
    id: "1",
    personaName: "Sarah Johnson",
    domain: "tiktok.com",
    cookieCount: 24,
    sessionSize: "2.4 MB",
    lastUpdated: "2 hours ago",
    status: "active"
  },
  {
    id: "2",
    personaName: "Mark Chen",
    domain: "youtube.com",
    cookieCount: 18,
    sessionSize: "1.8 MB",
    lastUpdated: "1 day ago",
    status: "expired"
  }
];

export default function CookieManager() {
  const [files, setFiles] = useState<any[]>([]);
  const { toast } = useToast()
  useEffect(() => { (async () => {
    const { data } = await listCookieFiles();
    setFiles(data || []);
  })(); }, []);
  const [sessions, setSessions] = useState<CookieSession[]>(mockSessions);
  const [selectedPersona, setSelectedPersona] = useState("");
  const [personas, setPersonas] = useState<any[]>([]);
  useEffect(() => { (async () => {
    const { data: ps } = await supabase.from('personas').select('id,name').order('created_at', { ascending: false }).limit(500);
    setPersonas(ps || [])
  })(); }, []);
  const [rawCookieData, setRawCookieData] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "expired":
        return <Badge className="bg-destructive text-destructive-foreground">Expired</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleImportChrome = () => {
    console.log("Importing from Chrome...");
  };

  const handleImportFirefox = () => {
    console.log("Importing from Firefox...");
  };

  const handleImportPlaywright = () => {
    console.log("Importing from Playwright...");
  };

  const handleAttachToPersona = async () => {
    if (!selectedPersona || files.length === 0) return;
    const latest = files[0];
    // Fetch file and parse JSON to insert into cookies table
    let url = ''
    try { url = await getSignedUrl('cookies', latest.name, 60) } catch { url = getPublicFileUrl('cookies', latest.name) }
    const resp = await fetch(url)
    const json = await resp.json().catch(() => null)
    // Insert cookies row linked to persona
    await supabase.from('cookies').insert({ persona_id: selectedPersona, cookie_blob: json || { path: latest.name } })
    toast({ title: 'Cookie attached', description: 'Latest cookie file linked to persona.' })
  };

  const handleAutoMatch = () => {
    console.log("Auto-matching cookies to personas...");
  };

  const handleViewRaw = (sessionId: string) => {
    setRawCookieData(`{
  "domain": "tiktok.com",
  "cookies": [
    {
      "name": "sessionid",
      "value": "abc123def456...",
      "domain": ".tiktok.com",
      "path": "/",
      "expires": 1735689600,
      "httpOnly": true,
      "secure": true
    },
    {
      "name": "csrf_token",
      "value": "xyz789uvw012...",
      "domain": ".tiktok.com",
      "path": "/",
      "expires": 1704153600,
      "httpOnly": false,
      "secure": true
    }
  ],
  "localStorage": {
    "user_preferences": "{}",
    "theme": "dark"
  }
}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Cookie & Export Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage session cookies and data exports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button asChild>
            <label className="inline-flex items-center cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              <span>Import Cookies</span>
              <input type="file" accept=".json,.txt" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const personaId = selectedPersona || 'unassigned';
                const { error, path } = await uploadCookieBlob(personaId, file);
                if (!error) {
                  const { data } = await listCookieFiles();
                  setFiles(data || []);
                }
              }} />
            </label>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">Cookie Sessions</TabsTrigger>
          <TabsTrigger value="import">Import Cookies</TabsTrigger>
          <TabsTrigger value="raw">Raw Cookie Details</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Cookie Sessions
                <div className="flex gap-2">
                  <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select Persona" />
                    </SelectTrigger>
                    <SelectContent>
                      {personas.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAttachToPersona} disabled={!selectedPersona}>
                    <Link2 className="h-4 w-4 mr-2" />
                    Attach to Persona
                  </Button>
                  <Button variant="outline" onClick={handleAutoMatch}>
                    Auto-Match
                  </Button>
                  <Button variant="outline" onClick={async () => {
                    const list = files.map(f => f.name).join("\n");
                    alert(`Files in storage (cookies):\n${list}`);
                  }}>
                    List Storage
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Persona</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Cookies</TableHead>
                    <TableHead>Session Size</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.personaName}</TableCell>
                      <TableCell>{session.domain}</TableCell>
                      <TableCell>{session.cookieCount} cookies</TableCell>
                      <TableCell>{session.sessionSize}</TableCell>
                      <TableCell>{session.lastUpdated}</TableCell>
                      <TableCell>{getStatusBadge(session.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewRaw(session.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={async () => {
                            let url = ''
                            try { url = await getSignedUrl('cookies', latest.name, 60) } catch { url = getPublicFileUrl('cookies', latest.name) }
                            window.open(url, '_blank')
                            toast({ title: 'Download started', description: latest.name })
                          }}>
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
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Chrome className="h-5 w-5" />
                  Import from Chrome
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Import cookies from Chrome browser profiles
                </p>
                <Input placeholder="Chrome profile path..." />
                <Button onClick={handleImportChrome} className="w-full">
                  Import Chrome Cookies
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Import from Firefox
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Import cookies from Firefox browser profiles
                </p>
                <Input placeholder="Firefox profile path..." />
                <Button onClick={handleImportFirefox} className="w-full">
                  Import Firefox Cookies
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Import from Playwright
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Import cookies from Playwright session files
                </p>
                <Input placeholder="Playwright context file..." />
                <Button onClick={handleImportPlaywright} className="w-full">
                  Import Playwright Cookies
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="raw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Raw Cookie/Session Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={rawCookieData}
                onChange={(e) => setRawCookieData(e.target.value)}
                placeholder="Select a session to view raw cookie data..."
                rows={20}
                className="font-mono text-sm"
              />
              <div className="flex gap-2 mt-4">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Netscape
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export HAR
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}