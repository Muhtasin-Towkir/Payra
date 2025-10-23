import React, { useState } from "react";
import { useAuth } from "../context/authContext.jsx";
import { Navigate } from 'react-router-dom';
import Signup from "../components/User/Signup.jsx";
import Login from "../components/User/Login.jsx";

export default function UserPage() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl animate-pulse">Loading Session...</p>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard/profile" replace /> : <AuthForms />;
}

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToSignup = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {isLogin ? (
          <Login onToggleForm={switchToSignup} />
        ) : (
          <Signup onToggleForm={switchToLogin} />
        )}
      </div>
    </div>
  );
};

