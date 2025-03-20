
import { useState } from "react";
import { useAuth as useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const { signIn, signUp, loading } = useAuthContext();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [formError, setFormError] = useState<string | null>(null);

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
    loading,
    handleAuth
  };
};
