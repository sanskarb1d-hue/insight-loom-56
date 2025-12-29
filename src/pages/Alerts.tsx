import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BellOff,
  Clock,
  MoreVertical,
  Play,
  Trash2,
  Edit,
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
  ShieldAlert,
  Info,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface AlertConfig {
  id: string;
  name: string;
  description: string;
  filters: string;
  severity: "critical" | "high" | "medium" | "low";
  enabled: boolean;
  triggeredCount: number;
  lastTriggered?: string;
  notifyEmail: boolean;
  notifySlack: boolean;
}

const mockAlerts: AlertConfig[] = [
  {
    id: "1",
    name: "Failed Login Monitor",
    description: "Alert when failed login attempts exceed threshold",
    filters: "ACTION=FailedLogin",
    severity: "critical",
    enabled: true,
    triggeredCount: 234,
    lastTriggered: "5 minutes ago",
    notifyEmail: true,
    notifySlack: true,
  },
  {
    id: "2",
    name: "Weak Password Detection",
    description: "Detect users with weak passwords",
    filters: "ACTION=WeakPassword",
    severity: "high",
    enabled: true,
    triggeredCount: 412,
    lastTriggered: "2 hours ago",
    notifyEmail: true,
    notifySlack: false,
  },
  {
    id: "3",
    name: "Server Vulnerability",
    description: "Monitor for server security vulnerabilities",
    filters: "WHAT=Server ACTION=VulnerabilityFound",
    severity: "high",
    enabled: true,
    triggeredCount: 23,
    lastTriggered: "Yesterday",
    notifyEmail: true,
    notifySlack: true,
  },
  {
    id: "4",
    name: "Password Expiry Notice",
    description: "Alert for expired user passwords",
    filters: "ACTION=PasswordExpired",
    severity: "medium",
    enabled: true,
    triggeredCount: 156,
    lastTriggered: "1 hour ago",
    notifyEmail: true,
    notifySlack: false,
  },
  {
    id: "5",
    name: "Policy Violation",
    description: "Machines without required policies",
    filters: "ACTION=PolicyMissing",
    severity: "medium",
    enabled: false,
    triggeredCount: 47,
    lastTriggered: "3 days ago",
    notifyEmail: false,
    notifySlack: false,
  },
];

export default function Alerts() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [alerts, setAlerts] = useState<AlertConfig[]>(mockAlerts);

  const filteredAlerts = alerts.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAlert = (id: string) => {
    setAlerts(
      alerts.map((a) =>
        a.id === id ? { ...a, enabled: !a.enabled } : a
      )
    );
    const alert = alerts.find((a) => a.id === id);
    toast({
      title: alert?.enabled ? "Alert Disabled" : "Alert Enabled",
      description: `"${alert?.name}" has been ${alert?.enabled ? "disabled" : "enabled"}.`,
    });
  };

  const handleDelete = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
    toast({
      title: "Alert Deleted",
      description: "The alert configuration has been removed.",
    });
  };

  const handleViewTriggers = (alert: AlertConfig) => {
    navigate(`/search?q=${encodeURIComponent(alert.filters)}&alert=${alert.id}`);
  };

  const getSeverityIcon = (severity: AlertConfig["severity"]) => {
    switch (severity) {
      case "critical":
        return <ShieldAlert className="w-5 h-5 text-critical" />;
      case "high":
        return <AlertTriangle className="w-5 h-5 text-high" />;
      case "medium":
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case "low":
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getSeverityBadge = (severity: AlertConfig["severity"]) => {
    const colors = {
      critical: "bg-critical/20 text-critical border-critical/30",
      high: "bg-high/20 text-high border-high/30",
      medium: "bg-warning/20 text-warning border-warning/30",
      low: "bg-primary/20 text-primary border-primary/30",
    };
    return colors[severity];
  };

  return (
    <>
      <Header title="Alert Configuration" subtitle="Manage your alert rules and notifications" />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Alerts</p>
              <p className="text-2xl font-bold text-foreground">{alerts.length}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Active Alerts</p>
              <p className="text-2xl font-bold text-success">
                {alerts.filter((a) => a.enabled).length}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Triggered Today</p>
              <p className="text-2xl font-bold text-warning">
                {alerts.reduce((sum, a) => sum + a.triggeredCount, 0)}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Critical Alerts</p>
              <p className="text-2xl font-bold text-critical">
                {alerts.filter((a) => a.severity === "critical" && a.enabled).length}
              </p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search alerts..."
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-gradient-primary text-primary-foreground">
              <Bell className="w-4 h-4 mr-2" />
              Create Alert
            </Button>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "bg-card rounded-xl border border-border p-5 transition-all",
                  !alert.enabled && "opacity-60"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      alert.severity === "critical" && "bg-critical/10",
                      alert.severity === "high" && "bg-high/10",
                      alert.severity === "medium" && "bg-warning/10",
                      alert.severity === "low" && "bg-primary/10"
                    )}
                  >
                    {getSeverityIcon(alert.severity)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground">{alert.name}</h3>
                      <Badge
                        variant="outline"
                        className={cn("text-xs border", getSeverityBadge(alert.severity))}
                      >
                        {alert.severity}
                      </Badge>
                      {!alert.enabled && (
                        <Badge variant="secondary" className="text-xs">
                          <BellOff className="w-3 h-3 mr-1" />
                          Disabled
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {alert.description}
                    </p>

                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                      <span>
                        <code className="bg-muted px-2 py-0.5 rounded font-mono">
                          {alert.filters}
                        </code>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last triggered: {alert.lastTriggered || "Never"}
                      </span>
                      <span className="flex items-center gap-1">
                        Triggered: <strong className="text-foreground">{alert.triggeredCount}</strong> times
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {alert.enabled ? "Active" : "Inactive"}
                      </span>
                      <Switch
                        checked={alert.enabled}
                        onCheckedChange={() => toggleAlert(alert.id)}
                      />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewTriggers(alert)}>
                          <Play className="w-4 h-4 mr-2" />
                          View Triggers
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Configuration
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(alert.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Alert
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
