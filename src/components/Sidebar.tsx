import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
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
  Bot,
  ChevronDown,
  ChevronRight,
  Code,
  Target,
  TrendingUp,
  Zap,
  LogIn
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

interface NavigationItem {
  name: string;
  href?: string;
  icon: any;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Authentication", href: "/auth", icon: LogIn },
  { name: "Persona Manager", href: "/personas", icon: Users },
  { name: "Device Profiles", href: "/device-profiles", icon: Smartphone },
  { name: "Session Replayer", href: "/sessions", icon: Play },
  { name: "Cookie Manager", href: "/cookies", icon: Cookie },
  { name: "Proxy Manager", href: "/proxies", icon: Shield },
  { name: "Task Scheduler", href: "/scheduler", icon: Calendar },
  { name: "Vanta AI Panel", href: "/ai-trainer", icon: Brain },
  { name: "Script Hub", href: "/scripts", icon: Code },
  {
    name: "Referral System",
    icon: LinkIcon,
    children: [
      { name: "Campaign Builder", href: "/referrals/campaigns", icon: Target },
      { name: "Task Engine", href: "/referrals/tasks", icon: Zap },
      { name: "Analytics", href: "/referrals/analytics", icon: TrendingUp },
      { name: "AI Training", href: "/referrals/ai-training", icon: Brain },
    ]
  },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderNavItem = (item: NavigationItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const isActive = item.href ? location.pathname === item.href : false;
    const isChildActive = hasChildren && item.children?.some(child => location.pathname === child.href);

    if (hasChildren) {
      return (
        <div key={item.name} className="mb-1">
          <button
            onClick={() => toggleExpanded(item.name)}
            className={cn(
              "flex items-center gap-3 px-3 py-3 w-full rounded-lg transition-all duration-200 group",
              isChildActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {isOpen && (
              <>
                <span className="font-medium truncate flex-1 text-left">{item.name}</span>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                )}
              </>
            )}
          </button>
          {isOpen && isExpanded && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children?.map((child) => {
                const isChildItemActive = location.pathname === child.href;
                return (
                  <Link
                    key={child.name}
                    to={child.href!}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                      isChildItemActive
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <child.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium truncate text-sm">{child.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.href!}
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
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-50 h-full bg-card border-r border-border transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-center h-16 border-b border-border bg-gradient-primary">
        <div className="flex items-center gap-3">
          <img src="/tiktalkhub-logo.svg" alt="Tiktalkhub" className="h-8 w-8" />
          {isOpen && (
            <span className="text-xl font-bold text-primary-foreground">
              Tiktalkhub Automation
            </span>
          )}
        </div>
      </div>

      <nav className="mt-6 px-3 overflow-y-auto h-[calc(100vh-12rem)] pb-4">
        {navigation.map(renderNavItem)}
      </nav>

      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4 mb-16">
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