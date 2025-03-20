
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    try {
      if (authMode === "signin") {
        await signIn(email, password);
      } else {
        if (!fullName.trim()) {
          setFormError("Full name is required");
          return;
        }
        await signUp(email, password, fullName);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setFormError(error.message || "Authentication failed");
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <div className="w-full max-w-md">
        <Tabs defaultValue="signin" value={authMode} onValueChange={(value) => setAuthMode(value as "signin" | "signup")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{authMode === "signin" ? "Welcome Back" : "Create an Account"}</CardTitle>
              <CardDescription>
                {authMode === "signin" 
                  ? "Enter your credentials to access your account" 
                  : "Fill in your details to create a new account"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                {formError && (
                  <Alert variant="destructive">
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}
                
                {authMode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
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
                    minLength={6}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {authMode === "signin" ? "Signing In..." : "Signing Up..."}
                    </>
                  ) : (
                    authMode === "signin" ? "Sign In" : "Sign Up"
                  )}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center text-sm text-muted-foreground">
              {authMode === "signin" 
                ? "Don't have an account? " 
                : "Already have an account? "}
              <Button 
                variant="link" 
                className="px-1" 
                onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
              >
                {authMode === "signin" ? "Sign Up" : "Sign In"}
              </Button>
            </CardFooter>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
