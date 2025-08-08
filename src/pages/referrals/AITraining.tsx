import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
  Brain,
  Plus,
  Play,
  Database,
  Zap,
  Target,
  Eye,
  Download,
  Upload,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const trainingData = [
  {
    id: "dataset_001",
    name: "TikTok Click Patterns",
    type: "click_behavior",
    platform: "tiktok",
    samples: 12450,
    quality: 94.2,
    lastUpdated: "2 hours ago",
    status: "active",
    size: "2.3 GB"
  },
  {
    id: "dataset_002",
    name: "Instagram Story Interactions",
    type: "story_engagement", 
    platform: "instagram",
    samples: 8967,
    quality: 91.8,
    lastUpdated: "1 day ago",
    status: "active",
    size: "1.8 GB"
  },
  {
    id: "dataset_003",
    name: "YouTube Ad Skip Behavior",
    type: "ad_interaction",
    platform: "youtube",
    samples: 5432,
    quality: 87.5,
    lastUpdated: "3 days ago",
    status: "training",
    size: "945 MB"
  },
  {
    id: "dataset_004",
    name: "WhatsApp Link Navigation",
    type: "link_following",
    platform: "whatsapp",
    samples: 3210,
    quality: 96.1,
    lastUpdated: "5 days ago",
    status: "completed",
    size: "654 MB"
  }
];

const heuristics = [
  {
    id: "heur_001",
    name: "Platform-specific CTA Actions",
    description: "Recognizes and responds to call-to-action buttons across different platforms",
    platforms: ["tiktok", "instagram", "facebook"],
    accuracy: 92.4,
    enabled: true,
    lastTrained: "1 day ago"
  },
  {
    id: "heur_002", 
    name: "Multi-tab Session Simulation",
    description: "Manages multiple browser tabs to simulate realistic browsing patterns",
    platforms: ["all"],
    accuracy: 89.7,
    enabled: true,
    lastTrained: "3 days ago"
  },
  {
    id: "heur_003",
    name: "Lookalike Source Simulation",
    description: "Mimics behavior patterns of similar user demographics",
    platforms: ["facebook", "instagram"],
    accuracy: 94.8,
    enabled: false,
    lastTrained: "1 week ago"
  },
  {
    id: "heur_004",
    name: "Referral Fraud Detection",
    description: "Identifies and avoids patterns that might trigger fraud detection",
    platforms: ["all"],
    accuracy: 97.2,
    enabled: true,
    lastTrained: "2 days ago"
  }
];

