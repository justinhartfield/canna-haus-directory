
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
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        if (!user) {
          setIsAdmin(false);
          setCheckingRole(false);
          return;
        }

        // Check if the user has the admin role using the has_role function
        const { data, error } = await supabase.rpc('has_role', {
          required_role: 'admin'
        });

        if (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
        } else {
          console.log("Admin role check result:", data);
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error("Error in admin role check:", error);
        setIsAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };

    if (!loading) {
      checkAdminRole();
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

  // If authenticated but not admin, redirect to home with error
  if (!isAdmin) {
    toast.error("You don't have permission to access the admin area", {
      duration: 3000,
      position: "top-center",
    });
    return <Navigate to="/" replace />;
  }

  // If admin, render the protected content
  return <>{children}</>;
};

export default AdminRoute;
