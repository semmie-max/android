"use client";

import React, { useState } from "react";

export default function SignupPage() {
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("rack_users") || "[]");
    const userExists = existingUsers.some((user: { email: string }) => user.email === email);

    if (userExists) {
      setError("An account with this email already exists.");
      return;
    }

    const newUser = { email, password };
    existingUsers.push(newUser);
    localStorage.setItem("rack_users", JSON.stringify(existingUsers));

    console.log("Account created and saved:", newUser);
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col justify-between selection:bg-[#ab1f09] selection:text-[#fff7d3]">
      
      {/* Top Header Bar */}
      <header className="w-full border-b border-neutral-800 bg-[#0a0a0a] py-4 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ab1f09]" />
          <span className="font-bold tracking-tight text-xl text-[#fff7d3]">
            Rack
          </span>
        </div>
        <a
          href="/"
          className="text-xs font-mono text-neutral-400 hover:text-[#fff7d3] transition-colors"
        >
          ← BACK TO HOME
        </a>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-6xl border border-neutral-800 rounded-xl overflow-hidden bg-[#0a0a0a] grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
          
          {/* LEFT SIDE (Visible on Desktop / Wide Screens) */}
          <div className="hidden lg:flex lg:col-span-7 relative overflow-hidden bg-black p-12 flex-col justify-between border-r border-neutral-800">
            {/* Animated Brand Glow Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ab1f09]/40 via-[#ab1f09]/10 to-black animate-pulse duration-1000" />
            
            {/* Texture Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#fff7d3 1px, transparent 1px)`,
                backgroundSize: "16px 16px",
              }}
            />

            {/* Top Pill Tag */}
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-black/60 border border-neutral-800 text-xs font-mono text-[#fff7d3]">
                <span className="w-2 h-2 rounded-full bg-[#ab1f09]" />
                SECURE AUTHENTICATION
              </span>
            </div>

            {/* Hero Copy */}
            <div className="relative z-10 space-y-6 my-auto py-12">
              <h1 className="text-4xl xl:text-5xl font-semibold tracking-tight leading-tight text-white">
                Powering modern events with precision.
              </h1>
              <p className="text-neutral-400 text-sm xl:text-base leading-relaxed max-w-lg">
                Access your dashboard to manage ticketing, analyze automated response insights, and scale your audience seamlessly.
              </p>
            </div>

            {/* Bottom Proof Metric Box */}
            <div className="relative z-10 border-t border-neutral-800/80 pt-6 flex items-center justify-between text-xs font-mono text-neutral-500">
              <span>SYSTEM STATUS: <span className="text-[#fff7d3]">ONLINE</span></span>
              <span>ENCRYPTION: <span className="text-[#ab1f09]">256-BIT</span></span>
            </div>
          </div>

          {/* RIGHT SIDE (Login Form - Normal on Mobile, Right side on Desktop) */}
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-center bg-[#0a0a0a]">
            
            {/* Header */}
            <div className="space-y-2 mb-8">
              <div className="lg:hidden inline-flex items-center gap-2 px-2.5 py-1 rounded bg-black border border-neutral-800 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#ab1f09]" />
                <span className="text-xs font-mono tracking-widest text-[#fff7d3]">SIGN UP</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Create your account
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Fill in the details below to get started.
              </p>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email Address Field */}
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="block text-xs font-mono tracking-widest text-neutral-400 uppercase"
                >
                  Gmail / Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-none text-white placeholder-neutral-600 focus:outline-none focus:border-[#ab1f09] focus:ring-1 focus:ring-[#ab1f09] transition-all text-sm font-sans"
                />
              </div>

                            {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label 
                    htmlFor="password" 
                    className="block text-xs font-mono tracking-widest text-neutral-400 uppercase"
                  >
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-none text-white placeholder-neutral-600 focus:outline-none focus:border-[#ab1f09] focus:ring-1 focus:ring-[#ab1f09] transition-all text-sm font-sans"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label 
                    htmlFor="confirmPassword" 
                    className="block text-xs font-mono tracking-widest text-neutral-400 uppercase"
                  >
                    Confirm Password
                  </label>
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-none text-white placeholder-neutral-600 focus:outline-none focus:border-[#ab1f09] focus:ring-1 focus:ring-[#ab1f09] transition-all text-sm font-sans"
                />
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-xs text-red-500 font-mono">{error}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-white text-black font-semibold tracking-wider text-sm hover:bg-[#fff7d3] active:bg-[#ab1f09] active:text-white transition-colors rounded-none uppercase mt-2"
              >
                Sign Up
              </button>

            </form>

            {/* Footer Registration Link */}
            <div className="mt-8 pt-6 border-t border-neutral-800/80 text-center">
              <p className="text-xs text-neutral-400">
  Don't have an account?{" "}
  <a href="/register" className="text-[#fff7d3] hover:underline font-medium">
    Create one
  </a>
</p>
            </div>            <div className="mt-8 pt-6 border-t border-neutral-800/80 text-center">
              <p className="text-xs text-neutral-400">
                Already have an account?{" "}
                <a href="/login" className="text-[#fff7d3] hover:underline font-medium">
                  Sign in
                </a>
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full py-4 text-center text-xs text-neutral-600 font-mono">
        © {new Date().getFullYear()} RACK. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}