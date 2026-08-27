"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiCopy,
  FiTrash2,
  FiPlusCircle,
} from "react-icons/fi";

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
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("Form description");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [activeTab, setActiveTab] = useState<"questions" | "responses" | "settings">("questions");
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

  // Load existing form or initialize new one
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

    // New Form ID
    const newId = "rack_" + Date.now();
    setFormId(newId);
  }, [formIdParam]);

  // Auto-Save Draft to LocalStorage on every change
  useEffect(() => {
    if (!formId) return;

    const existingForms: RackForm[] = JSON.parse(localStorage.getItem("rack_forms") || "[]");
    const currentForm: RackForm = {
      id: formId,
      title: title || "Untitled Form",
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
    const timer = setTimeout(() => setSavedNotice(false), 1800);
    return () => clearTimeout(timer);
  }, [formId, title, description, questions, status]);

  // Add new question
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

  // Duplicate question
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

  // Delete question
  const handleDeleteQuestion = (id: string) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Add option to question
  const handleAddOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push(`Option ${updated[qIndex].options.length + 1}`);
    setQuestions(updated);
  };

  // Update option text
  const handleOptionChange = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = text;
    setQuestions(updated);
  };

  // Delete option
  const handleDeleteOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options.length <= 1) return;
    updated[qIndex].options.splice(optIndex, 1);
    setQuestions(updated);
  };

  // Publish Form
  const handlePublish = () => {
    setStatus("published");
    alert("🎉 Your Rack Form is now Published!");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-800 font-sans pb-16 selection:bg-purple-500/20">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-sm">
        
        {/* Left Side: Back to Dashboard & Form Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-mono"
            title="Back to Dashboard"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">DASHBOARD</span>
          </Link>

          <div className="h-5 w-[1px] bg-slate-200" />

          <div className="w-8 h-8 rounded-lg bg-[#ab1f09] flex items-center justify-center text-white shadow-sm font-mono font-bold text-sm">
            R
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-base sm:text-lg font-medium text-slate-800 bg-transparent hover:border-b hover:border-slate-300 focus:border-b-2 focus:border-purple-600 focus:outline-none px-1 py-0.5 transition-all max-w-[200px] sm:max-w-xs truncate"
          />

          {/* Auto-Save Indicator */}
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-flex items-center gap-1">
            {savedNotice ? (
              <>
                <FiCheckCircle className="text-emerald-500 w-3 h-3" /> Saved Draft
              </>
            ) : (
              "All changes saved"
            )}
          </span>
        </div>

        {/* Center Tabs */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
          <button
            onClick={() => setActiveTab("questions")}
            className={`pb-1 relative transition-colors ${
              activeTab === "questions" ? "text-purple-600 font-semibold" : "hover:text-slate-900"
            }`}
          >
            Questions
            {activeTab === "questions" && (
              <span className="absolute bottom-[-11px] left-0 right-0 h-0.5 bg-purple-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("responses")}
            className={`pb-1 relative transition-colors ${
              activeTab === "responses" ? "text-purple-600 font-semibold" : "hover:text-slate-900"
            }`}
          >
            Responses
            {activeTab === "responses" && (
              <span className="absolute bottom-[-11px] left-0 right-0 h-0.5 bg-purple-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-1 relative transition-colors ${
              activeTab === "settings" ? "text-purple-600 font-semibold" : "hover:text-slate-900"
            }`}
          >
            Settings
            {activeTab === "settings" && (
              <span className="absolute bottom-[-11px] left-0 right-0 h-0.5 bg-purple-600 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Right Side Publish & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 text-slate-600">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider ${
              status === "published"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {status}
          </span>

          <button
            onClick={handlePublish}
            className="px-4 sm:px-5 py-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-medium text-xs sm:text-sm rounded-lg shadow-sm shadow-purple-500/30 transition-all cursor-pointer"
          >
            {status === "published" ? "Save Changes" : "Publish"}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-3xl mx-auto mt-6 px-4 flex gap-4 items-start relative">
        
        {/* Form Container */}
        <div className="flex-1 space-y-4">
          
          {/* Form Header Card */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm relative">
            <div className="h-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500" />
            <div className="p-6">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl sm:text-3xl font-semibold text-slate-900 border-b border-transparent focus:border-purple-600 outline-none pb-1 transition-all"
                placeholder="Form Title"
              />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-3 text-sm text-slate-500 border-b border-transparent focus:border-purple-600 outline-none pb-1 transition-all"
                placeholder="Form description"
              />
            </div>
          </div>

          {/* Dynamic Questions List */}
          {questions.map((q, qIndex) => (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden flex"
            >
              {/* Active Left Indicator Bar */}
              <div className="w-1.5 bg-purple-600 self-stretch" />

              <div className="flex-1 p-6">
                {/* Question Header & Type Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="sm:col-span-2 flex items-center gap-2 bg-slate-50 border-b-2 border-purple-600 p-3 rounded-t-md">
                    <input
                      type="text"
                      value={q.title}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qIndex].title = e.target.value;
                        setQuestions(updated);
                      }}
                      className="w-full bg-transparent text-slate-800 font-medium outline-none text-sm"
                      placeholder="Question title"
                    />
                  </div>

                  {/* Type Selector Dropdown */}
                  <select
                    value={q.type}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIndex].type = e.target.value as any;
                      setQuestions(updated);
                    }}
                    className="border border-slate-200 rounded-lg p-3 bg-white text-sm font-medium text-slate-700 outline-none focus:border-purple-600 cursor-pointer"
                  >
                    <option value="multiple_choice">● Multiple choice</option>
                    <option value="checkboxes">■ Checkboxes</option>
                    <option value="short_text">― Short text</option>
                  </select>
                </div>

                {/* Options Section */}
                <div className="mt-6 space-y-3">
                  {q.type === "short_text" ? (
                    <div className="text-xs text-slate-400 italic border-b border-dashed border-slate-300 py-2">
                      User will type short answer here...
                    </div>
                  ) : (
                    <>
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-3">
                          {q.type === "multiple_choice" ? (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded border-2 border-slate-300 flex-shrink-0" />
                          )}
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                            className="text-sm text-slate-700 bg-transparent border-b border-transparent focus:border-purple-600 outline-none py-1 flex-1"
                          />
                          {q.options.length > 1 && (
                            <button
                              onClick={() => handleDeleteOption(qIndex, optIndex)}
                              className="text-slate-400 hover:text-red-500 text-xs px-1 cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}

                      <div className="flex items-center gap-3 pt-2 text-sm">
                        <button
                          onClick={() => handleAddOption(qIndex)}
                          className="text-purple-600 font-medium hover:underline text-xs cursor-pointer"
                        >
                          + Add option
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Question Footer Actions */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end gap-3 text-slate-500">
                  <button
                    onClick={() => handleDuplicate(qIndex)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                    title="Duplicate"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-red-500 cursor-pointer"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>

                  <div className="h-5 w-[1px] bg-slate-200 mx-1" />

                  {/* Required Toggle */}
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <span>Required</span>
                    <button
                      onClick={() => {
                        const updated = [...questions];
                        updated[qIndex].required = !updated[qIndex].required;
                        setQuestions(updated);
                      }}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                        q.required ? "bg-purple-600" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
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

        {/* Floating Side Action Bar */}
        <aside className="sticky top-20 flex flex-col gap-2 bg-white border border-slate-200 p-2 rounded-xl shadow-md text-slate-500">
          <button
            onClick={handleAddQuestion}
            className="p-2.5 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors cursor-pointer"
            title="Add Question"
          >
            <FiPlusCircle className="w-5 h-5" />
          </button>
        </aside>
      </main>

    </div>
  );
}

export default function FormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F0F2F5]" />}>
      <FormBuilderContent />
    </Suspense>
  );
}