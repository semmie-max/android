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
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col justify-between selection:bg-[#ab1f09] selection:text-[#fff7d3] font-sans antialiased">
      
      {/* Top Header Bar */}
      <header className="w-full border-b border-neutral-800/60 bg-black/40 backdrop-blur-xl py-4 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ab1f09] z-10" />
            <div className="absolute w-4 h-4 rounded-full bg-[#ab1f09]/50 animate-ping" />
          </div>
          <span className="font-mono font-bold tracking-widest text-lg text-[#fff7d3] uppercase">
            RACK<span className="text-[#ab1f09]">.</span>
          </span>
        </div>
        <a
          href="/"
          className="group text-xs font-mono tracking-widest text-neutral-400 hover:text-[#fff7d3] transition-all duration-200 flex items-center gap-2"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> 
          <span>RETURN HOME</span>
        </a>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 relative">
        {/* Subtle Ambient Background Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#ab1f09]/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="w-full max-w-6xl border border-neutral-800/80 rounded-2xl overflow-hidden bg-[#0d0d0d]/80 backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-12 shadow-[0_0_80px_rgba(0,0,0,0.9)] relative z-10">
          
          {/* LEFT SIDE (Visible on Desktop / Wide Screens) */}
          <div className="hidden lg:flex lg:col-span-7 relative overflow-hidden bg-gradient-to-b from-black via-[#080808] to-[#0d0d0d] p-12 flex-col justify-between border-r border-neutral-800/80">
            
            {/* Visual Mesh Overlay */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#fff7d3 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />

            {/* Top Pill Tag */}
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-900/90 border border-neutral-800 text-[11px] font-mono tracking-wider text-[#fff7d3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ab1f09]" />
                INFRASTRUCTURE V2.0
              </span>
            </div>

            {/* Hero Copy */}
            <div className="relative z-10 space-y-6 my-auto py-12">
              <h1 className="text-4xl xl:text-5xl font-semibold tracking-tight leading-tight text-white">
                Powering modern events with <span className="text-[#fff7d3] underline decoration-[#ab1f09]/60 underline-offset-8">precision</span>.
              </h1>
              <p className="text-neutral-400 text-sm xl:text-base leading-relaxed max-w-lg font-light">
                Access your dashboard to manage ticketing, analyze automated response insights, and scale your audience seamlessly.
              </p>
            </div>

            {/* Bottom Proof Metric Box */}
            <div className="relative z-10 border-t border-neutral-800/80 pt-6 flex items-center justify-between text-xs font-mono text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>SYSTEM STATUS: <span className="text-neutral-200">ONLINE</span></span>
              </div>
              <div>
                <span>ENCRYPTION: <span className="text-[#ab1f09]">256-BIT</span></span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (Signup Form - Normal on Mobile, Right side on Desktop) */}
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-center bg-[#0a0a0a]/90">
            
            {/* Header */}
            <div className="space-y-2 mb-8">
              <div className="lg:hidden inline-flex items-center gap-2 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ab1f09]" />
                <span className="text-[10px] font-mono tracking-widest text-[#fff7d3] uppercase">SIGN UP</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Create your account
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-light">
                Fill in the details below to get started.
              </p>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Address Field */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="email" 
                  className="block text-[10px] font-mono tracking-widest text-neutral-400 uppercase"
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
                  className="w-full px-4 py-3 bg-[#111111] border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-[#ab1f09] focus:ring-1 focus:ring-[#ab1f09] transition-all text-sm font-sans"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="password" 
                  className="block text-[10px] font-mono tracking-widest text-neutral-400 uppercase"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#111111] border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-[#ab1f09] focus:ring-1 focus:ring-[#ab1f09] transition-all text-sm font-sans"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-[10px] font-mono tracking-widest text-neutral-400 uppercase"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#111111] border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-[#ab1f09] focus:ring-1 focus:ring-[#ab1f09] transition-all text-sm font-sans"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-[#ab1f09]/10 border border-[#ab1f09]/30 rounded-lg">
                  <p className="text-xs text-[#fff7d3] font-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ab1f09]" />
                    {error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#ab1f09] hover:bg-[#c2240b] text-[#fff7d3] font-mono font-medium tracking-wider text-xs transition-all duration-200 rounded-lg uppercase mt-2 shadow-lg shadow-[#ab1f09]/20 hover:shadow-[#ab1f09]/40 active:scale-[0.99]"
              >
                Sign Up
              </button>

            </form>

            {/* Footer Navigation Link */}
            <div className="mt-8 pt-6 border-t border-neutral-800/60 text-center">
              <p className="text-xs text-neutral-400 font-light">
                Already have an account?{" "}
                <a href="/login" className="text-[#fff7d3] hover:underline font-normal transition-colors">
                  Sign in
                </a>
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full py-4 text-center text-[11px] text-neutral-600 font-mono border-t border-neutral-900/60">
        © {new Date().getFullYear()} RACK. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}