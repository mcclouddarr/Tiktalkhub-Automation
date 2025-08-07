import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Smartphone,
  Monitor,
  Tablet,
  Settings,
  Eye,
  Shuffle,
  Download,
  Upload
} from "lucide-react";

const devicePresets = [
  {
    id: "iphone15pro",
    name: "iPhone 15 Pro",
    type: "mobile",
    screen: "393x852",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X)",
    platform: "iOS",
    popular: true
  },
  {
    id: "galaxys24",
    name: "Galaxy S24",
    type: "mobile", 
    screen: "384x854",
    userAgent: "Mozilla/5.0 (Linux; Android 14; SM-S921B)",
    platform: "Android",
    popular: true
  },
  {
    id: "pixel9",
    name: "Pixel 9",
    type: "mobile",
    screen: "393x873",
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 9)",
    platform: "Android",
    popular: true
  },
  {
    id: "ipadpro",
    name: "iPad Pro 12.9",
    type: "tablet",
    screen: "1024x1366",
    userAgent: "Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X)",
    platform: "iPadOS",
    popular: false
  },
  {
    id: "macbook",
    name: "MacBook Pro",
    type: "desktop",
    screen: "1512x982",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    platform: "macOS",
    popular: false
  }
];

const spoofingSettings = [
  { id: "userAgent", label: "User Agent", enabled: true },
  { id: "resolution", label: "Screen Resolution", enabled: true },
  { id: "fonts", label: "Font Fingerprinting", enabled: true },
  { id: "webgl", label: "WebGL Fingerprint", enabled: true },
  { id: "canvas", label: "Canvas Fingerprint", enabled: false },
  { id: "timezone", label: "Timezone Spoofing", enabled: true },
  { id: "language", label: "Language Headers", enabled: true },
  { id: "plugins", label: "Browser Plugins", enabled: false }
];

export default function DeviceSpoofing() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Device & Browser Spoofing
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure device presets and browser fingerprint spoofing
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Config
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Config
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Presets */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Device Presets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {devicePresets.map((device) => (
                  <Card key={device.id} className="relative border-border hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {device.type === "mobile" && <Smartphone className="h-5 w-5 text-primary" />}
                          {device.type === "tablet" && <Tablet className="h-5 w-5 text-primary" />}
                          {device.type === "desktop" && <Monitor className="h-5 w-5 text-primary" />}
                          <h3 className="font-semibold">{device.name}</h3>
                        </div>
                        {device.popular && (
                          <Badge variant="secondary" className="text-xs">Popular</Badge>
                        )}
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p><span className="font-medium">Platform:</span> {device.platform}</p>
                        <p><span className="font-medium">Resolution:</span> {device.screen}</p>
                        <p className="truncate" title={device.userAgent}>
                          <span className="font-medium">User Agent:</span> {device.userAgent.substring(0, 40)}...
                        </p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1">
                          Use Preset
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Device Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-accent rounded-lg p-8 text-center">
                <div className="max-w-sm mx-auto">
                  {/* Mock device frame */}
                  <div className="bg-card border border-border rounded-[2rem] p-2 shadow-elevated">
                    <div className="bg-background rounded-[1.5rem] p-4 aspect-[9/16]">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-1 bg-muted rounded-full"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-8 bg-primary/20 rounded"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-16 bg-accent/20 rounded"></div>
                          <div className="h-16 bg-accent/20 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    iPhone 15 Pro Preview • 393x852
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spoofing Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Spoofing Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {spoofingSettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <Label htmlFor={setting.id} className="text-sm font-medium">
                    {setting.label}
                  </Label>
                  <Switch id={setting.id} defaultChecked={setting.enabled} />
                </div>
              ))}
              
              <div className="pt-4 border-t border-border">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Browser Engine</Label>
                    <Select defaultValue="webkit">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="webkit">WebKit (Safari)</SelectItem>
                        <SelectItem value="blink">Blink (Chrome)</SelectItem>
                        <SelectItem value="gecko">Gecko (Firefox)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Randomization Level</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="extreme">Extreme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shuffle className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Shuffle className="h-4 w-4 mr-2" />
                Randomize All
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Monitor className="h-4 w-4 mr-2" />
                Desktop Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}