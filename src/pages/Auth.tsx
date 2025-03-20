
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth as useAuthContext } from "@/context/AuthContext";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const { user } = useAuthContext();
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
    // Redirect if user is already logged in
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

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
