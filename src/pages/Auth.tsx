import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Shield, Users, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import sahayaknetLogo from "@/assets/sahayaknet-logo.png";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState<"community_member" | "emergency_responder">("community_member");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate(redirectTo);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event === "SIGNED_IN") {
        navigate(redirectTo);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirectTo]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validate sign up data
        const { authSignUpSchema } = await import('@/lib/validationSchemas');
        const validationResult = authSignUpSchema.safeParse({ 
          email, 
          password, 
          fullName, 
          userType 
        });
        
        if (!validationResult.success) {
          toast.error(validationResult.error.errors[0].message);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: validationResult.data.email,
          password: validationResult.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: validationResult.data.fullName,
            },
          },
        });

        if (error) throw error;
        
        // Call secure edge function to assign role
        if (data.user) {
          const { error: roleError } = await supabase.functions.invoke('assign-user-role', {
            body: { userId: data.user.id, role: validationResult.data.userType }
          });
          
          if (roleError) {
            toast.error("Account created but role assignment failed. Please contact support.");
            setIsLoading(false);
            return;
          }
        }
        
        toast.success("Account created! Please check your email to verify.");
      } else {
        // Validate sign in data
        const { authSignInSchema } = await import('@/lib/validationSchemas');
        const validationResult = authSignInSchema.safeParse({ email, password });
        
        if (!validationResult.success) {
          toast.error(validationResult.error.errors[0].message);
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: validationResult.data.email,
          password: validationResult.data.password,
        });

        if (error) throw error;
        toast.success("Signed in successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-5xl">
        <Button 
          onClick={() => navigate("/")} 
          variant="ghost" 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <div className="text-center mb-8">
          <img src={sahayaknetLogo} alt="SahayakNet" className="h-20 w-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground">Welcome to SahayakNet</h1>
          <p className="text-muted-foreground mt-2">Community Disaster Management Platform</p>
        </div>

        <Tabs defaultValue="community_member" className="w-full" onValueChange={(value) => setUserType(value as typeof userType)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="community_member" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Community Member
            </TabsTrigger>
            <TabsTrigger value="emergency_responder" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Emergency Responder
            </TabsTrigger>
          </TabsList>

          <TabsContent value="community_member">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">
                  {isSignUp ? "Join as Community Member" : "Community Member Sign In"}
                </CardTitle>
                <CardDescription>
                  {isSignUp
                    ? "Register to connect with your local emergency network"
                    : "Access your community dashboard"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAuth} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSignUp ? "Sign Up" : "Sign In"}
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-primary hover:underline"
                  >
                    {isSignUp
                      ? "Already have an account? Sign in"
                      : "Don't have an account? Sign up"}
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency_responder">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">
                  {isSignUp ? "Register as Emergency Responder" : "Responder Sign In"}
                </CardTitle>
                <CardDescription>
                  {isSignUp
                    ? "Join the emergency response team"
                    : "Access emergency management dashboard"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAuth} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="responderName">Full Name</Label>
                      <Input
                        id="responderName"
                        placeholder="Jane Smith"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="responderEmail">Email</Label>
                    <Input
                      id="responderEmail"
                      type="email"
                      placeholder="responder@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responderPassword">Password</Label>
                    <Input
                      id="responderPassword"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSignUp ? "Sign Up" : "Sign In"}
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-primary hover:underline"
                  >
                    {isSignUp
                      ? "Already have an account? Sign in"
                      : "Don't have an account? Sign up"}
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
