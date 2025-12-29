import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  Bell,
  Save,
  Mail,
  MoreVertical,
  Calendar,
  Clock,
  X,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FilterValue {
  who?: string;
  action?: string;
  what?: string;
  when?: string;
  where?: string;
}

interface SearchResult {
  id: string;
  timestamp: string;
  who: string;
  action: string;
  what: string;
  where: string;
  details: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
}

const whoOptions = ["Any", "admin", "john.doe", "jane.smith", "system", "WORKSTATION-001"];
const actionOptions = ["Any", "Created", "Deleted", "Modified", "Read", "PermissionChanged", "Installed", "Enabled", "Disabled", "PasswordChanged", "PasswordExpired", "FailedLogin"];
const whatOptions = ["Any", "User", "LocalUser", "File", "Folder", "Software", "Machine", "Policy"];
const whenOptions = ["Last 1 hour", "Last 24 hours", "Last 7 days", "Last 30 days", "Last 90 days", "Custom"];
const whereOptions = ["Any", "Workstation", "FileServer", "DomainController", "Server"];

const mockResults: SearchResult[] = [
  { id: "1", timestamp: "2025-12-29 10:45:23", who: "admin", action: "PasswordChanged", what: "LocalUser", where: "WORKSTATION-047", details: "Password successfully changed for user account", severity: "info" },
  { id: "2", timestamp: "2025-12-29 10:42:11", who: "system", action: "FailedLogin", what: "User", where: "DC-01", details: "Failed login attempt from IP 192.168.1.105", severity: "critical" },
  { id: "3", timestamp: "2025-12-29 10:38:45", who: "john.doe", action: "Deleted", what: "File", where: "FileServer-01", details: "Deleted file: /shared/reports/quarterly.xlsx", severity: "high" },
  { id: "4", timestamp: "2025-12-29 10:35:02", who: "system", action: "Installed", what: "Software", where: "WORKSTATION-023", details: "Installed application: Visual Studio Code v1.85", severity: "medium" },
  { id: "5", timestamp: "2025-12-29 10:30:18", who: "jane.smith", action: "PermissionChanged", what: "Folder", where: "FileServer-02", details: "Changed permissions on /finance/budgets", severity: "high" },
  { id: "6", timestamp: "2025-12-29 10:25:44", who: "admin", action: "Created", what: "LocalUser", where: "DC-01", details: "Created new user account: new.employee@company.com", severity: "info" },
  { id: "7", timestamp: "2025-12-29 10:20:33", who: "system", action: "PasswordExpired", what: "LocalUser", where: "WORKSTATION-012", details: "Password expired for user: legacy.account", severity: "medium" },
  { id: "8", timestamp: "2025-12-29 10:15:22", who: "WORKSTATION-001", action: "Enabled", what: "LocalUser", where: "Workstation", details: "Enabled local administrator account", severity: "high" },
];

