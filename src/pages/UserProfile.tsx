import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Clock,
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  Copy,
  Pencil,
  Users,
  Info,
  RefreshCw,
  Check,
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock user data
const mockUser = {
  firstName: "Ajay",
  lastName: "Bhandari",
  loginName: "Ajay.Bhandari12",
  email: "ajay.bhandari@company.com",
  mobile: "+91 98765 43210",
  department: "IT Operations",
  creationDate: "2025-11-23 03:43:03 PM",
  lastLogonTime: "",
  lastModified: "2026-01-21 03:21:46 PM",
  address: {
    street: "123 Tech Park",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    postalCode: "560001",
  },
  teams: {
    adGroup: "Domain Users",
    manager: "",
    ou: "Bengaluru",
  },
  accountProperties: {
    isUnlocked: true,
    status: "Enable",
    expiry: "Never Expire",
  },
  password: {
    expiryDate: "03/04/2026 03:21:46 PM",
    age: "0 Days",
  },
};

export default function UserProfile() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleGeneratePassword = () => {
    const generated = Array(16)
      .fill(0)
      .map(() => String.fromCharCode(Math.floor(Math.random() * 94) + 33))
      .join("");
    setNewPassword(generated);
    setConfirmPassword(generated);
    toast({
      title: "Password Generated",
      description: "A strong password has been generated for you.",
    });
  };

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const renderInfoRow = (label: string, value: string, editable = false) => (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-primary">{value || "—"}</span>
    </div>
  );

  return (
    <>
      <Header
        title="User Profile"
        subtitle="View and manage your account information"
      />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your basic account details
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-x-8">
                {renderInfoRow("First Name", mockUser.firstName)}
                {renderInfoRow("Last Name", mockUser.lastName)}
                {renderInfoRow("Login Name", mockUser.loginName)}
                {renderInfoRow("Department", mockUser.department)}
                {renderInfoRow("Creation Date", mockUser.creationDate)}
                {renderInfoRow("Last Logon Time", mockUser.lastLogonTime)}
                {renderInfoRow("Last Modified", mockUser.lastModified)}
              </div>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Contact</CardTitle>
              </div>
              <Button variant="outline" size="sm">
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-8">
                {renderInfoRow("Email", mockUser.email)}
                {renderInfoRow("Mobile", mockUser.mobile)}
              </div>
            </CardContent>
          </Card>

          {/* Address Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Address</CardTitle>
              </div>
              <Button variant="outline" size="sm">
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-8">
                {renderInfoRow("Address", mockUser.address.street)}
                {renderInfoRow("City", mockUser.address.city)}
                {renderInfoRow("State", mockUser.address.state)}
                {renderInfoRow("Country", mockUser.address.country)}
                {renderInfoRow("Postal Code", mockUser.address.postalCode)}
              </div>
            </CardContent>
          </Card>

          {/* Teams Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Teams
                </CardTitle>
              </div>
              <Button variant="outline" size="sm">
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-8">
                {renderInfoRow("Member of AD Group", mockUser.teams.adGroup)}
                {renderInfoRow("Manager", mockUser.teams.manager)}
                {renderInfoRow("OU", mockUser.teams.ou)}
              </div>
            </CardContent>
          </Card>

          {/* Account Property Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Account Property
                </CardTitle>
              </div>
              <Button variant="outline" size="sm">
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-8">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Account is</span>
                  <Badge variant="default" className="bg-success">
                    {mockUser.accountProperties.isUnlocked ? "Unlocked" : "Locked"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Account Status</span>
                  <Badge variant="default" className="bg-success">
                    {mockUser.accountProperties.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Account Expiry</span>
                  <span className="text-sm font-medium text-primary">
                    {mockUser.accountProperties.expiry}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Password
                </CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Info className="w-4 h-4 text-primary" />
                      <span className="ml-2 text-primary">Password policy</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    <p className="text-sm">
                      Password must be at least 8 characters long, contain uppercase,
                      lowercase, numbers, and special characters.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-x-8">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Password Expiry</span>
                  <span className="text-sm font-medium text-primary">
                    {mockUser.password.expiryDate}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Password Age</span>
                  <span className="text-sm font-medium text-primary">
                    {mockUser.password.age}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="pr-20"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => {
                          navigator.clipboard.writeText(currentPassword);
                          toast({ title: "Copied to clipboard" });
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={handleGeneratePassword}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Password
                  </Button>
                  <Button onClick={handleSavePassword} className="bg-gradient-primary">
                    <Check className="w-4 h-4 mr-2" />
                    Set Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
