import { useState } from 'react';
import { 
  Users, Shield, Database, BarChart3, CreditCard,
  Key, Globe, Clock, Mail, Slack, Bell, 
  Lock, UserPlus, UserMinus, Settings, AlertTriangle,
  CheckCircle, Pause, Play, HardDrive, Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Mock tenant users
const tenantUsers = [
  { id: 'u-001', name: 'John Smith', email: 'john@acmecorp.com', role: 'Admin', status: 'active', lastLogin: '2 hours ago' },
  { id: 'u-002', name: 'Sarah Johnson', email: 'sarah@acmecorp.com', role: 'Analyst', status: 'active', lastLogin: '1 day ago' },
  { id: 'u-003', name: 'Mike Brown', email: 'mike@acmecorp.com', role: 'Viewer', status: 'active', lastLogin: '3 days ago' },
  { id: 'u-004', name: 'Emily Davis', email: 'emily@acmecorp.com', role: 'Analyst', status: 'invited', lastLogin: 'Never' },
];

const CustomerAdminSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Identity & Access
    azureAdEnabled: false,
    azureAdTenantId: '',
    mfaRequired: true,
    sessionTimeout: 30,
    deviceTrust: true,
    
    // Security
    geoLockEnabled: false,
    allowedCountries: ['US', 'CA'],
    ipAllowlistEnabled: false,
    ipAllowlist: '',
    
    // Data & Retention
    hotRetentionDays: 30,
    coldRetentionDays: 365,
    ingestionPaused: false,
    
    // Notifications
    emailNotifications: true,
    slackEnabled: false,
    slackWebhook: '',
  });

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your tenant settings have been updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tenant Administration</h1>
          <p className="text-slate-500">
            Manage settings for {user?.tenantName || 'your organization'}
          </p>
        </div>
        <Button onClick={handleSave} className="bg-primary text-white">
          Save All Changes
        </Button>
      </div>

      {/* Usage Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-slate-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">45</p>
                <p className="text-xs text-slate-500">Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <HardDrive className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">23.5 GB</p>
                <p className="text-xs text-slate-500">Logs Stored</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-50">
                <Bell className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">12</p>
                <p className="text-xs text-slate-500">Active Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50">
                <Key className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">3</p>
                <p className="text-xs text-slate-500">API Keys</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <CreditCard className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">$450</p>
                <p className="text-xs text-slate-500">Est. Monthly</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="identity" className="space-y-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="identity" className="gap-2">
            <Users className="w-4 h-4" />
            Identity & Access
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2">
            <Database className="w-4 h-4" />
            Data & Retention
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Identity & Access Tab */}
        <TabsContent value="identity" className="space-y-6">
          {/* User Management */}
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">User Management</CardTitle>
                  <CardDescription>Manage users in your organization</CardDescription>
                </div>
                <Button className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Invite User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">{u.name}</p>
                          <p className="text-sm text-slate-500">{u.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{u.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={u.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                          }
                        >
                          {u.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500">{u.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* SSO Integration */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">SSO Integration</CardTitle>
              <CardDescription>Connect with Azure AD or Active Directory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Azure AD Integration</p>
                    <p className="text-sm text-slate-500">Enable single sign-on with Microsoft</p>
                  </div>
                </div>
                <Switch
                  checked={settings.azureAdEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, azureAdEnabled: checked })}
                />
              </div>
              {settings.azureAdEnabled && (
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  <div className="space-y-2">
                    <Label>Azure AD Tenant ID</Label>
                    <Input 
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      value={settings.azureAdTenantId}
                      onChange={(e) => setSettings({ ...settings, azureAdTenantId: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Settings */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Session Settings</CardTitle>
              <CardDescription>Configure authentication security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Require MFA for all users</p>
                  <p className="text-sm text-slate-500">Enforce multi-factor authentication</p>
                </div>
                <Switch
                  checked={settings.mfaRequired}
                  onCheckedChange={(checked) => setSettings({ ...settings, mfaRequired: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Device Trust</p>
                  <p className="text-sm text-slate-500">Require OTP for new browser/device</p>
                </div>
                <Switch
                  checked={settings.deviceTrust}
                  onCheckedChange={(checked) => setSettings({ ...settings, deviceTrust: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Select 
                  value={String(settings.sessionTimeout)}
                  onValueChange={(v) => setSettings({ ...settings, sessionTimeout: Number(v) })}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Geo & IP Restrictions</CardTitle>
              <CardDescription>Control access based on location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Geo Lock</p>
                  <p className="text-sm text-slate-500">Restrict access to specific countries</p>
                </div>
                <Switch
                  checked={settings.geoLockEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, geoLockEnabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">IP Allowlist</p>
                  <p className="text-sm text-slate-500">Only allow specific IP addresses</p>
                </div>
                <Switch
                  checked={settings.ipAllowlistEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, ipAllowlistEnabled: checked })}
                />
              </div>
              {settings.ipAllowlistEnabled && (
                <div className="space-y-2 pl-4 border-l-2 border-slate-200">
                  <Label>Allowed IP Addresses</Label>
                  <Input
                    placeholder="192.168.1.0/24, 10.0.0.1"
                    value={settings.ipAllowlist}
                    onChange={(e) => setSettings({ ...settings, ipAllowlist: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">Comma-separated list of IPs or CIDR ranges</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Encryption Status</CardTitle>
              <CardDescription>View encryption configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700">Encryption at Rest</span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">AES-256</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700">Encryption in Transit</span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">TLS 1.3</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Retention Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Retention Policies</CardTitle>
              <CardDescription>Configure how long logs are stored</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Hot Storage (Fast Access)</Label>
                  <span className="text-sm font-medium text-slate-700">{settings.hotRetentionDays} days</span>
                </div>
                <Input
                  type="range"
                  min="7"
                  max="90"
                  value={settings.hotRetentionDays}
                  onChange={(e) => setSettings({ ...settings, hotRetentionDays: Number(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">Logs in hot storage for quick search and analysis</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Cold Storage (Archive)</Label>
                  <span className="text-sm font-medium text-slate-700">{settings.coldRetentionDays} days</span>
                </div>
                <Input
                  type="range"
                  min="30"
                  max="730"
                  value={settings.coldRetentionDays}
                  onChange={(e) => setSettings({ ...settings, coldRetentionDays: Number(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">Long-term archival storage for compliance</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                <AlertTriangle className="w-5 h-5" />
                Ingestion Control
              </CardTitle>
              <CardDescription className="text-amber-700">
                Pause log ingestion to control costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">
                    {settings.ingestionPaused ? 'Ingestion Paused' : 'Ingestion Active'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {settings.ingestionPaused 
                      ? 'No new logs are being collected'
                      : 'Logs are being collected normally'
                    }
                  </p>
                </div>
                <Button
                  variant={settings.ingestionPaused ? 'default' : 'outline'}
                  className="gap-2"
                  onClick={() => setSettings({ ...settings, ingestionPaused: !settings.ingestionPaused })}
                >
                  {settings.ingestionPaused ? (
                    <>
                      <Play className="w-4 h-4" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Deactivate Tenant</p>
                  <p className="text-sm text-slate-500">
                    This will stop all ingestion and disable access
                  </p>
                </div>
                <Button variant="destructive">Deactivate</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Notification Channels</CardTitle>
              <CardDescription>Configure where to send alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Email Notifications</p>
                    <p className="text-sm text-slate-500">Send alerts via email</p>
                  </div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Slack className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Slack Integration</p>
                    <p className="text-sm text-slate-500">Send alerts to Slack channel</p>
                  </div>
                </div>
                <Switch
                  checked={settings.slackEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, slackEnabled: checked })}
                />
              </div>
              {settings.slackEnabled && (
                <div className="space-y-2 pl-4 border-l-2 border-purple-200">
                  <Label>Slack Webhook URL</Label>
                  <Input
                    placeholder="https://hooks.slack.com/services/..."
                    value={settings.slackWebhook}
                    onChange={(e) => setSettings({ ...settings, slackWebhook: e.target.value })}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerAdminSettings;
