import { useState } from "react";
import {
  Search,
  Download,
  Calendar,
  Filter,
  ChevronDown,
  Eye,
  User,
  Clock,
  Monitor,
  Shield,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  category: string;
  target: string;
  ipAddress: string;
  device: string;
  status: "success" | "failed" | "warning";
  details: string;
}

const mockAuditEvents: AuditEvent[] = [
  {
    id: "1",
    timestamp: "2026-01-21 10:45:23",
    action: "Login",
    category: "Authentication",
    target: "Portal",
    ipAddress: "192.168.1.100",
    device: "Windows 11 - Chrome",
    status: "success",
    details: "Successful login from trusted device",
  },
  {
    id: "2",
    timestamp: "2026-01-21 10:42:11",
    action: "Password Changed",
    category: "Security",
    target: "Account",
    ipAddress: "192.168.1.100",
    device: "Windows 11 - Chrome",
    status: "success",
    details: "Password updated successfully",
  },
  {
    id: "3",
    timestamp: "2026-01-20 15:30:45",
    action: "Report Downloaded",
    category: "Data Access",
    target: "Weekly Security Report",
    ipAddress: "192.168.1.100",
    device: "Windows 11 - Chrome",
    status: "success",
    details: "Downloaded report in PDF format",
  },
  {
    id: "4",
    timestamp: "2026-01-20 14:22:18",
    action: "Settings Modified",
    category: "Configuration",
    target: "Notification Preferences",
    ipAddress: "192.168.1.100",
    device: "Windows 11 - Chrome",
    status: "success",
    details: "Email notifications enabled",
  },
  {
    id: "5",
    timestamp: "2026-01-20 09:15:33",
    action: "Login Failed",
    category: "Authentication",
    target: "Portal",
    ipAddress: "203.45.67.89",
    device: "Unknown",
    status: "failed",
    details: "Invalid password - 2 attempts remaining",
  },
  {
    id: "6",
    timestamp: "2026-01-19 16:45:00",
    action: "MFA Enrolled",
    category: "Security",
    target: "Account",
    ipAddress: "192.168.1.100",
    device: "Windows 11 - Chrome",
    status: "success",
    details: "Authenticator app configured",
  },
  {
    id: "7",
    timestamp: "2026-01-19 11:30:22",
    action: "Search Performed",
    category: "Data Access",
    target: "User Logs",
    ipAddress: "192.168.1.100",
    device: "Windows 11 - Chrome",
    status: "success",
    details: "Query: failed login attempts last 7 days",
  },
  {
    id: "8",
    timestamp: "2026-01-18 13:20:15",
    action: "API Key Generated",
    category: "Security",
    target: "API Access",
    ipAddress: "192.168.1.100",
    device: "Windows 11 - Chrome",
    status: "warning",
    details: "New API key created - expires in 90 days",
  },
];

export default function SelfAuditTrail() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7days");

  const filteredEvents = mockAuditEvents.filter((event) => {
    if (categoryFilter !== "all" && event.category !== categoryFilter) return false;
    if (statusFilter !== "all" && event.status !== statusFilter) return false;
    if (searchQuery && !event.action.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !event.target.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusBadge = (status: AuditEvent["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-success text-success-foreground">Success</Badge>;
      case "failed":
        return <Badge className="bg-critical text-critical-foreground">Failed</Badge>;
      case "warning":
        return <Badge className="bg-warning text-warning-foreground">Warning</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Authentication":
        return <User className="w-4 h-4" />;
      case "Security":
        return <Shield className="w-4 h-4" />;
      case "Data Access":
        return <Eye className="w-4 h-4" />;
      case "Configuration":
        return <Monitor className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Summary statistics
  const stats = {
    totalEvents: mockAuditEvents.length,
    successEvents: mockAuditEvents.filter((e) => e.status === "success").length,
    failedEvents: mockAuditEvents.filter((e) => e.status === "failed").length,
    warningEvents: mockAuditEvents.filter((e) => e.status === "warning").length,
  };

  return (
    <>
      <Header
        title="Self Audit Trail"
        subtitle="View your personal activity and security audit log"
      />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                    <p className="text-2xl font-bold">{stats.totalEvents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10 text-success">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Successful</p>
                    <p className="text-2xl font-bold text-success">{stats.successEvents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-critical/10 text-critical">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Failed</p>
                    <p className="text-2xl font-bold text-critical">{stats.failedEvents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10 text-warning">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Warnings</p>
                    <p className="text-2xl font-bold text-warning">{stats.warningEvents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Authentication">Authentication</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Data Access">Data Access</SelectItem>
                    <SelectItem value="Configuration">Configuration</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Events Table */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                Showing {filteredEvents.length} events from the last {dateRange === "7days" ? "7 days" : dateRange}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-mono text-xs">
                        {event.timestamp}
                      </TableCell>
                      <TableCell className="font-medium">{event.action}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(event.category)}
                          <span className="text-sm">{event.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>{event.target}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {event.ipAddress}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {event.device}
                      </TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Copy Event ID</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
