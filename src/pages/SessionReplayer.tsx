import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSessions } from "@/lib/db";
import { useRealtimeSessions } from "@/hooks/useRealtimeSessions";
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

export default function SessionReplayer() {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { data, error } = await fetchSessions();
      if (error) throw error;
      return data || [];
    },
  });

  useRealtimeSessions(() => {
    queryClient.invalidateQueries({ queryKey: ["sessions"] });
  });

  const sessions = useMemo(() => data || [], [data]);
  const filteredSessions = useMemo(() =>
    (sessions || []).filter((s: any) =>
      (s.personas?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.target || "").toLowerCase().includes(searchTerm.toLowerCase())
    ),
  [sessions, searchTerm]);

  const getStatusColor = (status: string, success: boolean) => {
    if ((status || "") === "failed" || success === false) return "bg-error text-error-foreground";
    if ((status || "") === "completed" && (success ?? true)) return "bg-success text-success-foreground";
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
          <Button className="bg-gradient-primary hover:opacity-90">
            <Play className="h-4 w-4 mr-2" />
            Start Replay
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by persona or target"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Persona</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(filteredSessions || []).map((session: any) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.personas?.name || '-'}</TableCell>
                  <TableCell>{session.activity_log?.target || '-'}</TableCell>
                  <TableCell>{session.start_time ? new Date(session.start_time).toLocaleString() : '-'}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(session.status || '', (session.activity_log?.success ?? true))}>
                      {session.status || 'running'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
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
    </div>
  );
}