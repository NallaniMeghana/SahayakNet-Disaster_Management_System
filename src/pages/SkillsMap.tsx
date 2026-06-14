import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Plus, Search } from "lucide-react";
import InstagramStoryTemplate from "@/components/InstagramStoryTemplate";
import { profileThemes } from "@/types/profileThemes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const SkillsMap = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [open, setOpen] = useState(false);

  const { data: skills, refetch } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase.from('skills').select('*').eq('available', true).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { 
      toast.error("Please sign in");
      return; 
    }
    const { error } = await supabase.from('skills').insert({ user_id: user.id, skill_name: skillName, skill_category: skillCategory, proficiency_level: proficiency, available: true });
    if (!error) { 
      toast.success("Skill added!");
      setOpen(false); 
      setSkillName(""); 
      setSkillCategory(""); 
      setProficiency(""); 
      refetch(); 
    } else {
      toast.error("Failed to add skill");
    }
  };

  const filteredSkills = skills?.filter(skill => skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase()) || skill.skill_category.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <InstagramStoryTemplate theme={profileThemes.skills}>
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
            <div className="inline-block p-6 rounded-full bg-white/10 backdrop-blur-sm mb-4"><Users className="w-16 h-16 text-white" /></div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Community Skills Map</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">Connect with neighbors who have critical skills</p>
          </div>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search skills..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/90" />
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button size="lg"><Plus className="mr-2 h-5 w-5" />Add Skill</Button></DialogTrigger>
              <DialogContent><DialogHeader><DialogTitle>Add Your Skill</DialogTitle></DialogHeader>
                <form onSubmit={handleAddSkill} className="space-y-4">
                  <div><Label>Skill Name</Label><Input value={skillName} onChange={(e) => setSkillName(e.target.value)} required /></div>
                  <div><Label>Category</Label><Select value={skillCategory} onValueChange={setSkillCategory} required><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent><SelectItem value="Medical">Medical</SelectItem><SelectItem value="Engineering">Engineering</SelectItem><SelectItem value="First Aid">First Aid</SelectItem></SelectContent></Select></div>
                  <div><Label>Proficiency</Label><Select value={proficiency} onValueChange={setProficiency} required><SelectTrigger><SelectValue placeholder="Select proficiency" /></SelectTrigger><SelectContent><SelectItem value="Beginner">Beginner</SelectItem><SelectItem value="Intermediate">Intermediate</SelectItem><SelectItem value="Expert">Expert</SelectItem></SelectContent></Select></div>
                  <Button type="submit" className="w-full">Add Skill</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills?.map((skill) => (
              <Card key={skill.id} className="bg-white/90 backdrop-blur-sm"><CardHeader><CardTitle>{skill.skill_name}</CardTitle><CardDescription>Community Member</CardDescription></CardHeader><CardContent><div className="flex gap-2 flex-wrap"><Badge variant="secondary">{skill.skill_category}</Badge><Badge variant="outline">{skill.proficiency_level}</Badge></div></CardContent></Card>
            ))}
          </div>
        </div>
      </div>
    </InstagramStoryTemplate>
  );
};

export default SkillsMap;
