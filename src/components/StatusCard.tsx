import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  status?: "success" | "warning" | "error" | "default";
  className?: string;
}

export function StatusCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  status = "default",
  className
}: StatusCardProps) {
  const statusColors = {
    success: "border-success/30 bg-gradient-to-br from-success/10 to-success/5",
    warning: "border-warning/30 bg-gradient-to-br from-warning/10 to-warning/5",
    error: "border-error/30 bg-gradient-to-br from-error/10 to-error/5",
    default: "border-border bg-gradient-surface"
  };

  return (
    <div className={cn(
      "relative p-6 rounded-lg border transition-all duration-200 hover:shadow-card group",
      statusColors[status],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-success" : "text-error"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
              <span className="text-sm text-muted-foreground ml-1">
                from last hour
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-lg transition-colors duration-200",
          status === "success" && "bg-success/20 text-success",
          status === "warning" && "bg-warning/20 text-warning",
          status === "error" && "bg-error/20 text-error",
          status === "default" && "bg-primary/20 text-primary"
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}