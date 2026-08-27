"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface FormQuestion {
  id: string;
  title: string;
  type: "multiple_choice" | "checkboxes" | "short_text";
  options: string[];
  required: boolean;
}

interface RackForm {
  id: string;
  title: string;
  description: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  questions: FormQuestion[];
}

function FormBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formIdParam = searchParams.get("id");

  const [formId, setFormId] = useState<string>("");
  const [title, setTitle] = useState("Untitled Rack Form");
  const [description, setDescription] = useState("Configure and collect data seamlessly.");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [savedNotice, setSavedNotice] = useState(false);

  const [questions, setQuestions] = useState<FormQuestion[]>([
    {
      id: "q_1",
      title: "Untitled Question",
      type: "multiple_choice",
      options: ["Option 1"],
      required: false,
    },
  ]);

  // Load existing form or initialize new ID
  useEffect(() => {
    const existingForms: RackForm[] = JSON.parse(localStorage.getItem("rack_forms") || "[]");

    if (formIdParam) {
      const found = existingForms.find((f) => f.id === formIdParam);
      if (found) {
        setFormId(found.id);
        setTitle(found.title);
        setDescription(found.description);
        setStatus(found.status);
        setQuestions(found.questions);
        return;
      }
    }

    const newId = "rack_" + Date.now();
    setFormId(newId);
  }, [formIdParam]);

  // Auto-Save Draft to LocalStorage
  useEffect(() => {
    if (!formId) return;

    const existingForms: RackForm[] = JSON.parse(localStorage.getItem("rack_forms") || "[]");
    const currentForm: RackForm = {
      id: formId,
      title: title || "Untitled Rack Form",
      description: description || "",
      status: status,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      questions,
    };

    const index = existingForms.findIndex((f) => f.id === formId);
    if (index >= 0) {
      existingForms[index] = currentForm;
    } else {
      existingForms.push(currentForm);
    }

    localStorage.setItem("rack_forms", JSON.stringify(existingForms));
    setSavedNotice(true);
    const timer = setTimeout(() => setSavedNotice(false), 1500);
    return () => clearTimeout(timer);
  }, [formId, title, description, questions, status]);

  // Question actions
  const handleAddQuestion = () => {
    const newQ: FormQuestion = {
      id: "q_" + Date.now(),
      title: "Untitled Question",
      type: "multiple_choice",
      options: ["Option 1"],
      required: false,
    };
    setQuestions([...questions, newQ]);
  };

  const handleDuplicate = (index: number) => {
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

  const handleAddOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push(`Option ${updated[qIndex].options.length + 1}`);
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = text;
    setQuestions(updated);
  };

  const handleDeleteOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options.length <= 1) return;
    updated[qIndex].options.splice(optIndex, 1);
    setQuestions(updated);
  };

  const handlePublish = () => {
    setStatus("published");
    alert("🎉 Your Rack Form is now Published!");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col selection:bg-[#ab1f09] selection:text-[#fff7d3] font-sans antialiased">
      
      {/* Top Header Bar */}
      <header className="w-full border-b border-neutral-800/80 bg-black/60 backdrop-blur-xl py-3.5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50">
        
        {/* Left: Back Link & Form Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-[#fff7d3] hover:border-neutral-700 transition-all flex items-center gap-1.5 text-xs font-mono"
            title="Back to Dashboard"
          >
            <span>←</span> <span className="hidden sm:inline">DASHBOARD</span>
          </Link>

          <div className="h-4 w-[1px] bg-neutral-800" />

          <div className="w-7 h-7 rounded-lg bg-[#ab1f09] flex items-center justify-center text-[#fff7d3] font-mono font-bold text-xs shadow-md shadow-[#ab1f09]/20">
            R
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm sm:text-base font-semibold text-white bg-transparent border-b border-transparent focus:border-[#ab1f09] focus:outline-none px-1 py-0.5 transition-all max-w-[180px] sm:max-w-xs truncate"
            placeholder="Untitled Form"
          />

          {/* Auto-Save Indicator */}
          <span className="text-[10px] font-mono text-neutral-500 hidden md:inline-flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${savedNotice ? "bg-emerald-500 animate-pulse" : "bg-neutral-600"}`} />
            <span>{savedNotice ? "Draft Saved" : "All changes saved"}</span>
          </span>
        </div>

        {/* Right: Status Badge & Publish Button */}
        <div className="flex items-center gap-3">
          <span
            className={`text-[9px] font-mono px-2.5 py-1 rounded-full uppercase font-bold tracking-wider ${
              status === "published"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
            }`}
          >
            {status === "published" ? "● LIVE" : "⏳ DRAFT"}
          </span>

          <button
            onClick={handlePublish}
            className="px-4 py-2 bg-[#ab1f09] hover:bg-[#c2240b] text-[#fff7d3] font-mono font-medium text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-[#ab1f09]/20 active:scale-[0.98] cursor-pointer"
          >
            {status === "published" ? "Save Changes" : "Publish Rack"}
          </button>
        </div>
      </header>

      {/* Main Form Builder Area */}
      <main className="max-w-3xl w-full mx-auto p-4 sm:p-8 flex gap-5 items-start relative flex-1">
        
        {/* Background Ambient Lighting */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#ab1f09]/5 blur-[140px] pointer-events-none rounded-full" />

        {/* Forms Stack */}
        <div className="flex-1 space-y-6 relative z-10">
          
          {/* Form Header Card */}
          <div className="p-6 sm:p-8 border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 backdrop-blur-xl shadow-2xl relative overflow-hidden space-y-3">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ab1f09] via-[#fff7d3]/50 to-[#ab1f09]" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl sm:text-3xl font-semibold tracking-tight text-white bg-transparent border-b border-transparent focus:border-[#ab1f09] outline-none pb-1 transition-all"
              placeholder="Rack Form Title"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs sm:text-sm text-neutral-400 font-light bg-transparent border-b border-transparent focus:border-[#ab1f09] outline-none pb-1 transition-all"
              placeholder="Describe what this form collects..."
            />
          </div>

          {/* Dynamic Questions List */}
          {questions.map((q, qIndex) => (
            <div
              key={q.id}
              className="border border-neutral-800/80 rounded-2xl bg-[#0d0d0d]/80 backdrop-blur-xl shadow-xl relative overflow-hidden transition-all hover:border-neutral-700"
            >
              {/* Left Active Line */}
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#ab1f09]" />

              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Question Header & Type Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={q.title}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qIndex].title = e.target.value;
                        setQuestions(updated);
                      }}
                      className="w-full text-sm sm:text-base font-medium text-white bg-[#111111] border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#ab1f09] transition-all"
                      placeholder="Type your question..."
                    />
                  </div>

                  {/* Type Dropdown */}
                  <select
                    value={q.type}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIndex].type = e.target.value as any;
                      setQuestions(updated);
                    }}
                    className="w-full bg-[#111111] border border-neutral-800 rounded-xl px-3 py-3 text-xs font-mono text-neutral-300 focus:outline-none focus:border-[#ab1f09] cursor-pointer"
                  >
                    <option value="multiple_choice">● Multiple choice</option>
                    <option value="checkboxes">■ Checkboxes</option>
                    <option value="short_text">― Short text</option>
                  </select>
                </div>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {q.type === "short_text" ? (
                    <div className="text-xs font-mono text-neutral-500 italic border-b border-dashed border-neutral-800 py-3">
                      User will type their answer here...
                    </div>
                  ) : (
                    <>
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-3">
                          {q.type === "multiple_choice" ? (
                            <div className="w-4 h-4 rounded-full border border-neutral-700 bg-neutral-900 flex-shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded border border-neutral-700 bg-neutral-900 flex-shrink-0" />
                          )}
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                            className="text-xs sm:text-sm text-neutral-200 bg-transparent border-b border-neutral-800 focus:border-[#ab1f09] outline-none py-1 flex-1 transition-colors"
                          />
                          {q.options.length > 1 && (
                            <button
                              onClick={() => handleDeleteOption(qIndex, optIndex)}
                              className="text-neutral-600 hover:text-red-400 text-xs px-1 cursor-pointer transition-colors"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        onClick={() => handleAddOption(qIndex)}
                        className="text-xs font-mono text-[#fff7d3] hover:text-[#ab1f09] transition-colors pt-2 block cursor-pointer"
                      >
                        + Add option
                      </button>
                    </>
                  )}
                </div>

                {/* Question Actions Footer */}
                <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-end gap-3 text-neutral-500">
                  <button
                    onClick={() => handleDuplicate(qIndex)}
                    className="p-2 hover:bg-neutral-900 rounded-lg hover:text-white transition-colors cursor-pointer text-xs font-mono"
                    title="Duplicate"
                  >
                    DUPLICATE
                  </button>

                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-2 hover:bg-neutral-900 rounded-lg hover:text-red-400 transition-colors cursor-pointer text-xs font-mono"
                    title="Delete"
                  >
                    DELETE
                  </button>

                  <div className="h-4 w-[1px] bg-neutral-800 mx-1" />

                  {/* Required Switch */}
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <span>Required</span>
                    <button
                      onClick={() => {
                        const updated = [...questions];
                        updated[qIndex].required = !updated[qIndex].required;
                        setQuestions(updated);
                      }}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                        q.required ? "bg-[#ab1f09]" : "bg-neutral-800"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                          q.required ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}

        </div>

        {/* Floating Side Action Button */}
        <aside className="sticky top-24 flex flex-col gap-2 bg-[#0d0d0d] border border-neutral-800/80 p-2 rounded-2xl shadow-xl">
          <button
            onClick={handleAddQuestion}
            className="w-10 h-10 rounded-xl bg-[#ab1f09] hover:bg-[#c2240b] text-[#fff7d3] flex items-center justify-center font-bold text-lg shadow-md shadow-[#ab1f09]/20 transition-transform active:scale-95 cursor-pointer"
            title="Add Question"
          >
            +
          </button>
        </aside>

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