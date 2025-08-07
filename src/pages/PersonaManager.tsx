import { useState } from "react";
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

const personas = [
  {
    id: 1,
    name: "Emma_21_iOS",
    age: 21,
    device: "iPhone 15 Pro",
    location: "New York, US",
    browser: "Safari",
    os: "iOS 17.2",
    tags: ["Gen Z", "Fashion", "TikTok"],
    status: "active",
    lastUsed: "2 min ago",
    sessions: 342
  },
  {
    id: 2,
    name: "Jake_19_Android",
    age: 19,
    device: "Galaxy S24",
    location: "London, UK",
    browser: "Chrome",
    os: "Android 14",
    tags: ["Gaming", "Tech"],
    status: "idle",
    lastUsed: "1 hour ago",
    sessions: 128
  },
  {
    id: 3,
    name: "Sarah_25_iPad",
    age: 25,
    device: "iPad Pro",
    location: "Toronto, CA",
    browser: "Safari",
    os: "iPadOS 17",
    tags: ["Art", "Design"],
    status: "running",
    lastUsed: "Active now",
    sessions: 567
  },
  {
    id: 4,
    name: "Alex_23_Desktop",
    age: 23,
    device: "Windows PC",
    location: "Berlin, DE",
    browser: "Firefox",
    os: "Windows 11",
    tags: ["Music", "Streaming"],
    status: "paused",
    lastUsed: "30 min ago",
    sessions: 89
  }
];

export default function PersonaManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOS, setFilterOS] = useState("all");
  const [selectedPersona, setSelectedPersona] = useState<typeof personas[0] | null>(null);

  const filteredPersonas = personas.filter(persona => {
    const matchesSearch = persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         persona.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOS = filterOS === "all" || persona.os.toLowerCase().includes(filterOS.toLowerCase());
    return matchesSearch && matchesOS;
  });

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
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Dataset
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90">
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
                <p className="text-2xl font-bold">128</p>
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
                <p className="text-2xl font-bold">42</p>
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
                <p className="text-2xl font-bold">23</p>
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
                <p className="text-2xl font-bold">1,247</p>
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
                placeholder="Search personas by name, location..."
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
                <TableHead>Location</TableHead>
                <TableHead>Browser</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPersonas.map((persona) => (
                <TableRow key={persona.id}>
                  <TableCell className="font-medium">{persona.name}</TableCell>
                  <TableCell>{persona.age}</TableCell>
                  <TableCell>{persona.device}</TableCell>
                  <TableCell>{persona.location}</TableCell>
                  <TableCell>{persona.browser}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {persona.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(persona.status)}>
                      {persona.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{persona.sessions}</TableCell>
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
                                  <p><span className="text-muted-foreground">Age:</span> {selectedPersona.age}</p>
                                  <p><span className="text-muted-foreground">Location:</span> {selectedPersona.location}</p>
                                  <p><span className="text-muted-foreground">Device:</span> {selectedPersona.device}</p>
                                  <p><span className="text-muted-foreground">Browser:</span> {selectedPersona.browser}</p>
                                  <p><span className="text-muted-foreground">OS:</span> {selectedPersona.os}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-3">Activity</h4>
                                <div className="space-y-2 text-sm">
                                  <p><span className="text-muted-foreground">Status:</span> {selectedPersona.status}</p>
                                  <p><span className="text-muted-foreground">Last Used:</span> {selectedPersona.lastUsed}</p>
                                  <p><span className="text-muted-foreground">Total Sessions:</span> {selectedPersona.sessions}</p>
                                  <p><span className="text-muted-foreground">Success Rate:</span> 94.2%</p>
                                </div>
                              </div>
                              <div className="col-span-2">
                                <h4 className="font-semibold mb-3">Backstory & Behavior</h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                  This persona represents a typical {selectedPersona.age}-year-old user interested in {selectedPersona.tags.join(", ").toLowerCase()}. 
                                  Primarily uses {selectedPersona.device} for social media browsing and content consumption.
                                </p>
                                <div className="bg-muted/50 p-3 rounded-lg">
                                  <p className="text-xs text-muted-foreground">Session Cookies: 247 active • User-Agent: Randomized • Fingerprint: Unique</p>
                                </div>
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