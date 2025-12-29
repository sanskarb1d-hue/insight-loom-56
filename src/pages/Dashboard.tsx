import {
  Monitor,
  Users,
  UserCheck,
  UserX,
  Key,
  KeyRound,
  Shield,
  AlertTriangle,
  Clock,
  Package,
  ShieldOff,
  Lock,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MetricTile } from "@/components/dashboard/MetricTile";
import { AlertTile } from "@/components/dashboard/AlertTile";

const mockAlerts = [
  {
    id: "1",
    title: "Failed Login Attempts",
    count: 234,
    severity: "critical" as const,
    timestamp: "Last hour",
  },
  {
    id: "2",
    title: "Weak Password Detected",
    count: 412,
    severity: "high" as const,
    timestamp: "Last 24 hours",
  },
  {
    id: "3",
    title: "Server Vulnerability Found",
    count: 23,
    severity: "high" as const,
    timestamp: "Last 24 hours",
  },
  {
    id: "4",
    title: "Expired User Accounts",
    count: 156,
    severity: "medium" as const,
    timestamp: "Current",
  },
  {
    id: "5",
    title: "Machine with No Policy",
    count: 47,
    severity: "medium" as const,
    timestamp: "Current",
  },
];

export default function Dashboard() {
  return (
    <>
      <Header
        title="Dashboard Overview"
        subtitle="Welcome back! Here's what's happening with your infrastructure today."
      />

      <div className="flex-1 p-6 overflow-auto bg-gradient-to-b from-background to-card/20">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricTile
              title="Total Workstations"
              value={1247}
              change={{ value: 20.1, label: "vs last month" }}
              icon={Monitor}
              severity="neutral"
              searchQuery="WHAT=Machine WHERE=Workstation"
            />
            <MetricTile
              title="Enabled Local Users"
              value={2400}
              change={{ value: 15.3, label: "vs last month" }}
              icon={UserCheck}
              severity="neutral"
              searchQuery="WHAT=LocalUser ACTION=Enabled"
            />
            <MetricTile
              title="Users in Privileged Groups"
              value="60.24%"
              change={{ value: 2.5, label: "vs last month" }}
              icon={Users}
              severity="low"
              searchQuery="WHAT=LocalUser ACTION=MemberOf WHO=Administrators"
            />
            <MetricTile
              title="Failed Login Attempts"
              value={234}
              severity="critical"
              icon={AlertTriangle}
              searchQuery="ACTION=FailedLogin WHEN=Last24Hours"
            />
          </div>

          {/* Second Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricTile
              title="Password Never Expire"
              value={2400}
              icon={KeyRound}
              severity="medium"
              searchQuery="WHAT=LocalUser ACTION=PasswordNeverExpires"
            />
            <MetricTile
              title="Disabled Local Users"
              value={328}
              change={{ value: 5.2, label: "vs last month" }}
              icon={UserX}
              severity="neutral"
              searchQuery="WHAT=LocalUser ACTION=Disabled"
            />
            <MetricTile
              title="Installed Software"
              value={47}
              change={{ value: -12.3, label: "vs last month" }}
              icon={Package}
              severity="neutral"
              searchQuery="WHAT=Software ACTION=Installed"
            />
            <MetricTile
              title="Expired User Accounts"
              value={156}
              severity="high"
              icon={Clock}
              searchQuery="WHAT=LocalUser ACTION=PasswordExpired"
            />
          </div>

          {/* Third Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricTile
              title="Weak Passwords"
              value={412}
              severity="medium"
              icon={Key}
              searchQuery="ACTION=WeakPassword"
            />
            <MetricTile
              title="Machine with No Policy"
              value={47}
              severity="medium"
              icon={ShieldOff}
              searchQuery="WHAT=Machine ACTION=PolicyMissing"
            />
            <MetricTile
              title="Password Changed (24h)"
              value={700}
              change={{ value: 10, label: "vs last 30 days" }}
              icon={Lock}
              severity="low"
              searchQuery="WHAT=User ACTION=PasswordChanged WHEN=Last24Hours"
            />
            <MetricTile
              title="Server Vulnerabilities"
              value={23}
              severity="high"
              icon={Shield}
              searchQuery="WHAT=Server ACTION=VulnerabilityFound"
            />
          </div>

          {/* Alerts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlertTile alerts={mockAlerts} />
            
            {/* Recent Activity */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { action: "User account created", user: "john.doe@company.com", time: "2 min ago", type: "success" },
                  { action: "Failed login attempt", user: "admin@company.com", time: "5 min ago", type: "error" },
                  { action: "Password changed", user: "jane.smith@company.com", time: "12 min ago", type: "info" },
                  { action: "New software installed", user: "WORKSTATION-047", time: "25 min ago", type: "warning" },
                  { action: "Policy updated", user: "Domain Policy 01", time: "1 hour ago", type: "info" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === "success" ? "bg-success" :
                      item.type === "error" ? "bg-critical" :
                      item.type === "warning" ? "bg-warning" :
                      "bg-primary"
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
