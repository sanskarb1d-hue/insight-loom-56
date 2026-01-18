import { useState } from 'react';
import { 
  Building2, Users, Activity, Server, AlertTriangle, 
  TrendingUp, Globe, Shield, DollarSign, HardDrive,
  Play, Pause, Trash2, Mail, MoreVertical, Eye,
  CheckCircle, XCircle, Clock, Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data for tenants
const tenants = [
  { 
    id: 'tenant-acme', 
    name: 'ACME Corporation', 
    status: 'active', 
    plan: 'enterprise',
    users: 45, 
    machines: 156,
    logsGB: 23.5,
    alerts: 12,
    region: 'US-East',
    createdAt: '2024-01-15',
    lastActivity: '2 min ago'
  },
  { 
    id: 'tenant-globex', 
    name: 'Globex Industries', 
    status: 'active', 
    plan: 'professional',
    users: 28, 
    machines: 89,
    logsGB: 15.2,
    alerts: 5,
    region: 'EU-West',
    createdAt: '2024-02-20',
    lastActivity: '15 min ago'
  },
  { 
    id: 'tenant-initech', 
    name: 'Initech LLC', 
    status: 'trial', 
    plan: 'trial',
    users: 8, 
    machines: 24,
    logsGB: 2.1,
    alerts: 1,
    region: 'US-West',
    createdAt: '2024-03-01',
    lastActivity: '1 hour ago',
    trialEndsIn: 7
  },
  { 
    id: 'tenant-wayne', 
    name: 'Wayne Enterprises', 
    status: 'suspended', 
    plan: 'enterprise',
    users: 120, 
    machines: 450,
    logsGB: 78.9,
    alerts: 0,
    region: 'US-East',
    createdAt: '2023-11-10',
    lastActivity: '3 days ago'
  },
];

const platformMetrics = {
  totalTenants: 47,
  activeTenants: 42,
  trialTenants: 3,
  suspendedTenants: 2,
  totalUsers: 1250,
  totalMachines: 4580,
  totalLogsGB: 856.4,
  monthlyRevenue: 48500,
  alertsToday: 234,
  apiCalls: 1250000,
};

const SuperAdminDashboard = () => {
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>;
      case 'trial':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Trial</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Super Admin Dashboard</h1>
          <p className="text-slate-500">Platform-wide visibility and tenant management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Mail className="w-4 h-4" />
            Send Tenant Invite
          </Button>
          <Button className="gap-2 bg-primary text-white">
            <Building2 className="w-4 h-4" />
            Create Tenant
          </Button>
        </div>
      </div>

      {/* Platform Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="border-slate-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{platformMetrics.totalTenants}</p>
                <p className="text-xs text-slate-500">Total Tenants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{platformMetrics.activeTenants}</p>
                <p className="text-xs text-slate-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{platformMetrics.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-50">
                <Server className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{platformMetrics.totalMachines.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Machines</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50">
                <HardDrive className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{platformMetrics.totalLogsGB}</p>
                <p className="text-xs text-slate-500">Logs (GB)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">${(platformMetrics.monthlyRevenue / 1000).toFixed(1)}k</p>
                <p className="text-xs text-slate-500">MRR</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tenant Management Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Tenant Management</CardTitle>
          <CardDescription>Manage all tenant accounts and their lifecycle</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Users</TableHead>
                <TableHead className="text-right">Machines</TableHead>
                <TableHead className="text-right">Logs (GB)</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">{tenant.name}</p>
                      <p className="text-xs text-slate-500">{tenant.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(tenant.status)}
                      {tenant.trialEndsIn && (
                        <span className="text-xs text-amber-600">({tenant.trialEndsIn}d left)</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{tenant.plan}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{tenant.users}</TableCell>
                  <TableCell className="text-right">{tenant.machines}</TableCell>
                  <TableCell className="text-right">{tenant.logsGB}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-400" />
                      <span className="text-sm">{tenant.region}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-500">{tenant.lastActivity}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white border-slate-200 z-50">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Eye className="w-4 h-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Activity className="w-4 h-4" /> View Usage
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {tenant.status === 'active' && (
                          <DropdownMenuItem className="gap-2 text-amber-600 cursor-pointer">
                            <Pause className="w-4 h-4" /> Suspend Tenant
                          </DropdownMenuItem>
                        )}
                        {tenant.status === 'suspended' && (
                          <DropdownMenuItem className="gap-2 text-emerald-600 cursor-pointer">
                            <Play className="w-4 h-4" /> Reactivate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="gap-2 text-red-600 cursor-pointer">
                          <Trash2 className="w-4 h-4" /> Delete Tenant
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Security & Infrastructure Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Global Security Controls */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium text-slate-900">Emergency Lockdown</p>
                <p className="text-sm text-slate-500">Disable all tenant access globally</p>
              </div>
              <Button variant="destructive" size="sm">Activate</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium text-slate-900">Global Ingestion Pause</p>
                <p className="text-sm text-slate-500">Stop log ingestion for all tenants</p>
              </div>
              <Button variant="outline" size="sm">Pause</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium text-slate-900">Force Agent Upgrade</p>
                <p className="text-sm text-slate-500">Push latest agent version to all</p>
              </div>
              <Button variant="outline" size="sm">Deploy</Button>
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure Status */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Infrastructure Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Loki Ingestion</span>
                <span className="text-emerald-600 font-medium">Healthy</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-slate-500">1.2M logs/min • 85% capacity</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">S3 Storage</span>
                <span className="text-emerald-600 font-medium">Healthy</span>
              </div>
              <Progress value={42} className="h-2" />
              <p className="text-xs text-slate-500">856 GB used • 42% of limit</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Grafana Clusters</span>
                <span className="text-emerald-600 font-medium">All Online</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-emerald-600">US-East ✓</Badge>
                <Badge variant="outline" className="text-emerald-600">EU-West ✓</Badge>
                <Badge variant="outline" className="text-emerald-600">US-West ✓</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