export default function SmartSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState<FilterValue>({
    who: "Any",
    action: "Any",
    what: "Any",
    when: "Last 24 hours",
    where: "Any",
  });
  const [results, setResults] = useState<SearchResult[]>(mockResults);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [alertName, setAlertName] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      // Parse query parameters into filters
      const parts = q.split(" ");
      const newFilters: FilterValue = { ...filters };
      parts.forEach((part) => {
        const [key, value] = part.split("=");
        if (key && value) {
          const filterKey = key.toLowerCase() as keyof FilterValue;
          if (filterKey in newFilters) {
            newFilters[filterKey] = value;
          }
        }
      });
      setFilters(newFilters);
    }
  }, [searchParams]);

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      // Filter results based on current filters
      const filtered = mockResults.filter((r) => {
        if (filters.who !== "Any" && r.who !== filters.who) return false;
        if (filters.action !== "Any" && r.action !== filters.action) return false;
        if (filters.what !== "Any" && r.what !== filters.what) return false;
        if (filters.where !== "Any" && !r.where.includes(filters.where)) return false;
        return true;
      });
      setResults(filtered);
    }, 500);
  };

  const handleSaveSearch = () => {
    toast({
      title: "Report Saved",
      description: `"${reportName}" has been saved to your reports.`,
    });
    setSaveDialogOpen(false);
    setReportName("");
  };

  const handleSetAlert = () => {
    toast({
      title: "Alert Created",
      description: `Alert "${alertName}" has been configured.`,
    });
    setAlertDialogOpen(false);
    setAlertName("");
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your report is being generated as CSV.",
    });
  };

  const handleSendEmail = () => {
    toast({
      title: "Email Scheduled",
      description: "Report will be sent to your email.",
    });
  };

  const clearFilter = (key: keyof FilterValue) => {
    setFilters({ ...filters, [key]: "Any" });
  };

  const activeFiltersCount = Object.values(filters).filter((v) => v !== "Any").length - 1; // -1 for 'when' which always has a value

  const getSeverityColor = (severity: SearchResult["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-critical/20 text-critical border-critical/30";
      case "high":
        return "bg-high/20 text-high border-high/30";
      case "medium":
        return "bg-warning/20 text-warning border-warning/30";
      case "low":
        return "bg-primary/20 text-primary border-primary/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <>
      <Header title="Smart Search" subtitle="Search and analyze your logs with intelligent filters" />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search logs... (e.g., 'failed login', 'password changed')"
                  className="pl-10 h-12 text-base bg-background"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                className="h-12 px-6 bg-gradient-primary text-primary-foreground hover:opacity-90"
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
              <Button
                variant="outline"
                className="h-12 px-4"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12 px-4">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setSaveDialogOpen(true)}>
                    <Save className="w-4 h-4 mr-2" />
                    Save as Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setAlertDialogOpen(true)}>
                    <Bell className="w-4 h-4 mr-2" />
                    Set Alert
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSendEmail}>
                    <Mail className="w-4 h-4 mr-2" />
                    Schedule Email
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in New Window
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Who</Label>
                    <Select
                      value={filters.who}
                      onValueChange={(v) => setFilters({ ...filters, who: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {whoOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Action</Label>
                    <Select
                      value={filters.action}
                      onValueChange={(v) => setFilters({ ...filters, action: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {actionOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">What</Label>
                    <Select
                      value={filters.what}
                      onValueChange={(v) => setFilters({ ...filters, what: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {whatOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">When</Label>
                    <Select
                      value={filters.when}
                      onValueChange={(v) => setFilters({ ...filters, when: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {whenOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Where</Label>
                    <Select
                      value={filters.where}
                      onValueChange={(v) => setFilters({ ...filters, where: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {whereOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Active Filters Tags */}
                {activeFiltersCount > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {Object.entries(filters).map(([key, value]) => {
                      if (value === "Any" || key === "when") return null;
                      return (
                        <Badge
                          key={key}
                          variant="secondary"
                          className="px-3 py-1 cursor-pointer hover:bg-destructive/20"
                          onClick={() => clearFilter(key as keyof FilterValue)}
                        >
                          {key}: {value}
                          <X className="w-3 h-3 ml-2" />
                        </Badge>
                      );
                    })}
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setFilters({
                            who: "Any",
                            action: "Any",
                            what: "Any",
                            when: "Last 24 hours",
                            where: "Any",
                          })
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {results.length} results found
                </span>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {filters.when}
                </Badge>
              </div>
            </div>

            <div className="divide-y divide-border">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="px-4 py-4 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "px-2 py-1 rounded text-xs font-medium border",
                        getSeverityColor(result.severity)
                      )}
                    >
                      {result.severity}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-xs text-muted-foreground">
                          {result.timestamp}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {result.action}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {result.what}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground">{result.details}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>
                          <strong>Who:</strong> {result.who}
                        </span>
                        <span>
                          <strong>Where:</strong> {result.where}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Report Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Search as Report</DialogTitle>
            <DialogDescription>
              Save this search with the current filters to access it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Report Name</Label>
              <Input
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="e.g., Failed Login Attempts Report"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSearch}>Save Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Alert Dialog */}
      <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Alert</DialogTitle>
            <DialogDescription>
              Configure an alert based on this search. You'll be notified when new events match.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Alert Name</Label>
              <Input
                value={alertName}
                onChange={(e) => setAlertName(e.target.value)}
                placeholder="e.g., Critical Login Failures"
              />
            </div>
            <div className="space-y-2">
              <Label>Notification Method</Label>
              <Select defaultValue="email">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="slack">Slack</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAlertDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetAlert}>Create Alert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
