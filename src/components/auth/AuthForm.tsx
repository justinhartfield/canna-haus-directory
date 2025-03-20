
import React from "react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface AuthFormProps {
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

export const AuthForm = ({
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
}: AuthFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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

      <div className="text-center text-sm text-muted-foreground">
        {authMode === "signin" 
          ? "Don't have an account? " 
          : "Already have an account? "}
        <Button 
          variant="link" 
          className="px-1" 
          onClick={onModeChange}
          type="button"
        >
          {authMode === "signin" ? "Sign Up" : "Sign In"}
        </Button>
      </div>
    </form>
  );
};
