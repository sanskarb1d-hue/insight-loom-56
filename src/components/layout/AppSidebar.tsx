import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  FileText,
  Bell,
  Settings,
  Users,
  Shield,
  Database,
  Key,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Layers,
  Plug,
  UserCircle,
  History,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  badge?: number;
}

const NavItem = ({ to, icon, label, collapsed, badge }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const content = (
    <NavLink
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
        "hover:bg-sidebar-accent group relative",
        isActive && "bg-sidebar-accent text-primary"
      )}
    >
      <span className={cn(
        "flex-shrink-0 transition-colors",
        isActive ? "text-primary" : "text-slate-600 group-hover:text-slate-900"
      )}>
        {icon}
      </span>
      {!collapsed && (
        <span className={cn(
          "text-sm font-medium transition-colors",
          isActive ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"
        )}>
          {label}
        </span>
      )}
      {badge !== undefined && badge > 0 && !collapsed && (
        <span className="ml-auto bg-critical text-critical-foreground text-xs px-2 py-0.5 rounded-full font-medium">
          {badge}
        </span>
      )}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full" />
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {label}
          {badge !== undefined && badge > 0 && (
            <span className="bg-critical text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
};

interface NavGroupProps {
  title: string;
  children: React.ReactNode;
  collapsed: boolean;
}

const NavGroup = ({ title, children, collapsed }: NavGroupProps) => (
  <div className="space-y-1">
    {!collapsed && (
      <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {title}
      </h3>
    )}
    {children}
  </div>
);

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { isSuperAdmin } = useAuth();

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-sidebar-border flex flex-col transition-all duration-300 shadow-sm",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Actonix</h1>
              <p className="text-xs text-slate-500">Enterprise Audit</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
        <NavGroup title="Main" collapsed={collapsed}>
          <NavItem to="/" icon={<LayoutDashboard className="w-5 h-5" />} label="Home" collapsed={collapsed} />
          <NavItem to="/change" icon={<RefreshCw className="w-5 h-5" />} label="Change" collapsed={collapsed} />
          <NavItem to="/search" icon={<Search className="w-5 h-5" />} label="Search" collapsed={collapsed} />
          <NavItem to="/alerts" icon={<Bell className="w-5 h-5" />} label="Alerts" collapsed={collapsed} badge={5} />
          <NavItem to="/reports" icon={<FileText className="w-5 h-5" />} label="Reports" collapsed={collapsed} />
        </NavGroup>

        <NavGroup title="Configuration" collapsed={collapsed}>
          <NavItem to="/scope-manager" icon={<Layers className="w-5 h-5" />} label="ScopeMgr" collapsed={collapsed} />
          <NavItem to="/integration" icon={<Plug className="w-5 h-5" />} label="Integration" collapsed={collapsed} />
          <NavItem to="/settings" icon={<Settings className="w-5 h-5" />} label="Setting" collapsed={collapsed} />
        </NavGroup>

        <NavGroup title="Account" collapsed={collapsed}>
          <NavItem to="/profile" icon={<UserCircle className="w-5 h-5" />} label="User Profile" collapsed={collapsed} />
          <NavItem to="/audit-trail" icon={<History className="w-5 h-5" />} label="Self Audit Trail" collapsed={collapsed} />
        </NavGroup>

        {isSuperAdmin && (
          <NavGroup title="Super Admin" collapsed={collapsed}>
            <NavItem to="/admin" icon={<Crown className="w-5 h-5" />} label="Dashboard" collapsed={collapsed} />
            <NavItem to="/admin/schema" icon={<Database className="w-5 h-5" />} label="Schema Manager" collapsed={collapsed} />
            <NavItem to="/admin/mapper" icon={<Key className="w-5 h-5" />} label="Schema Mapper" collapsed={collapsed} />
            <NavItem to="/tenants" icon={<Users className="w-5 h-5" />} label="Tenants" collapsed={collapsed} />
          </NavGroup>
        )}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
