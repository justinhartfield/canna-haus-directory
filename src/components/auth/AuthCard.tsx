
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { AuthForm } from "./AuthForm";

interface AuthCardProps {
  authMode: "signin" | "signup";
  loading: boolean;
  formError: string | null;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onModeChange: () => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  fullName: string;
  setFullName: (value: string) => void;
}

export const AuthCard = ({
  authMode,
  loading,
  formError,
  onSubmit,
  onModeChange,
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
}: AuthCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{authMode === "signin" ? "Welcome Back" : "Create an Account"}</CardTitle>
        <CardDescription>
          {authMode === "signin" 
            ? "Enter your credentials to access your account" 
            : "Fill in your details to create a new account"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <AuthForm
          authMode={authMode}
          loading={loading}
          formError={formError}
          onSubmit={onSubmit}
          onModeChange={onModeChange}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          fullName={fullName}
          setFullName={setFullName}
        />
      </CardContent>
    </Card>
  );
};
