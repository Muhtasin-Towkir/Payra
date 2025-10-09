import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login({ onToggleForm }) { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    console.log("Login:", { email, password });
  };
  
  const handleToggleAndClear = () => {
    setError(""); 
    
    if (typeof onToggleForm === 'function') {
        onToggleForm(); 
    } else {
        console.error("onToggleForm prop is NOT a function!", onToggleForm); 
    }
  };

  const darkGreen = "#004C04";
  const labelColor = "#72A274";

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <h2 className="text-3xl text-center font-bold pb-3" style={{ color: darkGreen }}>
        Welcome Back
      </h2>
      <p className="text-gray-500 text-center mb-8">Sign in to continue to your account</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: labelColor }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[${labelColor}] focus:border-[${labelColor}] outline-none transition-colors ${
              error.includes("email") ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: labelColor }}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[${labelColor}] focus:border-[${labelColor}] outline-none transition-colors ${
                error.includes("Password") ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {error && <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>}

        <div className="pt-4 flex justify-center">
        <button
          type="submit"
          className="w-3xl  sm:w-auto bg-[#4805] hover:bg-[#94BC96] text-gray-900 font-semibold py-3 px-6 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          Login
        </button>
      </div>
      </form>
      
      {/* TOGGLE BUTTON */}
      <div className="text-sm text-center text-gray-500 mt-6">
        Did you not register yet?{" "}
        <button
          type="button"
          onClick={handleToggleAndClear}
          className="font-semibold underline underline-offset-4 transition-colors"
          style={{ color: darkGreen }}
        >
          Register Now!
        </button>
      </div>
    </div>
  );
}
