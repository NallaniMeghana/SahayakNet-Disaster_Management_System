import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ReportIncidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReportIncidentDialog = ({ open, onOpenChange }: ReportIncidentDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    incident_type: "",
    severity: "",
    description: "",
    latitude: 0,
    longitude: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
              toast.error("You must be logged in to report an incident");
              setIsLoading(false);
              return;
            }

            // Validate incident data
            const { incidentSchema } = await import('@/lib/validationSchemas');
            const validationResult = incidentSchema.safeParse({
              ...formData,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });

            if (!validationResult.success) {
              toast.error(validationResult.error.errors[0].message);
              setIsLoading(false);
              return;
            }

            const { error } = await supabase.from("incidents").insert([{
              title: validationResult.data.title,
              incident_type: validationResult.data.incident_type,
              severity: validationResult.data.severity,
              description: validationResult.data.description,
              latitude: validationResult.data.latitude,
              longitude: validationResult.data.longitude,
              reported_by: user.id,
            }]);

            if (error) throw error;

            toast.success("Incident reported successfully");
            onOpenChange(false);
            setFormData({
              title: "",
              incident_type: "",
              severity: "",
              description: "",
              latitude: 0,
              longitude: 0,
            });
            setIsLoading(false);
          },
          (error) => {
            toast.error("Unable to get your location. Please enable location services.");
            setIsLoading(false);
          }
        );
      } else {
        toast.error("Geolocation is not supported by your browser");
        setIsLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to report incident");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report an Incident</DialogTitle>
          <DialogDescription>
            Provide details about the emergency situation
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Incident Type</Label>
            <Select
              value={formData.incident_type}
              onValueChange={(value) => setFormData({ ...formData, incident_type: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fire">Fire</SelectItem>
                <SelectItem value="flood">Flood</SelectItem>
                <SelectItem value="earthquake">Earthquake</SelectItem>
                <SelectItem value="medical">Medical Emergency</SelectItem>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severity</Label>
            <Select
              value={formData.severity}
              onValueChange={(value) => setFormData({ ...formData, severity: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Report Incident
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportIncidentDialog;
