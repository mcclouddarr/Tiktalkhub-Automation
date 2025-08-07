import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Play,
  Link as LinkIcon,
  Shield,
  Smartphone,
  Brain,
  Calendar,
  Cookie,
  Settings,
  Bot
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Persona Manager", href: "/personas", icon: Users },
  { name: "Session Replayer", href: "/sessions", icon: Play },
  { name: "Referral Tasks", href: "/referrals", icon: LinkIcon },
  { name: "Proxy Manager", href: "/proxies", icon: Shield },
  { name: "Device Spoofing", href: "/devices", icon: Smartphone },
  { name: "Vanta AI Trainer", href: "/ai-trainer", icon: Brain },
  { name: "Bulk Scheduler", href: "/scheduler", icon: Calendar },
  { name: "Cookie Manager", href: "/cookies", icon: Cookie },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-50 h-full bg-card border-r border-border transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-center h-16 border-b border-border bg-gradient-primary">
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary-foreground" />
          {isOpen && (
            <span className="text-xl font-bold text-primary-foreground">
              TikTalk Automaton
            </span>
          )}
        </div>
      </div>

      <nav className="mt-6 px-3">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 mb-1 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && (
                <span className="font-medium truncate">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-accent rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm font-medium">Vanta AI Status</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Online • Training Model v2.3
            </p>
          </div>
        </div>
      )}
    </div>
  );
}