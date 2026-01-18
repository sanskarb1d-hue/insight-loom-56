import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SmartSearch from "./pages/SmartSearch";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import Tenants from "./pages/Tenants";
import ApiKeys from "./pages/ApiKeys";
import FieldMappings from "./pages/FieldMappings";
import SettingsPage from "./pages/Settings";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import CanonicalSchemaManager from "./pages/admin/CanonicalSchemaManager";
import SchemaMapper from "./pages/admin/SchemaMapper";
import CustomerAdminSettings from "./pages/admin/CustomerAdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/search" element={<SmartSearch />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/api-keys" element={<ApiKeys />} />
              <Route path="/mappings" element={<FieldMappings />} />
              <Route path="/settings" element={<SettingsPage />} />
              
              {/* Super Admin routes */}
              <Route path="/admin" element={<SuperAdminDashboard />} />
              <Route path="/admin/schema" element={<CanonicalSchemaManager />} />
              <Route path="/admin/mapper" element={<SchemaMapper />} />
              
              {/* Customer Admin routes */}
              <Route path="/tenant-admin" element={<CustomerAdminSettings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