export default function AITraining() {
  const [showDatasetDialog, setShowDatasetDialog] = useState(false);
  const [showHeuristicDialog, setShowHeuristicDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("datasets");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "training":
        return "bg-warning text-warning-foreground";
      case "completed":
        return "bg-accent text-accent-foreground";
      case "error":
        return "bg-error text-error-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      tiktok: "bg-pink-500/10 text-pink-500",
      instagram: "bg-purple-500/10 text-purple-500",
      facebook: "bg-blue-500/10 text-blue-500",
      youtube: "bg-red-500/10 text-red-500",
      whatsapp: "bg-green-500/10 text-green-500",
      all: "bg-gray-500/10 text-gray-500"
    };
    return colors[platform] || "bg-secondary text-secondary-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Referral-AI Training
          </h1>
          <p className="text-muted-foreground mt-1">
            Train Vanta AI on referral datasets and customize behavior heuristics
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            AI Settings
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Play className="h-4 w-4 mr-2" />
            Start Training
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">32</p>
                <p className="text-sm text-muted-foreground">Training Datasets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">v2.8</p>
                <p className="text-sm text-muted-foreground">Model Version</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">94.2%</p>
                <p className="text-sm text-muted-foreground">Accuracy Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Training Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        <button
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "datasets" 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("datasets")}
        >
          Training Datasets
        </button>
        <button
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "heuristics" 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("heuristics")}
        >
          Behavior Heuristics
        </button>
        <button
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "training" 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("training")}
        >
          Training History
        </button>
      </div>

      {/* Training Datasets Tab */}
      {activeTab === "datasets" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Training Datasets</CardTitle>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Dataset
                </Button>
                <Dialog open={showDatasetDialog} onOpenChange={setShowDatasetDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Dataset
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Training Dataset</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dataset-name">Dataset Name</Label>
                          <Input
                            id="dataset-name"
                            placeholder="TikTok Click Patterns"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dataset-type">Behavior Type</Label>
                          <Select>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="click_behavior">Click Behavior</SelectItem>
                              <SelectItem value="scroll_patterns">Scroll Patterns</SelectItem>
                              <SelectItem value="form_filling">Form Filling</SelectItem>
                              <SelectItem value="navigation">Navigation</SelectItem>
                              <SelectItem value="engagement">Engagement</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="platform">Target Platform</Label>
                          <Select>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tiktok">TikTok</SelectItem>
                              <SelectItem value="instagram">Instagram</SelectItem>
                              <SelectItem value="facebook">Facebook</SelectItem>
                              <SelectItem value="youtube">YouTube</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                              <SelectItem value="all">All Platforms</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="sample-size">Expected Samples</Label>
                          <Input
                            id="sample-size"
                            type="number"
                            placeholder="10000"
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="dataset-description">Description</Label>
                        <Textarea
                          id="dataset-description"
                          placeholder="Describe the behavior patterns this dataset will capture..."
                          className="mt-2 h-24"
                        />
                      </div>

                      <div>
                        <Label htmlFor="data-source">Data Source</Label>
                        <Select>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="session_replay">Session Replay Data</SelectItem>
                            <SelectItem value="manual_entry">Manual Entry</SelectItem>
                            <SelectItem value="import_json">Import JSON</SelectItem>
                            <SelectItem value="live_collection">Live Collection</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => setShowDatasetDialog(false)}>
                          Cancel
                        </Button>
                        <Button className="bg-gradient-primary hover:opacity-90">
                          Create Dataset
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dataset</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Samples</TableHead>
                  <TableHead>Quality Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainingData.map((dataset) => (
                  <TableRow key={dataset.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{dataset.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {dataset.size} • Updated {dataset.lastUpdated}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{dataset.type.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPlatformColor(dataset.platform)}>
                        {dataset.platform}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{dataset.samples.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{dataset.quality}%</span>
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${dataset.quality}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(dataset.status)}>
                        {dataset.status}
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
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Behavior Heuristics Tab */}
      {activeTab === "heuristics" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Behavior Heuristics</CardTitle>
              <Dialog open={showHeuristicDialog} onOpenChange={setShowHeuristicDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Heuristic
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Heuristic</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="heuristic-name">Heuristic Name</Label>
                      <Input
                        id="heuristic-name"
                        placeholder="Advanced Click Pattern Recognition"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="heuristic-description">Description</Label>
                      <Textarea
                        id="heuristic-description"
                        placeholder="Describe what this heuristic does and how it improves AI behavior..."
                        className="mt-2 h-24"
                      />
                    </div>

                    <div>
                      <Label>Target Platforms</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {["tiktok", "instagram", "facebook", "youtube", "whatsapp", "all"].map((platform) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={platform}
                              className="rounded border-border"
                            />
                            <Label htmlFor={platform} className="text-sm capitalize">{platform}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="heuristic-logic">Heuristic Logic (JSON)</Label>
                      <Textarea
                        id="heuristic-logic"
                        placeholder='{"trigger": "button_click", "conditions": {...}, "actions": {...}}'
                        className="mt-2 h-32 font-mono"
                      />
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button variant="outline" onClick={() => setShowHeuristicDialog(false)}>
                        Cancel
                      </Button>
                      <Button variant="outline">
                        Test Heuristic
                      </Button>
                      <Button className="bg-gradient-primary hover:opacity-90">
                        Create Heuristic
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Heuristic</TableHead>
                  <TableHead>Platforms</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Trained</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {heuristics.map((heuristic) => (
                  <TableRow key={heuristic.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{heuristic.name}</div>
                        <div className="text-sm text-muted-foreground max-w-xs">
                          {heuristic.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {heuristic.platforms.map((platform) => (
                          <Badge key={platform} className={getPlatformColor(platform)} variant="outline">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{heuristic.accuracy}%</span>
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${heuristic.accuracy}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={heuristic.enabled} />
                        {heuristic.enabled ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {heuristic.lastTrained}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Training History Tab */}
      {activeTab === "training" && (
        <Card>
          <CardHeader>
            <CardTitle>Training History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: "train_001",
                  modelVersion: "v2.8",
                  datasets: ["TikTok Click Patterns", "Instagram Engagement"],
                  duration: "2h 34m",
                  accuracy: 94.2,
                  status: "completed",
                  startTime: "2024-01-15 10:30:00",
                  endTime: "2024-01-15 13:04:00"
                },
                {
                  id: "train_002", 
                  modelVersion: "v2.7",
                  datasets: ["YouTube Ad Behavior", "WhatsApp Navigation"],
                  duration: "1h 45m",
                  accuracy: 92.8,
                  status: "completed",
                  startTime: "2024-01-14 14:15:00",
                  endTime: "2024-01-14 16:00:00"
                },
                {
                  id: "train_003",
                  modelVersion: "v2.6",
                  datasets: ["Facebook Click Patterns"],
                  duration: "Running...",
                  accuracy: 0,
                  status: "training",
                  startTime: "2024-01-16 09:00:00",
                  endTime: "In progress"
                }
              ].map((training) => (
                <div key={training.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{training.modelVersion}</Badge>
                      <span className="font-medium">Training Job {training.id}</span>
                      <Badge className={getStatusColor(training.status)}>
                        {training.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {training.duration}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Datasets</Label>
                      <div className="mt-1">
                        {training.datasets.map((dataset, index) => (
                          <div key={index}>{dataset}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Timeline</Label>
                      <div className="mt-1">
                        <div>Started: {new Date(training.startTime).toLocaleString()}</div>
                        <div>Ended: {training.endTime}</div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Performance</Label>
                      <div className="mt-1">
                        {training.accuracy > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{training.accuracy}% accuracy</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Training in progress...</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}