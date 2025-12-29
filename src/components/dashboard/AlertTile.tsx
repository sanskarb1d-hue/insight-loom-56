import { AlertTriangle, ShieldAlert, ShieldCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Alert {
  id: string;
  title: string;
  count: number;
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
}

interface AlertTileProps {
  alerts: Alert[];
  title?: string;
}

export function AlertTile({ alerts, title = "Top Active Threats" }: AlertTileProps) {
  const navigate = useNavigate();

  const getSeverityIcon = (severity: Alert["severity"]) => {
    switch (severity) {
      case "critical":
        return <ShieldAlert className="w-4 h-4 text-critical" />;
      case "high":
        return <AlertTriangle className="w-4 h-4 text-high" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case "low":
        return <Info className="w-4 h-4 text-primary" />;
    }
  };

  const getSeverityBg = (severity: Alert["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-critical/10 border-critical/30";
      case "high":
        return "bg-high/10 border-high/30";
      case "medium":
        return "bg-warning/10 border-warning/30";
      case "low":
        return "bg-primary/10 border-primary/30";
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <button
          onClick={() => navigate("/alerts")}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => navigate(`/search?alert=${alert.id}`)}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border cursor-pointer",
              "hover:scale-[1.02] transition-all duration-200",
              getSeverityBg(alert.severity)
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                alert.severity === "critical" && "bg-critical/20",
                alert.severity === "high" && "bg-high/20",
                alert.severity === "medium" && "bg-warning/20",
                alert.severity === "low" && "bg-primary/20"
              )}>
                {getSeverityIcon(alert.severity)}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-lg font-bold",
                alert.severity === "critical" && "text-critical",
                alert.severity === "high" && "text-high",
                alert.severity === "medium" && "text-warning",
                alert.severity === "low" && "text-primary"
              )}>
                {alert.count}
              </span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded font-medium uppercase",
                alert.severity === "critical" && "bg-critical/20 text-critical",
                alert.severity === "high" && "bg-high/20 text-high",
                alert.severity === "medium" && "bg-warning/20 text-warning",
                alert.severity === "low" && "bg-primary/20 text-primary"
              )}>
                {alert.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
