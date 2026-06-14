import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Plus } from "lucide-react";
import InstagramStoryTemplate from "@/components/InstagramStoryTemplate";
import { profileThemes } from "@/types/profileThemes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const Registry = () => {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [vulnerabilityTypes, setVulnerabilityTypes] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [specialNeeds, setSpecialNeeds] = useState("");

  const { data: registries, refetch } = useQuery({
    queryKey: ['vulnerability_registry'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vulnerability_registry')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please sign in to add registry entries");
      return;
    }

    const typesArray = vulnerabilityTypes.split(',').map(t => t.trim()).filter(t => t);

    // Validate registry data
    const { registrySchema } = await import('@/lib/validationSchemas');
    const validationResult = registrySchema.safeParse({
      full_name: fullName,
      phone,
      address,
      vulnerability_type: typesArray,
      medical_conditions: medicalConditions,
      emergency_contact: emergencyContact,
      special_needs: specialNeeds
    });

    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
      return;
    }

    const { error } = await supabase.from('vulnerability_registry').insert([{
      user_id: user.id,
      full_name: validationResult.data.full_name,
      phone: validationResult.data.phone,
      address: validationResult.data.address,
      vulnerability_type: validationResult.data.vulnerability_type,
      medical_conditions: validationResult.data.medical_conditions,
      emergency_contact: validationResult.data.emergency_contact,
      special_needs: validationResult.data.special_needs
    }]);

    if (error) {
      toast.error("Failed to add entry. Please try again.");
    } else {
      toast.success("Registry entry added successfully!");
      setOpen(false);
      setFullName("");
      setPhone("");
      setAddress("");
      setVulnerabilityTypes("");
      setMedicalConditions("");
      setEmergencyContact("");
      setSpecialNeeds("");
      refetch();
    }
  };

  return (
    <InstagramStoryTemplate theme={profileThemes.vulnerability}>
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <Link to="/">
          <Button variant="ghost" className="mb-8 text-white hover:bg-white/10">
            <ArrowLeft className="mr-2" />
            Back to Home
          </Button>
        </Link>
        
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-block p-6 rounded-full bg-white/10 backdrop-blur-sm mb-4">
              <Heart className="w-16 h-16 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Vulnerability Registry
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Private registry to ensure vulnerable members receive help first
            </p>
          </div>

          <div className="flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Registry Entry</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddEntry} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="vulnerabilityTypes">Vulnerability Types (comma-separated)</Label>
                    <Input 
                      id="vulnerabilityTypes" 
                      placeholder="e.g., Elderly, Mobility Issues, Medical"
                      value={vulnerabilityTypes} 
                      onChange={(e) => setVulnerabilityTypes(e.target.value)} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="medicalConditions">Medical Conditions</Label>
                    <Textarea id="medicalConditions" value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input id="emergencyContact" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="specialNeeds">Special Needs</Label>
                    <Textarea id="specialNeeds" value={specialNeeds} onChange={(e) => setSpecialNeeds(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full">Add Entry</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {registries?.map((entry) => (
              <Card key={entry.id} className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{entry.full_name}</CardTitle>
                  <CardDescription>{entry.phone}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm"><strong>Address:</strong> {entry.address}</p>
                  <div className="flex gap-2 flex-wrap">
                    {entry.vulnerability_type?.map((type: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{type}</Badge>
                    ))}
                  </div>
                  {entry.medical_conditions && (
                    <p className="text-sm"><strong>Medical:</strong> {entry.medical_conditions}</p>
                  )}
                  {entry.special_needs && (
                    <p className="text-sm"><strong>Special Needs:</strong> {entry.special_needs}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </InstagramStoryTemplate>
  );
};

export default Registry;