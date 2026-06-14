import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  Map,
  Users,
  AlertTriangle,
  Heart,
  Package,
  Trophy,
  ArrowRight,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useState } from "react";

const Features = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleFeatureClick = (route: string) => {
    if (isAuthenticated) {
      navigate(route);
    } else {
      navigate(`/auth?redirect=${route}`);
    }
  };

  const features = [
    {
      icon: Users,
      title: "Community Skill Mapping",
      description: "Identify and track community skills for emergency response",
      route: "/dashboard/skill-mapping",
    },
    {
      icon: Map,
      title: "Live Incident Map",
      description: "Real-time visualization of incidents and emergency situations",
      route: "/dashboard/live-incident-map",
    },
    {
      icon: AlertTriangle,
      title: "Emergency Alerts",
      description: "Instant notifications for critical situations",
      route: "/dashboard/emergency-alerts",
    },
    {
      icon: Heart,
      title: "Vulnerability Register",
      description: "Track and support vulnerable community members",
      route: "/dashboard/vulnerability-register",
    },
    {
      icon: Package,
      title: "Resource Sharing",
      description: "Share and request resources during emergencies",
      route: "/dashboard/resource-sharing",
    },
    {
      icon: Trophy,
      title: "Simulations & Drills",
      description: "Practice and prepare for emergency scenarios",
      route: "/dashboard/simulations-drills",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        <Button 
          variant="ghost" 
          className="mb-8" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">SahayakNet Features</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive disaster management and community resilience platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.route}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleFeatureClick(feature.route)}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full group">
                    Access Feature
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Features;
