import { useState } from "react";
import {
  Users,
  Building2,
  MoreVertical,
  Plus,
  Search,
  Filter,
  Key,
  Activity,
  HardDrive,
  Trash2,
  Edit,
  Eye,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: "active" | "inactive" | "pending";
  machines: number;
  users: number;
  apiKeys: number;
  dataUsage: string;
  createdAt: string;
}

const mockTenants: Tenant[] = [
  {
    id: "1",
    name: "Acme Corporation",
    domain: "acme.com",
    status: "active",
    machines: 450,
    users: 1200,
    apiKeys: 3,
    dataUsage: "2.4 GB",
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    name: "TechStart Inc",
    domain: "techstart.io",
    status: "active",
    machines: 125,
    users: 340,
    apiKeys: 2,
    dataUsage: "890 MB",
    createdAt: "2025-02-20",
  },
  {
    id: "3",
    name: "Global Finance Ltd",
    domain: "globalfinance.com",
    status: "active",
    machines: 890,
    users: 2100,
    apiKeys: 5,
    dataUsage: "5.2 GB",
    createdAt: "2024-11-08",
  },
  {
    id: "4",
    name: "Healthcare Plus",
    domain: "healthcareplus.org",
    status: "pending",
    machines: 0,
    users: 0,
    apiKeys: 1,
    dataUsage: "0 MB",
    createdAt: "2025-12-28",
  },
  {
    id: "5",
    name: "Retail Solutions",
    domain: "retailsolutions.net",
    status: "inactive",
    machines: 230,
    users: 560,
    apiKeys: 2,
    dataUsage: "1.1 GB",
    createdAt: "2024-08-12",
  },
];

export default function Tenants() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTenantName, setNewTenantName] = useState("");
  const [newTenantDomain, setNewTenantDomain] = useState("");

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTenant = () => {
    const newTenant: Tenant = {
      id: String(tenants.length + 1),
      name: newTenantName,
      domain: newTenantDomain,
      status: "pending",
      machines: 0,
      users: 0,
      apiKeys: 0,
      dataUsage: "0 MB",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTenants([...tenants, newTenant]);
    setCreateDialogOpen(false);
    setNewTenantName("");
    setNewTenantDomain("");
    toast({
      title: "Tenant Created",
      description: `"${newTenantName}" has been added successfully.`,
    });
  };

  const handleDeleteTenant = (id: string) => {
    setTenants(tenants.filter((t) => t.id !== id));
    toast({
      title: "Tenant Deleted",
      description: "The tenant has been removed.",
    });
  };

  const getStatusBadge = (status: Tenant["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/20 text-success border-success/30">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Pending</Badge>;
    }
  };

  return (
    <>
      <Header title="Tenant Management" subtitle="Manage organizations and their access" />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Tenants</p>
              <p className="text-2xl font-bold text-foreground">{tenants.length}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-success">
                {tenants.filter((t) => t.status === "active").length}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Machines</p>
              <p className="text-2xl font-bold text-primary">
                {tenants.reduce((sum, t) => sum + t.machines, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Data Usage</p>
              <p className="text-2xl font-bold text-foreground">9.6 GB</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tenants..."
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button
              className="bg-gradient-primary text-primary-foreground"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tenant
            </Button>
          </div>

          {/* Tenants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTenants.map((tenant) => (
              <div
                key={tenant.id}
                className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{tenant.name}</h3>
                      <p className="text-sm text-muted-foreground">{tenant.domain}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Key className="w-4 h-4 mr-2" />
                        Manage API Keys
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteTenant(tenant.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mb-4">{getStatusBadge(tenant.status)}</div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <HardDrive className="w-4 h-4" />
                    <span>{tenant.machines} machines</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{tenant.users} users</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Key className="w-4 h-4" />
                    <span>{tenant.apiKeys} API keys</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Activity className="w-4 h-4" />
                    <span>{tenant.dataUsage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Tenant Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tenant</DialogTitle>
            <DialogDescription>
              Add a new organization to the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input
                value={newTenantName}
                onChange={(e) => setNewTenantName(e.target.value)}
                placeholder="e.g., Acme Corporation"
              />
            </div>
            <div className="space-y-2">
              <Label>Domain</Label>
              <Input
                value={newTenantDomain}
                onChange={(e) => setNewTenantDomain(e.target.value)}
                placeholder="e.g., acme.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTenant}>Create Tenant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
