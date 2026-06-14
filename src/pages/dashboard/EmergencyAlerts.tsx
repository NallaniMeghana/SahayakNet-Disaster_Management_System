import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Alert {
  id: string;
  title: string;
  message: string;
  alert_type: string;
  severity: string;
  created_at: string;
  expires_at: string;
  status: string;
}

const EmergencyAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    loadAlerts();

    // Set up realtime subscription
    const channel = supabase
      .channel("alerts-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "alerts" },
        (payload) => {
          setAlerts((prev) => [payload.new as Alert, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error: any) {
      console.error("Failed to load alerts:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "default";
      default:
        return "default";
    }
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-5 w-5" />;
      case "medium":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Emergency Alerts</h1>
          <p className="text-muted-foreground">Real-time emergency notifications</p>
        </div>

        {alerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
              <Info className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No active alerts</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${
                        alert.severity === "critical" || alert.severity === "high"
                          ? "text-destructive"
                          : alert.severity === "medium"
                          ? "text-warning"
                          : "text-primary"
                      }`}>
                        {getIcon(alert.severity)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <p className="text-sm text-muted-foreground capitalize">
                          {alert.alert_type.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getSeverityColor(alert.severity) as any} className="capitalize">
                      {alert.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{alert.message}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Issued: {new Date(alert.created_at).toLocaleString()}</span>
                    {alert.expires_at && (
                      <span>Expires: {new Date(alert.expires_at).toLocaleString()}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmergencyAlerts;
