
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthCard } from "./AuthCard";

interface AuthTabsProps {
  authMode: "signin" | "signup";
  setAuthMode: (mode: "signin" | "signup") => void;
  loading: boolean;
  formError: string | null;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  fullName: string;
  setFullName: (value: string) => void;
}

export const AuthTabs = ({
  authMode,
  setAuthMode,
  loading,
  formError,
  onSubmit,
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
}: AuthTabsProps) => {
  const handleModeChange = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
  };

  return (
    <Tabs 
      defaultValue="signin" 
      value={authMode} 
      onValueChange={(value) => setAuthMode(value as "signin" | "signup")}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      
      <div className="mt-6">
        <AuthCard 
          authMode={authMode}
          loading={loading}
          formError={formError}
          onSubmit={onSubmit}
          onModeChange={handleModeChange}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          fullName={fullName}
          setFullName={setFullName}
        />
      </div>
    </Tabs>
  );
};
