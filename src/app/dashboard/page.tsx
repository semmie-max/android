"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RackDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [userEmail, setUserEmail] = useState<string>("Member");

  // Check authentication on load
  useEffect(() => {
    const token = localStorage.getItem("rack_token");
    if (!token) {
      // If not logged in, redirect to signup
      router.push("/signup");
      return;
    }

    // Attempt to read stored email or decode token if available
    const savedEmail = localStorage.getItem("rack_user_email");
    if (savedEmail) {
      setUserEmail(savedEmail.split("@")[0]);
    }
  }, [router]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("rack_token");
    localStorage.removeItem("rack_user_email");
    router.push("/signup");
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col justify-between selection:bg-[#ab1f09] selection:text-[#fff7d3] font-sans antialiased">
      
      {/* Top Header / Navigation Bar */}
      <header className="w-full border-b border-neutral-800/60 bg-black/40 backdrop-blur-xl py-4 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ab1f09] z-10 shadow-[0_0_8px_#ab1f09]" />
            <div className="absolute w-4 h-4 rounded-full bg-[#ab1f09]/50 animate-ping" />
          </div>
          <a href="/" className="font-mono font-bold tracking-widest text-lg text-[#fff7d3] uppercase hover:opacity-80 transition-opacity">
            RACK<span className="text-[#ab1f09]">.</span>
          </a>
          <span className="hidden sm:inline-block text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 ml-2">
            DASHBOARD
          </span>
        </div>

        {/* User Quick Nav & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>SYSTEM ONLINE</span>
          </div>
          <div className="h-4 w-[1px] bg-neutral-800 hidden md:block" />
          <button 
            onClick={handleLogout}
            className="text-xs font-mono tracking-wider text-neutral-400 hover:text-[#fff7d3] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            LOGOUT <span>→</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#ab1f09]/5 blur-[140px] pointer-events-none rounded-full" />

        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* User Profile Mini Card */}
          <div className="p-5 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#ab1f09]/10 rounded-bl-full pointer-events-none transition-all group-hover:bg-[#ab1f09]/20" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-mono font-bold text-[#fff7d3] shadow-inner uppercase">
                {userEmail.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white capitalize">{userEmail}</h3>
                <p className="text-[11px] font-mono text-neutral-400">Pro Plan Member</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="border border-neutral-800/80 rounded-2xl p-3 bg-[#0d0d0d]/80 backdrop-blur-xl space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
              Account Management
            </div>
            {[
              { id: "overview", label: "Overview" },
              { id: "profile", label: "Profile" },
              { id: "settings", label: "Settings" },
              { id: "notifications", label: "Notifications" },
              { id: "security", label: "Security" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-mono transition-all duration-200 flex items-center justify-between ${
                  activeTab === item.id
                    ? "bg-[#ab1f09]/15 text-[#fff7d3] border border-[#ab1f09]/30"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                }`}
              >
                <span>{item.label}</span>
                {activeTab === item.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ab1f09]" />
                )}
              </button>
            ))}
          </div>

          {/* Workspace Status Box */}
          <div className="p-4 border border-neutral-800/60 rounded-2xl bg-black/40 text-xs font-mono space-y-2">
            <div className="text-neutral-500 text-[10px] tracking-widest uppercase">WORKSPACE SECURITY</div>
            <div className="flex justify-between text-neutral-300">
              <span>ENCRYPTION:</span>
              <span className="text-[#ab1f09]">256-BIT</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>RACK LIMIT:</span>
              <span className="text-[#fff7d3]">UNLIMITED</span>
            </div>
          </div>

        </aside>

        {/* MAIN DASHBOARD CONTENT */}
        <main className="lg:col-span-9 space-y-8">
          
          {/* Welcome Header Banner */}
          <div className="relative overflow-hidden border border-neutral-800/80 rounded-2xl p-8 bg-gradient-to-r from-[#0d0d0d] via-black to-[#0d0d0d]">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#ab1f09]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-900/90 border border-neutral-800 text-[10px] font-mono tracking-wider text-[#fff7d3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ab1f09]" />
                WORKSPACE OVERVIEW
              </span>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white capitalize">
                Welcome back, <span className="text-[#fff7d3]">{userEmail}</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-xl">
                Manage your active Racks, review recent metrics, and construct new workspaces from your control panel.
              </p>
            </div>
          </div>

          {/* Overview Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Active Racks Stat Card */}
            <div className="p-6 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 backdrop-blur-xl space-y-3 relative overflow-hidden group hover:border-neutral-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">Active Racks</span>
                <span className="px-2 py-0.5 rounded bg-[#ab1f09]/20 text-[#fff7d3] text-[10px] font-mono">LIVE</span>
              </div>
              <div className="text-3xl font-bold font-mono text-white">0</div>
              <p className="text-xs text-neutral-500 font-light">
                Create, manage, and organize your projects in one place.
              </p>
            </div>

            {/* Recent Activity Stat Card */}
            <div className="p-6 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 backdrop-blur-xl space-y-3 relative overflow-hidden group hover:border-neutral-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">Recent Activity</span>
                <span className="w-2 h-2 rounded-full bg-neutral-700" />
              </div>
              <div className="text-xs font-mono text-neutral-400 pt-1">NO RECENT UPDATES</div>
              <p className="text-xs text-neutral-500 font-light">
                See what has been created, updated, and shared recently.
              </p>
            </div>

          </div>

          {/* Quick Actions Grid */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Quick Actions</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Action 1: Create */}
              <button className="p-5 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 hover:bg-neutral-900/60 hover:border-[#ab1f09]/50 transition-all text-left space-y-3 group active:scale-[0.98] cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-[#ab1f09] text-[#fff7d3] flex items-center justify-center font-bold text-lg shadow-md shadow-[#ab1f09]/20 group-hover:scale-105 transition-transform">
                  +
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#fff7d3] transition-colors">Create New Rack</h3>
                  <p className="text-[11px] text-neutral-500 font-light mt-1">Start a new project, form, or workspace.</p>
                </div>
              </button>

              {/* Action 2: Responses */}
              <button className="p-5 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 hover:bg-neutral-900/60 hover:border-neutral-700 transition-all text-left space-y-3 group active:scale-[0.98] cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 flex items-center justify-center font-mono text-xs group-hover:border-[#fff7d3] transition-colors">
                  01
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#fff7d3] transition-colors">View Responses</h3>
                  <p className="text-[11px] text-neutral-500 font-light mt-1">Check submissions, feedback, and data.</p>
                </div>
              </button>

              {/* Action 3: Members */}
              <button className="p-5 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 hover:bg-neutral-900/60 hover:border-neutral-700 transition-all text-left space-y-3 group active:scale-[0.98] cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 flex items-center justify-center font-mono text-xs group-hover:border-[#fff7d3] transition-colors">
                  02
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#fff7d3] transition-colors">Manage Members</h3>
                  <p className="text-[11px] text-neutral-500 font-light mt-1">Invite people and control access.</p>
                </div>
              </button>

              {/* Action 4: Analytics */}
              <button className="p-5 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 hover:bg-neutral-900/60 hover:border-neutral-700 transition-all text-left space-y-3 group active:scale-[0.98] cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 flex items-center justify-center font-mono text-xs group-hover:border-[#fff7d3] transition-colors">
                  03
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#fff7d3] transition-colors">Analytics</h3>
                  <p className="text-[11px] text-neutral-500 font-light mt-1">Track engagement and performance.</p>
                </div>
              </button>

            </div>
          </div>

          {/* Your Racks - Empty State Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Your Racks</h2>
              <span className="text-xs font-mono text-neutral-600">COUNT: 0</span>
            </div>

            <div className="border border-dashed border-neutral-800/80 rounded-2xl p-12 text-center bg-[#0d0d0d]/40 backdrop-blur-xl flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 font-mono text-lg">
                [ ]
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-medium text-white">No racks created yet.</h3>
                <p className="text-xs text-neutral-500 font-light">
                  Create your first Rack to start building, collecting, and managing information.
                </p>
              </div>
              <button className="px-5 py-2.5 bg-[#fff7d3] hover:bg-white active:bg-[#ab1f09] active:text-white text-black font-mono font-medium text-xs tracking-wider uppercase rounded-lg transition-all shadow-md cursor-pointer">
                + Create First Rack
              </button>
            </div>
          </div>

        </main>

      </div>

      {/* Footer copyright */}
      <footer className="w-full py-4 text-center text-[11px] text-neutral-600 font-mono border-t border-neutral-900/60 mt-8">
        © {new Date().getFullYear()} RACK. ALL RIGHTS RESERVED.
      </footer>

    </div>
  );
}