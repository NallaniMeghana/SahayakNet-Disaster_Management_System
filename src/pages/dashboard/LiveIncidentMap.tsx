import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Incident {
  id: string;
  title: string;
  incident_type: string;
  severity: string;
  description: string;
  latitude: number;
  longitude: number;
  created_at: string;
  status: string;
}

const LiveIncidentMap = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [center, setCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIncidents();
    getUserLocation();
    setupRealtimeSubscription();
  }, []);

  const loadIncidents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("incidents")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading incidents:", error);
        toast.error("Failed to load incidents");
        return;
      }
      
      setIncidents(data || []);
    } catch (error) {
      console.error("Error loading incidents:", error);
      toast.error("An error occurred while loading incidents");
    } finally {
      setIsLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log("Geolocation error:", error.message);
        }
      );
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("incidents-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "incidents" },
        (payload) => {
          const newIncident = payload.new as Incident;
          if (newIncident.status === "active") {
            setIncidents((prev) => [newIncident, ...prev]);
            toast.info(`New incident reported: ${newIncident.title}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getSeverityColor = (severity: string) => {
    const severityLower = severity?.toLowerCase() || "";
    switch (severityLower) {
      case "critical":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Live Incident Map</h1>
          <p className="text-muted-foreground">Real-time visualization of active incidents</p>
        </div>

        <Card className="overflow-hidden">
          <div style={{ height: "600px", width: "100%" }}>
            <MapContainer
              center={center}
              zoom={6}
              style={{ height: "100%", width: "100%" }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {incidents.map((incident) => (
                <Marker
                  key={incident.id}
                  position={[incident.latitude, incident.longitude]}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertTriangle className={`h-5 w-5 ${getSeverityColor(incident.severity)}`} />
                        <div className="flex-1">
                          <h3 className="font-bold">{incident.title}</h3>
                          <p className="text-sm capitalize text-muted-foreground">{incident.incident_type}</p>
                        </div>
                      </div>
                      {incident.description && (
                        <p className="text-sm mb-2">{incident.description}</p>
                      )}
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className={`capitalize font-medium ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </span>
                        <span>{new Date(incident.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {["critical", "high", "medium", "low"].map((severity) => {
            const count = incidents.filter((i) => i.severity?.toLowerCase() === severity).length;
            return (
              <Card key={severity} className="p-4">
                <div className="flex items-center justify-between">
                  <span className={`font-medium capitalize ${getSeverityColor(severity)}`}>
                    {severity}
                  </span>
                  <span className="text-2xl font-bold">{count}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LiveIncidentMap;
