import { ReactNode, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Map,
  MapPin,
  AlertTriangle,
  Heart,
  Package,
  Trophy,
  Settings,
  LogOut,
  Menu,
  Shield,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const loadUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();
      
      setUserRole(roleData?.role || null);
      setIsLoading(false);
    };

    loadUserRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        loadUserRole();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  const communityMemberNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Skill Mapping", path: "/dashboard/skill-mapping" },
    { icon: Map, label: "Incident Map", path: "/dashboard/live-incident-map" },
    { icon: AlertTriangle, label: "Alerts", path: "/dashboard/emergency-alerts" },
    { icon: Heart, label: "Vulnerability", path: "/dashboard/vulnerability-register" },
    { icon: Package, label: "Resources", path: "/dashboard/resources" },
    { icon: Trophy, label: "Drills", path: "/dashboard/simulations-drills" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  const emergencyResponderNavItems = [
    { icon: LayoutDashboard, label: "Command Center", path: "/dashboard" },
    { icon: Map, label: "Live Incident Map", path: "/dashboard/live-incident-map" },
    { icon: AlertTriangle, label: "Emergency Alerts", path: "/dashboard/emergency-alerts" },
    { icon: MapPin, label: "Disaster Zones", path: "/dashboard/disaster-zones" },
    { icon: Shield, label: "Community Lead", path: "/dashboard/community-lead" },
    { icon: Package, label: "Resource Management", path: "/dashboard/resources" },
    { icon: Users, label: "Team Coordination", path: "/dashboard/skill-mapping" },
    { icon: Trophy, label: "Training & Drills", path: "/dashboard/simulations-drills" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  const navItems = userRole === "emergency_responder" ? emergencyResponderNavItems : communityMemberNavItems;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src="/src/assets/sahayaknet-logo.png" alt="SahayakNet" className="h-8 w-8" />
          <span className="font-bold text-lg">SahayakNet</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r z-40 transition-transform lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b hidden lg:flex items-center gap-3">
          <img src="/src/assets/sahayaknet-logo.png" alt="SahayakNet" className="h-10 w-10" />
          <span className="font-bold text-xl">SahayakNet</span>
        </div>

        <nav className="p-4 space-y-2 mt-16 lg:mt-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6">{children}</div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
