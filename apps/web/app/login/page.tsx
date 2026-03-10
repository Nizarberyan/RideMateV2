"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { client } from "../../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await client.auth.login({ email, password });
      login(res);
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 bg-black-brand relative overflow-hidden items-end p-16">
        {/* Lime geometric blobs */}
        <div className="absolute top-0 right-0 w-[60%] h-[45%] bg-lime-brand rounded-bl-[120px]" />
        <div className="absolute bottom-[30%] left-[-10%] w-[50%] h-[50%] bg-lime-brand/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-16">
            <div className="bg-lime-brand text-black-brand px-2 py-0.5 rounded-md text-xl font-extrabold">
              RM
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              RideMate
            </span>
          </Link>
          <h2 className="text-5xl font-bold text-white leading-tight mb-4">
            Welcome
            <br />
            <span className="text-lime-brand">back.</span>
          </h2>
          <p className="text-white/60 text-sm max-w-xs">
            Your experimental mobility platform awaits. Continue where you left
            off.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="bg-lime-brand text-black-brand px-2 py-0.5 rounded-md text-xl font-extrabold">
            RM
          </div>
          <span className="text-2xl font-bold text-black-brand tracking-tight">
            RideMate
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black-brand mb-2">
              Sign in
            </h1>
            <p className="text-gray-brand text-sm">
              Enter your credentials to access your account.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-black-brand">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                className="w-full bg-white border border-gray-200 text-black-brand rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-lime-brand focus:border-transparent transition-all placeholder:text-gray-brand/50 text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-black-brand">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-gray-brand hover:text-black-brand transition-colors font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-white border border-gray-200 text-black-brand rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-lime-brand focus:border-transparent transition-all placeholder:text-gray-brand/50 text-sm"
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-lime-brand hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed text-black-brand font-bold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-black-brand/30 border-t-black-brand rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-brand mt-8 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-black-brand font-bold hover:text-lime-brand transition-colors"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
