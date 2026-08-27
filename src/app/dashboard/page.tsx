"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Candidate {
  id: string;
  name: string;
  category?: string;
  votes: number;
}

interface FormQuestion {
  id: string;
  title: string;
  type: string;
  candidates?: Candidate[];
}

interface FormResponseItem {
  id: string;
  submittedAt: string;
  email?: string;
  votedCandidate?: string;
  voteCount?: number;
  totalPaid?: number;
}

interface RackForm {
  id: string;
  title: string;
  description: string;
  status: "draft" | "published" | "closed";
  createdAt: string;
  updatedAt: string;
  questions: FormQuestion[];
  responses: FormResponseItem[];
}

export default function RackDashboard() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>("Alex");
  const [userEmail, setUserEmail] = useState<string>("");
  const [forms, setForms] = useState<RackForm[]>([]);
  const [selectedAnalyticsForm, setSelectedAnalyticsForm] = useState<RackForm | null>(null);
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

    if (savedEmail) {
      setUserEmail(savedEmail);
    }

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

  // Compute Total Metrics across all forms
  const totalSubmissions = forms.reduce((acc, f) => acc + (f.responses?.length || 0), 0);
  const totalRevenue = forms.reduce((acc, f) => {
    const rev = f.responses?.reduce((rAcc, r) => rAcc + (r.totalPaid || 0), 0) || 0;
    return acc + rev;
  }, 0);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col font-sans selection:bg-[#ab1f09] selection:text-[#fff7d3]">
      
      {/* Top Bar */}
      <header className="w-full border-b border-neutral-800 bg-black/80 backdrop-blur-xl py-4 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ab1f09] shadow-[0_0_8px_#ab1f09]" />
          <span className="font-mono font-bold tracking-widest text-lg text-[#fff7d3] uppercase">
            RACK<span className="text-[#ab1f09]">.</span>
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 ml-2">
            WORKSPACE
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-neutral-400 capitalize hidden sm:inline">{displayName}</span>
          <button 
            onClick={handleLogout}
            className="text-xs font-mono text-neutral-400 hover:text-[#fff7d3] transition-colors cursor-pointer"
          >
            LOGOUT →
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto p-6 sm:p-10 space-y-10 flex-1">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white capitalize">Welcome back, {displayName}</h1>
            <p className="text-xs text-neutral-400 font-light mt-1">Manage your active Racks and monitor response analytics in real time.</p>
          </div>
          <button
            onClick={() => router.push("/form")}
            className="px-5 py-2.5 bg-[#ab1f09] hover:bg-[#c2240b] text-[#fff7d3] font-mono font-medium text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#ab1f09]/20 cursor-pointer self-start sm:self-auto"
          >
            + Create New Rack
          </button>
        </div>

        {/* Global Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 border border-neutral-800 rounded-3xl bg-[#0d0d0d] space-y-2">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Active Racks</span>
            <div className="text-3xl font-bold font-mono text-white">{forms.length}</div>
          </div>
          <div className="p-6 border border-neutral-800 rounded-3xl bg-[#0d0d0d] space-y-2">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Total Responses</span>
            <div className="text-3xl font-bold font-mono text-emerald-400">{totalSubmissions}</div>
          </div>
          <div className="p-6 border border-neutral-800 rounded-3xl bg-[#0d0d0d] space-y-2">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Total Revenue (Votes)</span>
            <div className="text-3xl font-bold font-mono text-[#fff7d3]">${totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        {/* Forms Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Your Racks</h2>
            <span className="text-xs font-mono text-neutral-600">COUNT: {forms.length}</span>
          </div>

          {forms.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-neutral-800 rounded-3xl bg-[#0d0d0d]/40 space-y-4">
              <h3 className="text-base font-medium text-white">No racks created yet.</h3>
              <button
                onClick={() => router.push("/form")}
                className="px-5 py-2.5 bg-[#fff7d3] hover:bg-white text-black font-mono font-medium text-xs tracking-wider uppercase rounded-xl cursor-pointer"
              >
                + Create First Rack
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="p-6 border border-neutral-800 rounded-3xl bg-[#0d0d0d] hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4 relative"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full uppercase font-bold ${
                          form.status === "published"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {form.status === "published" ? "LIVE" : "DRAFT"}
                      </span>
                      <button
                        onClick={(e) => handleDeleteForm(form.id, e)}
                        className="text-neutral-500 hover:text-red-400 text-xs p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    <h3 className="text-base font-semibold text-white truncate">{form.title}</h3>
                    <p className="text-xs text-neutral-400 font-light line-clamp-2">{form.description}</p>
                  </div>

                  {/* Actions & Analytics trigger */}
                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono">
                    <button
                      onClick={() => setSelectedAnalyticsForm(form)}
                      className="text-[#fff7d3] hover:underline cursor-pointer"
                    >
                      Analytics ({form.responses?.length || 0})
                    </button>
                    <button
                      onClick={() => router.push(`/form?id=${form.id}`)}
                      className="text-[#ab1f09] hover:underline cursor-pointer"
                    >
                      Edit →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analytics Modal Drawer */}
        {selectedAnalyticsForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedAnalyticsForm.title}</h3>
                  <p className="text-xs text-neutral-400">Total Submissions: {selectedAnalyticsForm.responses?.length || 0}</p>
                </div>
                <button
                  onClick={() => setSelectedAnalyticsForm(null)}
                  className="p-2 text-neutral-400 hover:text-white text-xs font-mono"
                >
                  CLOSE ✕
                </button>
              </div>

              {/* Paid Voting Contestant Breakdown if exists */}
              {selectedAnalyticsForm.questions.find((q) => q.type === "paid_voting") && (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono text-[#fff7d3] uppercase tracking-wider">Contestant Leaderboard</h4>
                  <div className="space-y-2">
                    {selectedAnalyticsForm.questions
                      .find((q) => q.type === "paid_voting")
                      ?.candidates?.map((cand) => (
                        <div key={cand.id} className="p-3 bg-[#111111] border border-neutral-800 rounded-xl flex items-center justify-between text-xs font-mono">
                          <span className="text-white font-semibold">{cand.name}</span>
                          <span className="text-[#ab1f09] font-bold">{cand.votes} Votes</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Responses List */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Submissions Log</h4>
                {selectedAnalyticsForm.responses?.length === 0 ? (
                  <div className="text-xs text-neutral-500 italic py-4">No submissions yet.</div>
                ) : (
                  <div className="space-y-2">
                    {selectedAnalyticsForm.responses?.map((resp) => (
                      <div key={resp.id} className="p-3 bg-[#111111] border border-neutral-800 rounded-xl text-xs font-mono flex items-center justify-between">
                        <span className="text-neutral-300">{resp.email || "Anonymous"}</span>
                        <span className="text-neutral-500">{resp.submittedAt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}