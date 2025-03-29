
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  // Add console log to debug authentication state
  console.log("ProtectedRoute state:", { user: !!user, loading, authChecked });

  useEffect(() => {
    // Only redirect if not loading and no user
    if (!loading) {
      setAuthChecked(true);
      if (!user) {
        console.log("User not authenticated, redirecting to /auth");
        toast.error("You need to sign in to access this page", {
          duration: 3000,
          position: "top-center",
        });
        navigate("/auth", { replace: true });
      } else {
        console.log("User is authenticated, allowing access");
      }
    }
  }, [loading, user, navigate]);

  if (loading || !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Second check as a fallback - if no user and not loading, redirect
  if (!user) {
    console.log("Fallback redirect triggered in ProtectedRoute");
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
