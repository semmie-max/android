"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// --- TYPES ---
export type QuestionType =
  | "short_answer"
  | "paragraph"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown"
  | "number"
  | "date"
  | "rating"
  | "file_upload"
  | "paid_voting";

export interface Candidate {
  id: string;
  name: string;
  category?: string;
  votes: number;
}

export interface FormQuestion {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
  options: string[];
  pricePerVote?: number;
  currency?: string;
  candidates?: Candidate[];
}

export interface FormTheme {
  accentColor: string;
  fontFamily: "font-sans" | "font-mono" | "font-serif";
  cardRadius: "rounded-xl" | "rounded-2xl" | "rounded-3xl";
}

export interface FormSettings {
  acceptingResponses: boolean;
  collectEmail: boolean;
  confirmationMessage: string;
  theme: FormTheme;
}

export interface FormResponseItem {
  id: string;
  submittedAt: string;
  email?: string;
  answers: Record<string, any>;
  votedCandidate?: string;
  voteCount?: number;
  totalPaid?: number;
}

export interface RackForm {
  id: string;
  title: string;
  description: string;
  status: "draft" | "published" | "closed";
  createdAt: string;
  updatedAt: string;
  settings: FormSettings;
  questions: FormQuestion[];
  responses: FormResponseItem[];
}

