import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  MapPin,
  Bell,
  Package,
  TrendingUp,
  Activity,
} from "lucide-react";
import { EmergencyAlertButton } from "@/components/EmergencyAlertButton";

interface DashboardStats {
  totalSkills: number;
  activeIncidents: number;
  activeAlerts: number;
  availableResources: number;
  skillCategories: { [key: string]: number };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalSkills: 0,
    activeIncidents: 0,
    activeAlerts: 0,
    availableResources: 0,
    skillCategories: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth?redirect=/dashboard");
        return;
      }
      loadDashboardStats(session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const loadDashboardStats = async (userId: string) => {
    try {
      // Get user's skills with detailed category breakdown
      const { data: skillsData } = await supabase
        .from("skills")
        .select("skill_category")
        .eq("user_id", userId);

      const skillCategories: { [key: string]: number } = {};
      skillsData?.forEach((skill) => {
        skillCategories[skill.skill_category] = (skillCategories[skill.skill_category] || 0) + 1;
      });

      // Get active incidents
      const { data: incidentsData } = await supabase
        .from("incidents")
        .select("id", { count: "exact" })
        .eq("status", "active");

      // Get active alerts
      const { data: alertsData } = await supabase
        .from("alerts")
        .select("id", { count: "exact" })
        .eq("status", "active");

      // Get available resources
      const { data: resourcesData } = await supabase
        .from("resources")
        .select("id", { count: "exact" })
        .eq("available", true);

      setStats({
        totalSkills: skillsData?.length || 0,
        activeIncidents: incidentsData?.length || 0,
        activeAlerts: alertsData?.length || 0,
        availableResources: resourcesData?.length || 0,
        skillCategories,
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "My Skills Mapped",
      value: stats.totalSkills,
      icon: Users,
      description: "Active skills registered",
      color: "text-primary",
    },
    {
      title: "Active Incidents",
      value: stats.activeIncidents,
      icon: MapPin,
      description: "Ongoing emergencies",
      color: "text-destructive",
    },
    {
      title: "Active Alerts",
      value: stats.activeAlerts,
      icon: Bell,
      description: "Current warnings",
      color: "text-warning",
    },
    {
      title: "Available Resources",
      value: stats.availableResources,
      icon: Package,
      description: "Ready for deployment",
      color: "text-success",
    },
  ];

  return (
    <DashboardLayout>
      <EmergencyAlertButton />
      
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your community's emergency preparedness
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {stats.totalSkills > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Your Skill Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.skillCategories).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{category}</p>
                        <p className="text-sm text-muted-foreground">{count} skill{count > 1 ? 's' : ''} mapped</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary">{count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                onClick={() => navigate("/dashboard/skill-mapping")}
                className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <p className="font-medium">Update Skills</p>
                <p className="text-sm text-muted-foreground">Add or modify your registered skills</p>
              </button>
              <button
                onClick={() => navigate("/dashboard/live-incident-map")}
                className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <p className="font-medium">View Incident Map</p>
                <p className="text-sm text-muted-foreground">See real-time incidents in your area</p>
              </button>
              <button
                onClick={() => navigate("/dashboard/resources")}
                className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <p className="font-medium">Manage Resources</p>
                <p className="text-sm text-muted-foreground">Share or request emergency resources</p>
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Preparedness Level</span>
                  <span className="text-sm text-success font-bold">Ready</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Response Time</span>
                  <span className="text-sm font-bold">~5 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Coverage Area</span>
                  <span className="text-sm font-bold">Full</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
