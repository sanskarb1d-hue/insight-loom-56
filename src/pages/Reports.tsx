import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Calendar,
  Clock,
  MoreVertical,
  Play,
  Trash2,
  Edit,
  Download,
  Search,
  Filter,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

interface SavedReport {
  id: string;
  name: string;
  description: string;
  filters: string;
  createdAt: string;
  lastRun: string;
  schedule?: string;
}

const mockReports: SavedReport[] = [
  {
    id: "1",
    name: "Failed Login Attempts",
    description: "All failed login attempts across the network",
    filters: "ACTION=FailedLogin",
    createdAt: "2025-12-20",
    lastRun: "2 hours ago",
    schedule: "Daily at 9:00 AM",
  },
  {
    id: "2",
    name: "Password Expiry Report",
    description: "Users with expired or expiring passwords",
    filters: "ACTION=PasswordExpired WHERE=Workstation",
    createdAt: "2025-12-18",
    lastRun: "Yesterday",
    schedule: "Weekly on Monday",
  },
  {
    id: "3",
    name: "Software Inventory",
    description: "All installed software across workstations",
    filters: "WHAT=Software ACTION=Installed",
    createdAt: "2025-12-15",
    lastRun: "3 days ago",
  },
  {
    id: "4",
    name: "Privileged Users Audit",
    description: "Users in administrative groups",
    filters: "WHAT=LocalUser ACTION=MemberOf WHO=Administrators",
    createdAt: "2025-12-10",
    lastRun: "1 week ago",
    schedule: "Monthly",
  },
  {
    id: "5",
    name: "File Deletions",
    description: "All file deletion events on file servers",
    filters: "WHAT=File ACTION=Deleted WHERE=FileServer",
    createdAt: "2025-12-05",
    lastRun: "2 hours ago",
    schedule: "Daily at 6:00 PM",
  },
];

export default function Reports() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState<SavedReport[]>(mockReports);

  const filteredReports = reports.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRun = (report: SavedReport) => {
    navigate(`/search?q=${encodeURIComponent(report.filters)}`);
  };

  const handleDelete = (id: string) => {
    setReports(reports.filter((r) => r.id !== id));
    toast({
      title: "Report Deleted",
      description: "The report has been removed.",
    });
  };

  const handleDownload = (report: SavedReport) => {
    toast({
      title: "Download Started",
      description: `Generating "${report.name}" as CSV...`,
    });
  };

  return (
    <>
      <Header title="Saved Reports" subtitle="View and manage your saved search reports" />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Toolbar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reports..."
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Reports Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[300px]">Report Name</TableHead>
                  <TableHead>Filters</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow
                    key={report.id}
                    className="cursor-pointer"
                    onClick={() => handleRun(report)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{report.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                        {report.filters}
                      </code>
                    </TableCell>
                    <TableCell>
                      {report.schedule ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{report.schedule}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not scheduled</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{report.lastRun}</span>
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRun(report)}>
                            <Play className="w-4 h-4 mr-2" />
                            Run Now
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(report)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(report.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
