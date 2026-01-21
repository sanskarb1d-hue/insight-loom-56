import { useState } from "react";
import {
  Cloud,
  Server,
  Monitor,
  FolderOpen,
  Check,
  ExternalLink,
  Settings,
  Plus,
  ChevronRight,
  Shield,
  Key,
  Lock,
  RefreshCw,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "connected" | "disconnected" | "pending";
  docsUrl?: string;
  category: "identity" | "windows" | "files" | "cloud";
}

const integrations: Integration[] = [
  {
    id: "entra",
    name: "Microsoft Entra (Azure AD)",
    description: "OIDC integration for enterprise SSO with Azure Active Directory",
    icon: <Cloud className="w-6 h-6" />,
    status: "connected",
    docsUrl: "https://zitadel.com/docs/guides/integrate/identity-providers/azure-ad-oidc",
    category: "identity",
  },
  {
    id: "ldap",
    name: "Active Directory / LDAP",
    description: "Direct LDAP integration for on-premises Active Directory",
    icon: <Server className="w-6 h-6" />,
    status: "connected",
    docsUrl: "https://zitadel.com/docs/guides/integrate/identity-providers/ldap",
    category: "identity",
  },
  {
    id: "windows-machine",
    name: "Windows Machine",
    description: "Deploy agents to Windows workstations and servers",
    icon: <Monitor className="w-6 h-6" />,
    status: "connected",
    category: "windows",
  },
  {
    id: "m365",
    name: "Microsoft 365",
    description: "Connect to Microsoft 365 services for cloud auditing",
    icon: <Cloud className="w-6 h-6" />,
    status: "connected",
    category: "cloud",
  },
  {
    id: "file-folders",
    name: "File and Folders",
    description: "Configure file server auditing with custom rules",
    icon: <FolderOpen className="w-6 h-6" />,
    status: "connected",
    category: "files",
  },
];

