
import { useState } from "react";
import { useAuth as useAuthContext } from "@/context/AuthContext";

export const useAuth = () => {
  const { signIn, signUp, loading: authLoading } = useAuthContext();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);
    
    try {
      if (authMode === "signin") {
        await signIn(email, password);
      } else {
        if (!fullName.trim()) {
          setFormError("Full name is required");
          setLoading(false);
          return;
        }
        await signUp(email, password, fullName);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setFormError(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    authMode,
    setAuthMode,
    formError,
    loading: loading || authLoading, // Combine both loading states
    handleAuth
  };
};
