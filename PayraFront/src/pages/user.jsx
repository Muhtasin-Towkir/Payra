import { useState } from "react"
import { LoginForm } from "../components/User/login"
import { SignupForm } from "../components/User/signup"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-muted-foreground">
            {isLogin ? "Sign in to continue to your account" : "Sign up to get started"}
          </p>
        </div>

        {isLogin ? (
          <LoginForm onToggleForm={() => setIsLogin(false)} />
        ) : (
          <SignupForm onToggleForm={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
}

