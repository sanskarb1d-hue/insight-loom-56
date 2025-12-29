import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import SmartSearch from "./pages/SmartSearch";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import Tenants from "./pages/Tenants";
import ApiKeys from "./pages/ApiKeys";
import FieldMappings from "./pages/FieldMappings";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/search" element={<SmartSearch />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/api-keys" element={<ApiKeys />} />
            <Route path="/mappings" element={<FieldMappings />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/dashboard/workstations" element={<Dashboard />} />
            <Route path="/dashboard/files" element={<Dashboard />} />
            <Route path="/dashboard/activity" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