// Preset Theme Colors
const COLOR_PRESETS = [
  { name: "Crimson", hex: "#ab1f09" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Indigo", hex: "#6366f1" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Cyan", hex: "#06b6d4" },
  { name: "Pink", hex: "#ec4899" },
];

function FormApp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formIdParam = searchParams.get("id");
  const isLiveView = searchParams.get("view") === "live";

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<"builder" | "responses" | "settings">("builder");
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Form State
  const [formId, setFormId] = useState<string>("");
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("Fill out the required information below.");
  const [status, setStatus] = useState<"draft" | "published" | "closed">("draft");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [settings, setSettings] = useState<FormSettings>({
    acceptingResponses: true,
    collectEmail: true,
    confirmationMessage: "Thank you! Your response has been securely recorded.",
    theme: {
      accentColor: "#ab1f09",
      fontFamily: "font-sans",
      cardRadius: "rounded-3xl",
    },
  });
  const [questions, setQuestions] = useState<FormQuestion[]>([
    {
      id: "q_1",
      title: "Full Name",
      type: "short_answer",
      required: true,
      options: [],
    },
  ]);
  const [responses, setResponses] = useState<FormResponseItem[]>([]);

  // Public Submitter state
  const [liveEmail, setLiveEmail] = useState("");
  const [liveAnswers, setLiveAnswers] = useState<Record<string, any>>({});
  const [liveVotesCount, setLiveVotesCount] = useState<number>(1);
  const [liveSelectedCandidate, setLiveSelectedCandidate] = useState<string>("");
  const [liveSubmitted, setLiveSubmitted] = useState(false);

  // 1. Initial Load
  useEffect(() => {
    const existingForms: RackForm[] = JSON.parse(localStorage.getItem("rack_forms") || "[]");

    if (formIdParam) {
      const found = existingForms.find((f) => f.id === formIdParam);
      if (found) {
        setFormId(found.id);
        setTitle(found.title);
        setDescription(found.description);
        setStatus(found.status);
        setCreatedAt(found.createdAt);
        setUpdatedAt(found.updatedAt);
        setSettings({
          ...settings,
          ...found.settings,
          theme: found.settings?.theme || settings.theme,
        });
        setQuestions(found.questions || []);
        setResponses(found.responses || []);
        return;
      }
    }

    const newId = "rack_" + Date.now();
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    setFormId(newId);
    setCreatedAt(dateStr);
    setUpdatedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }, [formIdParam]);

  // 2. Auto-Save Draft
  useEffect(() => {
    if (!formId || isLiveView) return;

    const existingForms: RackForm[] = JSON.parse(localStorage.getItem("rack_forms") || "[]");
    const updatedTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const currentForm: RackForm = {
      id: formId,
      title: title || "Untitled Form",
      description: description || "",
      status,
      createdAt: createdAt || "Today",
      updatedAt: updatedTime,
      settings,
      questions,
      responses,
    };

    const index = existingForms.findIndex((f) => f.id === formId);
    if (index >= 0) {
      existingForms[index] = currentForm;
    } else {
      existingForms.push(currentForm);
    }

    localStorage.setItem("rack_forms", JSON.stringify(existingForms));
    setUpdatedAt(updatedTime);
    setSavedNotice(true);
    const timer = setTimeout(() => setSavedNotice(false), 1500);
    return () => clearTimeout(timer);
  }, [formId, title, description, status, settings, questions, responses, isLiveView]);

  // --- ACTIONS ---
  const handleAddQuestion = (type: QuestionType) => {
    const isPaid = type === "paid_voting";
    const newQ: FormQuestion = {
      id: "q_" + Date.now(),
      title: isPaid ? "Contestant Ballot" : "Untitled Question",
      type,
      required: false,
      options: type === "multiple_choice" || type === "checkboxes" || type === "dropdown" ? ["Option 1", "Option 2"] : [],
      pricePerVote: isPaid ? 1.0 : undefined,
      currency: isPaid ? "USD" : undefined,
      candidates: isPaid
        ? [
            { id: "cand_1", name: "Contestant 1", category: "Nominee", votes: 0 },
            { id: "cand_2", name: "Contestant 2", category: "Nominee", votes: 0 },
          ]
        : undefined,
    };
    setQuestions([...questions, newQ]);
    setShowTypeSelector(false);
  };

  // Delete Full Block
  const handleDeleteFullBlock = (id: string) => {
    if (questions.length === 1) {
      alert("A form must contain at least one question block.");
      return;
    }
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleDuplicateQuestion = (idx: number) => {
    const target = questions[idx];
    const duplicated: FormQuestion = { ...target, id: "q_" + Date.now(), title: `${target.title} (Copy)` };
    const updated = [...questions];
    updated.splice(idx + 1, 0, duplicated);
    setQuestions(updated);
  };

  // Option controls
  const handleAddOption = (qIdx: number) => {
    const updated = [...questions];
    updated[qIdx].options.push(`Option ${updated[qIdx].options.length + 1}`);
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx: number, oIdx: number, val: string) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = val;
    setQuestions(updated);
  };

  const handleDeleteOption = (qIdx: number, oIdx: number) => {
    const updated = [...questions];
    if (updated[qIdx].options.length <= 1) return;
    updated[qIdx].options.splice(oIdx, 1);
    setQuestions(updated);
  };

  // Candidate controls for Paid Voting
  const handleAddCandidate = (qIdx: number) => {
    const updated = [...questions];
    if (!updated[qIdx].candidates) updated[qIdx].candidates = [];
    updated[qIdx].candidates!.push({
      id: "cand_" + Date.now(),
      name: `Contestant ${updated[qIdx].candidates!.length + 1}`,
      category: "Nominee",
      votes: 0,
    });
    setQuestions(updated);
  };

  const handleCandidateChange = (qIdx: number, cIdx: number, field: "name" | "category", val: string) => {
    const updated = [...questions];
    if (updated[qIdx].candidates) {
      updated[qIdx].candidates![cIdx][field] = val;
      setQuestions(updated);
    }
  };

  const handleDeleteCandidate = (qIdx: number, cIdx: number) => {
    const updated = [...questions];
    if (updated[qIdx].candidates && updated[qIdx].candidates.length > 1) {
      updated[qIdx].candidates.splice(cIdx, 1);
      setQuestions(updated);
    }
  };

  // Public Live Submission
  const handleLiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const existingForms: RackForm[] = JSON.parse(localStorage.getItem("rack_forms") || "[]");
    const targetIndex = existingForms.findIndex((f) => f.id === formId);
    if (targetIndex === -1) return;

    const currentForm = existingForms[targetIndex];
    const votingQ = currentForm.questions.find((q) => q.type === "paid_voting");
    let totalPaid = 0;
    if (votingQ && liveSelectedCandidate) {
      totalPaid = (votingQ.pricePerVote || 1) * liveVotesCount;
      if (votingQ.candidates) {
        const cIndex = votingQ.candidates.findIndex((c) => c.name === liveSelectedCandidate);
        if (cIndex >= 0) {
          votingQ.candidates[cIndex].votes += liveVotesCount;
        }
      }
    }

    const newResponse: FormResponseItem = {
      id: "resp_" + Date.now(),
      submittedAt: new Date().toLocaleString(),
      email: liveEmail || "Anonymous",
      answers: liveAnswers,
      votedCandidate: liveSelectedCandidate || undefined,
      voteCount: liveSelectedCandidate ? liveVotesCount : undefined,
      totalPaid: totalPaid > 0 ? totalPaid : undefined,
    };

    currentForm.responses = [newResponse, ...(currentForm.responses || [])];
    existingForms[targetIndex] = currentForm;

    localStorage.setItem("rack_forms", JSON.stringify(existingForms));
    setLiveSubmitted(true);
  };

  const livePublicUrl = typeof window !== "undefined" ? `${window.location.origin}/form?id=${formId}&view=live` : "";

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(livePublicUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const currentTheme = settings.theme || {
    accentColor: "#ab1f09",
    fontFamily: "font-sans",
    cardRadius: "rounded-3xl",
  };

  // =========================================================================
  // 1. PUBLIC LIVE RESPONDENT VIEW
  // =========================================================================
  if (isLiveView) {
    return (
      <div className={`min-h-screen w-full bg-[#050505] text-white flex flex-col justify-center items-center p-4 sm:p-8 ${currentTheme.fontFamily}`}>
        <div className={`w-full max-w-2xl bg-[#0d0d0d] border border-neutral-800 ${currentTheme.cardRadius} p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-8`}>
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ backgroundColor: currentTheme.accentColor }}
          />

          {liveSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div
                className="w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto"
                style={{
                  backgroundColor: `${currentTheme.accentColor}20`,
                  borderColor: currentTheme.accentColor,
                  color: currentTheme.accentColor,
                }}
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Submission Confirmed</h2>
              <p className="text-sm text-neutral-400 max-w-md mx-auto">{settings.confirmationMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleLiveSubmit} className="space-y-8">
              <div className="space-y-2 border-b border-neutral-800/80 pb-6">
                <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
                <p className="text-sm text-neutral-400 font-light leading-relaxed">{description}</p>

                {settings.collectEmail && (
                  <div className="pt-4">
                    <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">
                      Your Email Address <span style={{ color: currentTheme.accentColor }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={liveEmail}
                      onChange={(e) => setLiveEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full px-4 py-3 bg-[#111111] border border-neutral-800 rounded-xl text-sm text-white focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {questions.map((q, idx) => (
                  <div key={q.id} className={`p-6 bg-[#111111]/80 border border-neutral-800 ${currentTheme.cardRadius} space-y-4`}>
                    <label className="block text-sm font-semibold text-white">
                      {idx + 1}. {q.title} {q.required && <span style={{ color: currentTheme.accentColor }}>*</span>}
                    </label>

                    {q.type === "short_answer" && (
                      <input
                        type="text"
                        required={q.required}
                        value={liveAnswers[q.id] || ""}
                        onChange={(e) => setLiveAnswers({ ...liveAnswers, [q.id]: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black border border-neutral-800 rounded-xl text-sm text-white outline-none"
                        placeholder="Your answer..."
                      />
                    )}

                    {q.type === "paragraph" && (
                      <textarea
                        rows={3}
                        required={q.required}
                        value={liveAnswers[q.id] || ""}
                        onChange={(e) => setLiveAnswers({ ...liveAnswers, [q.id]: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black border border-neutral-800 rounded-xl text-sm text-white outline-none resize-none"
                        placeholder="Write your response..."
                      />
                    )}

                    {(q.type === "multiple_choice" || q.type === "dropdown") && (
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => (
                          <label key={oIdx} className="flex items-center gap-3 text-sm text-neutral-300 cursor-pointer">
                            <input
                              type="radio"
                              name={q.id}
                              required={q.required}
                              checked={liveAnswers[q.id] === opt}
                              onChange={() => setLiveAnswers({ ...liveAnswers, [q.id]: opt })}
                              className="w-4 h-4"
                              style={{ accentColor: currentTheme.accentColor }}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {q.type === "checkboxes" && (
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => (
                          <label key={oIdx} className="flex items-center gap-3 text-sm text-neutral-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(liveAnswers[q.id] || []).includes(opt)}
                              onChange={(e) => {
                                const curr: string[] = liveAnswers[q.id] || [];
                                const updated = e.target.checked ? [...curr, opt] : curr.filter((x) => x !== opt);
                                setLiveAnswers({ ...liveAnswers, [q.id]: updated });
                              }}
                              className="w-4 h-4"
                              style={{ accentColor: currentTheme.accentColor }}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {q.type === "rating" && (
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            type="button"
                            key={val}
                            onClick={() => setLiveAnswers({ ...liveAnswers, [q.id]: val })}
                            className="w-10 h-10 rounded-xl font-mono text-sm transition-all border cursor-pointer"
                            style={{
                              backgroundColor: liveAnswers[q.id] === val ? currentTheme.accentColor : "#000",
                              borderColor: liveAnswers[q.id] === val ? currentTheme.accentColor : "#262626",
                              color: liveAnswers[q.id] === val ? "#fff" : "#a3a3a3",
                            }}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Paid Voting Contestant Selector */}
                    {q.type === "paid_voting" && (
                      <div className="space-y-4">
                        <div className="text-xs font-mono text-neutral-400">
                          Rate: <span style={{ color: currentTheme.accentColor }}>{q.currency} {q.pricePerVote}</span> per vote
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.candidates?.map((cand) => (
                            <div
                              key={cand.id}
                              onClick={() => setLiveSelectedCandidate(cand.name)}
                              className="p-4 rounded-2xl border transition-all cursor-pointer space-y-1"
                              style={{
                                backgroundColor: liveSelectedCandidate === cand.name ? `${currentTheme.accentColor}15` : "#000",
                                borderColor: liveSelectedCandidate === cand.name ? currentTheme.accentColor : "#262626",
                              }}
                            >
                              <div className="font-semibold text-sm text-white">{cand.name}</div>
                              <div className="text-xs text-neutral-500">{cand.category}</div>
                              <div className="text-[11px] font-mono text-neutral-400 pt-1">
                                Current Tally: {cand.votes} votes
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between p-3 bg-black border border-neutral-800 rounded-xl">
                          <span className="text-xs font-mono text-neutral-400">Votes:</span>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              min="1"
                              value={liveVotesCount}
                              onChange={(e) => setLiveVotesCount(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-16 px-2 py-1 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono text-center text-xs"
                            />
                            <span className="text-xs font-mono font-bold" style={{ color: currentTheme.accentColor }}>
                              Total: {q.currency} {((q.pricePerVote || 1) * liveVotesCount).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-4 text-white font-mono font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl cursor-pointer"
                style={{ backgroundColor: currentTheme.accentColor }}
              >
                Submit Form
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. ADMIN FORM BUILDER INTERFACE
  // =========================================================================
  return (
    <div className={`min-h-screen w-full bg-[#050505] text-white flex flex-col ${currentTheme.fontFamily}`}>
      
      {/* Top Header Bar */}
      <header className="w-full border-b border-neutral-800/80 bg-black/80 backdrop-blur-xl py-3 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50">
        
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">DASHBOARD</span>
          </Link>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-base font-semibold text-white bg-transparent border-b border-transparent focus:border-neutral-500 outline-none px-1 max-w-[180px] sm:max-w-xs truncate"
            placeholder="Form Title"
          />

          <span className="text-[10px] font-mono text-neutral-500 hidden md:inline-flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${savedNotice ? "bg-emerald-500" : "bg-neutral-600"}`} />
            <span>{savedNotice ? "Saved" : `Auto-saved ${updatedAt}`}</span>
          </span>
        </div>

        {/* Center: Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab("builder")}
            className="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            style={{
              backgroundColor: activeTab === "builder" ? currentTheme.accentColor : "transparent",
              color: activeTab === "builder" ? "#fff" : "#a3a3a3",
            }}
          >
            Builder
          </button>
          <button
            onClick={() => setActiveTab("responses")}
            className="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            style={{
              backgroundColor: activeTab === "responses" ? currentTheme.accentColor : "transparent",
              color: activeTab === "responses" ? "#fff" : "#a3a3a3",
            }}
          >
            Responses ({responses.length})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            style={{
              backgroundColor: activeTab === "settings" ? currentTheme.accentColor : "transparent",
              color: activeTab === "settings" ? "#fff" : "#a3a3a3",
            }}
          >
            Settings
          </button>
        </div>

        {/* Right: Theme, Copy Link & Publish */}
        <div className="flex items-center gap-2.5">
          
          {/* Theme Palette Button */}
          <button
            onClick={() => setShowThemeModal(true)}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            title="Customize Form Theme"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4 5 5 0 013-4.5V6a3 3 0 016 0v6.5A5 5 0 0115 17a4 4 0 01-4 4H7zM15 11l6-6m-3 0l3 3" />
            </svg>
            <span className="hidden sm:inline">THEME</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>{copiedLink ? "COPIED!" : "SHARE LINK"}</span>
          </button>

          {/* Publish Toggle */}
          <button
            onClick={() => setStatus(status === "published" ? "closed" : "published")}
            className="px-3.5 py-1.5 text-xs font-mono font-medium uppercase rounded-xl transition-all cursor-pointer"
            style={{
              backgroundColor: status === "published" ? "transparent" : currentTheme.accentColor,
              color: status === "published" ? "#10b981" : "#fff",
              border: status === "published" ? "1px solid #10b98150" : "none",
            }}
          >
            {status === "published" ? "PUBLISHED" : "PUBLISH"}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6 relative">
        
        {/* TAB 1: BUILDER */}
        {activeTab === "builder" && (
          <div className="space-y-6">
            
            {/* Header Card */}
            <div className={`p-6 sm:p-8 ${currentTheme.cardRadius} bg-[#0d0d0d] border border-neutral-800 space-y-3 relative overflow-hidden shadow-2xl`}>
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: currentTheme.accentColor }}
              />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl sm:text-3xl font-bold text-white bg-transparent border-b border-transparent focus:border-neutral-600 outline-none pb-1"
                placeholder="Form Title"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full text-xs sm:text-sm text-neutral-400 font-light bg-transparent border-b border-transparent focus:border-neutral-600 outline-none resize-none"
                placeholder="Form Description"
              />
            </div>

            {/* Questions Blocks */}
            {questions.map((q, qIdx) => (
              <div
                key={q.id}
                className={`p-6 sm:p-8 ${currentTheme.cardRadius} bg-[#0d0d0d] border border-neutral-800 space-y-5 hover:border-neutral-700 transition-all relative group`}
              >
                {/* Top Row with Delete Full Block Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xs font-mono text-neutral-500">{qIdx + 1}.</span>
                    <input
                      type="text"
                      value={q.title}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qIdx].title = e.target.value;
                        setQuestions(updated);
                      }}
                      className="w-full text-sm sm:text-base font-semibold text-white bg-[#111111] border border-neutral-800 rounded-xl px-4 py-2.5 focus:border-neutral-600 outline-none"
                      placeholder="Question Title..."
                    />
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-[10px] font-mono px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[#fff7d3] uppercase">
                      {q.type.replace("_", " ")}
                    </span>

                    {/* Delete Full Block Button */}
                    <button
                      onClick={() => handleDeleteFullBlock(q.id)}
                      className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-red-400 hover:border-red-500/40 transition-colors cursor-pointer"
                      title="Delete Full Question Block"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Question Body */}
                <div className="pt-2">
                  {/* Options for Choices */}
                  {(q.type === "multiple_choice" || q.type === "checkboxes" || q.type === "dropdown") && (
                    <div className="space-y-2.5">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-3">
                          <span className="text-xs font-mono text-neutral-500">○</span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                            className="text-xs sm:text-sm text-neutral-200 bg-transparent border-b border-neutral-800 focus:border-neutral-500 outline-none py-1 flex-1"
                          />
                          {q.options.length > 1 && (
                            <button
                              onClick={() => handleDeleteOption(qIdx, oIdx)}
                              className="text-neutral-600 hover:text-red-400 text-xs px-2 cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddOption(qIdx)}
                        className="text-xs font-mono pt-1 block cursor-pointer hover:underline"
                        style={{ color: currentTheme.accentColor }}
                      >
                        + Add Choice
                      </button>
                    </div>
                  )}

                  {/* Paid Voting Candidates Editor */}
                  {q.type === "paid_voting" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs font-mono">
                        <span>Price Per Vote:</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0.1"
                          value={q.pricePerVote || 1.0}
                          onChange={(e) => {
                            const updated = [...questions];
                            updated[qIdx].pricePerVote = parseFloat(e.target.value) || 1.0;
                            setQuestions(updated);
                          }}
                          className="w-20 px-2 py-1 bg-black border border-neutral-700 rounded-lg text-white font-mono text-xs outline-none"
                        />
                        <select
                          value={q.currency || "USD"}
                          onChange={(e) => {
                            const updated = [...questions];
                            updated[qIdx].currency = e.target.value;
                            setQuestions(updated);
                          }}
                          className="px-2 py-1 bg-black border border-neutral-700 rounded-lg text-white font-mono text-xs"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="NGN">NGN (₦)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        {q.candidates?.map((cand, cIdx) => (
                          <div key={cand.id} className="flex items-center gap-3 p-3 bg-[#111111] border border-neutral-800 rounded-xl">
                            <span className="text-xs font-mono text-neutral-500">{cIdx + 1}</span>
                            <input
                              type="text"
                              value={cand.name}
                              onChange={(e) => handleCandidateChange(qIdx, cIdx, "name", e.target.value)}
                              className="text-xs sm:text-sm text-white bg-transparent border-b border-transparent focus:border-neutral-500 outline-none flex-1"
                              placeholder="Contestant Name"
                            />
                            <input
                              type="text"
                              value={cand.category || ""}
                              onChange={(e) => handleCandidateChange(qIdx, cIdx, "category", e.target.value)}
                              className="text-xs text-neutral-400 bg-transparent border-b border-transparent focus:border-neutral-500 outline-none w-1/3"
                              placeholder="Tagline / Category"
                            />
                            {q.candidates && q.candidates.length > 1 && (
                              <button
                                onClick={() => handleDeleteCandidate(qIdx, cIdx)}
                                className="text-neutral-500 hover:text-red-400 text-xs px-2 cursor-pointer"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddCandidate(qIdx)}
                          className="text-xs font-mono pt-1 block cursor-pointer hover:underline"
                          style={{ color: currentTheme.accentColor }}
                        >
                          + Add Contestant
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleDuplicateQuestion(qIdx)} className="hover:text-white cursor-pointer">
                      Duplicate
                    </button>
                    <button onClick={() => handleDeleteFullBlock(q.id)} className="hover:text-red-400 cursor-pointer">
                      Delete Block
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>Required</span>
                    <button
                      onClick={() => {
                        const updated = [...questions];
                        updated[qIdx].required = !updated[qIdx].required;
                        setQuestions(updated);
                      }}
                      className="w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer"
                      style={{
                        backgroundColor: q.required ? currentTheme.accentColor : "#262626",
                      }}
                    >
                      <div
                        className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                          q.required ? "translate-x-3.5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Element Bar */}
            <div className="relative">
              <button
                onClick={() => setShowTypeSelector(!showTypeSelector)}
                className={`w-full py-4 ${currentTheme.cardRadius} bg-[#0d0d0d] border border-dashed border-neutral-800 hover:border-neutral-600 text-xs font-mono text-white transition-all flex items-center justify-center gap-2 cursor-pointer`}
              >
                <span className="text-base font-bold">+</span> ADD QUESTION OR ELEMENT
              </button>

              {/* Element Type Picker Modal */}
              {showTypeSelector && (
                <div className={`absolute top-full left-0 right-0 mt-3 p-4 bg-[#0d0d0d] border border-neutral-800 ${currentTheme.cardRadius} shadow-2xl z-30 grid grid-cols-2 sm:grid-cols-3 gap-3`}>
                  {[
                    { id: "short_answer", label: "Short Text" },
                    { id: "paragraph", label: "Long Answer" },
                    { id: "multiple_choice", label: "Multiple Choice" },
                    { id: "checkboxes", label: "Checkboxes" },
                    { id: "dropdown", label: "Dropdown" },
                    { id: "number", label: "Number Input" },
                    { id: "date", label: "Date Picker" },
                    { id: "rating", label: "Rating Scale" },
                    { id: "paid_voting", label: "Paid Voting Ballot ($$)" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleAddQuestion(item.id as QuestionType)}
                      className={`p-3 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                        item.id === "paid_voting"
                          ? "bg-neutral-900 border-[#ab1f09] text-white font-bold"
                          : "bg-[#111111] border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: RESPONSES */}
        {activeTab === "responses" && (
          <div className="space-y-6">
            <div className={`p-6 ${currentTheme.cardRadius} bg-[#0d0d0d] border border-neutral-800 flex items-center justify-between`}>
              <div className="text-xs font-mono text-neutral-400 uppercase">
                Submissions: <span className="text-white font-bold">{responses.length}</span>
              </div>
            </div>

            {responses.length === 0 ? (
              <div className={`p-12 text-center border border-dashed border-neutral-800 ${currentTheme.cardRadius} bg-[#0d0d0d]/40 text-xs font-mono text-neutral-500`}>
                No submissions recorded yet. Share your public link to start collecting data.
              </div>
            ) : (
              <div className={`border border-neutral-800 ${currentTheme.cardRadius} overflow-x-auto bg-[#0d0d0d]`}>
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-neutral-800 bg-neutral-900/60 text-neutral-400">
                    <tr>
                      <th className="p-4">#</th>
                      <th className="p-4">Submitted At</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Vote Candidate</th>
                      <th className="p-4">Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                    {responses.map((res, idx) => (
                      <tr key={res.id} className="hover:bg-neutral-900/40">
                        <td className="p-4 text-neutral-500">{idx + 1}</td>
                        <td className="p-4 text-neutral-400">{res.submittedAt}</td>
                        <td className="p-4 text-white">{res.email || "Anonymous"}</td>
                        <td className="p-4 text-[#fff7d3]">{res.votedCandidate || "-"}</td>
                        <td className="p-4 text-emerald-400">{res.totalPaid ? `$${res.totalPaid.toFixed(2)}` : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === "settings" && (
          <div className={`max-w-xl mx-auto p-6 sm:p-8 ${currentTheme.cardRadius} bg-[#0d0d0d] border border-neutral-800 space-y-6`}>
            <h3 className="text-sm font-mono text-white uppercase tracking-wider">Form Preferences</h3>
            
            <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
              <div>
                <div className="text-xs font-semibold text-white">Accepting Responses</div>
                <div className="text-[11px] text-neutral-500">Allow users to submit this form</div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, acceptingResponses: !settings.acceptingResponses })}
                className="w-8 h-4.5 flex items-center rounded-full p-0.5 cursor-pointer"
                style={{
                  backgroundColor: settings.acceptingResponses ? currentTheme.accentColor : "#262626",
                }}
              >
                <div
                  className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                    settings.acceptingResponses ? "translate-x-3.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-neutral-800 pt-4 space-y-2">
              <label className="text-xs font-semibold text-white">Confirmation Message</label>
              <input
                type="text"
                value={settings.confirmationMessage}
                onChange={(e) => setSettings({ ...settings, confirmationMessage: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#111111] border border-neutral-800 rounded-xl text-xs text-white outline-none"
              />
            </div>
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* 3. THEME CUSTOMIZER MODAL DRAWER */}
      {/* ========================================================= */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Customize Form Theme</h3>
                <p className="text-xs text-neutral-400">Pick colors, typography, and card radius.</p>
              </div>
              <button
                onClick={() => setShowThemeModal(false)}
                className="text-neutral-500 hover:text-white text-xs font-mono cursor-pointer"
              >
                CLOSE ✕
              </button>
            </div>

            {/* Accent Colors */}
            <div className="space-y-3">
              <label className="text-xs font-mono text-neutral-400 uppercase">Accent Theme Color</label>
              <div className="grid grid-cols-3 gap-2.5">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.hex}
                    onClick={() =>
                      setSettings({
                        ...settings,
                        theme: { ...currentTheme, accentColor: preset.hex },
                      })
                    }
                    className="p-2.5 rounded-xl border flex items-center gap-2 text-xs font-mono transition-all cursor-pointer"
                    style={{
                      borderColor: currentTheme.accentColor === preset.hex ? preset.hex : "#262626",
                      backgroundColor: currentTheme.accentColor === preset.hex ? `${preset.hex}20` : "#111",
                    }}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.hex }} />
                    <span className="truncate">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-3 border-t border-neutral-800 pt-4">
              <label className="text-xs font-mono text-neutral-400 uppercase">Typography Font</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "font-sans", label: "Sans (Clean)" },
                  { id: "font-mono", label: "Mono (Tech)" },
                  { id: "font-serif", label: "Serif (Luxury)" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() =>
                      setSettings({
                        ...settings,
                        theme: { ...currentTheme, fontFamily: f.id as any },
                      })
                    }
                    className={`p-2.5 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                      currentTheme.fontFamily === f.id
                        ? "bg-neutral-800 border-neutral-500 text-white font-bold"
                        : "bg-[#111] border-neutral-800 text-neutral-400"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Curvature */}
            <div className="space-y-3 border-t border-neutral-800 pt-4">
              <label className="text-xs font-mono text-neutral-400 uppercase">Corner Curvature</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "rounded-xl", label: "Subtle (12px)" },
                  { id: "rounded-2xl", label: "Smooth (16px)" },
                  { id: "rounded-3xl", label: "Pill Glass (24px)" },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() =>
                      setSettings({
                        ...settings,
                        theme: { ...currentTheme, cardRadius: r.id as any },
                      })
                    }
                    className={`p-2.5 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                      currentTheme.cardRadius === r.id
                        ? "bg-neutral-800 border-neutral-500 text-white font-bold"
                        : "bg-[#111] border-neutral-800 text-neutral-400"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowThemeModal(false)}
              className="w-full py-3 text-white font-mono text-xs font-semibold rounded-xl uppercase tracking-wider cursor-pointer"
              style={{ backgroundColor: currentTheme.accentColor }}
            >
              Apply Theme
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default function FormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <FormApp />
    </Suspense>
  );
}