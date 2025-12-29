import { useState } from "react";
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  Search,
  RefreshCw,
  Clock,
  Shield,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  tenant: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string;
  status: "active" | "expired" | "revoked";
}

const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production Agent Key",
    key: "lw_prod_sk_1234567890abcdef",
    tenant: "Acme Corporation",
    permissions: ["logs:write", "metrics:write"],
    createdAt: "2025-12-01",
    lastUsed: "2 minutes ago",
    status: "active",
  },
  {
    id: "2",
    name: "Development Key",
    key: "lw_dev_sk_abcdef1234567890",
    tenant: "Acme Corporation",
    permissions: ["logs:read", "logs:write"],
    createdAt: "2025-11-15",
    lastUsed: "1 hour ago",
    status: "active",
  },
  {
    id: "3",
    name: "TechStart Agent",
    key: "lw_prod_sk_qwerty0987654321",
    tenant: "TechStart Inc",
    permissions: ["logs:write"],
    createdAt: "2025-10-20",
    lastUsed: "5 hours ago",
    status: "active",
  },
  {
    id: "4",
    name: "Old Production Key",
    key: "lw_prod_sk_oldkey12345678",
    tenant: "Retail Solutions",
    permissions: ["logs:write", "metrics:write"],
    createdAt: "2024-06-10",
    lastUsed: "30 days ago",
    status: "expired",
  },
  {
    id: "5",
    name: "Revoked Test Key",
    key: "lw_test_sk_revoked999888",
    tenant: "Global Finance Ltd",
    permissions: ["logs:read"],
    createdAt: "2025-08-05",
    lastUsed: "Never",
    status: "revoked",
  },
];

export default function ApiKeys() {
  const [searchTerm, setSearchTerm] = useState("");
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyTenant, setNewKeyTenant] = useState("");

  const filteredKeys = apiKeys.filter(
    (k) =>
      k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.tenant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateKey = () => {
    const newKey: ApiKey = {
      id: String(apiKeys.length + 1),
      name: newKeyName,
      key: `lw_prod_sk_${Math.random().toString(36).substring(2, 18)}`,
      tenant: newKeyTenant,
      permissions: ["logs:write"],
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      status: "active",
    };
    setApiKeys([...apiKeys, newKey]);
    setCreateDialogOpen(false);
    setNewKeyName("");
    setNewKeyTenant("");
    toast({
      title: "API Key Created",
      description: "New API key has been generated. Make sure to copy it now.",
    });
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied",
      description: "API key copied to clipboard.",
    });
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(
      apiKeys.map((k) =>
        k.id === id ? { ...k, status: "revoked" as const } : k
      )
    );
    toast({
      title: "Key Revoked",
      description: "The API key has been revoked and can no longer be used.",
    });
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
    toast({
      title: "Key Deleted",
      description: "The API key has been permanently deleted.",
    });
  };

  const getStatusBadge = (status: ApiKey["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/20 text-success border-success/30">Active</Badge>;
      case "expired":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Expired</Badge>;
      case "revoked":
        return <Badge variant="secondary">Revoked</Badge>;
    }
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + "..." + key.substring(key.length - 4);
  };

  return (
    <>
      <Header title="API Key Management" subtitle="Generate and manage API keys for agent authentication" />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Keys</p>
              <p className="text-2xl font-bold text-foreground">{apiKeys.length}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Active Keys</p>
              <p className="text-2xl font-bold text-success">
                {apiKeys.filter((k) => k.status === "active").length}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Expired</p>
              <p className="text-2xl font-bold text-warning">
                {apiKeys.filter((k) => k.status === "expired").length}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Revoked</p>
              <p className="text-2xl font-bold text-muted-foreground">
                {apiKeys.filter((k) => k.status === "revoked").length}
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
                placeholder="Search API keys..."
                className="pl-9"
              />
            </div>
            <Button
              className="bg-gradient-primary text-primary-foreground"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate Key
            </Button>
          </div>

          {/* API Keys List */}
          <div className="space-y-4">
            {filteredKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className={cn(
                  "bg-card rounded-xl border border-border p-5 transition-all",
                  apiKey.status !== "active" && "opacity-60"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Key className="w-6 h-6 text-primary" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{apiKey.name}</h3>
                      {getStatusBadge(apiKey.status)}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <code className="text-sm bg-muted px-3 py-1.5 rounded font-mono text-muted-foreground">
                        {showKey === apiKey.id ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setShowKey(showKey === apiKey.id ? null : apiKey.id)
                        }
                      >
                        {showKey === apiKey.id ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyKey(apiKey.key)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                      <span>Tenant: {apiKey.tenant}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last used: {apiKey.lastUsed}
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {apiKey.permissions.join(", ")}
                      </span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleCopyKey(apiKey.key)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Key
                      </DropdownMenuItem>
                      {apiKey.status === "active" && (
                        <DropdownMenuItem onClick={() => handleRevokeKey(apiKey.id)}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Revoke Key
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteKey(apiKey.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Key Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
            <DialogDescription>
              Create a new API key for agent authentication.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Key Name</Label>
              <Input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production Agent Key"
              />
            </div>
            <div className="space-y-2">
              <Label>Tenant</Label>
              <Select value={newKeyTenant} onValueChange={setNewKeyTenant}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Acme Corporation">Acme Corporation</SelectItem>
                  <SelectItem value="TechStart Inc">TechStart Inc</SelectItem>
                  <SelectItem value="Global Finance Ltd">Global Finance Ltd</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateKey}>Generate Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
