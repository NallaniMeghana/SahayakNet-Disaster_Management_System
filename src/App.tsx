import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Features from "./pages/Features";
import Dashboard from "./pages/Dashboard";
import SkillMapping from "./pages/dashboard/SkillMapping";
import Resources from "./pages/dashboard/Resources";
import Settings from "./pages/dashboard/Settings";
import LiveIncidentMap from "./pages/dashboard/LiveIncidentMap";
import EmergencyAlerts from "./pages/dashboard/EmergencyAlerts";
import VulnerabilityRegister from "./pages/dashboard/VulnerabilityRegister";
import SimulationsDrills from "./pages/dashboard/SimulationsDrills";
import ResourceSharing from "./pages/dashboard/ResourceSharing";
import CommunityLeadManagement from "./pages/dashboard/CommunityLeadManagement";
import DisasterZoneMap from "./pages/dashboard/DisasterZoneMap";
import IncidentMap from "./pages/IncidentMap";
import Registry from "./pages/Registry";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/features" element={<Features />} />
          <Route path="/incident-map" element={<IncidentMap />} />
          <Route path="/registry" element={<Registry />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/skill-mapping" element={<SkillMapping />} />
          <Route path="/dashboard/resources" element={<Resources />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/live-incident-map" element={<LiveIncidentMap />} />
          <Route path="/dashboard/emergency-alerts" element={<EmergencyAlerts />} />
          <Route path="/dashboard/vulnerability-register" element={<VulnerabilityRegister />} />
          <Route path="/dashboard/simulations-drills" element={<SimulationsDrills />} />
          <Route path="/dashboard/resource-sharing" element={<ResourceSharing />} />
          <Route path="/dashboard/community-lead" element={<CommunityLeadManagement />} />
          <Route path="/dashboard/disaster-zones" element={<DisasterZoneMap />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
