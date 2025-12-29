import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface MetricTileProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  icon: LucideIcon;
  severity?: "critical" | "high" | "medium" | "low" | "neutral";
  onClick?: () => void;
  searchQuery?: string;
}

export function MetricTile({
  title,
  value,
  change,
  icon: Icon,
  severity = "neutral",
  onClick,
  searchQuery,
}: MetricTileProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (searchQuery) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const severityColors = {
    critical: "border-l-critical",
    high: "border-l-high",
    medium: "border-l-warning",
    low: "border-l-primary",
    neutral: "border-l-border",
  };

  const iconBgColors = {
    critical: "bg-critical/10 text-critical",
    high: "bg-high/10 text-high",
    medium: "bg-warning/10 text-warning",
    low: "bg-primary/10 text-primary",
    neutral: "bg-muted text-muted-foreground",
  };

  const getTrendIcon = () => {
    if (!change) return null;
    if (change.value > 0) return <TrendingUp className="w-3 h-3" />;
    if (change.value < 0) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (!change) return "";
    if (severity === "critical" || severity === "high") {
      return change.value > 0 ? "text-critical" : "text-success";
    }
    return change.value > 0 ? "text-success" : "text-critical";
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "bg-card rounded-xl border border-border p-5 cursor-pointer tile-hover",
        "border-l-4",
        severityColors[severity]
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-lg", iconBgColors[severity])}>
          <Icon className="w-5 h-5" />
        </div>
        {severity !== "neutral" && (
          <span
            className={cn(
              "px-2 py-0.5 rounded text-xs font-semibold uppercase",
              severity === "critical" && "bg-critical/20 text-critical",
              severity === "high" && "bg-high/20 text-high",
              severity === "medium" && "bg-warning/20 text-warning",
              severity === "low" && "bg-primary/20 text-primary"
            )}
          >
            {severity}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-3xl font-bold text-foreground tracking-tight animate-count-up">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>

      {change && (
        <div className={cn("flex items-center gap-1 mt-3 text-xs", getTrendColor())}>
          {getTrendIcon()}
          <span className="font-medium">{Math.abs(change.value)}%</span>
          <span className="text-muted-foreground">{change.label}</span>
        </div>
      )}
    </div>
  );
}
