import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Package, MapPin, Phone, Filter, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Resource {
  id: string;
  resource_name: string;
  resource_type: string;
  description: string;
  location: string;
  contact_info: string;
  available: boolean;
  owner_id: string;
}

const ResourceSharing = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    loadResources();

    // Set up realtime subscription
    const channel = supabase
      .channel("resources-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "resources" },
        () => {
          loadResources();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("available", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error: any) {
      console.error("Failed to load resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.resource_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesType = filterType === "all" || resource.resource_type === filterType;
    return matchesSearch && matchesType;
  });

  const resourceTypes = [
    { value: "all", label: "All Types" },
    { value: "medical_supplies", label: "Medical Supplies" },
    { value: "food_&_water", label: "Food & Water" },
    { value: "shelter", label: "Shelter" },
    { value: "transportation", label: "Transportation" },
    { value: "equipment", label: "Equipment" },
    { value: "other", label: "Other" },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Resource Sharing</h1>
          <p className="text-muted-foreground">
            Browse and request available community resources
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <Card key={resource.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{resource.resource_name}</CardTitle>
                  </div>
                  <Badge variant="default" className="capitalize">
                    {resource.resource_type.replace(/_/g, " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {resource.description && (
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                )}
                {resource.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{resource.location}</span>
                  </div>
                )}
                {resource.contact_info && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{resource.contact_info}</span>
                  </div>
                )}
                <Button className="w-full mt-4" variant="outline">
                  Request Resource
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
              <Package className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchTerm || filterType !== "all"
                  ? "No resources found matching your criteria"
                  : "No resources available yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResourceSharing;
