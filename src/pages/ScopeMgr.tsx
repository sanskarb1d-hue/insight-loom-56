import { useState } from "react";
import {
  Server,
  FolderOpen,
  Cloud,
  Monitor,
  Check,
  X,
  Settings,
  ChevronRight,
  Shield,
  Eye,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AuditScope {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  configUrl?: string;
}

interface ScopeCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  scopes: AuditScope[];
}

const scopeCategories: ScopeCategory[] = [
  {
    id: "active-directory",
    name: "Active Directory",
    icon: <Server className="w-6 h-6" />,
    description: "Monitor Active Directory changes and user activities",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    scopes: [
      { id: "ad-password-reset", name: "Password Reset", description: "Track password reset events", enabled: true },
      { id: "ad-user-self-service", name: "User Self-Service Attribute Setting", description: "Monitor user profile changes", enabled: true, configUrl: "/admin/formcontrol" },
      { id: "ad-group-changes", name: "Group Membership Changes", description: "Track group additions and removals", enabled: true },
      { id: "ad-gpo-changes", name: "GPO Changes", description: "Monitor Group Policy modifications", enabled: false },
      { id: "ad-schema-changes", name: "Schema Changes", description: "Track AD schema modifications", enabled: false },
    ],
  },
  {
    id: "file-server",
    name: "File Server",
    icon: <FolderOpen className="w-6 h-6" />,
    description: "Audit file and folder access and permission changes",
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    scopes: [
      { id: "fs-file-audit", name: "File and Folder Audit", description: "Track file access and modifications", enabled: true },
      { id: "fs-permission-state", name: "File and Folder Permission State", description: "Monitor permission changes", enabled: true },
      { id: "fs-share-audit", name: "Share Access Audit", description: "Track network share access", enabled: false },
    ],
  },
  {
    id: "m365",
    name: "M365",
    icon: <Cloud className="w-6 h-6" />,
    description: "Microsoft 365 and cloud service auditing",
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    scopes: [
      { id: "m365-entra", name: "Entra ID Audit", description: "Azure AD / Entra ID changes", enabled: true },
      { id: "m365-copilot", name: "Copilot Audit", description: "Microsoft Copilot usage tracking", enabled: false },
      { id: "m365-teams", name: "Teams Audit", description: "Microsoft Teams activity", enabled: true },
      { id: "m365-sharepoint", name: "SharePoint Online Audit", description: "SharePoint document access", enabled: true },
      { id: "m365-onedrive", name: "OneDrive Audit", description: "OneDrive file operations", enabled: true },
      { id: "m365-exchange", name: "Exchange Online Audit", description: "Email and mailbox activities", enabled: true },
    ],
  },
  {
    id: "workstation",
    name: "Workstation",
    icon: <Monitor className="w-6 h-6" />,
    description: "Local workstation monitoring and security",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    scopes: [
      { id: "ws-password-reset", name: "Password Reset", description: "Local password resets", enabled: true },
      { id: "ws-password-policy", name: "Password Policy", description: "Password policy compliance", enabled: true },
      { id: "ws-local-users", name: "Local Users and Groups", description: "Local account changes", enabled: true },
      { id: "ws-services", name: "Services Running with Domain Account", description: "Service account monitoring", enabled: false },
      { id: "ws-software", name: "Software Installed", description: "Software installation tracking", enabled: true },
      { id: "ws-rsop", name: "RSOP", description: "Resultant Set of Policy", enabled: false },
      { id: "ws-system-info", name: "System Info", description: "System configuration changes", enabled: true },
      { id: "ws-event-log", name: "Event Log Collection", description: "Windows event log forwarding", enabled: true },
    ],
  },
];

export default function ScopeMgr() {
  const [scopes, setScopes] = useState<ScopeCategory[]>(scopeCategories);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("active-directory");

  const handleToggleScope = (categoryId: string, scopeId: string) => {
    setScopes((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            scopes: cat.scopes.map((scope) => {
              if (scope.id === scopeId) {
                const newEnabled = !scope.enabled;
                toast({
                  title: newEnabled ? "Scope Enabled" : "Scope Disabled",
                  description: `${scope.name} has been ${newEnabled ? "enabled" : "disabled"}.`,
                });
                return { ...scope, enabled: newEnabled };
              }
              return scope;
            }),
          };
        }
        return cat;
      })
    );
  };

  const getEnabledCount = (category: ScopeCategory) => {
    return category.scopes.filter((s) => s.enabled).length;
  };

  return (
    <>
      <Header
        title="Scope Manager"
        subtitle="Configure audit scopes for different data sources"
      />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {scopes.map((category) => (
              <Card
                key={category.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  expandedCategory === category.id && "ring-2 ring-primary"
                )}
                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn("p-2 rounded-lg border", category.color)}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {getEnabledCount(category)} / {category.scopes.length} enabled
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {category.scopes.slice(0, 5).map((scope) => (
                        <div
                          key={scope.id}
                          className={cn(
                            "w-2 h-2 rounded-full",
                            scope.enabled ? "bg-success" : "bg-muted"
                          )}
                        />
                      ))}
                      {category.scopes.length > 5 && (
                        <span className="text-xs text-muted-foreground ml-1">
                          +{category.scopes.length - 5}
                        </span>
                      )}
                    </div>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform",
                        expandedCategory === category.id && "rotate-90"
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed View */}
          {expandedCategory && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-3 rounded-lg border",
                        scopes.find((c) => c.id === expandedCategory)?.color
                      )}
                    >
                      {scopes.find((c) => c.id === expandedCategory)?.icon}
                    </div>
                    <div>
                      <CardTitle>
                        {scopes.find((c) => c.id === expandedCategory)?.name}
                      </CardTitle>
                      <CardDescription>
                        {scopes.find((c) => c.id === expandedCategory)?.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Logs
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {scopes
                    .find((c) => c.id === expandedCategory)
                    ?.scopes.map((scope) => (
                      <div
                        key={scope.id}
                        className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              scope.enabled
                                ? "bg-success/10 text-success"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {scope.enabled ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <X className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">
                              {scope.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {scope.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {scope.configUrl && (
                            <Button variant="ghost" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                          )}
                          <Badge variant={scope.enabled ? "default" : "secondary"}>
                            {scope.enabled ? "Active" : "Inactive"}
                          </Badge>
                          <Switch
                            checked={scope.enabled}
                            onCheckedChange={() =>
                              handleToggleScope(expandedCategory, scope.id)
                            }
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Audit Scope Matrix
              </CardTitle>
              <CardDescription>
                Overview of all configured audit scopes across categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground bg-muted/30">
                        Active Directory
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground bg-muted/30">
                        File Server
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground bg-muted/30">
                        M365
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground bg-muted/30">
                        Workstation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {scopes.map((category) => (
                        <td key={category.id} className="py-3 px-4 align-top">
                          <ul className="space-y-2">
                            {category.scopes.map((scope) => (
                              <li
                                key={scope.id}
                                className="flex items-center gap-2 text-sm"
                              >
                                <div
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    scope.enabled ? "bg-success" : "bg-muted"
                                  )}
                                />
                                <span
                                  className={cn(
                                    scope.enabled
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {scope.name}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
