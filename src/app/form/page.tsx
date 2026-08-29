"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://rack-backend-fqdf.onrender.com";

// --- TYPES ---
export type ComponentCategory = "content" | "form" | "other";

export type QuestionType =
  | "heading"
  | "subheading"
  | "paragraph_text"
  | "short_answer"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown"
  | "number"
  | "date"
  | "rating"
  | "file_upload"
  | "paid_voting"
  | "section_break";

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
  placeholder?: string;
  pricePerVote?: number;
  currency?: string;
  candidates?: Candidate[];
}

export interface FormSettings {
  acceptingResponses: boolean;
  collectEmail: boolean;
  confirmationMessage: string;
  accentColor: string;
  fontFamily: string;
  coverImage?: string;
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
  viewCount?: number;
}

function FormBuilderSaaS() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formIdParam = searchParams.get("id");
  const isLiveView = searchParams.get("view") === "live";

  // Top Tabs & Sidebar state
  const [topTab, setTopTab] = useState<"dashboard" | "builder" | "responses" | "integration" | "settings">("builder");
  const [leftTab, setLeftTab] = useState<"component" | "pages">("component");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("q_header");
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [formLoaded, setFormLoaded] = useState(false);
  const [creatorEmail, setCreatorEmail] = useState<string>("");
  const [creatorName, setCreatorName] = useState<string>("");
  const [formNotFound, setFormNotFound] = useState(false);
  const [isNewForm, setIsNewForm] = useState(true);
  const [justPublished, setJustPublished] = useState(false);

  // Form State
  const [formId, setFormId] = useState<string>("");
  const [title, setTitle] = useState("Customer Feedback");
  const [description, setDescription] = useState("Please fill in your thoughts to help us improve our services.");
  const [status, setStatus] = useState<"draft" | "published" | "closed">("draft");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [settings, setSettings] = useState<FormSettings>({
    acceptingResponses: true,
    collectEmail: true,
    confirmationMessage: "Thank you! Your response has been securely recorded.",
    accentColor: "#ab1f09",
    fontFamily: "font-sans",
    coverImage: "",
  });

  const [questions, setQuestions] = useState<FormQuestion[]>([
    {
      id: "q_1",
      title: "What is your name?",
      type: "short_answer",
      placeholder: "Enter your name...",
      required: true,
      options: [],
    },
    {
      id: "q_2",
      title: "Where you have found out our products?",
      type: "multiple_choice",
      required: false,
      options: ["Word of mouth", "YouTube", "Website"],
    },
  ]);

  const [responses, setResponses] = useState<FormResponseItem[]>([]);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Public Submitter state
  const [liveEmail, setLiveEmail] = useState("");
  const [liveAnswers, setLiveAnswers] = useState<Record<string, any>>({});
  const [liveVotesCount, setLiveVotesCount] = useState<number>(1);
  const [liveSelectedCandidate, setLiveSelectedCandidate] = useState<string>("");
  const [liveSubmitted, setLiveSubmitted] = useState(false);


    // 1. Initial Load
  useEffect(() => {
    if (formIdParam) {
      if (isLiveView) {
        fetch(`${API_BASE}/api/forms/${formIdParam}/public`)
          .then((res) => res.json())
          .then((data) => {
            if (data.found) {
              setFormId(data.id);
              setTitle(data.title);
              setDescription(data.description);
              setStatus(data.status);
              setSettings(data.settings || settings);
              setQuestions(data.questions || []);
              setIsNewForm(false);
              fetch(`${API_BASE}/api/forms/${data.id}/view`, { method: "POST" }).catch(() => {});
            } else {
              setFormNotFound(true);
            }
            setFormLoaded(true);
          })
          .catch(() => {
            setFormNotFound(true);
            setFormLoaded(true);
          });
        return;
      }

      const token = localStorage.getItem("rack_token");
      fetch(`${API_BASE}/api/forms/${formIdParam}/edit`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            setFormId(data.id);
            setTitle(data.title);
            setDescription(data.description);
            setStatus(data.status);
            setCreatedAt(data.createdAt);
            setUpdatedAt(data.updatedAt);
            setSettings(data.settings || settings);
            setQuestions(data.questions || []);
            setResponses(data.responses || []);
            if (data.questions?.length > 0) {
              setSelectedQuestionId(data.questions[0].id);
            }
            setIsNewForm(false);
          }
          setFormLoaded(true);
        })
        .catch((err) => {
          console.error("Failed to load rack", err);
          setFormLoaded(true);
        });
      return;
    }

    const newId = "rack_" + Date.now();
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    setFormId(newId);
    setCreatedAt(dateStr);
    setUpdatedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setIsNewForm(true);
    setFormLoaded(true);
  }, [formIdParam, isLiveView]);

  // Load the actual logged in creator's identity for the header pill
  useEffect(() => {
    if (isLiveView) return;
    const savedEmail = localStorage.getItem("rack_user_email");
    const savedName = localStorage.getItem("rack_user_name");
    if (savedEmail) setCreatorEmail(savedEmail);
    setCreatorName(savedName && savedName.trim() !== "" ? savedName : savedEmail ? savedEmail.split("@")[0] : "User");
  }, [isLiveView]);
  // 2. Auto-Save Draft to Backend
  useEffect(() => {
    if (!formId || isLiveView || !formLoaded) return;

    const token = localStorage.getItem("rack_token");
    const payload = {
      id: formId,
      title: title || "Untitled Form",
      description: description || "",
      status,
      settings,
      questions,
    };

    autosaveTimerRef.current = setTimeout(() => {
      const request = isNewForm
        ? fetch(`${API_BASE}/api/forms`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
          })
        : fetch(`${API_BASE}/api/forms/${formId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
          });

      request
        .then((res) => {
          if (res.ok && isNewForm) setIsNewForm(false);
          setUpdatedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
          setSavedNotice(true);
          setTimeout(() => setSavedNotice(false), 1500);
        })
        .catch((err) => console.error("Failed to save rack", err));
    }, 600);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [formId, title, description, status, settings, questions, isLiveView, formLoaded, isNewForm]);

  // Selected Question Helper
  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);
  const selectedQuestionIndex = questions.findIndex((q) => q.id === selectedQuestionId);

  // --- ACTIONS ---
  const handleAddComponent = (type: QuestionType) => {
    const isPaid = type === "paid_voting";
    let defaultTitle = "Untitled Question";
    let defaultOptions: string[] = [];

    if (type === "heading") defaultTitle = "Section Heading";
    else if (type === "subheading") defaultTitle = "Sub Heading Description";
    else if (type === "paragraph_text") defaultTitle = "Informational text block.";
    else if (type === "multiple_choice" || type === "checkboxes" || type === "dropdown") {
      defaultOptions = ["Option 1", "Option 2"];
    } else if (isPaid) {
      defaultTitle = "Official Contestant Ballot";
    }

    const newQ: FormQuestion = {
      id: "q_" + Date.now(),
      title: defaultTitle,
      type,
      required: false,
      options: defaultOptions,
      placeholder: type === "short_answer" ? "Enter your response..." : undefined,
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
    setSelectedQuestionId(newQ.id);
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length === 1) {
      alert("Form must contain at least one element.");
      return;
    }
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    if (selectedQuestionId === id) {
      setSelectedQuestionId(updated[0]?.id || "q_header");
    }
  };

  const handleDuplicateQuestion = (id: string) => {
    const idx = questions.findIndex((q) => q.id === id);
    if (idx === -1) return;
    const target = questions[idx];
    const duplicated: FormQuestion = { ...target, id: "q_" + Date.now(), title: `${target.title} (Copy)` };
    const updated = [...questions];
    updated.splice(idx + 1, 0, duplicated);
    setQuestions(updated);
    setSelectedQuestionId(duplicated.id);
  };

  // Option modifications
  const handleAddOption = (qId: string) => {
    const idx = questions.findIndex((q) => q.id === qId);
    if (idx === -1) return;
    const updated = [...questions];
    updated[idx].options.push(`Option ${updated[idx].options.length + 1}`);
    setQuestions(updated);
  };

  const handleOptionChange = (qId: string, optIdx: number, val: string) => {
    const idx = questions.findIndex((q) => q.id === qId);
    if (idx === -1) return;
    const updated = [...questions];
    updated[idx].options[optIdx] = val;
    setQuestions(updated);
  };

  const handleDeleteOption = (qId: string, optIdx: number) => {
    const idx = questions.findIndex((q) => q.id === qId);
    if (idx === -1) return;
    const updated = [...questions];
    if (updated[idx].options.length <= 1) return;
    updated[idx].options.splice(optIdx, 1);
    setQuestions(updated);
  };
  // Live Submission
  const handleLiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const votingQ = questions.find((q) => q.type === "paid_voting");
    let totalPaid = 0;
    if (votingQ && liveSelectedCandidate) {
      totalPaid = (votingQ.pricePerVote || 1) * liveVotesCount;
    }

    fetch(`${API_BASE}/api/forms/${formId}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: liveEmail || "Anonymous",
        answers: liveAnswers,
        votedCandidate: liveSelectedCandidate || undefined,
        voteCount: liveSelectedCandidate ? liveVotesCount : undefined,
        totalPaid: totalPaid > 0 ? totalPaid : undefined,
      }),
    })
      .then((res) => {
        if (res.ok) setLiveSubmitted(true);
      })
      .catch((err) => console.error("Failed to submit response", err));
  };

  const handlePublish = async () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    const token = localStorage.getItem("rack_token");
    const payload = {
      id: formId,
      title: title || "Untitled Form",
      description: description || "",
      status: "published",
      settings,
      questions,
    };
    try {
      const request = isNewForm
        ? fetch(`${API_BASE}/api/forms`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
          })
        : fetch(`${API_BASE}/api/forms/${formId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
          });
      const res = await request;
      if (!res.ok) {
        throw new Error("Publish request failed.");
      }
      setStatus("published");
      setIsNewForm(false);
      setJustPublished(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1800);
    } catch (err) {
      console.error("Failed to publish rack", err);
      alert("Couldn't publish this rack — check your connection and try again.");
    }
  };

  const livePublicUrl = typeof window !== "undefined" ? `${window.location.origin}/android/form?id=${formId}&view=live` : "";

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(livePublicUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSettings({ ...settings, coverImage: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCoverImage = () => {
    setSettings({ ...settings, coverImage: "" });
  };

  // =========================================================================
  // 1. PUBLIC LIVE RESPONDENT VIEW
  // =========================================================================
  if (isLiveView) {
    return (
      <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col justify-center items-center p-4 sm:p-8 font-sans selection:bg-[#ab1f09] selection:text-[#fff7d3]">
        <div className="w-full max-w-2xl bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-0 shadow-2xl space-y-0 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ab1f09] via-[#fff7d3]/50 to-[#ab1f09] z-10" />

          {!formLoaded ? (
  <div className="text-center py-16 px-6">
    <p className="text-sm font-mono text-neutral-500">Loading form...</p>
  </div>
          ) : formNotFound ? (
  <div className="text-center py-16 px-6 space-y-3">
    <h2 className="text-xl font-bold text-white">Form Not Found</h2>
              <p className="text-sm text-neutral-400 max-w-md mx-auto">
                This link doesn't point to a form we can find on this device/browser.
              </p>
            </div>
          ) : status !== "published" || !settings.acceptingResponses ? (
  <div className="text-center py-16 px-6 space-y-3">
    <h2 className="text-xl font-bold text-white">Not Accepting Responses</h2>
              <p className="text-sm text-neutral-400 max-w-md mx-auto">
                This rack is currently {status === "draft" ? "still in draft and hasn't been published yet" : "closed"}.
              </p>
            </div>
) : liveSubmitted ? (
  <div className="text-center py-12 px-6 space-y-4">
    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Submission Confirmed</h2>
              <p className="text-sm text-neutral-400 max-w-md mx-auto">{settings.confirmationMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleLiveSubmit} className="space-y-8 p-6 sm:p-10">
              <div className="space-y-4 border-b border-neutral-800 pb-6 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10">
                {settings.coverImage && (
                  <div className="w-full max-h-[320px] overflow-hidden">
                    <img src={settings.coverImage} alt="Form cover" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="px-6 sm:px-10 space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight break-words">{title}</h1>
                  <p className="text-sm text-neutral-400 font-light leading-relaxed break-words">{description}</p>
                </div>
                {settings.collectEmail && (
                  <div className="px-6 sm:px-10 pt-2">
                    <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">
                      Email Address <span className="text-[#ab1f09]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={liveEmail}
                      onChange={(e) => setLiveEmail(e.target.value)}
                      placeholder="your.email@gmail.com"
                      className="w-full px-4 py-3.5 bg-[#0d0d0d] border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-600 outline-none focus:border-[#ab1f09] focus:ring-2 focus:ring-[#ab1f09]/20 transition-all"
                    />
                  </div>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-5 sm:p-6 bg-[#0a0a0a] border border-neutral-800 rounded-2xl space-y-4 shadow-sm">
                    <label className="block text-sm font-semibold text-white">
                      {idx + 1}. {q.title} {q.required && <span className="text-[#ab1f09]">*</span>}
                    </label>

                    {q.type === "short_answer" && (
                      <input
                        type="text"
                        required={q.required}
                        value={liveAnswers[q.id] || ""}
                        onChange={(e) => setLiveAnswers({ ...liveAnswers, [q.id]: e.target.value })}
                        className="w-full px-4 py-3.5 bg-[#0d0d0d] border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-600 outline-none focus:border-[#ab1f09] focus:ring-2 focus:ring-[#ab1f09]/20 transition-all"
                        placeholder={q.placeholder || "Your answer..."}
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
                              className="w-4 h-4 accent-[#ab1f09]"
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
                              className="w-4 h-4 accent-[#ab1f09]"
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
                            className={`w-10 h-10 rounded-xl font-mono text-sm transition-all border cursor-pointer ${
                              liveAnswers[q.id] === val
                                ? "bg-[#ab1f09] border-[#ab1f09] text-[#fff7d3] font-bold shadow-md shadow-[#ab1f09]/30"
                                : "bg-[#0d0d0d] border-neutral-800 text-neutral-400"
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Paid Voting Contestant Selector */}
                    {q.type === "paid_voting" && (
                      <div className="space-y-4">
                        <div className="text-xs font-mono text-[#fff7d3]">
                          Rate: {q.currency} {q.pricePerVote} per vote
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.candidates?.map((cand) => (
                            <div
                              key={cand.id}
                              onClick={() => setLiveSelectedCandidate(cand.name)}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                                liveSelectedCandidate === cand.name
                                  ? "bg-[#ab1f09]/20 border-[#ab1f09] text-white shadow-lg shadow-[#ab1f09]/20"
                                  : "bg-[#0d0d0d] border-neutral-800 text-neutral-400 hover:border-neutral-700"
                              }`}
                            >
                              <div className="font-semibold text-sm text-white">{cand.name}</div>
                              <div className="text-xs text-neutral-500">{cand.category}</div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-[#0d0d0d] border border-neutral-800 rounded-xl">
  <span className="text-xs font-mono text-neutral-400">Votes Quantity:</span>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              min="1"
                              value={liveVotesCount}
                              onChange={(e) => setLiveVotesCount(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-16 px-2 py-1 bg-[#050505] border border-neutral-700 rounded-lg text-white font-mono text-center text-xs"
                            />
                            <span className="text-xs font-mono font-bold text-[#fff7d3]">
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
                className="w-full py-4 bg-[#ab1f09] hover:bg-[#c2240b] text-[#fff7d3] font-mono font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-[#ab1f09]/20 cursor-pointer"
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
  // 2. MAIN 3-COLUMN DESKTOP SAAS FORM BUILDER (RACK BRAND THEME)
  // =========================================================================
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col font-sans selection:bg-[#ab1f09] selection:text-[#fff7d3]">

      {justPublished && (
        <div className="fixed inset-0 bg-[#050505] z-[100] flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Rack Published</h2>
          <p className="text-xs font-mono text-neutral-500">Taking you to your dashboard...</p>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TOP NAVIGATION BAR */}
      {/* ------------------------------------------------------------- */}
      <header className="w-full border-b border-neutral-800/80 bg-[#0a0a0a] px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        
        {/* Left: Brand Icon */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#fff7d3] hover:opacity-80">
            <div className="w-8 h-8 rounded-xl bg-[#ab1f09]/20 border border-[#ab1f09]/40 flex flex-col items-center justify-center gap-1 shadow-sm shadow-[#ab1f09]/20">
              <div className="w-4 h-1 bg-[#ab1f09] rounded-full" />
              <div className="w-4 h-1 bg-[#fff7d3] rounded-full" />
            </div>
            <span className="font-mono font-bold tracking-widest text-base text-[#fff7d3] uppercase hidden sm:inline">
              RACK<span className="text-[#ab1f09]">.</span>
            </span>
          </Link>
        </div>

        {/* Center: Navigation Pill Container */}
        <div className="hidden md:flex items-center p-1 rounded-2xl bg-[#050505] border border-neutral-800 text-xs font-mono">
          {[
            { id: "dashboard", label: "Dashboard", href: "/dashboard" },
            { id: "builder", label: "Builder" },
            { id: "responses", label: `Respond (${responses.length})` },
            { id: "integration", label: "Integration" },
            { id: "settings", label: "Settings" },
          ].map((item) =>
            item.href ? (
              <Link
                key={item.id}
                href={item.href}
                className="px-4 py-1.5 rounded-xl text-neutral-400 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => setTopTab(item.id as any)}
                className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                  topTab === item.id
                    ? "bg-[#ab1f09] text-[#fff7d3] font-semibold shadow-md shadow-[#ab1f09]/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            )
          )}
        </div>

        {/* Right: User Profile & Link Action */}
        <div className="flex items-center gap-3">
          {status === "published" && (
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-[#050505] border border-neutral-800 text-[#fff7d3] hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-[#ab1f09]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="hidden sm:inline">{copiedLink ? "COPIED!" : "SHARE LINK"}</span>
            </button>
          )}

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-neutral-800">
            <div className="text-right hidden sm:block font-mono">
              <div className="text-xs font-semibold text-white capitalize">{creatorName || "User"}</div>
              <div className="text-[10px] text-neutral-500">{creatorEmail || ""}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#ab1f09] border border-[#ab1f09]/60 flex items-center justify-center font-bold text-xs text-[#fff7d3] font-mono shadow-sm">
              {creatorName ? creatorName.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 3-COLUMN WORKSPACE BODY (BUILDER TAB) */}
      {/* ------------------------------------------------------------- */}
      {topTab === "builder" && (
            <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#ab1f09]/10 blur-[140px] pointer-events-none rounded-full" />
        
        {/* ========================================================= */}
        {/* COLUMN 1: LEFT COMPONENT LIBRARY (WIDTH: 280px) */}
        {/* ========================================================= */}
                <aside className="lg:col-span-3 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 backdrop-blur-xl p-5 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-110px)]">
          
          {/* Top Pill Switch */}
          <div className="p-1 rounded-2xl bg-[#050505] border border-neutral-800 grid grid-cols-2 text-xs font-mono text-center">
            <button
              onClick={() => setLeftTab("component")}
              className={`py-1.5 rounded-xl transition-all ${
                leftTab === "component" ? "bg-[#ab1f09] text-[#fff7d3] font-semibold shadow-md shadow-[#ab1f09]/20" : "text-neutral-400"
              }`}
            >
              Component
            </button>
            <button
              onClick={() => setLeftTab("pages")}
              className={`py-1.5 rounded-xl transition-all ${
                leftTab === "pages" ? "bg-[#ab1f09] text-[#fff7d3] font-semibold shadow-md shadow-[#ab1f09]/20" : "text-neutral-400"
              }`}
            >
              Pages
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <svg className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search component..."
              className="w-full pl-10 pr-4 py-2 bg-[#050505] border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#ab1f09]"
            />
          </div>

          {/* 1. Content Components */}
          <div className="space-y-2.5 font-mono">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Content Components</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAddComponent("heading")}
                className="p-3 bg-[#050505] border border-neutral-800 hover:border-[#ab1f09]/60 rounded-xl flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer group"
              >
                <span className="text-base font-bold text-[#fff7d3]">T</span>
                <span className="text-[10px] text-neutral-400 group-hover:text-white">Heading</span>
              </button>

              <button
                onClick={() => handleAddComponent("subheading")}
                className="p-3 bg-[#050505] border border-neutral-800 hover:border-[#ab1f09]/60 rounded-xl flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer group"
              >
                <span className="text-xs font-semibold text-[#fff7d3]">T</span>
                <span className="text-[10px] text-neutral-400 group-hover:text-white leading-tight">Sub Heading</span>
              </button>

              <button
                onClick={() => handleAddComponent("paragraph_text")}
                className="p-3 bg-[#050505] border border-neutral-800 hover:border-[#ab1f09]/60 rounded-xl flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer group"
              >
                <span className="text-xs text-[#fff7d3]">¶</span>
                <span className="text-[10px] text-neutral-400 group-hover:text-white">Paragraph</span>
              </button>
            </div>
          </div>

          {/* 2. Form Components */}
          <div className="space-y-2.5 font-mono">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Form Components</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAddComponent("short_answer")}
                className="p-3 bg-[#050505] border border-neutral-800 hover:border-[#ab1f09]/60 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group"
              >
                <svg className="w-4 h-4 text-[#ab1f09]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10" />
                </svg>
                <span className="text-[10px] text-neutral-400 group-hover:text-white leading-tight">Short Question</span>
              </button>

              <button
                onClick={() => handleAddComponent("multiple_choice")}
                className="p-3 bg-[#050505] border border-neutral-800 hover:border-[#ab1f09]/60 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group"
              >
                <svg className="w-4 h-4 text-[#ab1f09]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-[10px] text-neutral-400 group-hover:text-white leading-tight">Multiple Choice</span>
              </button>

              <button
                onClick={() => handleAddComponent("checkboxes")}
                className="p-3 bg-[#050505] border border-neutral-800 hover:border-[#ab1f09]/60 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group"
              >
                <svg className="w-4 h-4 text-[#ab1f09]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[10px] text-neutral-400 group-hover:text-white leading-tight">Checkboxes</span>
              </button>

              <button
                onClick={() => handleAddComponent("date")}
                className="p-3 bg-[#050505] border border-neutral-800 hover:border-[#ab1f09]/60 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group"
              >
                <svg className="w-4 h-4 text-[#ab1f09]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[10px] text-neutral-400 group-hover:text-white">Date</span>
              </button>

              <button
                onClick={() => handleAddComponent("rating")}
                className="p-3 bg-[#050505] border border-neutral-800 hover:border-[#ab1f09]/60 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group"
              >
                <svg className="w-4 h-4 text-[#ab1f09]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-[10px] text-neutral-400 group-hover:text-white">Rating</span>
              </button>

              <button
                onClick={() => handleAddComponent("paid_voting")}
                className="p-3 bg-[#ab1f09]/15 border border-[#ab1f09]/50 hover:border-[#ab1f09] rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group shadow-sm shadow-[#ab1f09]/20"
              >
                <span className="text-xs font-bold text-[#ab1f09]">$$</span>
                <span className="text-[10px] text-[#fff7d3] font-semibold leading-tight">Paid Voting</span>
              </button>
            </div>
          </div>

          {/* 3. Other Components */}
          <div className="space-y-2.5 font-mono">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Other Components</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAddComponent("file_upload")}
                className="p-3 bg-[#050505] border border-neutral-800 hover:border-[#ab1f09]/60 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group"
              >
                <svg className="w-4 h-4 text-[#ab1f09]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-[10px] text-neutral-400 group-hover:text-white leading-tight">File Upload</span>
              </button>

              <button
                onClick={() => handleAddComponent("dropdown")}
                className="p-3 bg-[#050505] border border-neutral-800 hover:border-[#ab1f09]/60 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group"
              >
                <svg className="w-4 h-4 text-[#ab1f09]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
                <span className="text-[10px] text-neutral-400 group-hover:text-white leading-tight">Dropdown</span>
              </button>

              <button
                onClick={() => handleAddComponent("number")}
                className="p-3 bg-[#050505] border border-neutral-800 hover:border-[#ab1f09]/60 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer group"
              >
                <span className="text-xs font-bold text-[#ab1f09]">#</span>
                <span className="text-[10px] text-neutral-400 group-hover:text-white">Number</span>
              </button>
            </div>
          </div>

        </aside>

        {/* ========================================================= */}
        {/* COLUMN 2: CENTER LIVE CANVAS */}
        {/* ========================================================= */}
                <main className="lg:col-span-6 overflow-y-auto max-h-[calc(100vh-110px)] space-y-6 flex flex-col items-center">
          
          <div className="w-full max-w-2xl space-y-5">
            
            {/* Header Block - Permanent Title, Description & Cover Image */}
            <div
              onClick={() => setSelectedQuestionId("q_header")}
              className={`rounded-2xl bg-[#0d0d0d] border transition-all cursor-pointer relative shadow-lg overflow-hidden ${
                selectedQuestionId === "q_header" ? "border-[#ab1f09] ring-1 ring-[#ab1f09]" : "border-neutral-800"
              }`}
            >
              {/* Cover Image */}
              {settings.coverImage ? (
                <div className="relative w-full max-h-[280px] overflow-hidden">
                  <img src={settings.coverImage} alt="Form cover" className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCoverImage();
                    }}
                    className="absolute top-3 right-3 px-2.5 py-1 bg-black/70 hover:bg-black text-white text-[10px] font-mono rounded-lg cursor-pointer"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <label
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center justify-center gap-2 w-full py-6 sm:py-8 border-b border-dashed border-neutral-800 text-neutral-500 hover:text-[#fff7d3] hover:border-[#ab1f09]/50 cursor-pointer transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[11px] font-mono">Add a cover image (optional, under 2MB)</span>
                  <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" />
                </label>
              )}

              <div className="p-6 sm:p-8 space-y-3">
                {/* Type Pill */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#ab1f09] font-mono">T</span>
                  <span className="text-xs font-semibold text-[#fff7d3] font-mono">Form Header</span>
                  <svg className="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xl sm:text-2xl font-bold text-white bg-transparent border-b border-neutral-800 focus:border-[#ab1f09] outline-none pb-1"
                  placeholder="Form Heading..."
                />

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full text-sm text-neutral-400 font-light bg-transparent border-b border-neutral-800 focus:border-[#ab1f09] outline-none pb-1 resize-none"
                  placeholder="Describe what this form is about..."
                />
              </div>
            </div>

            {/* Questions Blocks Stack */}
            {questions.map((q, qIdx) => (
              <div
                key={q.id}
                onClick={() => setSelectedQuestionId(q.id)}
                className={`p-6 rounded-2xl bg-[#0d0d0d] border transition-all cursor-pointer relative flex gap-4 shadow-lg ${
                  selectedQuestionId === q.id ? "border-[#ab1f09] ring-1 ring-[#ab1f09]" : "border-neutral-800"
                }`}
              >
                {/* Drag Handle Indicator Dots */}
                <div className="text-neutral-600 font-mono tracking-widest text-xs select-none pt-1">
                  :::
                </div>

                <div className="flex-1 space-y-4">
                  
                  {/* Type Selector Pill Header */}
                  <div className="flex items-center justify-between font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#fff7d3] capitalize">{q.type.replace("_", " ")} Question</span>
                      <svg className="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {/* Quick Delete Block Trash */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteQuestion(q.id);
                      }}
                      className="text-neutral-500 hover:text-red-400 text-xs p-1 cursor-pointer"
                      title="Delete Question"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Question Title Input */}
                  <input
                    type="text"
                    value={q.title}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIdx].title = e.target.value;
                      setQuestions(updated);
                    }}
                    className="w-full text-base font-semibold text-white bg-transparent border-b border-neutral-800 focus:border-[#ab1f09] outline-none pb-1"
                    placeholder="Enter question title..."
                  />

                  {/* Body according to type */}
                  {q.type === "short_answer" && (
                    <div className="p-3 bg-[#050505] border border-neutral-800 rounded-xl text-xs text-neutral-500 font-mono">
                      {q.placeholder || "Enter your response..."}
                    </div>
                  )}

                  {(q.type === "multiple_choice" || q.type === "checkboxes" || q.type === "dropdown") && (
                    <div className="space-y-2.5">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center justify-between p-3 bg-[#050505] border border-neutral-800 rounded-xl text-xs text-neutral-300">
                          <div className="flex items-center gap-2.5 flex-1">
                            <span className="w-3.5 h-3.5 rounded border border-neutral-700 block" />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionChange(q.id, oIdx, e.target.value)}
                              className="bg-transparent text-white outline-none flex-1 text-xs"
                            />
                          </div>
                          {q.options.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOption(q.id, oIdx);
                              }}
                              className="text-neutral-600 hover:text-red-400 text-xs px-2 cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddOption(q.id);
                        }}
                        className="w-full py-2.5 bg-[#050505] hover:bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-[#fff7d3] font-mono font-medium transition-all cursor-pointer"
                      >
                        + Add more
                      </button>
                    </div>
                  )}

                  {q.type === "rating" && (
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="w-8 h-8 rounded-lg bg-[#050505] border border-neutral-800 flex items-center justify-center text-xs font-mono text-neutral-400">
                          {num}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === "paid_voting" && (
                    <div className="space-y-2 pt-1 font-mono">
                      <div className="text-xs text-[#ab1f09] font-bold">Contestant List (Paid Voting Ballot)</div>
                      <div className="grid grid-cols-2 gap-2">
                        {q.candidates?.map((cand) => (
                          <div key={cand.id} className="p-3 bg-[#050505] border border-neutral-800 rounded-xl text-xs">
                            <div className="font-semibold text-white">{cand.name}</div>
                            <div className="text-[10px] text-neutral-500">{cand.category}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}

          </div>
        </main>

        {/* ========================================================= */}
        {/* COLUMN 3: RIGHT PROPERTIES & INSPECTOR PANEL */}
        {/* ========================================================= */}
                <aside className="lg:col-span-3 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 backdrop-blur-xl p-5 flex flex-col justify-between overflow-y-auto max-h-[calc(100vh-110px)] space-y-6">
          
          <div className="space-y-6">
            
            {/* Top Action Buttons: Save & Publish */}
            <div className="grid grid-cols-2 gap-2 font-mono">
              <button
                onClick={() => {
                  setSavedNotice(true);
                  setTimeout(() => setSavedNotice(false), 1500);
                }}
                className="py-2 bg-[#ab1f09] hover:bg-[#c2240b] text-[#fff7d3] font-medium text-xs rounded-xl transition-all shadow-md shadow-[#ab1f09]/20 cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => {
                  if (status === "published") {
                    setStatus("closed");
                  } else {
                    handlePublish();
                  }
                }}
                className="py-2 bg-[#050505] border border-neutral-700 hover:border-[#ab1f09] text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
              >
                {status === "published" ? "Published" : "Publish"}
              </button>
            </div>

            {/* Type Selector Dropdown Header */}
            {selectedQuestion && (
              <div className="space-y-4">
                
                {/* Question Type Selection */}
                <div className="space-y-1.5 font-mono">
                  <div className="text-[10px] uppercase text-neutral-500">Component Type</div>
                  <select
                    value={selectedQuestion.type}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[selectedQuestionIndex].type = e.target.value as QuestionType;
                      setQuestions(updated);
                    }}
                    className="w-full px-3 py-2 bg-[#050505] border border-neutral-800 rounded-xl text-xs text-white outline-none focus:border-[#ab1f09] capitalize cursor-pointer"
                  >
                    <option value="short_answer">Short Question</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="checkboxes">Checkboxes</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="date">Date</option>
                    <option value="rating">Rating</option>
                    <option value="file_upload">File Upload</option>
                    <option value="paid_voting">Paid Voting ($$)</option>
                  </select>
                </div>

                {/* Question Properties Accordion */}
                <div className="border border-neutral-800 rounded-2xl p-4 bg-[#050505] space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-white font-mono">
                    <span>Question</span>
                    <div className="flex items-center gap-2 text-neutral-500">
                      <button
                        onClick={() => handleDuplicateQuestion(selectedQuestion.id)}
                        className="hover:text-white text-sm cursor-pointer"
                        title="Duplicate"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(selectedQuestion.id)}
                        className="hover:text-red-400 cursor-pointer"
                        title="Delete"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-500 leading-relaxed font-light font-mono">
                    Customize your question rules, validations, and choice structures.
                  </div>
                </div>

                {/* Styling Properties (Font, Fill) */}
                <div className="space-y-3 border-t border-neutral-800 pt-4 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Font</span>
                    <span className="text-white font-medium">Inter / Mono</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Weight</span>
                    <span className="text-white font-medium">Medium</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Fill</span>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#ab1f09] inline-block shadow-[0_0_8px_#ab1f09]" />
                      <span className="text-xs text-[#fff7d3]">#ab1f09</span>
                    </div>
                  </div>
                </div>

                {/* Answers List Accordion */}
                <div className="space-y-2 border-t border-neutral-800 pt-4 font-mono">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>Answer Options</span>
                    <button
                      onClick={() => handleAddOption(selectedQuestion.id)}
                      className="text-[#ab1f09] hover:text-[#c2240b] text-xs cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>

                  {selectedQuestion.options.map((opt, oIdx) => (
                    <div key={oIdx} className="p-2.5 bg-[#050505] border border-neutral-800 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-neutral-300 truncate max-w-[170px]">{opt}</span>
                      <button
                        onClick={() => handleDeleteOption(selectedQuestion.id, oIdx)}
                        className="text-neutral-600 hover:text-red-400 text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

          <div className="pt-4 border-t border-neutral-800/80 text-[11px] font-mono text-neutral-500 text-center">
            RACK Studio • <span className="text-[#ab1f09]">#ab1f09</span>
          </div>
        </aside>

      </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* RESPONSES TAB */}
      {/* ------------------------------------------------------------- */}
      {topTab === "responses" && (
        <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Responses ({responses.length})</h2>
          </div>

          {/* Auto Voting Leaderboard - only appears if this rack has a paid_voting question */}
          {questions.find((q) => q.type === "paid_voting") && (
            <div className="p-5 sm:p-6 rounded-2xl border border-[#ab1f09]/40 bg-[#0d0d0d] space-y-3">
              <h3 className="text-xs font-mono text-[#fff7d3] uppercase tracking-widest">Live Leaderboard</h3>
              <div className="space-y-2">
                {[...(questions.find((q) => q.type === "paid_voting")?.candidates || [])]
                  .sort((a, b) => b.votes - a.votes)
                  .map((cand, idx) => (
                    <div
                      key={cand.id}
                      className="flex items-center justify-between p-3 bg-[#050505] border border-neutral-800 rounded-xl text-xs font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          idx === 0 ? "bg-[#ab1f09] text-[#fff7d3]" : "bg-neutral-900 text-neutral-400 border border-neutral-800"
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-white font-semibold">{cand.name}</span>
                        {cand.category && <span className="text-neutral-500">{cand.category}</span>}
                      </div>
                      <span className="text-[#ab1f09] font-bold">{cand.votes} votes</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {responses.length === 0 ? (
            <div className="p-10 text-center rounded-2xl border border-neutral-800 bg-[#0d0d0d] text-sm text-neutral-500 font-mono">
              No responses yet. Share your link to start collecting submissions.
            </div>
          ) : (
            <div className="space-y-3">
              {responses.map((r) => (
                <div key={r.id} className="p-4 sm:p-5 rounded-2xl border border-neutral-800 bg-[#0d0d0d] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-800">
                    <div className="space-y-0.5">
                      <div className="text-white font-semibold text-sm">{r.email || "Anonymous"}</div>
                      <div className="text-neutral-500 text-[11px] font-mono">{r.submittedAt}</div>
                    </div>
                    {r.totalPaid ? (
                      <div className="text-[#ab1f09] font-bold text-sm font-mono">${r.totalPaid.toFixed(2)}</div>
                    ) : null}
                  </div>

                  {r.votedCandidate && (
                    <div className="text-xs font-mono px-3 py-2 bg-[#ab1f09]/10 border border-[#ab1f09]/30 rounded-xl text-[#fff7d3]">
                      Voted for <span className="font-bold">{r.votedCandidate}</span> ({r.voteCount} vote{r.voteCount !== 1 ? "s" : ""})
                    </div>
                  )}

                  {r.answers && Object.keys(r.answers).length > 0 && (
                    <div className="space-y-2">
                      {questions
                        .filter((q) => r.answers[q.id] !== undefined && r.answers[q.id] !== "")
                        .map((q) => (
                          <div key={q.id} className="text-xs">
                            <div className="text-neutral-500 font-mono mb-0.5">{q.title}</div>
                            <div className="text-white">
                              {Array.isArray(r.answers[q.id]) ? r.answers[q.id].join(", ") : String(r.answers[q.id])}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* INTEGRATION TAB */}
      {/* ------------------------------------------------------------- */}
      {topTab === "integration" && (
        <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">Share &amp; Integrate</h2>
          <div className="p-6 rounded-2xl border border-neutral-800 bg-[#0d0d0d] space-y-4">
            <label className="block text-xs font-mono text-neutral-400 uppercase">Public Link</label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={livePublicUrl}
                className="flex-1 px-4 py-2.5 bg-[#050505] border border-neutral-800 rounded-xl text-xs text-neutral-300 font-mono outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 bg-[#ab1f09] hover:bg-[#c2240b] text-[#fff7d3] text-xs font-mono font-semibold rounded-xl cursor-pointer whitespace-nowrap"
              >
                {copiedLink ? "Copied!" : "Copy Link"}
              </button>
            </div>
            <p className="text-[11px] text-neutral-500 font-mono leading-relaxed">
              Anyone with this link can view and submit this rack, as long as it's Published and Accepting Responses (set in Settings).
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SETTINGS TAB */}
      {/* ------------------------------------------------------------- */}
      {topTab === "settings" && (
        <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">Rack Settings</h2>

          <div className="p-6 rounded-2xl border border-neutral-800 bg-[#0d0d0d] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-white">Accepting Responses</h4>
                <p className="text-[11px] text-neutral-500">Turn off to stop new submissions without deleting the rack</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, acceptingResponses: !settings.acceptingResponses })}
                className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  settings.acceptingResponses ? "bg-[#ab1f09]" : "bg-neutral-800"
                }`}
              >
                <div
                  className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                    settings.acceptingResponses ? "translate-x-3.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
              <div>
                <h4 className="text-xs font-semibold text-white">Collect Email</h4>
                <p className="text-[11px] text-neutral-500">Require respondents to enter their email</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, collectEmail: !settings.collectEmail })}
                className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  settings.collectEmail ? "bg-[#ab1f09]" : "bg-neutral-800"
                }`}
              >
                <div
                  className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                    settings.collectEmail ? "translate-x-3.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2 border-t border-neutral-800 pt-4">
              <label className="block text-xs font-mono text-neutral-400 uppercase">Confirmation Message</label>
              <textarea
                value={settings.confirmationMessage}
                onChange={(e) => setSettings({ ...settings, confirmationMessage: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 bg-[#050505] border border-neutral-800 rounded-xl text-xs text-white focus:border-[#ab1f09] outline-none resize-none"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function FormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <FormBuilderSaaS />
    </Suspense>
  );
}