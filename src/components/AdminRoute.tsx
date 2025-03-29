
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkAuthorizedRole = async () => {
      try {
        if (!user) {
          setIsAuthorized(false);
          setCheckingRole(false);
          return;
        }

        // Check if the user has either the admin or user role
        const adminCheck = await supabase.rpc('has_role', {
          required_role: 'admin'
        });
        
        const userCheck = await supabase.rpc('has_role', {
          required_role: 'user'
        });

        if (adminCheck.error && userCheck.error) {
          console.error("Error checking roles:", adminCheck.error);
          setIsAuthorized(false);
        } else {
          // User is authorized if they have either admin or user role
          setIsAuthorized(!!(adminCheck.data || userCheck.data));
        }
      } catch (error) {
        console.error("Error in role check:", error);
        setIsAuthorized(false);
      } finally {
        setCheckingRole(false);
      }
    };

    if (!loading) {
      checkAuthorizedRole();
    }
  }, [user, loading]);

  // Show loading while checking authentication and role
  if (loading || checkingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    toast.error("You need to sign in to access this page", {
      duration: 3000,
      position: "top-center",
    });
    return <Navigate to="/auth" replace />;
  }

  // If authenticated but not authorized, redirect to home with error
  if (!isAuthorized) {
    toast.error("You don't have permission to access the admin area", {
      duration: 3000,
      position: "top-center",
    });
    return <Navigate to="/" replace />;
  }

  // If authorized, render the protected content
  return <>{children}</>;
};

export default AdminRoute;
