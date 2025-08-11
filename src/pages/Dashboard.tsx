import { StatusCard } from "@/components/StatusCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Play,
  TrendingUp,
  Users,
  Bot,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const recentActivities = [
    {
      id: 1,
      action: "Session completed",
      persona: "Emma_21_iOS",
      target: "tiktok.com",
      status: "success",
      time: "2 min ago"
    },
    {
      id: 2,
      action: "Proxy flagged",
      details: "157.245.123.45 detected as suspicious",
      status: "warning",
      time: "5 min ago"
    },
    {
      id: 3,
      action: "New persona created",
      persona: "Jake_19_Android",
      status: "success",
      time: "8 min ago"
    },
    {
      id: 4,
      action: "Task failed",
      persona: "Sarah_25_iPad",
      target: "Failed after 3 retries",
      status: "error",
      time: "12 min ago"
    }
  ];

  const proxyHealth = [
    { country: "United States", total: 45, healthy: 42, ping: "24ms" },
    { country: "United Kingdom", total: 32, healthy: 30, ping: "18ms" },
    { country: "Germany", total: 28, healthy: 26, ping: "31ms" },
    { country: "Japan", total: 22, healthy: 20, ping: "45ms" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor your automation campaigns and system health
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/task-engine">
              <Activity className="h-4 w-4 mr-2" />
              Create Task
            </Link>
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90" asChild>
            <Link to="/ai-trainer">
              <Play className="h-4 w-4 mr-2" />
              Vanta AI
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="Sessions Run Today"
          value="1,247"
          subtitle="Last session: 2 min ago"
          icon={Play}
          trend={{ value: 12.5, isPositive: true }}
          status="success"
        />
        <StatusCard
          title="Success Rate"
          value="94.2%"
          subtitle="Above target (90%)"
          icon={TrendingUp}
          trend={{ value: 2.1, isPositive: true }}
          status="success"
        />
        <StatusCard
          title="Active Personas"
          value="128"
          subtitle="42 currently running"
          icon={Users}
          status="default"
        />
        <StatusCard
          title="Vanta AI Status"
          value="Training"
          subtitle="Model v2.3 • 89% complete"
          icon={Bot}
          status="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="flex-shrink-0 mt-1">
                    {activity.status === "success" && (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                    {activity.status === "warning" && (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                    {activity.status === "error" && (
                      <XCircle className="h-4 w-4 text-error" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.persona && `${activity.persona} • `}
                      {activity.target || activity.details}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Proxy Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Proxy Health Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proxyHealth.map((proxy) => (
                <div key={proxy.country} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">{proxy.country}</p>
                    <p className="text-sm text-muted-foreground">
                      {proxy.healthy}/{proxy.total} healthy • {proxy.ping} avg
                    </p>
                  </div>
                  <Badge 
                    variant={proxy.healthy === proxy.total ? "default" : "secondary"}
                    className={proxy.healthy === proxy.total ? "bg-success text-success-foreground" : ""}
                  >
                    {Math.round((proxy.healthy / proxy.total) * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}