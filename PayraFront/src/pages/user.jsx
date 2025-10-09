import React, { useState } from "react";
import Login from "../components/User/Login";
import Signup from "../components/User/Signup";    

export default function AuthPage() {
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
        {/* ... Headers ... */}

        {isLogin ? (
          <Login onToggleForm={switchToSignup} /> 
        ) : (
          <Signup onToggleForm={switchToLogin} />
        )}
      </div>
    </div>
  );
}