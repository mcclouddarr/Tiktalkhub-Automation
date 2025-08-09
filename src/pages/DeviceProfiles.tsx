import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDevices } from "@/lib/db";
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

  const { data } = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const { data, error } = await fetchDevices();
      if (error) throw error;
      return data || [];
    },
  });

  const deviceProfiles = useMemo(() => data || [], [data]);

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
    switch ((browser || "").toLowerCase()) {
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

  const filteredProfiles = deviceProfiles.filter((profile: any) => {
    if (filter === "all") return true;
    return (profile.type || profile.browser_type)?.includes(filter) || profile.type === filter;
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
                <p className="text-2xl font-bold">{deviceProfiles.filter((d: any) => (d.browser_type || '').toLowerCase().includes('mobile')).length}</p>
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
                <p className="text-2xl font-bold">{deviceProfiles.filter((d: any) => (d.browser_type || '').toLowerCase().includes('desktop')).length}</p>
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
                <p className="text-2xl font-bold">{deviceProfiles.filter((d: any) => (d.browser_type || '').toLowerCase().includes('tablet')).length}</p>
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
                <p className="text-2xl font-bold">{deviceProfiles.filter((d: any) => (d.status || '').toLowerCase() === 'flagged').length}</p>
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
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile: any) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getTypeIcon((profile.browser_type || '').includes('mobile') ? 'mobile' : (profile.browser_type || '').includes('desktop') ? 'desktop' : 'tablet')}
                      <div>
                        <div className="font-medium">{profile.device_name}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {profile.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{profile.browser_type || '-'}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getBrowserIcon(profile.browser_type || '')}
                      <div>
                        <div className="text-sm font-medium">{profile.os || '-'}</div>
                        <div className="text-xs text-muted-foreground">{profile.platform || '-'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{profile.viewport || '-'}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(profile.status || 'active')}>
                      {profile.status || 'active'}
                    </Badge>
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