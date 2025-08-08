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

const scripts = [
  {
    id: "script_001",
    name: "Gmail Account Warmer",
    type: "gmail",
    description: "Automates email reading, marking, and basic interactions",
    language: "playwright",
    status: "active",
    runs: 156,
    success: 94.2,
    created: "2024-01-10",
    lastRun: "2 hours ago",
    author: "System",
    tags: ["email", "warming", "automation"]
  },
  {
    id: "script_002",
    name: "YouTube Subscribe Bot",
    type: "youtube",
    description: "Subscribes to channels and watches videos with natural behavior",
    language: "playwright",
    status: "active",
    runs: 89,
    success: 91.0,
    created: "2024-01-12",
    lastRun: "30 min ago",
    author: "User",
    tags: ["youtube", "subscribe", "social"]
  },
  {
    id: "script_003",
    name: "TikTok Engagement",
    type: "tiktok",
    description: "Likes, follows, and comments on TikTok content",
    language: "playwright",
    status: "draft",
    runs: 0,
    success: 0,
    created: "2024-01-15",
    lastRun: "Never",
    author: "User",
    tags: ["tiktok", "engagement", "social"]
  },
  {
    id: "script_004",
    name: "Referral Click Path",
    type: "referral",
    description: "Follows referral links with realistic browsing patterns",
    language: "playwright",
    status: "error",
    runs: 23,
    success: 65.2,
    created: "2024-01-08",
    lastRun: "1 day ago",
    author: "System",
    tags: ["referral", "clicking", "browsing"]
  }
];

const scriptTemplates = [
  { name: "Gmail Automation", type: "gmail" },
  { name: "YouTube Automation", type: "youtube" },
  { name: "TikTok Automation", type: "tiktok" },
  { name: "Instagram Automation", type: "instagram" },
  { name: "Twitter/X Automation", type: "twitter" },
  { name: "Referral Bot", type: "referral" },
  { name: "Custom Playwright", type: "custom" }
];

export default function ScriptHub() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [filter, setFilter] = useState("all");

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

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      gmail: "bg-blue-500/10 text-blue-500",
      youtube: "bg-red-500/10 text-red-500",
      tiktok: "bg-pink-500/10 text-pink-500",
      instagram: "bg-purple-500/10 text-purple-500",
      twitter: "bg-cyan-500/10 text-cyan-500",
      referral: "bg-green-500/10 text-green-500",
      custom: "bg-gray-500/10 text-gray-500"
    };
    return colors[type] || "bg-secondary text-secondary-foreground";
  };

  const filteredScripts = scripts.filter(script => {
    if (filter === "all") return true;
    return script.type === filter;
  });

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
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Script
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                New Script
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Script</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="script-name">Script Name</Label>
                    <Input
                      id="script-name"
                      placeholder="Gmail Account Warmer"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="script-type">Script Type</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {scriptTemplates.map((template) => (
                          <SelectItem key={template.type} value={template.type}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="script-description">Description</Label>
                  <Input
                    id="script-description"
                    placeholder="Brief description of what this script does"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="script-tags">Tags (comma separated)</Label>
                  <Input
                    id="script-tags"
                    placeholder="email, automation, warming"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="script-code">Playwright Code</Label>
                  <Textarea
                    id="script-code"
                    placeholder="import { test, expect } from '@playwright/test';"
                    className="mt-2 h-64 font-mono"
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="outline">
                    Save as Draft
                  </Button>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    Create & Test
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
              <Code className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-sm text-muted-foreground">Total Scripts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Active Scripts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Play className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">347</p>
                <p className="text-sm text-muted-foreground">Total Runs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Error Scripts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scripts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Script Library</CardTitle>
            <div className="flex gap-3">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scripts</SelectItem>
                  <SelectItem value="gmail">Gmail</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Script</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Runs</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScripts.map((script) => (
                <TableRow key={script.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{script.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {script.description}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono mt-1">
                        {script.id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(script.type)}>
                      {script.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {script.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{script.runs}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{script.success}%</span>
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${script.success}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(script.status)}>
                      {script.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {script.lastRun}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedScript(script);
                          setShowViewDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
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

      {/* View Script Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedScript?.name} - Script Details
            </DialogTitle>
          </DialogHeader>
          {selectedScript && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Type</Label>
                  <div className="mt-1">
                    <Badge className={getTypeColor(selectedScript.type)}>
                      {selectedScript.type}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedScript.status)}>
                      {selectedScript.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Success Rate</Label>
                  <div className="mt-1 font-medium">{selectedScript.success}%</div>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Description</Label>
                <p className="mt-1">{selectedScript.description}</p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Tags</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedScript.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Script Code</Label>
                <div className="mt-2 bg-muted rounded-lg p-4 font-mono text-sm">
                  <pre className="whitespace-pre-wrap">
{`// Playwright automation script for ${selectedScript.type}
import { test, expect } from '@playwright/test';

test('${selectedScript.name}', async ({ page }) => {
  // Navigate to target page
  await page.goto('https://example.com');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Perform automation actions
  // ... script implementation ...
  
  console.log('Script completed successfully');
});`}
                  </pre>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Script
                </Button>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Play className="h-4 w-4 mr-2" />
                  Run Script
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}