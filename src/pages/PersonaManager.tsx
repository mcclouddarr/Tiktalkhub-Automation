import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPersonas } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Users,
  Plus,
  Upload,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Smartphone,
  Globe,
  Clock
} from "lucide-react";

export default function PersonaManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOS, setFilterOS] = useState("all");
  const [selectedPersona, setSelectedPersona] = useState<any | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["personas"],
    queryFn: async () => {
      const { data, error } = await fetchPersonas();
      if (error) throw error;
      return data || [];
    },
  });

  const personas = useMemo(() => data || [], [data]);

  const filteredPersonas = useMemo(() => {
    return (personas || []).filter((p: any) => {
      const matchesSearch = (p.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesOS = filterOS === "all" || (p.devices?.os || p.os || "").toLowerCase().includes(filterOS.toLowerCase());
      return matchesSearch && matchesOS;
    });
  }, [personas, searchTerm, filterOS]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "running":
        return "bg-success text-success-foreground";
      case "idle":
        return "bg-warning text-warning-foreground";
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
            Persona Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your automation personas and their behaviors
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <label className="inline-flex items-center cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              <span>Import Dataset</span>
              <input type="file" accept="application/json" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const text = await file.text();
                const payload = JSON.parse(text);
                const { supabase } = await import('@/lib/supabaseClient');
                const { data, error } = await supabase.functions.invoke('uploadPersonas', {
                  body: Array.isArray(payload) ? payload : payload.personas
                });
                if (error) alert(error.message);
                else alert(`Uploaded ${data?.inserted || 0} personas`);
              }} />
            </label>
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90" onClick={() => {
            // Example quick create; replace with proper dialog if needed
            const name = prompt('Persona name?');
            if (!name) return;
            fetch('/').then(async () => {
              const { createPersona } = await import('@/lib/db');
              await createPersona({ name });
              const { queryClient } = await import('@tanstack/react-query');
              // no-op here; page uses query invalidate via manual reload
              window.location.reload();
            });
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Persona
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{isLoading ? "-" : personas.length}</p>
                <p className="text-sm text-muted-foreground">Total Personas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">-</p>
                <p className="text-sm text-muted-foreground">Active Now</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">-</p>
                <p className="text-sm text-muted-foreground">Countries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">-</p>
                <p className="text-sm text-muted-foreground">Sessions Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Persona Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search personas by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterOS} onValueChange={setFilterOS}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by OS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Operating Systems</SelectItem>
                <SelectItem value="ios">iOS</SelectItem>
                <SelectItem value="android">Android</SelectItem>
                <SelectItem value="windows">Windows</SelectItem>
                <SelectItem value="macos">macOS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(filteredPersonas || []).map((persona: any) => (
                <TableRow key={persona.id}>
                  <TableCell className="font-medium">{persona.name}</TableCell>
                  <TableCell>{persona.age ?? "-"}</TableCell>
                  <TableCell>{persona.devices?.device_name ?? "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {(persona.tags || []).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(persona.status || "active")}>
                      {persona.status || "active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedPersona(persona)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Persona Details: {selectedPersona?.name}</DialogTitle>
                          </DialogHeader>
                          {selectedPersona && (
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-3">Basic Information</h4>
                                <div className="space-y-2 text-sm">
                                  <p><span className="text-muted-foreground">Age:</span> {selectedPersona.age ?? '-'}</p>
                                  <p><span className="text-muted-foreground">Device:</span> {selectedPersona.devices?.device_name ?? '-'}</p>
                                  <p><span className="text-muted-foreground">OS:</span> {selectedPersona.devices?.os ?? '-'}</p>
                                  <p><span className="text-muted-foreground">Browser:</span> {selectedPersona.devices?.browser_type ?? '-'}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-3">Activity</h4>
                                <div className="space-y-2 text-sm">
                                  <p><span className="text-muted-foreground">Status:</span> {selectedPersona.status ?? 'active'}</p>
                                  <p><span className="text-muted-foreground">Total Sessions:</span> -</p>
                                </div>
                              </div>
                              <div className="col-span-2">
                                <h4 className="font-semibold mb-3">Backstory & Behavior</h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {selectedPersona.backstory || '—'}
                                </p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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