import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  Users,
  Map,
  AlertTriangle,
  Heart,
  Package,
  Trophy,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import sahayaknetLogo from "@/assets/sahayaknet-logo.png";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Community Skill Mapping",
      description: "Identify and leverage community expertise for rapid emergency response",
    },
    {
      icon: Map,
      title: "Live Incident Tracking",
      description: "Real-time visualization of incidents across your community",
    },
    {
      icon: AlertTriangle,
      title: "Instant Alerts",
      description: "Critical notifications delivered immediately when emergencies occur",
    },
    {
      icon: Heart,
      title: "Vulnerable Care",
      description: "Ensure special attention for those who need it most",
    },
    {
      icon: Package,
      title: "Resource Sharing",
      description: "Coordinate and distribute emergency resources efficiently",
    },
    {
      icon: Trophy,
      title: "Preparedness Drills",
      description: "Regular training to keep your community ready",
    },
  ];

  const benefits = [
    "Faster emergency response times",
    "Better resource allocation",
    "Enhanced community coordination",
    "Improved preparedness",
    "Data-driven decision making",
    "Vulnerable population protection",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="flex flex-col items-center text-center space-y-8">
            <img src={sahayaknetLogo} alt="SahayakNet" className="h-24 w-24 mb-4" />
            <h1 className="text-4xl md:text-6xl font-bold max-w-4xl">
              Community Disaster Management
              <span className="block text-primary mt-2">Made Simple</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              SahayakNet empowers communities to prepare, respond, and recover from disasters
              through intelligent coordination and real-time information sharing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" onClick={() => navigate("/auth")}>
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/features")}>
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Solution</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build a resilient community
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SahayakNet?</h2>
              <p className="text-xl text-muted-foreground">
                Built by emergency management experts for real-world impact
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 p-4 rounded-lg bg-card">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg mt-4">
                Join communities already using SahayakNet to save lives and protect their neighborhoods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button size="lg" onClick={() => navigate("/auth")}>
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Free to use. No credit card required.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 SahayakNet. Building resilient communities together.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
