import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Resource {
  id: string;
  resource_name: string;
  resource_type: string;
  description: string;
  location: string;
  contact_info: string;
  available: boolean;
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    resource_name: "",
    resource_type: "",
    description: "",
    location: "",
    contact_info: "",
    available: true,
  });

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("owner_id", user?.id);

      if (error) throw error;
      setResources(data || []);
    } catch (error: any) {
      toast.error("Failed to load resources");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (editingResource) {
        const { error } = await supabase
          .from("resources")
          .update(formData)
          .eq("id", editingResource.id);
        if (error) throw error;
        toast.success("Resource updated successfully");
      } else {
        const { error } = await supabase.from("resources").insert({
          ...formData,
          owner_id: user?.id,
        });
        if (error) throw error;
        toast.success("Resource added successfully");
      }

      setIsDialogOpen(false);
      setEditingResource(null);
      setFormData({
        resource_name: "",
        resource_type: "",
        description: "",
        location: "",
        contact_info: "",
        available: true,
      });
      loadResources();
    } catch (error: any) {
      toast.error(error.message || "Failed to save resource");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("resources").delete().eq("id", id);
      if (error) throw error;
      toast.success("Resource deleted");
      loadResources();
    } catch (error: any) {
      toast.error("Failed to delete resource");
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      resource_name: resource.resource_name,
      resource_type: resource.resource_type,
      description: resource.description || "",
      location: resource.location || "",
      contact_info: resource.contact_info || "",
      available: resource.available,
    });
    setIsDialogOpen(true);
  };

  const resourceTypes = ["Medical Supplies", "Food & Water", "Shelter", "Transportation", "Equipment", "Other"];

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Resources</h1>
            <p className="text-muted-foreground">Manage resources you can share during emergencies</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingResource(null);
              setFormData({
                resource_name: "",
                resource_type: "",
                description: "",
                location: "",
                contact_info: "",
                available: true,
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingResource ? "Edit Resource" : "Add New Resource"}</DialogTitle>
                <DialogDescription>
                  {editingResource ? "Update your resource details" : "Add a resource you can share"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resource_name">Resource Name</Label>
                  <Input
                    id="resource_name"
                    value={formData.resource_name}
                    onChange={(e) => setFormData({ ...formData, resource_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.resource_type}
                    onValueChange={(value) => setFormData({ ...formData, resource_type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '_')}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Info</Label>
                  <Input
                    id="contact"
                    value={formData.contact_info}
                    onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                  />
                  <Label htmlFor="available">Currently Available</Label>
                </div>
                <Button type="submit" className="w-full">
                  {editingResource ? "Update Resource" : "Add Resource"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((resource) => (
            <Card key={resource.id}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{resource.resource_name}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(resource)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(resource.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize">{resource.resource_type.replace(/_/g, ' ')}</span>
                </div>
                {resource.description && (
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                )}
                {resource.location && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{resource.location}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`font-medium ${resource.available ? 'text-success' : 'text-muted-foreground'}`}>
                    {resource.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {resources.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
              <p className="text-muted-foreground">No resources added yet</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Resource
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Resources;
