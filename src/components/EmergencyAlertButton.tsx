import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const EmergencyAlertButton = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to send an alert");
        return;
      }

      const { error } = await supabase.from("alerts").insert({
        title,
        message,
        severity,
        alert_type: alertType,
        created_by: user.id,
        status: "active",
      });

      if (error) {
        console.error("Error sending alert:", error);
        toast.error("Failed to send alert");
        return;
      }
      
      toast.success("Emergency alert sent!", {
        description: "All community members will be notified."
      });
      setOpen(false);
      setTitle("");
      setMessage("");
      setSeverity("");
      setAlertType("");
    } catch (error) {
      console.error("Error sending alert:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-50 bg-emergency hover:bg-emergency/90 text-emergency-foreground shadow-lg"
        size="lg"
      >
        <AlertTriangle className="mr-2 h-5 w-5" />
        Emergency Alert
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-emergency flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Send Emergency Alert
            </DialogTitle>
            <DialogDescription>
              Send an urgent alert to all community members
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Alert Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Flash Flood Warning"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Detailed alert message..."
              />
            </div>
            <div>
              <Label htmlFor="alertType">Alert Type</Label>
              <Select value={alertType} onValueChange={setAlertType} required>
                <SelectTrigger id="alertType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fire">Fire</SelectItem>
                  <SelectItem value="Flood">Flood</SelectItem>
                  <SelectItem value="Earthquake">Earthquake</SelectItem>
                  <SelectItem value="Medical">Medical Emergency</SelectItem>
                  <SelectItem value="Weather">Severe Weather</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="severity">Severity</Label>
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
            <Button type="submit" className="w-full bg-emergency hover:bg-emergency/90">
              Send Alert Now
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
