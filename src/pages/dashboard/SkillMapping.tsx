import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";

interface Skill {
  id: string;
  skill_name: string;
  skill_category: string;
  proficiency_level: string;
  available: boolean;
}

const SkillMapping = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    skill_name: "",
    skill_category: "",
    proficiency_level: "",
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;
      setSkills(data || []);
    } catch (error: any) {
      toast.error("Failed to load skills");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("skills").insert({
        ...formData,
        user_id: user?.id,
      });

      if (error) throw error;
      toast.success("Skill added successfully");
      setIsDialogOpen(false);
      setFormData({ skill_name: "", skill_category: "", proficiency_level: "" });
      loadSkills();
    } catch (error: any) {
      toast.error(error.message || "Failed to add skill");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
      toast.success("Skill deleted");
      loadSkills();
    } catch (error: any) {
      toast.error("Failed to delete skill");
    }
  };

  const categories = ["Medical", "Technical", "Construction", "Communication", "Leadership", "Other"];
  const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

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
            <h1 className="text-3xl font-bold">My Skills</h1>
            <p className="text-muted-foreground">Manage your skills for emergency response</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Skill</DialogTitle>
                <DialogDescription>Add a skill you can contribute during emergencies</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skill_name">Skill Name</Label>
                  <Input
                    id="skill_name"
                    value={formData.skill_name}
                    onChange={(e) => setFormData({ ...formData, skill_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.skill_category}
                    onValueChange={(value) => setFormData({ ...formData, skill_category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proficiency">Proficiency Level</Label>
                  <Select
                    value={formData.proficiency_level}
                    onValueChange={(value) => setFormData({ ...formData, proficiency_level: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {proficiencyLevels.map((level) => (
                        <SelectItem key={level} value={level.toLowerCase()}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Add Skill</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <Card key={skill.id}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{skill.skill_name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(skill.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium capitalize">{skill.skill_category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Proficiency:</span>
                  <span className="font-medium capitalize">{skill.proficiency_level}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available:</span>
                  <span className={`font-medium ${skill.available ? 'text-success' : 'text-muted-foreground'}`}>
                    {skill.available ? "Yes" : "No"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {skills.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
              <p className="text-muted-foreground">No skills added yet</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Skill
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SkillMapping;
