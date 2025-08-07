import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Search,
  Calendar,
  Smartphone,
  Globe,
  Clock,
  Eye,
  FileText,
  Activity
} from "lucide-react";

const sessions = [
  {
    id: "sess_001",
    persona: "Emma_21_iOS",
    target: "tiktok.com",
    duration: "4m 32s",
    timestamp: "2024-01-15 14:30:22",
    status: "completed",
    device: "iPhone 15 Pro",
    browser: "Safari",
    location: "New York, US",
    actions: 247,
    success: true,
    size: "2.1 MB"
  },
  {
    id: "sess_002",
    persona: "Jake_19_Android",
    target: "youtube.com",
    duration: "12m 18s",
    timestamp: "2024-01-15 14:25:10",
    status: "completed",
    device: "Galaxy S24",
    browser: "Chrome",
    location: "London, UK",
    actions: 189,
    success: true,
    size: "5.7 MB"
  },
  {
    id: "sess_003",
    persona: "Sarah_25_iPad",
    target: "instagram.com",
    duration: "7m 45s",
    timestamp: "2024-01-15 14:20:15",
    status: "failed",
    device: "iPad Pro",
    browser: "Safari",
    location: "Toronto, CA",
    actions: 94,
    success: false,
    size: "1.8 MB"
  },
  {
    id: "sess_004",
    persona: "Alex_23_Desktop",
    target: "spotify.com",
    duration: "15m 30s",
    timestamp: "2024-01-15 14:15:45",
    status: "completed",
    device: "Windows PC",
    browser: "Firefox",
    location: "Berlin, DE",
    actions: 312,
    success: true,
    size: "8.2 MB"
  }
];

export default function SessionReplayer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState<typeof sessions[0] | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const filteredSessions = sessions.filter(session =>
    session.persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string, success: boolean) => {
    if (status === "failed" || !success) return "bg-error text-error-foreground";
    if (status === "completed" && success) return "bg-success text-success-foreground";
    return "bg-warning text-warning-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Session Replayer
          </h1>
          <p className="text-muted-foreground mt-1">
            Replay and analyze automation sessions with detailed timelines
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Sessions</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sessions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session ID</TableHead>
                    <TableHead>Persona</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow 
                      key={session.id}
                      className={`cursor-pointer hover:bg-muted/50 ${selectedSession?.id === session.id ? 'bg-primary/10' : ''}`}
                      onClick={() => setSelectedSession(session)}
                    >
                      <TableCell className="font-mono text-sm">{session.id}</TableCell>
                      <TableCell>{session.persona}</TableCell>
                      <TableCell>{session.target}</TableCell>
                      <TableCell>{session.duration}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(session.status, session.success)}>
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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

          {/* Playback Controls */}
          {selectedSession && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Session Replay: {selectedSession.id}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Timeline */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0:00</span>
                      <span>{selectedSession.duration}</span>
                    </div>
                    <Progress value={playbackProgress} className="h-2" />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Session Preview */}
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="w-full max-w-md mx-auto bg-card border rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-3 w-3 rounded-full bg-error"></div>
                        <div className="h-3 w-3 rounded-full bg-warning"></div>
                        <div className="h-3 w-3 rounded-full bg-success"></div>
                        <div className="flex-1 bg-muted rounded text-xs px-2 py-1 ml-4">
                          {selectedSession.target}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-20 bg-gradient-accent rounded"></div>
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Session playback simulation • Click play to start
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Session Details Sidebar */}
        <div className="space-y-4">
          {selectedSession ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Session Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Persona</p>
                    <p className="font-medium">{selectedSession.persona}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Target URL</p>
                    <p className="font-medium">{selectedSession.target}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{selectedSession.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Timestamp</p>
                    <p className="font-medium text-sm">{selectedSession.timestamp}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Actions Performed</p>
                    <p className="font-medium">{selectedSession.actions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">File Size</p>
                    <p className="font-medium">{selectedSession.size}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Device Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Device</p>
                    <p className="font-medium">{selectedSession.device}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Browser</p>
                    <p className="font-medium">{selectedSession.browser}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedSession.location}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Export Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    HAR File
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    JSON Export
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Video Recording
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a session from the list to view details and replay controls
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}