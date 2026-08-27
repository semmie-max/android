"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RackDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string>("Alex");
  const [userEmail, setUserEmail] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  // Authentication check & load user data
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("rack_token");
    if (!token) {
      router.push("/signup");
      return;
    }

    const savedName = localStorage.getItem("rack_user_name");
    const savedEmail = localStorage.getItem("rack_user_email");

    if (savedName && savedName.trim() !== "") {
      setDisplayName(savedName);
    } else if (savedEmail) {
      setDisplayName(savedEmail.split("@")[0]);
    }

    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, [router]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("rack_token");
    localStorage.removeItem("rack_user_name");
    localStorage.removeItem("rack_user_email");
    router.push("/signup");
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[#050505]" />;
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col lg:flex-row selection:bg-[#ab1f09] selection:text-[#fff7d3] font-sans antialiased">
      
      {/* MOBILE TOP HEADER BAR */}
      <header className="lg:hidden w-full border-b border-neutral-800/60 bg-black/80 backdrop-blur-xl py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ab1f09] shadow-[0_0_8px_#ab1f09]" />
          <Link href="/" className="font-mono font-bold tracking-widest text-lg text-[#fff7d3] uppercase">
            RACK<span className="text-[#ab1f09]">.</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button (Right Side) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-neutral-400 hover:text-[#fff7d3] focus:outline-none cursor-pointer"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* SIDE NAVIGATION (Desktop Fixed Left / Mobile Drawer) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-[#0a0a0a] border-r border-neutral-800/80 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-8">
          
          {/* Brand Logo Header */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ab1f09] z-10 shadow-[0_0_8px_#ab1f09]" />
              <div className="absolute w-4 h-4 rounded-full bg-[#ab1f09]/50 animate-ping" />
            </div>
            <Link href="/" className="font-mono font-bold tracking-widest text-xl text-[#fff7d3] uppercase hover:opacity-80 transition-opacity">
              RACK<span className="text-[#ab1f09]">.</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-6">
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                Main Menu
              </div>
              {[
                { id: "overview", label: "Dashboard", icon: "⬡" },
                { id: "racks", label: "My Racks", icon: "❖" },
                { id: "analytics", label: "Analytics", icon: "∿" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                    activeTab === item.id
                      ? "bg-[#ab1f09]/15 text-[#fff7d3] border border-[#ab1f09]/30 font-medium"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                  }`}
                >
                  <span className="text-sm text-[#ab1f09]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                Account Settings
              </div>
              {[
                { id: "profile", label: "Profile" },
                { id: "settings", label: "Settings" },
                { id: "notifications", label: "Notifications" },
                { id: "security", label: "Security" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    activeTab === item.id
                      ? "bg-[#ab1f09]/15 text-[#fff7d3] border border-[#ab1f09]/30"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* User Profile & Logout Bottom Card */}
        <div className="border-t border-neutral-800/80 pt-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-mono font-bold text-[#fff7d3] text-sm uppercase">
              {displayName ? displayName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-xs font-semibold text-white capitalize truncate">{displayName}</h3>
              <p className="text-[10px] font-mono text-neutral-500 truncate">
                {userEmail || "Workspace Member"}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-mono text-neutral-400 hover:text-[#fff7d3] hover:bg-neutral-900/80 transition-colors flex items-center justify-between cursor-pointer"
          >
            <span>LOGOUT</span>
            <span>→</span>
          </button>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/80 z-30 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 space-y-10 max-w-6xl mx-auto w-full relative z-10">
        
        {/* Ambient Glow */}
        <div className="absolute top-10 right-10 w-[500px] h-[250px] bg-[#ab1f09]/10 blur-[130px] pointer-events-none rounded-full" />

        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/60 pb-6">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono tracking-wider text-[#fff7d3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ab1f09]" />
              WORKSPACE OVERVIEW
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white capitalize">
              Welcome back, <span className="text-[#fff7d3]">{displayName}</span>
            </h1>
          </div>
          <button className="self-start sm:self-auto px-4 py-2.5 bg-[#ab1f09] hover:bg-[#c2240b] text-[#fff7d3] font-mono font-medium text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-[#ab1f09]/20 active:scale-[0.98] flex items-center gap-2 cursor-pointer">
            <span>+</span> NEW RACK
          </button>
        </div>

        {/* QUICK ACTIONS SECTION */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <button className="p-5 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 hover:bg-neutral-900/60 hover:border-[#ab1f09]/50 transition-all text-left space-y-2 group active:scale-[0.98] cursor-pointer">
              <div className="text-[#ab1f09] text-xl font-bold">＋</div>
              <h3 className="text-xs font-semibold text-white group-hover:text-[#fff7d3]">Create New Rack</h3>
              <p className="text-[11px] text-neutral-500 font-light leading-snug">Start a new project, form, or workspace.</p>
            </button>

            <button className="p-5 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 hover:bg-neutral-900/60 hover:border-neutral-700 transition-all text-left space-y-2 group active:scale-[0.98] cursor-pointer">
              <div className="text-neutral-400 text-xl font-bold">💬</div>
              <h3 className="text-xs font-semibold text-white group-hover:text-[#fff7d3]">View Responses</h3>
              <p className="text-[11px] text-neutral-500 font-light leading-snug">Check submissions and feedback data.</p>
            </button>

            <button className="p-5 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 hover:bg-neutral-900/60 hover:border-neutral-700 transition-all text-left space-y-2 group active:scale-[0.98] cursor-pointer">
              <div className="text-neutral-400 text-xl font-bold">👥</div>
              <h3 className="text-xs font-semibold text-white group-hover:text-[#fff7d3]">Manage Members</h3>
              <p className="text-[11px] text-neutral-500 font-light leading-snug">Invite team members and adjust permissions.</p>
            </button>

            <button className="p-5 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 hover:bg-neutral-900/60 hover:border-neutral-700 transition-all text-left space-y-2 group active:scale-[0.98] cursor-pointer">
              <div className="text-neutral-400 text-xl font-bold">📈</div>
              <h3 className="text-xs font-semibold text-white group-hover:text-[#fff7d3]">Analytics</h3>
              <p className="text-[11px] text-neutral-500 font-light leading-snug">Track overall engagement and metrics.</p>
            </button>

          </div>
        </div>

        {/* ACTIVE RACKS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Active Racks</h2>
            <span className="text-[11px] font-mono text-neutral-600">TOTAL: 0</span>
          </div>

          <div className="border border-dashed border-neutral-800/90 rounded-2xl p-10 text-center bg-[#0d0d0d]/40 backdrop-blur-xl flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#ab1f09] font-mono text-xl">
              ❖
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="text-base font-medium text-white">No active racks created yet</h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Create, manage, and organize your projects in one place. Create your first Rack to start building and managing information.
              </p>
            </div>
            <button className="px-5 py-2.5 bg-[#fff7d3] hover:bg-white active:bg-[#ab1f09] active:text-white text-black font-mono font-medium text-xs tracking-wider uppercase rounded-xl transition-all shadow-md mt-2 cursor-pointer">
              + Create First Rack
            </button>
          </div>
        </div>

        {/* RECENT ACTIVITY SECTION */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Recent Activity</h2>
          <div className="p-6 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 text-xs font-mono text-neutral-500">
            See what has been created, updated, and shared recently.
          </div>
        </div>

      </main>

    </div>
  );
}