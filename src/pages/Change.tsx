import { useState } from "react";
import {
  UserPlus,
  Monitor,
  Users,
  Building2,
  Pencil,
  RotateCcw,
  ChevronRight,
  Plus,
  Search,
  Trash2,
  Eye,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ChangeAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  category: "new" | "modify" | "restore";
  type: "user" | "computer" | "group" | "ou";
}

const changeActions: ChangeAction[] = [
  // New
  { id: "new-user", icon: <UserPlus className="w-5 h-5" />, label: "User", description: "Create a new user account", category: "new", type: "user" },
  { id: "new-computer", icon: <Monitor className="w-5 h-5" />, label: "Computer", description: "Register a new computer", category: "new", type: "computer" },
  { id: "new-group", icon: <Users className="w-5 h-5" />, label: "Group", description: "Create a new security group", category: "new", type: "group" },
  { id: "new-ou", icon: <Building2 className="w-5 h-5" />, label: "OU", description: "Create an Organizational Unit", category: "new", type: "ou" },
  // Modify
  { id: "mod-user", icon: <UserPlus className="w-5 h-5" />, label: "User", description: "View and modify user details", category: "modify", type: "user" },
  { id: "mod-computer", icon: <Monitor className="w-5 h-5" />, label: "Computer", description: "View and modify computer details", category: "modify", type: "computer" },
  { id: "mod-group", icon: <Users className="w-5 h-5" />, label: "Group", description: "Manage group members", category: "modify", type: "group" },
  { id: "mod-ou", icon: <Building2 className="w-5 h-5" />, label: "OU", description: "View and modify OU details", category: "modify", type: "ou" },
  // Restore
  { id: "restore-user", icon: <UserPlus className="w-5 h-5" />, label: "User Deleted", description: "View and restore deleted users", category: "restore", type: "user" },
  { id: "restore-group", icon: <Users className="w-5 h-5" />, label: "Group Deleted", description: "View and restore deleted groups", category: "restore", type: "group" },
  { id: "restore-ou", icon: <Building2 className="w-5 h-5" />, label: "OU Deleted", description: "View and restore deleted OUs", category: "restore", type: "ou" },
];

// Mock data for lists
const mockUsers = [
  { id: "1", name: "John Doe", loginName: "john.doe", email: "john.doe@company.com", department: "IT", status: "enabled", lastModified: "2026-01-20" },
  { id: "2", name: "Jane Smith", loginName: "jane.smith", email: "jane.smith@company.com", department: "HR", status: "enabled", lastModified: "2026-01-19" },
  { id: "3", name: "Bob Wilson", loginName: "bob.wilson", email: "bob.wilson@company.com", department: "Finance", status: "disabled", lastModified: "2026-01-18" },
];

const mockComputers = [
  { id: "1", name: "WORKSTATION-001", os: "Windows 11", ip: "192.168.1.101", status: "online", lastSeen: "2026-01-21 10:30" },
  { id: "2", name: "WORKSTATION-002", os: "Windows 10", ip: "192.168.1.102", status: "online", lastSeen: "2026-01-21 10:28" },
  { id: "3", name: "SERVER-DC01", os: "Windows Server 2022", ip: "192.168.1.10", status: "online", lastSeen: "2026-01-21 10:30" },
];

const mockGroups = [
  { id: "1", name: "Domain Admins", members: 5, type: "Security", scope: "Global" },
  { id: "2", name: "IT Department", members: 12, type: "Security", scope: "Universal" },
  { id: "3", name: "All Users", members: 156, type: "Distribution", scope: "Global" },
];

const mockOUs = [
  { id: "1", name: "Users", path: "OU=Users,DC=company,DC=com", objects: 156 },
  { id: "2", name: "Computers", path: "OU=Computers,DC=company,DC=com", objects: 89 },
  { id: "3", name: "Servers", path: "OU=Servers,DC=company,DC=com", objects: 12 },
];

const mockDeletedUsers = [
  { id: "1", name: "Former Employee", loginName: "former.employee", deletedOn: "2026-01-15", deletedBy: "admin" },
  { id: "2", name: "Test Account", loginName: "test.account", deletedOn: "2026-01-10", deletedBy: "system" },
];

