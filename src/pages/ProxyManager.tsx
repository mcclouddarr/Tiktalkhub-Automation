import { useState, useMemo } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProxies, createProxy } from "@/lib/db";
import { supabase } from "@/lib/supabaseClient";
import {
  Shield,
  Plus,
  Upload,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Globe,
  Zap,
  Activity,
  Ban
} from "lucide-react";

export default function ProxyManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newProxy, setNewProxy] = useState({
    ip: "",
    port: 8080,
    type: "HTTP",
    country: "",
    provider: ""
  });
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["proxies"],
    queryFn: async () => {
      const { data, error } = await fetchProxies();
      if (error) throw error;
      return data || [];
    },
  });

  const proxies = useMemo(() => (data || []).map((p: any) => ({
    id: p.id,
    ip: p.ip,
    port: p.port,
    type: p.proxy_type,
    country: p.location_metadata?.country || p.location_metadata?.country_name || "",
    city: p.location_metadata?.city || "",
    status: p.status === 'active' ? 'healthy' : p.status === 'dead' ? 'down' : (p.status || 'warning'),
    ping: p.location_metadata?.ping || "-",
    uptime: p.location_metadata?.uptime || "-",
    lastChecked: p.last_check_time,
    flagged: (p.status || '').toLowerCase() === 'flagged',
    provider: p.location_metadata?.provider || ""
  })), [data]);

  const filteredProxies = proxies.filter(proxy => {
    const matchesSearch = proxy.ip.includes(searchTerm) || 
                         (proxy.country || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = filterCountry === "all" || proxy.country === filterCountry;
    const matchesStatus = filterStatus === "all" || proxy.status === filterStatus;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-success text-success-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "down":
        return "bg-error text-error-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "down":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const flaggedProxies = proxies.filter(p => p.flagged).length;
  const downProxies = proxies.filter(p => p.status === "down").length;

  async function handleAddProxy() {
    await createProxy({
      ip: newProxy.ip,
      port: newProxy.port,
      proxy_type: newProxy.type,
      status: "active",
      location_metadata: { country: newProxy.country, provider: newProxy.provider },
    } as any);
    setShowAddDialog(false);
    queryClient.invalidateQueries({ queryKey: ["proxies"] });
  }

  async function checkProxyHealth(id: string, ip: string, port: number) {
    await supabase.functions.invoke("checkProxyHealth", {
      body: { id, ip, port },
    });
    queryClient.invalidateQueries({ queryKey: ["proxies"] });
  }

  async function checkAll() {
    await Promise.all(proxies.map(p => checkProxyHealth(p.id, p.ip, p.port)));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Proxy Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your proxy infrastructure
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Add Proxy
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Proxy</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="proxy-ip">IP Address</Label>
                    <Input
                      id="proxy-ip"
                      placeholder="157.245.123.45"
                      value={newProxy.ip}
                      onChange={(e) => setNewProxy({...newProxy, ip: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="proxy-port">Port</Label>
                    <Input
                      id="proxy-port"
                      type="number"
                      placeholder="8080"
                      value={newProxy.port}
                      onChange={(e) => setNewProxy({...newProxy, port: parseInt(e.target.value) || 8080})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="proxy-type">Type</Label>
                    <Select value={newProxy.type} onValueChange={(value) => setNewProxy({...newProxy, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HTTP">HTTP</SelectItem>
                        <SelectItem value="HTTPS">HTTPS</SelectItem>
                        <SelectItem value="SOCKS4">SOCKS4</SelectItem>
                        <SelectItem value="SOCKS5">SOCKS5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="proxy-country">Country</Label>
                    <Input
                      id="proxy-country"
                      placeholder="United States"
                      value={newProxy.country}
                      onChange={(e) => setNewProxy({...newProxy, country: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="proxy-provider">Provider</Label>
                  <Input
                    id="proxy-provider"
                    placeholder="DataCenter A"
                    value={newProxy.provider}
                    onChange={(e) => setNewProxy({...newProxy, provider: e.target.value})}
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-gradient-primary hover:opacity-90" onClick={handleAddProxy}>
                    Add Proxy
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Warning Banners */}
      {(flaggedProxies > 0 || downProxies > 0) && (
        <div className="space-y-3">
          {flaggedProxies > 0 && (
            <Alert className="border-warning bg-warning/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{flaggedProxies} proxies</strong> have been flagged as potentially compromised. 
                Review and replace them to maintain security.
              </AlertDescription>
            </Alert>
          )}
          {downProxies > 0 && (
            <Alert className="border-error bg-error/10">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{downProxies} proxies</strong> are currently down. 
                Tasks may experience delays or failures.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{proxies.length}</p>
                <p className="text-sm text-muted-foreground">Total Proxies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{proxies.filter(p => p.status === "healthy").length}</p>
                <p className="text-sm text-muted-foreground">Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">{new Set(proxies.map(p => p.country)).size}</p>
                <p className="text-sm text-muted-foreground">Countries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">-</p>
                <p className="text-sm text-muted-foreground">Avg Ping</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proxy Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Proxy Infrastructure</CardTitle>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={checkAll}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Check All
              </Button>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by IP or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCountry} onValueChange={setFilterCountry}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {[...new Set(proxies.map(p => p.country).filter(Boolean))].map((c) => (
                  <SelectItem key={c} value={c as string}>{c as string}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="down">Down</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ping</TableHead>
                <TableHead>Uptime</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProxies.map((proxy) => (
                <TableRow key={proxy.id} className={proxy.flagged ? "bg-warning/5" : ""}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{proxy.ip}:{proxy.port}</span>
                      {proxy.flagged && (
                        <div title="Flagged as suspicious">
                          <Ban className="h-4 w-4 text-warning" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{proxy.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{proxy.country}</p>
                      <p className="text-sm text-muted-foreground">{proxy.city}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(proxy.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(proxy.status)}
                        {proxy.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>{proxy.ping}</TableCell>
                  <TableCell>{proxy.uptime}</TableCell>
                  <TableCell>{proxy.provider}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => checkProxyHealth(proxy.id, proxy.ip, proxy.port)}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Activity className="h-4 w-4" />
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