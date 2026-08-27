"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RackForm {
  id: string;
  title: string;
  description: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  questions: any[];
}

export default function RackDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string>("Alex");
  const [userEmail, setUserEmail] = useState<string>("");
  const [forms, setForms] = useState<RackForm[]>([]);
  const [mounted, setMounted] = useState(false);

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

    if (savedEmail) setUserEmail(savedEmail);

    const storedForms: RackForm[] = JSON.parse(localStorage.getItem("rack_forms") || "[]");
    setForms(storedForms);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("rack_token");
    localStorage.removeItem("rack_user_name");
    localStorage.removeItem("rack_user_email");
    router.push("/signup");
  };

  const handleDeleteForm = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = forms.filter((f) => f.id !== id);
    setForms(updated);
    localStorage.setItem("rack_forms", JSON.stringify(updated));
  };

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col lg:flex-row selection:bg-[#ab1f09] selection:text-[#fff7d3] font-sans antialiased">
      
      {/* MOBILE TOP HEADER BAR */}
      <header className="lg:hidden w-full border-b border-neutral-800/60 bg-black/80 backdrop-blur-xl py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ab1f09] shadow-[0_0_8px_#ab1f09]" />
          <span className="font-mono font-bold tracking-widest text-lg text-[#fff7d3] uppercase">
            RACK<span className="text-[#ab1f09]">.</span>
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-neutral-400 hover:text-[#fff7d3] focus:outline-none cursor-pointer"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* SIDE NAVIGATION */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-[#0a0a0a] border-r border-neutral-800/80 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-8">
          
          {/* Brand Header */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ab1f09] z-10 shadow-[0_0_8px_#ab1f09]" />
              <div className="absolute w-4 h-4 rounded-full bg-[#ab1f09]/50 animate-ping" />
            </div>
            <span className="font-mono font-bold tracking-widest text-xl text-[#fff7d3] uppercase">
              RACK<span className="text-[#ab1f09]">.</span>
            </span>
          </div>

          {/* Navigation Menus */}
          <nav className="space-y-6">
            
            {/* Main Menu */}
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

            {/* Account Settings */}
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
                  {activeTab === item.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ab1f09]" />
                  )}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* User Profile & Logout Bottom Card */}
        <div className="border-t border-neutral-800/80 pt-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-mono font-bold text-[#fff7d3] text-sm uppercase shadow-inner">
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

      {/* OVERLAY FOR MOBILE */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/80 z-30 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* MAIN DASHBOARD CONTENT */}
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
          <button 
            onClick={() => router.push("/form")}
            className="self-start sm:self-auto px-4 py-2.5 bg-[#ab1f09] hover:bg-[#c2240b] text-[#fff7d3] font-mono font-medium text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-[#ab1f09]/20 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
          >
            <span>+</span> NEW RACK
          </button>
        </div>

        {/* QUICK ACTIONS SECTION */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Action 1 */}
            <button 
              onClick={() => router.push("/form")}
              className="p-5 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 hover:bg-neutral-900/60 hover:border-[#ab1f09]/50 transition-all text-left space-y-3 group active:scale-[0.98] cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#ab1f09]/15 border border-[#ab1f09]/30 flex items-center justify-center text-[#ab1f09] group-hover:bg-[#ab1f09] group-hover:text-[#fff7d3] transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-[#fff7d3] transition-colors">Create New Rack</h3>
                <p className="text-[11px] text-neutral-500 font-light leading-snug mt-1">Start a new project or form.</p>
              </div>
            </button>

            {/* Action 2 */}
            <button className="p-5 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 hover:bg-neutral-900/60 hover:border-neutral-700 transition-all text-left space-y-3 group active:scale-[0.98] cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-[#fff7d3] group-hover:border-neutral-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-[#fff7d3] transition-colors">View Responses</h3>
                <p className="text-[11px] text-neutral-500 font-light leading-snug mt-1">Check submissions and feedback data.</p>
              </div>
            </button>

            {/* Action 3 */}
            <button className="p-5 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 hover:bg-neutral-900/60 hover:border-neutral-700 transition-all text-left space-y-3 group active:scale-[0.98] cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-[#fff7d3] group-hover:border-neutral-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-[#fff7d3] transition-colors">Manage Members</h3>
                <p className="text-[11px] text-neutral-500 font-light leading-snug mt-1">Invite members and adjust permissions.</p>
              </div>
            </button>

            {/* Action 4 */}
            <button className="p-5 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 hover:bg-neutral-900/60 hover:border-neutral-700 transition-all text-left space-y-3 group active:scale-[0.98] cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-[#fff7d3] group-hover:border-neutral-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-[#fff7d3] transition-colors">Analytics</h3>
                <p className="text-[11px] text-neutral-500 font-light leading-snug mt-1">Track overall engagement and metrics.</p>
              </div>
            </button>

          </div>
        </div>

        {/* ACTIVE & DRAFT RACKS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Your Racks</h2>
            <span className="text-[11px] font-mono text-neutral-500">TOTAL: {forms.length}</span>
          </div>

          {forms.length === 0 ? (
            <div className="border border-dashed border-neutral-800/90 rounded-2xl p-10 text-center bg-[#0d0d0d]/40 backdrop-blur-xl flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#ab1f09] font-mono text-xl">
                ❖
              </div>
              <div className="space-y-1 max-w-md">
                <h3 className="text-base font-medium text-white">No active racks created yet</h3>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  Create your first Rack to start building and managing information.
                </p>
              </div>
              <button 
                onClick={() => router.push("/form")}
                className="px-5 py-2.5 bg-[#fff7d3] hover:bg-white text-black font-mono font-medium text-xs tracking-wider uppercase rounded-xl transition-all shadow-md mt-2 cursor-pointer"
              >
                + Create First Rack
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forms.map((form) => (
                <div
                  key={form.id}
                  onClick={() => router.push(`/form?id=${form.id}`)}
                  className="p-6 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/90 hover:border-neutral-700 transition-all cursor-pointer flex flex-col justify-between group space-y-4 relative overflow-hidden"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                          form.status === "published"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {form.status === "published" ? "● LIVE" : "⏳ DRAFT"}
                      </span>
                      <button
                        onClick={(e) => handleDeleteForm(form.id, e)}
                        className="text-neutral-500 hover:text-red-400 p-1 transition-colors text-xs cursor-pointer"
                        title="Delete Rack"
                      >
                        ✕
                      </button>
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-[#fff7d3] transition-colors truncate">
                      {form.title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-light line-clamp-2">
                      {form.description || "No description provided."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                    <span>{form.questions?.length || 0} Questions</span>
                    <span className="text-[#ab1f09] group-hover:underline">Resume Editing →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RECENT ACTIVITY */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Recent Activity</h2>
          <div className="p-6 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 text-xs font-mono text-neutral-500">
            {forms.length > 0
              ? `Last updated: ${forms[0]?.title} (${forms[0]?.updatedAt})`
              : "No recent updates yet."}
          </div>
        </div>

      </main>

    </div>
  );
}