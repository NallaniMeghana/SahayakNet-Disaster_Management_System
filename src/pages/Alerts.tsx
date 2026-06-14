import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Plus } from "lucide-react";
import InstagramStoryTemplate from "@/components/InstagramStoryTemplate";
import { profileThemes } from "@/types/profileThemes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const Alerts = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [severity, setSeverity] = useState("");

  const { data: alerts, refetch } = useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please sign in to create alerts");
      return;
    }

    // Validate alert data
    const { alertSchema } = await import('@/lib/validationSchemas');
    const validationResult = alertSchema.safeParse({
      title,
      message,
      alert_type: alertType.toLowerCase(),
      severity: severity.toLowerCase()
    });

    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
      return;
    }

    const { error } = await supabase.from('alerts').insert([{
      title: validationResult.data.title,
      message: validationResult.data.message,
      alert_type: validationResult.data.alert_type,
      severity: validationResult.data.severity,
      created_by: user.id,
      status: 'active'
    }]);

    if (error) {
      toast.error("Failed to create alert. Please try again.");
    } else {
      toast.success("Alert created successfully!");
      setOpen(false);
      setTitle("");
      setMessage("");
      setAlertType("");
      setSeverity("");
      refetch();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'Critical': return 'destructive';
      case 'High': return 'default';
      case 'Medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <InstagramStoryTemplate theme={profileThemes.alerts}>
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <Button 
          variant="ghost" 
          className="mb-8 text-white hover:bg-white/10"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2" />
          Back to Home
        </Button>
        
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-block p-6 rounded-full bg-white/10 backdrop-blur-sm mb-4">
              <AlertTriangle className="w-16 h-16 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Emergency Alerts
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Instant notifications for disasters and emergencies
            </p>
          </div>

          <div className="flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Alert
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Alert</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateAlert} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="type">Alert Type</Label>
                    <Select value={alertType} onValueChange={setAlertType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weather">Weather</SelectItem>
                        <SelectItem value="Fire">Fire</SelectItem>
                        <SelectItem value="Flood">Flood</SelectItem>
                        <SelectItem value="Evacuation">Evacuation</SelectItem>
                        <SelectItem value="Community">Community Update</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="severity">Severity</Label>
                    <Select value={severity} onValueChange={setSeverity} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Info">Info</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">Create Alert</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-6">
            {alerts?.map((alert) => (
              <Card key={alert.id} className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{alert.title}</CardTitle>
                    <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                  </div>
                  <CardDescription>
                    {new Date(alert.created_at).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{alert.message}</p>
                  <Badge variant="outline">{alert.alert_type}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </InstagramStoryTemplate>
  );
};

export default Alerts;