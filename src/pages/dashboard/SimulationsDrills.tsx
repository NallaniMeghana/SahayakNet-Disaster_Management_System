import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Play, CheckCircle, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SimulationsDrills = () => {
  const navigate = useNavigate();
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
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Simulations & Drills</h1>
            <p className="text-muted-foreground">
              Practice and prepare for emergency scenarios
            </p>
          </div>
        </div>

        {activeDrill && (
          <Card className="border-emergency bg-emergency/5">
            <CardHeader>
              <CardTitle className="text-2xl text-emergency">Active Drill Running</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-4xl font-bold text-emergency">{formatTime(timer)}</div>
              <Button onClick={handleCompleteDrill} size="lg" className="bg-success hover:bg-success/90">
                <CheckCircle className="mr-2" />
                Complete Drill
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {drills?.map((drill) => (
            <Card key={drill.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-primary" />
                  <div className="flex-1">
                    <CardTitle>{drill.drill_name}</CardTitle>
                    <CardDescription>Expected duration: {drill.duration_minutes} minutes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge variant="secondary">{drill.drill_type}</Badge>
                {drill.description && (
                  <p className="text-sm text-muted-foreground">{drill.description}</p>
                )}
                <Button 
                  onClick={() => handleStartDrill(drill.id)} 
                  disabled={activeDrill !== null}
                  className="w-full"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Drill
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SimulationsDrills;
