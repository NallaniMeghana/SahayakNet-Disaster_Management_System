import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Zap, Plus, Search } from "lucide-react";
import InstagramStoryTemplate from "@/components/InstagramStoryTemplate";
import { profileThemes } from "@/types/profileThemes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const Resources = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [resourceName, setResourceName] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [description, setDescription] = useState("");

  const { data: resources, refetch } = useQuery({ queryKey: ['resources'], queryFn: async () => { const { data, error } = await supabase.from('resources').select('*').eq('available', true).order('created_at', { ascending: false }); if (error) throw error; return data; }});

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { 
      toast.error("Please sign in");
      return; 
    }
    const { error } = await supabase.from('resources').insert({ owner_id: user.id, resource_name: resourceName, resource_type: resourceType, description, available: true });
    if (!error) { 
      toast.success("Resource added!");
      setOpen(false); 
      setResourceName(""); 
      setResourceType(""); 
      setDescription(""); 
      refetch(); 
    } else {
      toast.error("Failed to add resource");
    }
  };

  const filtered = resources?.filter(r => r.resource_name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <InstagramStoryTemplate theme={profileThemes.resources}>
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <Button 
          variant="ghost" 
          className="mb-8 text-white hover:bg-white/10"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2" />
          Back to Home
        </Button>
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-block p-6 rounded-full bg-white/10 backdrop-blur-sm mb-4"><Zap className="w-16 h-16 text-white" /></div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Resource Sharing</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">Share generators, vehicles, and supplies</p>
          </div>
          <div className="flex gap-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/90" /></div>
            <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button size="lg"><Plus className="mr-2" />Share</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Share Resource</DialogTitle></DialogHeader><form onSubmit={handleAddResource} className="space-y-4"><div><Label>Name</Label><Input value={resourceName} onChange={(e) => setResourceName(e.target.value)} required /></div><div><Label>Type</Label><Select value={resourceType} onValueChange={setResourceType} required><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Generator">Generator</SelectItem><SelectItem value="Vehicle">Vehicle</SelectItem><SelectItem value="Tools">Tools</SelectItem></SelectContent></Select></div><div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div><Button type="submit" className="w-full">Share</Button></form></DialogContent></Dialog>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{filtered?.map((r) => (<Card key={r.id} className="bg-white/90"><CardHeader><CardTitle>{r.resource_name}</CardTitle><CardDescription>{r.location || "N/A"}</CardDescription></CardHeader><CardContent><Badge>{r.resource_type}</Badge>{r.description && <p className="text-sm mt-2">{r.description}</p>}</CardContent></Card>))}</div>
        </div>
      </div>
    </InstagramStoryTemplate>
  );
};

export default Resources;
