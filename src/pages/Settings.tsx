import { useState } from "react";
import {
  Settings,
  User,
  Shield,
  Bell,
  Database,
  Palette,
  Globe,
  Key,
  Mail,
  Save,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: "LogWatch Enterprise",
    adminEmail: "admin@company.com",
    dataRetentionDays: "30",
    coldStorageDays: "365",
    timezone: "UTC",
    emailNotifications: true,
    slackNotifications: false,
    weeklyReports: true,
    alertDigest: true,
    twoFactorAuth: true,
    sessionTimeout: "30",
    ipWhitelist: "",
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your configuration has been updated successfully.",
    });
  };

  return (
    <>
      <Header title="Settings" subtitle="Configure your platform preferences" />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="general" className="gap-2">
                <Settings className="w-4 h-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="w-4 h-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="data" className="gap-2">
                <Database className="w-4 h-4" />
                Data & Storage
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Platform Settings
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input
                        value={settings.companyName}
                        onChange={(e) =>
                          setSettings({ ...settings, companyName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Admin Email</Label>
                      <Input
                        type="email"
                        value={settings.adminEmail}
                        onChange={(e) =>
                          setSettings({ ...settings, adminEmail: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(v) => setSettings({ ...settings, timezone: v })}
                    >
                      <SelectTrigger className="w-full md:w-64">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                        <SelectItem value="Asia/Kolkata">India</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  White Label Branding
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize the platform appearance for your clients. Kiosk mode hides all
                  vendor branding.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Kiosk Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Hide Grafana and Metabase branding in embedded views
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Custom Logo</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your company logo in the portal
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Notification Channels
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts via email
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(v) =>
                        setSettings({ ...settings, emailNotifications: v })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                        </svg>
                      </div>
                      <div>
                        <Label>Slack Integration</Label>
                        <p className="text-sm text-muted-foreground">
                          Send alerts to Slack channels
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.slackNotifications}
                      onCheckedChange={(v) =>
                        setSettings({ ...settings, slackNotifications: v })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Scheduled Reports
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Summary Report</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly summary of all activity
                      </p>
                    </div>
                    <Switch
                      checked={settings.weeklyReports}
                      onCheckedChange={(v) =>
                        setSettings({ ...settings, weeklyReports: v })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Daily Alert Digest</Label>
                      <p className="text-sm text-muted-foreground">
                        Consolidated daily summary of all triggered alerts
                      </p>
                    </div>
                    <Switch
                      checked={settings.alertDigest}
                      onCheckedChange={(v) =>
                        setSettings({ ...settings, alertDigest: v })
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Authentication
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for all admin users
                      </p>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(v) =>
                        setSettings({ ...settings, twoFactorAuth: v })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Select
                      value={settings.sessionTimeout}
                      onValueChange={(v) =>
                        setSettings({ ...settings, sessionTimeout: v })
                      }
                    >
                      <SelectTrigger className="w-full md:w-64">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  SSO Configuration
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure Active Directory or Azure AD integration for enterprise SSO.
                </p>
                <div className="space-y-4">
                  <Button variant="outline">
                    <Key className="w-4 h-4 mr-2" />
                    Configure SAML/OIDC
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Data Settings */}
            <TabsContent value="data" className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Data Retention
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hot Storage (Loki) - Days</Label>
                      <Select
                        value={settings.dataRetentionDays}
                        onValueChange={(v) =>
                          setSettings({ ...settings, dataRetentionDays: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Fast queries for recent data
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Cold Storage (Trino) - Days</Label>
                      <Select
                        value={settings.coldStorageDays}
                        onValueChange={(v) =>
                          setSettings({ ...settings, coldStorageDays: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                          <SelectItem value="730">2 years</SelectItem>
                          <SelectItem value="1095">3 years</SelectItem>
                          <SelectItem value="1825">5 years</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Long-term analytics storage
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Storage Statistics
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Hot Storage Used</p>
                    <p className="text-2xl font-bold text-foreground">2.4 GB</p>
                    <p className="text-xs text-muted-foreground">of 10 GB</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Cold Storage Used</p>
                    <p className="text-2xl font-bold text-foreground">45.2 GB</p>
                    <p className="text-xs text-muted-foreground">of 500 GB</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Events Stored</p>
                    <p className="text-2xl font-bold text-foreground">12.4M</p>
                    <p className="text-xs text-muted-foreground">total events</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} className="bg-gradient-primary text-primary-foreground">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
