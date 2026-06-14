import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Plus, Play, CheckCircle } from "lucide-react";
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
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Drills = () => {
  const [open, setOpen] = useState(false);
  const [drillName, setDrillName] = useState("");
  const [drillType, setDrillType] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [activeDrill, setActiveDrill] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  const { data: drills, refetch } = useQuery({
    queryKey: ['drills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drills')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeDrill) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeDrill]);

  const handleCreateDrill = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please sign in to create drills");
      return;
    }

    const { error } = await supabase.from('drills').insert({
      drill_name: drillName,
      drill_type: drillType,
      description,
      duration_minutes: parseInt(duration),
      created_by: user.id
    });

    if (error) {
      toast.error("Failed to create drill");
    } else {
      toast.success("Drill created successfully!");
      setOpen(false);
      setDrillName("");
      setDrillType("");
      setDescription("");
      setDuration("");
      refetch();
    }
  };

  const handleStartDrill = async (drillId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please sign in to start drills");
      return;
    }

    const { error } = await supabase.from('drill_participation').insert({
      drill_id: drillId,
      user_id: user.id,
      status: 'in_progress'
    });

    if (error) {
      toast.error("Failed to start drill");
    } else {
      setActiveDrill(drillId);
      setTimer(0);
      toast.success("Drill started! Timer is running");
    }
  };

  const handleCompleteDrill = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !activeDrill) return;

    const { error } = await supabase
      .from('drill_participation')
      .update({
        completed_at: new Date().toISOString(),
        response_time_seconds: timer,
        status: 'completed'
      })
      .eq('drill_id', activeDrill)
      .eq('user_id', user.id)
      .eq('status', 'in_progress');

    if (error) {
      toast.error("Failed to complete drill");
    } else {
      toast.success(`Drill completed in ${Math.floor(timer / 60)}m ${timer % 60}s!`);
      setActiveDrill(null);
      setTimer(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <InstagramStoryTemplate theme={profileThemes.drills}>
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <Link to="/">
          <Button variant="ghost" className="mb-8 text-white hover:bg-white/10">
            <ArrowLeft className="mr-2" />
            Back to Home
          </Button>
        </Link>
        
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-block p-6 rounded-full bg-white/10 backdrop-blur-sm mb-4">
              <Shield className="w-16 h-16 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Simulation & Drills
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Test community readiness with mock drills
            </p>
          </div>

          {activeDrill && (
            <Card className="bg-white/90 backdrop-blur-sm border-4 border-primary">
              <CardHeader>
                <CardTitle className="text-2xl">Active Drill Running</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-4xl font-bold">{formatTime(timer)}</div>
                <Button onClick={handleCompleteDrill} size="lg">
                  <CheckCircle className="mr-2" />
                  Complete Drill
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Drill
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Drill</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateDrill} className="space-y-4">
                  <div>
                    <Label htmlFor="drillName">Drill Name</Label>
                    <Input id="drillName" value={drillName} onChange={(e) => setDrillName(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="drillType">Drill Type</Label>
                    <Select value={drillType} onValueChange={setDrillType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fire Evacuation">Fire Evacuation</SelectItem>
                        <SelectItem value="Earthquake">Earthquake</SelectItem>
                        <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
                        <SelectItem value="Flood Response">Flood Response</SelectItem>
                        <SelectItem value="Communication Test">Communication Test</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="duration">Expected Duration (minutes)</Label>
                    <Input 
                      id="duration" 
                      type="number" 
                      value={duration} 
                      onChange={(e) => setDuration(e.target.value)} 
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full">Create Drill</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {drills?.map((drill) => (
              <Card key={drill.id} className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{drill.drill_name}</CardTitle>
                  <CardDescription>Expected duration: {drill.duration_minutes} minutes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Badge variant="secondary">{drill.drill_type}</Badge>
                  {drill.description && <p className="text-sm">{drill.description}</p>}
                  <Button 
                    onClick={() => handleStartDrill(drill.id)} 
                    disabled={activeDrill !== null}
                    className="w-full mt-4"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Drill
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </InstagramStoryTemplate>
  );
};

export default Drills;