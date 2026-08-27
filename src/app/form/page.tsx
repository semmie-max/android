"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// --- TYPES & INTERFACES ---
export type QuestionType =
  | "short_answer"
  | "paragraph"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown"
  | "number"
  | "date"
  | "file_upload"
  | "rating"
  | "paid_voting";

export interface VotingOption {
  id: string;
  name: string;
  bio?: string;
  votes: number;
}

export interface FormQuestion {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  required: boolean;
  options: string[]; // For multiple_choice, checkboxes, dropdown
  ratingMax?: number; // 5 or 10
  // Paid Voting Configurations
  pricePerVote?: number;
  currency?: string;
  votingOptions?: VotingOption[];
}

export interface FormSettings {
  acceptingResponses: boolean;
  limitResponses: boolean;
  maxResponses: number;
  collectEmail: boolean;
  confirmationMessage: string;
}

export interface FormResponseItem {
  id: string;
  submittedAt: string;
  email?: string;
  answers: Record<string, any>;
  totalPaid?: number;
}

export interface RackForm {
  id: string;
  title: string;
  description: string;
  status: "draft" | "published" | "closed";
  createdAt: string;
  updatedAt: string;
  views: number;
  settings: FormSettings;
  questions: FormQuestion[];
  responses: FormResponseItem[];
}

