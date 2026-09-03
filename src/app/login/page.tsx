"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";

import Logo from "@/components/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER"); // CUSTOMER, MANAGER, ADMIN
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshAuth } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to login");
      }

      await refreshAuth();

      // Redirect based on role
      if (data.user.role === "CUSTOMER") router.push("/customer/dashboard");
      else if (data.user.role === "MANAGER") router.push("/manager/dashboard");
      else if (data.user.role === "ADMIN") router.push("/admin/dashboard");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-20 animate-fade-in flex justify-center min-h-[70vh] items-center">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-muted">Sign in to your SS Hair Studio account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-error p-3 rounded-md mb-6 border border-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group mb-6">
            <label className="form-label text-sm text-gray-500 mb-2">Login As</label>
            <div className="flex gap-2">
              {['CUSTOMER', 'MANAGER', 'ADMIN'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 text-xs rounded-md border ${
                    role === r 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-transparent text-gray-600 border-border hover:border-gray-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <div className="flex justify-between items-center mb-1">
              <label className="form-label mb-0" htmlFor="password">Password</label>
              {role === "CUSTOMER" && (
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full mt-4"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}
