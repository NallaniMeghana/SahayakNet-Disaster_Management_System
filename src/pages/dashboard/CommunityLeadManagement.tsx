import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CommunityLeadManagement = () => {
  const navigate = useNavigate();
  const [isResponder, setIsResponder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (roleData?.role === 'emergency_responder') {
        setIsResponder(true);
        loadMembers();
        loadLeads();
      } else {
        setIsResponder(false);
      }
    } catch (error) {
      console.error("Error checking access:", error);
      setIsResponder(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, user_roles!inner(role)")
        .eq("user_roles.role", "community_member");

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error("Error loading members:", error);
    }
  };

  const loadLeads = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id, profiles(full_name, phone)")
        .eq("role", "community_lead");

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error("Error loading leads:", error);
    }
  };

  const appointAsLead = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "community_lead" });

      if (error) throw error;

      toast.success("Community lead appointed successfully!");
      loadMembers();
      loadLeads();
    } catch (error: any) {
      toast.error(error.message || "Failed to appoint community lead");
    }
  };

  const removeLead = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "community_lead");

      if (error) throw error;

      toast.success("Community lead role removed");
      loadMembers();
      loadLeads();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove lead role");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isResponder) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Community Lead Management</h1>
            <p className="text-muted-foreground">
              Access restricted to emergency responders only
            </p>
          </div>

          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              This section is only accessible to Emergency Responders.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Award className="h-8 w-8 text-primary" />
            Community Lead Management
          </h1>
          <p className="text-muted-foreground">
            Appoint community members as leads to help during emergencies
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Current Community Leads
            </CardTitle>
            <CardDescription>
              These members have been appointed to help coordinate emergency response
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leads.length > 0 ? (
              <div className="space-y-3">
                {leads.map((lead: any) => (
                  <div key={lead.user_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{lead.profiles?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{lead.profiles?.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Community Lead</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeLead(lead.user_id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No community leads appointed yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appoint New Community Lead</CardTitle>
            <CardDescription>
              Select community members to appoint as leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members.map((member: any) => {
                const isLead = leads.some((l: any) => l.user_id === member.user_id);
                return (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{member.full_name}</p>
                      <p className="text-sm text-muted-foreground">{member.phone}</p>
                    </div>
                    {!isLead && (
                      <Button
                        size="sm"
                        onClick={() => appointAsLead(member.user_id)}
                      >
                        Appoint as Lead
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CommunityLeadManagement;