export default function Change() {
  const [activeTab, setActiveTab] = useState("new");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ChangeAction | null>(null);
  const [viewMode, setViewMode] = useState<"actions" | "list">("actions");
  const [selectedListType, setSelectedListType] = useState<string | null>(null);

  const handleActionClick = (action: ChangeAction) => {
    if (action.category === "modify" || action.category === "restore") {
      setSelectedListType(action.id);
      setViewMode("list");
    } else {
      setSelectedAction(action);
      setDialogOpen(true);
    }
  };

  const handleCreate = () => {
    toast({
      title: `${selectedAction?.label} Created`,
      description: `New ${selectedAction?.label.toLowerCase()} has been created successfully.`,
    });
    setDialogOpen(false);
  };

  const handleRestore = (name: string) => {
    toast({
      title: "Object Restored",
      description: `${name} has been restored successfully.`,
    });
  };

  const renderActionCard = (action: ChangeAction) => (
    <Card
      key={action.id}
      className="cursor-pointer hover:bg-accent transition-colors group"
      onClick={() => handleActionClick(action)}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          action.category === "new" && "bg-success/10 text-success",
          action.category === "modify" && "bg-primary/10 text-primary",
          action.category === "restore" && "bg-warning/10 text-warning"
        )}>
          {action.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
            {action.label}
          </h4>
          <p className="text-sm text-muted-foreground">{action.description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </CardContent>
    </Card>
  );

  const renderList = () => {
    if (!selectedListType) return null;

    const isModify = selectedListType.startsWith("mod-");
    const isRestore = selectedListType.startsWith("restore-");
    const type = selectedListType.split("-")[1];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setViewMode("actions")}>
            ← Back to Actions
          </Button>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {type === "user" && !isRestore && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Login Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.loginName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === "enabled" ? "default" : "secondary"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastModified}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {type === "user" && isRestore && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Login Name</TableHead>
                    <TableHead>Deleted On</TableHead>
                    <TableHead>Deleted By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDeletedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.loginName}</TableCell>
                      <TableCell>{user.deletedOn}</TableCell>
                      <TableCell>{user.deletedBy}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRestore(user.name)}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Restore
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {type === "computer" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Computer Name</TableHead>
                    <TableHead>Operating System</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockComputers.map((computer) => (
                    <TableRow key={computer.id}>
                      <TableCell className="font-medium">{computer.name}</TableCell>
                      <TableCell>{computer.os}</TableCell>
                      <TableCell className="font-mono text-sm">{computer.ip}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-success">
                          {computer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{computer.lastSeen}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {type === "group" && !isRestore && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group Name</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockGroups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">{group.name}</TableCell>
                      <TableCell>{group.members}</TableCell>
                      <TableCell>{group.type}</TableCell>
                      <TableCell>{group.scope}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Users className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {type === "ou" && !isRestore && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>OU Name</TableHead>
                    <TableHead>Distinguished Name</TableHead>
                    <TableHead>Objects</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOUs.map((ou) => (
                    <TableRow key={ou.id}>
                      <TableCell className="font-medium">{ou.name}</TableCell>
                      <TableCell className="font-mono text-sm">{ou.path}</TableCell>
                      <TableCell>{ou.objects}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      <Header title="Change Management" subtitle="Create, modify, and restore directory objects" />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {viewMode === "actions" ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-card border border-border">
                <TabsTrigger value="new" className="gap-2">
                  <Plus className="w-4 h-4" />
                  New
                </TabsTrigger>
                <TabsTrigger value="modify" className="gap-2">
                  <Pencil className="w-4 h-4" />
                  Modify
                </TabsTrigger>
                <TabsTrigger value="restore" className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Restore
                </TabsTrigger>
              </TabsList>

              <TabsContent value="new" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-success" />
                      Create New Objects
                    </CardTitle>
                    <CardDescription>
                      Add new users, computers, groups, or organizational units to your directory
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {changeActions
                      .filter((a) => a.category === "new")
                      .map(renderActionCard)}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="modify" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pencil className="w-5 h-5 text-primary" />
                      Modify Existing Objects
                    </CardTitle>
                    <CardDescription>
                      View and edit details of existing directory objects
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {changeActions
                      .filter((a) => a.category === "modify")
                      .map(renderActionCard)}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="restore" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RotateCcw className="w-5 h-5 text-warning" />
                      Restore Deleted Objects
                    </CardTitle>
                    <CardDescription>
                      Recover previously deleted users, groups, or organizational units
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {changeActions
                      .filter((a) => a.category === "restore")
                      .map(renderActionCard)}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            renderList()
          )}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New {selectedAction?.label}</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new {selectedAction?.label.toLowerCase()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedAction?.type === "user" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Login Name</Label>
                  <Input placeholder="john.doe" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="john.doe@company.com" />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {selectedAction?.type === "computer" && (
              <>
                <div className="space-y-2">
                  <Label>Computer Name</Label>
                  <Input placeholder="WORKSTATION-001" />
                </div>
                <div className="space-y-2">
                  <Label>Operating System</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select OS" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="win11">Windows 11</SelectItem>
                      <SelectItem value="win10">Windows 10</SelectItem>
                      <SelectItem value="winserver2022">Windows Server 2022</SelectItem>
                      <SelectItem value="winserver2019">Windows Server 2019</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>IP Address</Label>
                  <Input placeholder="192.168.1.xxx" />
                </div>
              </>
            )}
            {selectedAction?.type === "group" && (
              <>
                <div className="space-y-2">
                  <Label>Group Name</Label>
                  <Input placeholder="My Group" />
                </div>
                <div className="space-y-2">
                  <Label>Group Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="distribution">Distribution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Group Scope</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global</SelectItem>
                      <SelectItem value="universal">Universal</SelectItem>
                      <SelectItem value="domain-local">Domain Local</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {selectedAction?.type === "ou" && (
              <>
                <div className="space-y-2">
                  <Label>OU Name</Label>
                  <Input placeholder="New OU" />
                </div>
                <div className="space-y-2">
                  <Label>Parent OU</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="root">Root (DC=company,DC=com)</SelectItem>
                      <SelectItem value="users">OU=Users</SelectItem>
                      <SelectItem value="computers">OU=Computers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Description of this OU" />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} className="bg-gradient-primary">
              Create {selectedAction?.label}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