export default function IntegrationPage() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("identity");

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigDialogOpen(true);
  };

  const handleSaveConfig = () => {
    toast({
      title: "Configuration Saved",
      description: `${selectedIntegration?.name} settings have been updated.`,
    });
    setConfigDialogOpen(false);
  };

  const handleTestConnection = () => {
    toast({
      title: "Testing Connection",
      description: "Connection test successful!",
    });
  };

  const renderIntegrationCard = (integration: Integration) => (
    <Card key={integration.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "p-3 rounded-lg",
                integration.status === "connected"
                  ? "bg-success/10 text-success"
                  : integration.status === "pending"
                  ? "bg-warning/10 text-warning"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {integration.icon}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{integration.name}</h3>
              <p className="text-sm text-muted-foreground">
                {integration.description}
              </p>
            </div>
          </div>
          <Badge
            variant={
              integration.status === "connected"
                ? "default"
                : integration.status === "pending"
                ? "secondary"
                : "outline"
            }
            className={cn(
              integration.status === "connected" && "bg-success text-success-foreground"
            )}
          >
            {integration.status === "connected" && <Check className="w-3 h-3 mr-1" />}
            {integration.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleConfigure(integration)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          {integration.docsUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a href={integration.docsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Documentation
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Header
        title="Integrations"
        subtitle="Connect identity providers, cloud services, and configure data sources"
      />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="identity" className="gap-2">
                <Shield className="w-4 h-4" />
                Identity Providers
              </TabsTrigger>
              <TabsTrigger value="windows" className="gap-2">
                <Monitor className="w-4 h-4" />
                Windows
              </TabsTrigger>
              <TabsTrigger value="cloud" className="gap-2">
                <Cloud className="w-4 h-4" />
                Cloud Services
              </TabsTrigger>
              <TabsTrigger value="files" className="gap-2">
                <FolderOpen className="w-4 h-4" />
                File & Folders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="identity" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations
                  .filter((i) => i.category === "identity")
                  .map(renderIntegrationCard)}
              </div>

              {/* Identity Provider Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Microsoft Entra (Azure AD) Configuration</CardTitle>
                  <CardDescription>
                    OIDC integration settings for enterprise SSO
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Provider Name</Label>
                      <Input value="Microsoft Provider" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Issuer URL</Label>
                      <Input
                        value="https://login.microsoftonline.com/{tenant-id}/v2.0"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Client ID</Label>
                      <Input type="password" value="••••••••••••••••" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Client Secret</Label>
                      <Input type="password" value="••••••••••••••••" readOnly />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleTestConnection}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Test Connection
                    </Button>
                    <Button variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View in ZITADEL
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Directory / LDAP Configuration</CardTitle>
                  <CardDescription>
                    Direct LDAP connection settings for on-premises AD
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Server</Label>
                      <Input value="ldap://dc01.company.com:389" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Base DN</Label>
                      <Input value="DC=company,DC=com" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Bind DN</Label>
                      <Input value="CN=ldap-service,OU=Service,DC=company,DC=com" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Bind Password</Label>
                      <Input type="password" value="••••••••••••••••" readOnly />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="windows" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations
                  .filter((i) => i.category === "windows")
                  .map(renderIntegrationCard)}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Windows Machine Configuration</CardTitle>
                  <CardDescription>
                    Agent deployment parameters for Windows endpoints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <Label className="text-muted-foreground">Tenant ID</Label>
                        <p className="text-sm font-mono">-TenantId</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Identifies which organization you are accessing
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Client ID</Label>
                        <p className="text-sm font-mono">-ClientId</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Identifies which application is making the request
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Thumbprint</Label>
                        <p className="text-sm font-mono">-CertificateThumbprint</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Proves identity using a locally installed certificate
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>PowerShell Installation Command</Label>
                      <div className="p-4 bg-slate-900 rounded-lg">
                        <code className="text-sm text-green-400 font-mono">
                          Install-Agent -TenantId "your-tenant-id" -ClientId "your-client-id" -CertificateThumbprint "your-thumbprint"
                        </code>
                      </div>
                      <Button variant="outline" size="sm">
                        Copy Command
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cloud" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations
                  .filter((i) => i.category === "cloud")
                  .map(renderIntegrationCard)}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Microsoft 365 Configuration</CardTitle>
                  <CardDescription>
                    Connect to M365 services for comprehensive cloud auditing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tenant ID</Label>
                        <Input value="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Application ID</Label>
                        <Input value="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" readOnly />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {["Entra ID", "Teams", "SharePoint", "Exchange", "OneDrive", "Copilot"].map(
                        (service) => (
                          <div
                            key={service}
                            className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg"
                          >
                            <Check className="w-4 h-4 text-success" />
                            <span className="text-sm">{service}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations
                  .filter((i) => i.category === "files")
                  .map(renderIntegrationCard)}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>File and Folders Audit Configuration</CardTitle>
                  <CardDescription>
                    Configure file server auditing rules and exclusions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Audit Scope</Label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Files</SelectItem>
                            <SelectItem value="sensitive">Sensitive Only</SelectItem>
                            <SelectItem value="custom">Custom Rules</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Permission State Scope</Label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Permissions</SelectItem>
                            <SelectItem value="changes">Changes Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>File Extensions Included</Label>
                        <Input placeholder=".doc, .docx, .xls, .xlsx, .pdf" />
                      </div>
                      <div className="space-y-2">
                        <Label>File Extensions Excluded</Label>
                        <Input placeholder=".tmp, .log, .bak" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Folders Included</Label>
                        <Input placeholder="/shared, /finance, /hr" />
                      </div>
                      <div className="space-y-2">
                        <Label>Folders Excluded</Label>
                        <Input placeholder="/temp, /cache" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Users Excluded</Label>
                      <Input placeholder="backup-service, antivirus-scan" />
                    </div>

                    <div className="space-y-2">
                      <Label>Operations to Monitor</Label>
                      <div className="flex flex-wrap gap-2">
                        {["Create", "Delete", "Modify", "Read", "Rename", "Permission Change"].map(
                          (op) => (
                            <Badge key={op} variant="secondary" className="cursor-pointer">
                              <Check className="w-3 h-3 mr-1" />
                              {op}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>

                    <Button className="bg-gradient-primary">Save Configuration</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Configuration Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Update the connection settings for this integration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Connection Name</Label>
              <Input defaultValue={selectedIntegration?.name} />
            </div>
            {selectedIntegration?.category === "identity" && (
              <>
                <div className="space-y-2">
                  <Label>Client ID</Label>
                  <Input placeholder="Enter client ID" />
                </div>
                <div className="space-y-2">
                  <Label>Client Secret</Label>
                  <Input type="password" placeholder="Enter client secret" />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfig} className="bg-gradient-primary">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