// --- FORM BUILDER CORE COMPONENT ---
function FormBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formIdParam = searchParams.get("id");

  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "responses" | "settings" | "analytics">("editor");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [savedToast, setSavedToast] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [responseSearch, setResponseSearch] = useState("");

  // Form State
  const [formId, setFormId] = useState<string>("");
  const [title, setTitle] = useState("Untitled Rack Form");
  const [description, setDescription] = useState("Configure and collect data or run monetized voting seamlessly.");
  const [status, setStatus] = useState<"draft" | "published" | "closed">("draft");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [views, setViews] = useState<number>(0);
  const [settings, setSettings] = useState<FormSettings>({
    acceptingResponses: true,
    limitResponses: false,
    maxResponses: 100,
    collectEmail: true,
    confirmationMessage: "Thank you! Your response has been securely recorded.",
  });
  const [questions, setQuestions] = useState<FormQuestion[]>([
    {
      id: "q_1",
      title: "What is your full name?",
      type: "short_answer",
      required: true,
      options: [],
    },
  ]);
  const [responses, setResponses] = useState<FormResponseItem[]>([]);

  // Simulation state for Preview Submission
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, any>>({});
  const [previewEmail, setPreviewEmail] = useState("");
  const [previewSubmitted, setPreviewSubmitted] = useState(false);

  // 1. Initial Form Load
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
        setViews(found.views || 0);
        setSettings(found.settings || settings);
        setQuestions(found.questions || []);
        setResponses(found.responses || []);
        return;
      }
    }

    // Initialize New Form
    const newId = "rack_" + Date.now();
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    setFormId(newId);
    setCreatedAt(dateStr);
    setUpdatedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }, [formIdParam]);

  // 2. Auto-Save Draft to LocalStorage
  useEffect(() => {
    if (!formId) return;

    const existingForms: RackForm[] = JSON.parse(localStorage.getItem("rack_forms") || "[]");
    const updatedTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const currentForm: RackForm = {
      id: formId,
      title: title || "Untitled Rack Form",
      description: description || "",
      status,
      createdAt: createdAt || "Today",
      updatedAt: updatedTime,
      views,
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
    setSavedToast(true);
    const timer = setTimeout(() => setSavedToast(false), 1500);
    return () => clearTimeout(timer);
  }, [formId, title, description, status, settings, questions, responses]);

  // --- QUESTION ACTIONS ---
  const handleAddQuestion = (type: QuestionType = "short_answer") => {
    const newQ: FormQuestion = {
      id: "q_" + Date.now(),
      title: type === "paid_voting" ? "Vote for your preferred Contestant" : "Untitled Question",
      type,
      required: false,
      options: ["Option 1", "Option 2"],
      ratingMax: 5,
      pricePerVote: 1.0,
      currency: "USD",
      votingOptions:
        type === "paid_voting"
          ? [
              { id: "cand_1", name: "Contestant A", bio: "Category Nominee", votes: 0 },
              { id: "cand_2", name: "Contestant B", bio: "Category Nominee", votes: 0 },
            ]
          : undefined,
    };
    setQuestions([...questions, newQ]);
  };

  const handleDuplicateQuestion = (index: number) => {
    const target = questions[index];
    const duplicated: FormQuestion = {
      ...target,
      id: "q_" + Date.now(),
      title: `${target.title} (Copy)`,
    };
    const updated = [...questions];
    updated.splice(index + 1, 0, duplicated);
    setQuestions(updated);
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleMoveQuestion = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === questions.length - 1)) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...questions];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setQuestions(updated);
  };

  // Option modifications
  const handleAddOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push(`Option ${updated[qIndex].options.length + 1}`);
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleDeleteOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options.length <= 1) return;
    updated[qIndex].options.splice(optIndex, 1);
    setQuestions(updated);
  };

  // Paid Voting Contestant modifications
  const handleAddContestant = (qIndex: number) => {
    const updated = [...questions];
    if (!updated[qIndex].votingOptions) updated[qIndex].votingOptions = [];
    updated[qIndex].votingOptions!.push({
      id: "cand_" + Date.now(),
      name: `Contestant ${updated[qIndex].votingOptions!.length + 1}`,
      bio: "Nominee",
      votes: 0,
    });
    setQuestions(updated);
  };

  const handleContestantChange = (qIndex: number, cIndex: number, field: "name" | "bio", val: string) => {
    const updated = [...questions];
    if (updated[qIndex].votingOptions) {
      updated[qIndex].votingOptions![cIndex][field] = val;
      setQuestions(updated);
    }
  };

  const handleDeleteContestant = (qIndex: number, cIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].votingOptions && updated[qIndex].votingOptions!.length > 1) {
      updated[qIndex].votingOptions!.splice(cIndex, 1);
      setQuestions(updated);
    }
  };

  // --- PUBLISH & SHARING ---
  const handlePublishToggle = () => {
    const nextStatus = status === "published" ? "closed" : "published";
    setStatus(nextStatus);
  };

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/form?id=${formId}&view=live` : "";

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const embedCode = `<iframe src="${shareUrl}" width="100%" height="700" frameborder="0"></iframe>`;

  const handleCopyEmbed = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(embedCode);
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    }
  };

  // --- RESPONSES MANAGEMENT ---
  const filteredResponses = responses.filter((r) => {
    if (!responseSearch) return true;
    const searchLower = responseSearch.toLowerCase();
    return (
      (r.email && r.email.toLowerCase().includes(searchLower)) ||
      JSON.stringify(r.answers).toLowerCase().includes(searchLower)
    );
  });

  const handleExportCSV = () => {
    if (responses.length === 0) return alert("No responses to export.");
    const headers = ["ID", "Submitted At", "Email", ...questions.map((q) => `"${q.title}"`), "Total Paid"];
    const rows = responses.map((r) => [
      r.id,
      r.submittedAt,
      r.email || "N/A",
      ...questions.map((q) => `"${r.answers[q.id] !== undefined ? r.answers[q.id] : ""}"`),
      r.totalPaid || 0,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.replace(/\s+/g, "_")}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteResponse = (resId: string) => {
    const updated = responses.filter((r) => r.id !== resId);
    setResponses(updated);
  };

  // Preview form submit simulator
  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newResponse: FormResponseItem = {
      id: "resp_" + Date.now(),
      submittedAt: new Date().toLocaleString(),
      email: previewEmail || "guest@rack.io",
      answers: previewAnswers,
      totalPaid: 0,
    };
    setResponses([newResponse, ...responses]);
    setPreviewSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col selection:bg-[#ab1f09] selection:text-[#fff7d3] font-sans antialiased">
      
      {/* 1. TOP HEADER / CONTROL BAR */}
      <header className="w-full border-b border-neutral-800/80 bg-black/70 backdrop-blur-xl py-3 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
        
        {/* Left: Navigation, Title & Save Indicator */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-[#fff7d3] hover:border-neutral-700 transition-all flex items-center gap-1.5 text-xs font-mono"
            title="Return to Dashboard"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">DASHBOARD</span>
          </Link>

          <div className="h-4 w-[1px] bg-neutral-800" />

          <div className="w-7 h-7 rounded-lg bg-[#ab1f09] flex items-center justify-center text-[#fff7d3] font-mono font-bold text-xs shadow-md shadow-[#ab1f09]/20">
            R
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm sm:text-base font-semibold text-white bg-transparent border-b border-transparent focus:border-[#ab1f09] focus:outline-none px-1 py-0.5 transition-all max-w-[170px] sm:max-w-xs truncate"
            placeholder="Form Title"
          />

          {/* Auto-Save indicator */}
          <span className="text-[10px] font-mono text-neutral-500 hidden md:inline-flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${savedToast ? "bg-emerald-500 animate-pulse" : "bg-neutral-600"}`} />
            <span>{savedToast ? "Auto-saved" : `Saved at ${updatedAt}`}</span>
          </span>
        </div>

        {/* Center: View Mode Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs font-mono">
          {[
            { id: "editor", label: "Editor" },
            { id: "preview", label: "Preview" },
            { id: "responses", label: `Responses (${responses.length})` },
            { id: "settings", label: "Settings" },
            { id: "analytics", label: "Analytics" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setPreviewSubmitted(false);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#ab1f09] text-[#fff7d3] font-medium shadow-md shadow-[#ab1f09]/20"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Status, Copy Link, and Publish Switch */}
        <div className="flex items-center gap-2.5">
          
          {/* Share Button */}
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-[#fff7d3] hover:border-neutral-700 transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            title="Copy Public Link"
          >
            <svg className="w-3.5 h-3.5 text-[#ab1f09]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="hidden sm:inline">{copiedLink ? "COPIED!" : "SHARE"}</span>
          </button>

          {/* Status Badge */}
          <span
            className={`text-[9px] font-mono px-2.5 py-1 rounded-full uppercase font-bold tracking-wider ${
              status === "published"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : status === "closed"
                ? "bg-red-500/15 text-red-400 border border-red-500/30"
                : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
            }`}
          >
            {status === "published" ? "LIVE" : status === "closed" ? "CLOSED" : "DRAFT"}
          </span>

          {/* Publish / Close Button */}
          <button
            onClick={handlePublishToggle}
            className={`px-3.5 py-1.5 text-xs font-mono font-medium tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer ${
              status === "published"
                ? "bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:border-red-500/50"
                : "bg-[#ab1f09] hover:bg-[#c2240b] text-[#fff7d3] shadow-[#ab1f09]/20"
            }`}
          >
            {status === "published" ? "Close Form" : "Publish Form"}
          </button>
        </div>
      </header>

      {/* 2. TAB CONTENT ROUTER */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 relative">
        
        {/* Ambient Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#ab1f09]/5 blur-[150px] pointer-events-none rounded-full" />

        {/* ========================================================= */}
        {/* TAB 1: FORM EDITOR */}
        {/* ========================================================= */}
        {activeTab === "editor" && (
          <div className="flex gap-6 items-start relative z-10">
            
            {/* Main Form Stack */}
            <div className="flex-1 space-y-6">
              
              {/* Header Title & Description Card */}
              <div className="p-6 sm:p-8 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/90 backdrop-blur-xl shadow-2xl relative overflow-hidden space-y-4">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ab1f09] via-[#fff7d3]/40 to-[#ab1f09]" />
                
                <div>
                  <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Form Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-2xl sm:text-3xl font-semibold tracking-tight text-white bg-transparent border-b border-neutral-800 focus:border-[#ab1f09] outline-none pb-2 transition-all mt-1"
                    placeholder="Enter Rack Form Title"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Description / Instructions</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full text-xs sm:text-sm text-neutral-400 font-light bg-transparent border-b border-neutral-800 focus:border-[#ab1f09] outline-none pb-2 transition-all mt-1 resize-none"
                    placeholder="Provide details or instructions for respondents..."
                  />
                </div>
              </div>

              {/* Dynamic Questions List */}
              {questions.map((q, qIndex) => (
                <div
                  key={q.id}
                  className="border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/90 backdrop-blur-xl shadow-xl relative overflow-hidden group hover:border-neutral-700 transition-all space-y-6 p-6 sm:p-8"
                >
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#ab1f09]" />

                  {/* Question Header & Type Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    
                    {/* Index & Title */}
                    <div className="sm:col-span-8 flex items-center gap-3">
                      <span className="text-xs font-mono text-neutral-500 px-2 py-1 bg-neutral-900 border border-neutral-800 rounded-md">
                        {qIndex + 1}
                      </span>
                      <input
                        type="text"
                        value={q.title}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[qIndex].title = e.target.value;
                          setQuestions(updated);
                        }}
                        className="w-full text-sm sm:text-base font-medium text-white bg-[#111111] border border-neutral-800 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#ab1f09] transition-all"
                        placeholder="Question title..."
                      />
                    </div>

                    {/* Question Type Selector */}
                    <div className="sm:col-span-4">
                      <select
                        value={q.type}
                        onChange={(e) => {
                          const updated = [...questions];
                          const newType = e.target.value as QuestionType;
                          updated[qIndex].type = newType;
                          if (newType === "paid_voting" && !updated[qIndex].votingOptions) {
                            updated[qIndex].votingOptions = [
                              { id: "cand_1", name: "Contestant 1", bio: "Nominee", votes: 0 },
                              { id: "cand_2", name: "Contestant 2", bio: "Nominee", votes: 0 },
                            ];
                            updated[qIndex].pricePerVote = 1.0;
                            updated[qIndex].currency = "USD";
                          }
                          setQuestions(updated);
                        }}
                        className="w-full bg-[#111111] border border-neutral-800 rounded-xl px-3 py-2.5 text-xs font-mono text-neutral-300 focus:outline-none focus:border-[#ab1f09] cursor-pointer"
                      >
                        <option value="short_answer">Short Answer</option>
                        <option value="paragraph">Long Answer / Paragraph</option>
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="checkboxes">Checkboxes</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="file_upload">File Upload</option>
                        <option value="rating">Rating (1-5 / 1-10)</option>
                        <option value="paid_voting">Paid Voting / Monetized Contest</option>
                      </select>
                    </div>
                  </div>

                  {/* Dynamic Body according to Type */}
                  <div className="space-y-3 pt-2">
                    
                    {/* 1. Short Answer */}
                    {q.type === "short_answer" && (
                      <div className="text-xs font-mono text-neutral-500 italic border-b border-dashed border-neutral-800 py-3">
                        Short answer text input will appear here...
                      </div>
                    )}

                    {/* 2. Paragraph */}
                    {q.type === "paragraph" && (
                      <div className="text-xs font-mono text-neutral-500 italic border border-dashed border-neutral-800 rounded-xl p-4">
                        Multi-line long paragraph input will appear here...
                      </div>
                    )}

                    {/* 3. Number */}
                    {q.type === "number" && (
                      <div className="text-xs font-mono text-neutral-500 italic border-b border-dashed border-neutral-800 py-3">
                        Numerical value input (e.g., 42, 1000)...
                      </div>
                    )}

                    {/* 4. Date */}
                    {q.type === "date" && (
                      <div className="text-xs font-mono text-neutral-500 italic border-b border-dashed border-neutral-800 py-3">
                        Date selection picker (YYYY-MM-DD)...
                      </div>
                    )}

                    {/* 5. File Upload */}
                    {q.type === "file_upload" && (
                      <div className="border border-dashed border-neutral-800 rounded-xl p-6 text-center text-xs font-mono text-neutral-500 space-y-1">
                        <div>Upload Box (Supports Documents, Images, Audio, PDF)</div>
                        <div className="text-[10px] text-neutral-600">Max size 25MB</div>
                      </div>
                    )}

                    {/* 6. Rating */}
                    {q.type === "rating" && (
                      <div className="flex items-center gap-3 pt-2">
                        <span className="text-xs font-mono text-neutral-400">Scale:</span>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <div
                            key={num}
                            className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center font-mono text-xs text-neutral-300"
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 7. Multiple Choice, Checkboxes, Dropdown */}
                    {(q.type === "multiple_choice" || q.type === "checkboxes" || q.type === "dropdown") && (
                      <div className="space-y-2.5">
                        {q.options.map((opt, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-3">
                            <span className="text-[11px] font-mono text-neutral-600 w-4 text-center">
                              {q.type === "multiple_choice" ? "○" : q.type === "checkboxes" ? "□" : `${optIndex + 1}.`}
                            </span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                              className="text-xs sm:text-sm text-neutral-200 bg-transparent border-b border-neutral-800 focus:border-[#ab1f09] outline-none py-1 flex-1 transition-colors"
                              placeholder={`Option ${optIndex + 1}`}
                            />
                            {q.options.length > 1 && (
                              <button
                                onClick={() => handleDeleteOption(qIndex, optIndex)}
                                className="text-neutral-600 hover:text-red-400 text-xs px-2 transition-colors cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddOption(qIndex)}
                          className="text-xs font-mono text-[#fff7d3] hover:text-[#ab1f09] transition-colors pt-2 block cursor-pointer"
                        >
                          + Add Option
                        </button>
                      </div>
                    )}

                    {/* 8. PAID VOTING / MONETIZED CONTESTANT POLL */}
                    {q.type === "paid_voting" && (
                      <div className="space-y-4 pt-2">
                        <div className="p-4 rounded-xl bg-neutral-900/80 border border-[#ab1f09]/30 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-300">
                            <span className="text-[#fff7d3] font-semibold tracking-wider">
                              MONETIZATION SETTINGS:
                            </span>
                            <div className="flex items-center gap-3">
                              <span>Price Per Vote:</span>
                              <input
                                type="number"
                                step="0.5"
                                min="0.1"
                                value={q.pricePerVote || 1.0}
                                onChange={(e) => {
                                  const updated = [...questions];
                                  updated[qIndex].pricePerVote = parseFloat(e.target.value) || 1.0;
                                  setQuestions(updated);
                                }}
                                className="w-20 px-2.5 py-1 bg-black border border-neutral-700 rounded-lg text-white font-mono text-xs focus:border-[#ab1f09] outline-none"
                              />
                              <select
                                value={q.currency || "USD"}
                                onChange={(e) => {
                                  const updated = [...questions];
                                  updated[qIndex].currency = e.target.value;
                                  setQuestions(updated);
                                }}
                                className="px-2 py-1 bg-black border border-neutral-700 rounded-lg text-white font-mono text-xs"
                              >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="NGN">NGN (₦)</option>
                                <option value="GHS">GHS (₵)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Contestant Nominee List */}
                        <div className="space-y-2.5">
                          <div className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                            Nominees / Candidates
                          </div>
                          {q.votingOptions?.map((cand, cIndex) => (
                            <div
                              key={cand.id}
                              className="flex items-center gap-3 p-3 bg-[#111111] border border-neutral-800 rounded-xl"
                            >
                              <div className="w-6 h-6 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center font-mono text-xs text-neutral-400">
                                {cIndex + 1}
                              </div>
                              <input
                                type="text"
                                value={cand.name}
                                onChange={(e) => handleContestantChange(qIndex, cIndex, "name", e.target.value)}
                                className="text-xs sm:text-sm text-white font-medium bg-transparent border-b border-transparent focus:border-[#ab1f09] outline-none flex-1"
                                placeholder="Candidate Name..."
                              />
                              <input
                                type="text"
                                value={cand.bio || ""}
                                onChange={(e) => handleContestantChange(qIndex, cIndex, "bio", e.target.value)}
                                className="text-xs text-neutral-400 bg-transparent border-b border-transparent focus:border-[#ab1f09] outline-none w-1/3 hidden sm:block"
                                placeholder="Tagline / Bio (optional)"
                              />
                              {q.votingOptions && q.votingOptions.length > 1 && (
                                <button
                                  onClick={() => handleDeleteContestant(qIndex, cIndex)}
                                  className="text-neutral-500 hover:text-red-400 text-xs px-2 cursor-pointer"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => handleAddContestant(qIndex)}
                            className="text-xs font-mono text-[#fff7d3] hover:text-[#ab1f09] transition-colors pt-1 block cursor-pointer"
                          >
                            + Add Candidate / Nominee
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Question Bottom Action Toolbar */}
                  <div className="pt-4 border-t border-neutral-800/70 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400">
                    
                    {/* Reordering Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleMoveQuestion(qIndex, "up")}
                        disabled={qIndex === 0}
                        className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMoveQuestion(qIndex, "down")}
                        disabled={qIndex === questions.length - 1}
                        className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {/* Right Utilities: Duplicate, Delete, Required */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleDuplicateQuestion(qIndex)}
                        className="hover:text-[#fff7d3] transition-colors cursor-pointer"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="hover:text-red-400 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>

                      <div className="h-4 w-[1px] bg-neutral-800" />

                      {/* Required Toggle */}
                      <div className="flex items-center gap-2">
                        <span>Required</span>
                        <button
                          onClick={() => {
                            const updated = [...questions];
                            updated[qIndex].required = !updated[qIndex].required;
                            setQuestions(updated);
                          }}
                          className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                            q.required ? "bg-[#ab1f09]" : "bg-neutral-800"
                          }`}
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

                </div>
              ))}

            </div>

            {/* Sticky Action Sidebar */}
            <aside className="sticky top-24 flex flex-col gap-2 bg-[#0d0d0d] border border-neutral-800/80 p-2 rounded-2xl shadow-2xl">
              <button
                onClick={() => handleAddQuestion("short_answer")}
                className="w-10 h-10 rounded-xl bg-[#ab1f09] hover:bg-[#c2240b] text-[#fff7d3] flex items-center justify-center font-bold text-lg shadow-md shadow-[#ab1f09]/20 transition-transform active:scale-95 cursor-pointer"
                title="Add Question"
              >
                +
              </button>
              <button
                onClick={() => handleAddQuestion("paid_voting")}
                className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#ab1f09] text-[#fff7d3] flex items-center justify-center text-xs font-mono transition-colors cursor-pointer"
                title="Add Paid Voting Section"
              >
                $$
              </button>
            </aside>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PREVIEW (MOBILE & DESKTOP TOGGLE) */}
        {/* ========================================================= */}
        {activeTab === "preview" && (
          <div className="space-y-6 flex flex-col items-center">
            
            {/* Device Frame Switcher */}
            <div className="flex items-center gap-2 p-1 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono">
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  previewDevice === "desktop" ? "bg-[#ab1f09] text-[#fff7d3]" : "text-neutral-400"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Desktop View</span>
              </button>

              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  previewDevice === "mobile" ? "bg-[#ab1f09] text-[#fff7d3]" : "text-neutral-400"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Mobile View</span>
              </button>
            </div>

            {/* Container Frame */}
            <div
              className={`transition-all duration-300 w-full ${
                previewDevice === "mobile"
                  ? "max-w-[390px] border-4 border-neutral-700 rounded-[36px] p-4 bg-black shadow-2xl overflow-hidden"
                  : "max-w-3xl"
              }`}
            >
              {previewSubmitted ? (
                /* Success Confirmation State */
                <div className="p-8 border border-neutral-800 rounded-2xl bg-[#0d0d0d] text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-xl font-bold font-mono">
                    ✓
                  </div>
                  <h2 className="text-xl font-semibold text-white">Submission Successful</h2>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">{settings.confirmationMessage}</p>
                  <button
                    onClick={() => {
                      setPreviewSubmitted(false);
                      setPreviewAnswers({});
                    }}
                    className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-xs font-mono rounded-lg hover:text-white"
                  >
                    Submit Another Response
                  </button>
                </div>
              ) : (
                /* Live Interactive Simulation Form */
                <form onSubmit={handlePreviewSubmit} className="space-y-6">
                  
                  {/* Form Header */}
                  <div className="p-6 border border-neutral-800 rounded-2xl bg-[#0d0d0d] relative overflow-hidden space-y-2">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#ab1f09]" />
                    <h1 className="text-2xl font-bold text-white">{title}</h1>
                    <p className="text-xs text-neutral-400">{description}</p>
                    {settings.collectEmail && (
                      <div className="pt-4">
                        <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={previewEmail}
                          onChange={(e) => setPreviewEmail(e.target.value)}
                          placeholder="your.email@gmail.com"
                          className="w-full px-4 py-2.5 bg-[#111111] border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#ab1f09]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Questions Preview */}
                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-6 border border-neutral-800 rounded-2xl bg-[#0d0d0d] space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-white">
                          {idx + 1}. {q.title} {q.required && <span className="text-[#ab1f09]">*</span>}
                        </h3>
                      </div>

                      {/* Inputs */}
                      {q.type === "short_answer" && (
                        <input
                          type="text"
                          required={q.required}
                          value={previewAnswers[q.id] || ""}
                          onChange={(e) => setPreviewAnswers({ ...previewAnswers, [q.id]: e.target.value })}
                          className="w-full px-4 py-2.5 bg-[#111111] border border-neutral-800 rounded-xl text-xs text-white focus:border-[#ab1f09] outline-none"
                          placeholder="Your answer"
                        />
                      )}

                      {q.type === "paragraph" && (
                        <textarea
                          rows={3}
                          required={q.required}
                          value={previewAnswers[q.id] || ""}
                          onChange={(e) => setPreviewAnswers({ ...previewAnswers, [q.id]: e.target.value })}
                          className="w-full px-4 py-2.5 bg-[#111111] border border-neutral-800 rounded-xl text-xs text-white focus:border-[#ab1f09] outline-none resize-none"
                          placeholder="Your detailed answer"
                        />
                      )}

                      {q.type === "multiple_choice" && (
                        <div className="space-y-2">
                          {q.options.map((opt, oIdx) => (
                            <label key={oIdx} className="flex items-center gap-3 text-xs text-neutral-300 cursor-pointer">
                              <input
                                type="radio"
                                name={q.id}
                                required={q.required}
                                checked={previewAnswers[q.id] === opt}
                                onChange={() => setPreviewAnswers({ ...previewAnswers, [q.id]: opt })}
                                className="accent-[#ab1f09]"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === "checkboxes" && (
                        <div className="space-y-2">
                          {q.options.map((opt, oIdx) => (
                            <label key={oIdx} className="flex items-center gap-3 text-xs text-neutral-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={(previewAnswers[q.id] || []).includes(opt)}
                                onChange={(e) => {
                                  const current: string[] = previewAnswers[q.id] || [];
                                  const updated = e.target.checked ? [...current, opt] : current.filter((x) => x !== opt);
                                  setPreviewAnswers({ ...previewAnswers, [q.id]: updated });
                                }}
                                className="accent-[#ab1f09]"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === "dropdown" && (
                        <select
                          required={q.required}
                          value={previewAnswers[q.id] || ""}
                          onChange={(e) => setPreviewAnswers({ ...previewAnswers, [q.id]: e.target.value })}
                          className="w-full px-4 py-2.5 bg-[#111111] border border-neutral-800 rounded-xl text-xs text-white outline-none"
                        >
                          <option value="">Select an option</option>
                          {q.options.map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {q.type === "number" && (
                        <input
                          type="number"
                          required={q.required}
                          value={previewAnswers[q.id] || ""}
                          onChange={(e) => setPreviewAnswers({ ...previewAnswers, [q.id]: e.target.value })}
                          className="w-full px-4 py-2.5 bg-[#111111] border border-neutral-800 rounded-xl text-xs text-white outline-none"
                          placeholder="Enter number"
                        />
                      )}

                      {q.type === "date" && (
                        <input
                          type="date"
                          required={q.required}
                          value={previewAnswers[q.id] || ""}
                          onChange={(e) => setPreviewAnswers({ ...previewAnswers, [q.id]: e.target.value })}
                          className="w-full px-4 py-2.5 bg-[#111111] border border-neutral-800 rounded-xl text-xs text-white outline-none"
                        />
                      )}

                      {q.type === "file_upload" && (
                        <div className="border border-dashed border-neutral-800 rounded-xl p-4 text-center text-xs font-mono text-neutral-400">
                          Click to browse file from device
                        </div>
                      )}

                      {q.type === "rating" && (
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              type="button"
                              key={val}
                              onClick={() => setPreviewAnswers({ ...previewAnswers, [q.id]: val })}
                              className={`w-9 h-9 rounded-xl font-mono text-xs transition-all ${
                                previewAnswers[q.id] === val
                                  ? "bg-[#ab1f09] text-[#fff7d3] font-bold"
                                  : "bg-neutral-900 border border-neutral-800 text-neutral-400"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* PAID VOTING SIMULATOR */}
                      {q.type === "paid_voting" && (
                        <div className="space-y-3">
                          <div className="text-[11px] font-mono text-[#fff7d3]">
                            Cost: {q.currency} {q.pricePerVote} per vote
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {q.votingOptions?.map((cand) => (
                              <div
                                key={cand.id}
                                onClick={() => setPreviewAnswers({ ...previewAnswers, [q.id]: cand.name })}
                                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-1 ${
                                  previewAnswers[q.id] === cand.name
                                    ? "bg-[#ab1f09]/20 border-[#ab1f09] text-white"
                                    : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                                }`}
                              >
                                <div className="font-semibold text-xs text-white">{cand.name}</div>
                                <div className="text-[10px] text-neutral-500">{cand.bio}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  ))}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#ab1f09] hover:bg-[#c2240b] text-[#fff7d3] font-mono font-medium text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-[#ab1f09]/20 transition-all cursor-pointer"
                  >
                    Submit Response
                  </button>

                </form>
              )}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: RESPONSES MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === "responses" && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0d0d0d] border border-neutral-800">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-neutral-400 uppercase">
                  Total Submissions: <span className="text-white font-bold">{responses.length}</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={responseSearch}
                  onChange={(e) => setResponseSearch(e.target.value)}
                  placeholder="Search respondent or answers..."
                  className="px-3.5 py-1.5 bg-[#111111] border border-neutral-800 rounded-xl text-xs text-white outline-none focus:border-[#ab1f09] w-48 sm:w-64"
                />

                <button
                  onClick={handleExportCSV}
                  className="px-4 py-1.5 bg-neutral-900 border border-neutral-800 hover:text-white rounded-xl text-xs font-mono tracking-wider text-neutral-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-[#ab1f09]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>EXPORT CSV</span>
                </button>
              </div>
            </div>

            {/* Table */}
            {filteredResponses.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-neutral-800 rounded-2xl bg-[#0d0d0d]/40 space-y-2">
                <div className="text-xs font-mono text-neutral-500">No responses recorded yet.</div>
                <div className="text-[11px] text-neutral-600">Share your published link to collect submissions.</div>
              </div>
            ) : (
              <div className="border border-neutral-800 rounded-2xl overflow-x-auto bg-[#0d0d0d]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-neutral-800 bg-neutral-900/60 text-neutral-400">
                    <tr>
                      <th className="p-3.5">#</th>
                      <th className="p-3.5">Submitted</th>
                      <th className="p-3.5">Email</th>
                      {questions.map((q) => (
                        <th key={q.id} className="p-3.5 truncate max-w-[150px]">
                          {q.title}
                        </th>
                      ))}
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                    {filteredResponses.map((res, i) => (
                      <tr key={res.id} className="hover:bg-neutral-900/40 transition-colors">
                        <td className="p-3.5 text-neutral-500">{i + 1}</td>
                        <td className="p-3.5 whitespace-nowrap text-neutral-400">{res.submittedAt}</td>
                        <td className="p-3.5 text-white">{res.email || "Guest"}</td>
                        {questions.map((q) => (
                          <td key={q.id} className="p-3.5 truncate max-w-[150px]">
                            {Array.isArray(res.answers[q.id])
                              ? res.answers[q.id].join(", ")
                              : res.answers[q.id] !== undefined
                              ? String(res.answers[q.id])
                              : "-"}
                          </td>
                        ))}
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteResponse(res.id)}
                            className="text-neutral-600 hover:text-red-400 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: FORM SETTINGS & EMBED */}
        {/* ========================================================= */}
        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Response Preferences */}
            <div className="p-6 sm:p-8 border border-neutral-800 rounded-2xl bg-[#0d0d0d] space-y-6">
              <h2 className="text-sm font-mono tracking-widest text-[#fff7d3] uppercase">Response Controls</h2>
              
              {/* Accept Responses Switch */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Accepting Responses</h4>
                  <p className="text-[11px] text-neutral-500">Allow users to view and submit this form</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, acceptingResponses: !settings.acceptingResponses })}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    settings.acceptingResponses ? "bg-[#ab1f09]" : "bg-neutral-800"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                      settings.acceptingResponses ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Collect Email */}
              <div className="flex items-center justify-between border-t border-neutral-800/80 pt-4">
                <div>
                  <h4 className="text-xs font-semibold text-white">Collect Email Addresses</h4>
                  <p className="text-[11px] text-neutral-500">Require respondent to input their email</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, collectEmail: !settings.collectEmail })}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    settings.collectEmail ? "bg-[#ab1f09]" : "bg-neutral-800"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                      settings.collectEmail ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Confirmation Message */}
              <div className="border-t border-neutral-800/80 pt-4 space-y-2">
                <label className="text-xs font-semibold text-white">Custom Confirmation Message</label>
                <input
                  type="text"
                  value={settings.confirmationMessage}
                  onChange={(e) => setSettings({ ...settings, confirmationMessage: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#111111] border border-neutral-800 rounded-xl text-xs text-white focus:border-[#ab1f09] outline-none"
                />
              </div>
            </div>

            {/* Embed Code Widget */}
            <div className="p-6 sm:p-8 border border-neutral-800 rounded-2xl bg-[#0d0d0d] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-mono tracking-widest text-[#fff7d3] uppercase">Embed on Website</h2>
                  <p className="text-[11px] text-neutral-500">Paste this HTML snippet into any website</p>
                </div>
                <button
                  onClick={handleCopyEmbed}
                  className="px-3 py-1.5 bg-[#ab1f09] text-[#fff7d3] text-xs font-mono rounded-lg hover:bg-[#c2240b] cursor-pointer"
                >
                  {copiedEmbed ? "COPIED!" : "COPY EMBED"}
                </button>
              </div>

              <pre className="p-4 bg-black border border-neutral-800 rounded-xl text-[11px] font-mono text-neutral-300 overflow-x-auto">
                {embedCode}
              </pre>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: FORM ANALYTICS */}
        {/* ========================================================= */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-6 border border-neutral-800 rounded-2xl bg-[#0d0d0d] space-y-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Total Responses</span>
                <div className="text-3xl font-bold font-mono text-white">{responses.length}</div>
                <span className="text-[10px] font-mono text-emerald-400">Live Active</span>
              </div>

              <div className="p-6 border border-neutral-800 rounded-2xl bg-[#0d0d0d] space-y-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Total Questions</span>
                <div className="text-3xl font-bold font-mono text-white">{questions.length}</div>
                <span className="text-[10px] font-mono text-neutral-400">Configured</span>
              </div>

              <div className="p-6 border border-neutral-800 rounded-2xl bg-[#0d0d0d] space-y-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Completion Rate</span>
                <div className="text-3xl font-bold font-mono text-white">
                  {responses.length > 0 ? "100%" : "0%"}
                </div>
                <span className="text-[10px] font-mono text-neutral-400">Standard</span>
              </div>

              <div className="p-6 border border-neutral-800 rounded-2xl bg-[#0d0d0d] space-y-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Created Date</span>
                <div className="text-sm font-bold font-mono text-white mt-2">{createdAt || "Today"}</div>
                <span className="text-[10px] font-mono text-neutral-400">Last edit: {updatedAt}</span>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}

export default function FormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <FormBuilderContent />
    </Suspense>
  );
}