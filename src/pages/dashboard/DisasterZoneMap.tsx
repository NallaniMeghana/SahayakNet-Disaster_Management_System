import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { MapContainer, TileLayer, Circle, Popup, Marker } from "react-leaflet";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AlertTriangle, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface DisasterZone {
  id: string;
  zone_name: string;
  zone_type: string;
  risk_level: string;
  latitude: number;
  longitude: number;
  radius: number;
  description: string;
  last_incident?: string;
}

const DisasterZoneMap = () => {
  const [disasterZones, setDisasterZones] = useState<DisasterZone[]>([]);
  const [center, setCenter] = useState<[number, number]>([20.5937, 78.9629]); // India center

  useEffect(() => {
    loadDisasterZones();

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  const loadDisasterZones = async () => {
    try {
      const { data, error } = await supabase
        .from("disaster_zones")
        .select("*")
        .order("risk_level", { ascending: false });

      if (error) throw error;
      setDisasterZones(data || []);
    } catch (error: any) {
      console.error("Failed to load disaster zones:", error);
    }
  };

  const getZoneColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case "critical":
        return "#ef4444"; // red
      case "high":
        return "#f97316"; // orange
      case "medium":
        return "#eab308"; // yellow
      case "low":
        return "#3b82f6"; // blue
      default:
        return "#6b7280"; // gray
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case "critical":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MapPin className="h-8 w-8 text-destructive" />
            Disaster-Prone Areas
          </h1>
          <p className="text-muted-foreground">
            Interactive map showing high-risk zones and disaster-prone areas
          </p>
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
              {disasterZones.map((zone) => (
                <>
                  <Circle
                    key={`circle-${zone.id}`}
                    center={[zone.latitude, zone.longitude]}
                    radius={zone.radius}
                    pathOptions={{
                      color: getZoneColor(zone.risk_level),
                      fillColor: getZoneColor(zone.risk_level),
                      fillOpacity: 0.3,
                      weight: 2,
                    }}
                  />
                  <Marker
                    key={`marker-${zone.id}`}
                    position={[zone.latitude, zone.longitude]}
                  >
                    <Popup>
                      <div className="p-2 min-w-[250px]">
                        <div className="flex items-start gap-2 mb-3">
                          <AlertTriangle className={`h-5 w-5`} style={{ color: getZoneColor(zone.risk_level) }} />
                          <div className="flex-1">
                            <h3 className="font-bold text-base mb-1">{zone.zone_name}</h3>
                            <p className="text-sm capitalize text-muted-foreground">{zone.zone_type}</p>
                          </div>
                        </div>
                        {zone.description && (
                          <p className="text-sm mb-3">{zone.description}</p>
                        )}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium">Risk Level:</span>
                            <Badge variant={getRiskBadgeVariant(zone.risk_level) as any}>
                              {zone.risk_level}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium">Coverage:</span>
                            <span className="text-xs">{(zone.radius / 1000).toFixed(1)} km radius</span>
                          </div>
                          {zone.last_incident && (
                            <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                              Last incident: {new Date(zone.last_incident).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                </>
              ))}
            </MapContainer>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {["critical", "high", "medium", "low"].map((riskLevel) => {
            const count = disasterZones.filter((z) => z.risk_level.toLowerCase() === riskLevel).length;
            return (
              <Card key={riskLevel} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: getZoneColor(riskLevel) }}
                    />
                    <span className="font-medium capitalize">{riskLevel} Risk</span>
                  </div>
                  <span className="text-2xl font-bold">{count}</span>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Disaster Zone Legend</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-destructive" />
                <div>
                  <p className="font-medium">Critical Risk</p>
                  <p className="text-sm text-muted-foreground">Immediate danger, evacuate immediately</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-warning" />
                <div>
                  <p className="font-medium">High Risk</p>
                  <p className="text-sm text-muted-foreground">High probability of disaster occurrence</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-secondary" />
                <div>
                  <p className="font-medium">Medium Risk</p>
                  <p className="text-sm text-muted-foreground">Moderate risk, stay alert</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-primary" />
                <div>
                  <p className="font-medium">Low Risk</p>
                  <p className="text-sm text-muted-foreground">Low probability, monitor regularly</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DisasterZoneMap;
