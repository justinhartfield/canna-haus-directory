
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth as useAuthContext } from "@/context/AuthContext";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const { user, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  
  const {
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
  } = useAuth();

  useEffect(() => {
    // Redirect if user is already logged in and auth is not still loading
    if (user && !authLoading) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  // Don't render anything while checking auth state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <div className="w-full max-w-md">
        <AuthTabs
          authMode={authMode}
          setAuthMode={setAuthMode}
          loading={loading}
          formError={formError}
          onSubmit={handleAuth}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          fullName={fullName}
          setFullName={setFullName}
        />
      </div>
    </div>
  );
};

export default Auth;
