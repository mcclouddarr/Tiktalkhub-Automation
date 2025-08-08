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
  Smartphone,
  Monitor,
  Tablet,
  Plus,
  Download,
  Upload,
  Edit,
  Copy,
  Trash2,
  Chrome,
  Globe,
  Eye
} from "lucide-react";

const deviceProfiles = [
  {
    id: "dev_001",
    name: "iPhone 16 Pro",
    type: "mobile",
    os: "iOS 18.0",
    browser: "Safari",
    screen: "1206x2622",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)...",
    webgl: "Apple A18 Pro GPU",
    canvas: "fp_a1b2c3d4",
    status: "active",
    personas: ["Emma_21_iOS", "Sarah_25_iPad"],
    lastUsed: "2 hours ago"
  },
  {
    id: "dev_002", 
    name: "Galaxy S24 Ultra",
    type: "mobile",
    os: "Android 14",
    browser: "Chrome",
    screen: "1440x3120",
    userAgent: "Mozilla/5.0 (Linux; Android 14; SM-S928U)...",
    webgl: "Adreno 750",
    canvas: "fp_e5f6g7h8",
    status: "active",
    personas: ["Jake_19_Android"],
    lastUsed: "1 hour ago"
  },
  {
    id: "dev_003",
    name: "MacBook Pro M3",
    type: "desktop",
    os: "macOS 14.0",
    browser: "Chrome",
    screen: "3024x1964",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
    webgl: "Apple M3 Pro",
    canvas: "fp_i9j0k1l2",
    status: "inactive",
    personas: ["Alex_23_Desktop"],
    lastUsed: "1 day ago"
  },
  {
    id: "dev_004",
    name: "Pixel 9 Pro",
    type: "mobile",
    os: "Android 15",
    browser: "Chrome",
    screen: "1344x2992",
    userAgent: "Mozilla/5.0 (Linux; Android 15; Pixel 9 Pro)...",
    webgl: "Mali-G715 MC7",
    canvas: "fp_m3n4o5p6",
    status: "flagged",
    personas: [],
    lastUsed: "3 days ago"
  }
];

const deviceTemplates = [
  { name: "iPhone 16 Pro", type: "mobile", os: "iOS" },
  { name: "iPhone 16", type: "mobile", os: "iOS" },
  { name: "Galaxy S24 Ultra", type: "mobile", os: "Android" },
  { name: "Galaxy S24", type: "mobile", os: "Android" },
  { name: "Pixel 9 Pro", type: "mobile", os: "Android" },
  { name: "iPad Pro M4", type: "tablet", os: "iPadOS" },
  { name: "MacBook Pro M3", type: "desktop", os: "macOS" },
  { name: "Dell XPS 15", type: "desktop", os: "Windows" },
];

export default function DeviceProfiles() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [filter, setFilter] = useState("all");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      case "desktop":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Smartphone className="h-4 w-4" />;
    }
  };

  const getBrowserIcon = (browser: string) => {
    switch (browser.toLowerCase()) {
      case "chrome":
        return <Chrome className="h-4 w-4" />;
      case "firefox":
        return <Globe className="h-4 w-4" />;
      case "safari":
        return <Globe className="h-4 w-4" />;
      default:
        return <Chrome className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "inactive":
        return "bg-muted text-muted-foreground";
      case "flagged":
        return "bg-error text-error-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const filteredProfiles = deviceProfiles.filter(profile => {
    if (filter === "all") return true;
    return profile.type === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Device Profiles
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage browser and device fingerprints for persona automation
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import JSON
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Device Profiles</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="json-file">Upload JSON File</Label>
                  <Input id="json-file" type="file" accept=".json" className="mt-2" />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    Import
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Add Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Device Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="device-name">Profile Name</Label>
                    <Input
                      id="device-name"
                      placeholder="iPhone 16 Pro"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="device-template">Device Template</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {deviceTemplates.map((template) => (
                          <SelectItem key={template.name} value={template.name}>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(template.type)}
                              {template.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="device-os">Operating System</Label>
                    <Input
                      id="device-os"
                      placeholder="iOS 18.0"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="device-browser">Browser</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select browser" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chrome">Chrome</SelectItem>
                        <SelectItem value="firefox">Firefox</SelectItem>
                        <SelectItem value="safari">Safari</SelectItem>
                        <SelectItem value="edge">Edge</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="screen-resolution">Screen Resolution</Label>
                    <Input
                      id="screen-resolution"
                      placeholder="1206x2622"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="webgl-renderer">WebGL Renderer</Label>
                    <Input
                      id="webgl-renderer"
                      placeholder="Apple A18 Pro GPU"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="user-agent">User Agent</Label>
                  <Input
                    id="user-agent"
                    placeholder="Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)..."
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    Create Profile
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
              <Smartphone className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Mobile Profiles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Monitor className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Desktop Profiles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Tablet className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Tablet Profiles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Flagged</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Device Profiles</CardTitle>
            <div className="flex gap-3">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
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
                <TableHead>Profile</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>OS & Browser</TableHead>
                <TableHead>Screen</TableHead>
                <TableHead>Assigned Personas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getTypeIcon(profile.type)}
                      <div>
                        <div className="font-medium">{profile.name}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {profile.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{profile.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getBrowserIcon(profile.browser)}
                      <div>
                        <div className="text-sm font-medium">{profile.os}</div>
                        <div className="text-xs text-muted-foreground">{profile.browser}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{profile.screen}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {profile.personas.map((persona) => (
                        <Badge key={persona} variant="outline" className="text-xs">
                          {persona.split('_')[0]}
                        </Badge>
                      ))}
                      {profile.personas.length === 0 && (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(profile.status)}>
                      {profile.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {profile.lastUsed}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
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
    </div>
  );
}