import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Plus, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Incident {
  id: string;
  title: string;
  incident_type: string;
  severity: string;
  description: string | null;
  latitude: number;
  longitude: number;
  created_at: string;
  status: string;
}

const IncidentMap = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [severity, setSeverity] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: incidents, refetch } = useQuery<Incident[]>({ 
    queryKey: ['incidents'], 
    queryFn: async () => { 
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false }); 
      
      if (error) {
        console.error("Error fetching incidents:", error);
        throw error;
      }
      
      return data || [];
    }
  });

  const handleReportIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) { 
        toast.error("Please sign in to report an incident");
        navigate("/auth");
        return; 
      }
      
      const { error } = await supabase.from('incidents').insert({ 
        title, 
        description: description || null, 
        incident_type: incidentType, 
        severity: severity.toLowerCase(), 
        latitude: 40.7128, 
        longitude: -74.0060, 
        reported_by: user.id, 
        status: 'active' 
      });
      
      if (error) {
        console.error("Error reporting incident:", error);
        toast.error("Failed to report incident. Please try again.");
        return;
      }
      
      toast.success("Incident reported successfully!");
      setOpen(false); 
      setTitle(""); 
      setDescription(""); 
      setIncidentType(""); 
      setSeverity(""); 
      refetch();
    } catch (error) {
      console.error("Error reporting incident:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const getSeverityColor = (severity: string) => {
    const severityLower = severity?.toLowerCase() || "";
    switch (severityLower) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-destructive/10 via-background to-warning/10">
      <div className="container mx-auto px-4 py-12">
        <Button 
          onClick={() => navigate("/")} 
          variant="ghost" 
          className="mb-8"
        >
          <ArrowLeft className="mr-2" />
          Back to Home
        </Button>
        
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-block p-6 rounded-full bg-primary/10 mb-4">
              <MapPin className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Live Incident Map</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real-time incidents reported by the community
            </p>
          </div>
          
          <div className="flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2" />
                  Report Incident
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Report New Incident
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleReportIncident} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Incident Title</Label>
                    <Input 
                      id="title"
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      required 
                      placeholder="Brief description of incident"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide detailed information..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Incident Type</Label>
                    <Select value={incidentType} onValueChange={setIncidentType} required>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fire">Fire</SelectItem>
                        <SelectItem value="flood">Flood</SelectItem>
                        <SelectItem value="medical">Medical Emergency</SelectItem>
                        <SelectItem value="earthquake">Earthquake</SelectItem>
                        <SelectItem value="accident">Accident</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="severity">Severity Level</Label>
                    <Select value={severity} onValueChange={setSeverity} required>
                      <SelectTrigger id="severity">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">
                    Submit Report
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incidents && incidents.length > 0 ? (
              incidents.map((inc) => (
                <Card key={inc.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{inc.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {new Date(inc.created_at).toLocaleString()}
                        </CardDescription>
                      </div>
                      <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {inc.description && (
                      <p className="text-sm text-muted-foreground">{inc.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="capitalize">{inc.incident_type}</Badge>
                      <Badge className={getSeverityColor(inc.severity)}>
                        {inc.severity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active incidents reported</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentMap;
