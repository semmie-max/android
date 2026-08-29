"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiGrid,
  FiBox,
  FiBarChart2,
  FiUsers,
  FiSettings,
  FiBell,
  FiShield,
  FiMenu,
  FiX,
  FiLogOut,
  FiSearch,
  FiMoreHorizontal,
  FiTrendingUp,
} from "react-icons/fi";
import GlobeStudy from "@/components/originkit/ui/globe-study";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://rack-backend-fqdf.onrender.com";

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
  lat?: number;
  lon?: number;
}

interface RackForm {
  id: string;
  slug?: string;
  title: string;
  description: string;
  status: "draft" | "published" | "closed";
  createdAt: string;
  updatedAt: string;
  questions: FormQuestion[];
  responses: FormResponseItem[];
  viewCount?: number;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
}

export default function RackDashboard() {
  const router = useRouter();
  
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<
    "overview" | "racks" | "analytics" | "profile" | "settings" | "notifications" | "security"
  >("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(288); // px, same as w-72
const [isResizing, setIsResizing] = useState(false);

  // User State
  const [displayName, setDisplayName] = useState<string>("Alex");
  const [userEmail, setUserEmail] = useState<string>("alex.cto@gmail.com");
  const [userBio, setUserBio] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [profileSavedNotice, setProfileSavedNotice] = useState(false);

  // Forms & Analytics State
  const [forms, setForms] = useState<RackForm[]>([]);
  const [selectedFormForAnalytics, setSelectedFormForAnalytics] = useState<RackForm | null>(null);
   const [rackFilter, setRackFilter] = useState<"all" | "published" | "draft">("all");
  const [rackSearch, setRackSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState("Last month");
  const [copiedFormId, setCopiedFormId] = useState<string | null>(null);

  // Members Modal State
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<"Admin" | "Editor" | "Viewer">("Editor");

  // Notifications State
  interface NotificationItem {
    id: string;
    title: string;
    desc: string;
    time: string;
    read: boolean;
  }
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Security & Settings State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);



  // Workspace
  const [workspaceName, setWorkspaceName] = useState("My Workspace");
  const [restrictDomain, setRestrictDomain] = useState("");

  // Rack Defaults
  const [defaultVisibility, setDefaultVisibility] = useState<"draft" | "published">("draft");
  const [defaultVotingType, setDefaultVotingType] = useState<"free" | "paid">("free");
  const [autoCloseDays, setAutoCloseDays] = useState(0);
  const [requireEmailToSubmit, setRequireEmailToSubmit] = useState(true);

  // Notifications
  const [notifyOnSubmission, setNotifyOnSubmission] = useState(true);
  const [notifyOnClose, setNotifyOnClose] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = Math.min(Math.max(e.clientX, 200), 420); // min 200px, max 420px
    setSidebarWidth(newWidth);
  };
  const handleMouseUp = () => setIsResizing(false);

  if (isResizing) {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }
  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };
}, [isResizing]);

  // Load User & Forms
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

    fetch(`${API_BASE}/api/members`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.members) setMembers(data.members);
      })
      .catch((err) => console.error("Failed to load members", err));    if (savedEmail) setUserEmail(savedEmail);

    const savedAvatar = localStorage.getItem("rack_user_avatar");
    if (savedAvatar) setAvatarUrl(savedAvatar);

    const savedBio = localStorage.getItem("rack_user_bio");
    setUserBio(savedBio && savedBio.trim() !== "" ? savedBio : "Lead Workspace Admin");

    fetch(`${API_BASE}/api/forms`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.forms) setForms(data.forms);
      })
      .catch((err) => console.error("Failed to load racks", err));
  }, [router]);

  // Real-time-ish notifications: fetch now, then poll every 15s
  useEffect(() => {
    const token = localStorage.getItem("rack_token");
    if (!token) return;

    const loadNotifications = () => {
      fetch(`${API_BASE}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.notifications) {
            setNotifications(data.notifications.map((n: any) => ({ ...n, time: timeAgo(n.time) })));
          }
        })
        .catch((err) => console.error("Failed to load notifications", err));
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("rack_token");
    localStorage.removeItem("rack_user_name");
    localStorage.removeItem("rack_user_email");
    router.push("/signup");
  };

  // Delete Form
  const handleDeleteForm = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem("rack_token");
    const updated = forms.filter((f) => f.id !== id);
    setForms(updated);
    fetch(`${API_BASE}/api/forms/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).catch((err) => console.error("Failed to delete rack", err));
  };

  // Copy a rack's live share link
  const handleCopyShareLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const form = forms.find((f) => f.id === id);
    const url = form?.slug
      ? `${window.location.origin}/android/form?slug=${form.slug}`
      : `${window.location.origin}/android/form?id=${id}&view=live`;
    navigator.clipboard.writeText(url);
    setCopiedFormId(id);
    setTimeout(() => setCopiedFormId(null), 2000);
  };

  // Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("rack_user_name", displayName);
    localStorage.setItem("rack_user_bio", userBio);
    setProfileSavedNotice(true);
    setTimeout(() => setProfileSavedNotice(false), 2000);
  };

  // Upload / replace the profile picture
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);
      localStorage.setItem("rack_user_avatar", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Add Member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail) return;

    const token = localStorage.getItem("rack_token");
    fetch(`${API_BASE}/api/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email: newMemberEmail, role: newMemberRole }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setMembers([...members, { id: data.id, name: newMemberEmail.split("@")[0], email: newMemberEmail, role: newMemberRole }]);
          setNewMemberEmail("");
        }
      })
      .catch((err) => console.error("Failed to send invite", err));
  };

  const handleRemoveMember = (id: string) => {
    if (members.length <= 1 || id === "m_self") return;
    const token = localStorage.getItem("rack_token");
    setMembers(members.filter((m) => m.id !== id));
    fetch(`${API_BASE}/api/members/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).catch((err) => console.error("Failed to remove member", err));
  };

  // Turn a raw timestamp into "5 mins ago" style text
  const timeAgo = (dateStr: string) => {
    const then = new Date(dateStr).getTime();
    const now = Date.now();
    const mins = Math.floor((now - then) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  // Export all workspace data as a downloadable JSON file
  const handleExportData = () => {
    const payload = { workspaceName, forms, members };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workspaceName.replace(/\s+/g, "_").toLowerCase()}_export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Wipe every rack from this workspace after confirmation
  const handleDeleteWorkspace = () => {
    const confirmed = window.confirm("This will permanently delete all racks in this workspace. This cannot be undone. Continue?");
    if (!confirmed) return;
    const token = localStorage.getItem("rack_token");
    Promise.all(
      forms.map((f) =>
        fetch(`${API_BASE}/api/forms/${f.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
      )
    ).catch((err) => console.error("Failed to delete workspace", err));
    setForms([]);
  };

  // Total Metrics
  const totalSubmissions = forms.reduce((acc, f) => acc + (f.responses?.length || 0), 0);
  const totalClicks = forms.reduce((acc, f) => acc + (f.viewCount || 0), 0);
  const clickConversionRate = totalClicks > 0 ? ((totalSubmissions / totalClicks) * 100).toFixed(1) : "0.0";
  const totalRevenue = forms.reduce((acc, f) => {
    const rev = f.responses?.reduce((rAcc, r) => rAcc + (r.totalPaid || 0), 0) || 0;
    return acc + rev;
  }, 0);

  // Link Reach: every response across every rack that carries a location, fed
  // straight into the globe. Nothing here yet since responses have no lat/lon
  // until submissions start capturing it.
  const linkLocations = forms.flatMap((f) =>
    (f.responses || [])
      .filter((r) => typeof r.lat === "number" && typeof r.lon === "number")
      .map((r) => ({ lat: r.lat as number, lon: r.lon as number }))
  );

  // Real Analytics: last 7 calendar days, computed straight from forms/responses
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const dayLabels = last7Days.map((d) => d.toLocaleDateString("en-US", { weekday: "short" }));

  const submissionsByDay = last7Days.map((d) => {
    const dayStr = d.toDateString();
    return forms.reduce(
      (acc, f) => acc + (f.responses || []).filter((r) => new Date(r.submittedAt).toDateString() === dayStr).length,
      0
    );
  });

  const revenueByDay = last7Days.map((d) => {
    const dayStr = d.toDateString();
    return forms.reduce((acc, f) => {
      const dayResponses = (f.responses || []).filter((r) => new Date(r.submittedAt).toDateString() === dayStr);
      return acc + dayResponses.reduce((rAcc, r) => rAcc + (r.totalPaid || 0), 0);
    }, 0);
  });

  const racksByDay = last7Days.map((d) => {
    const dayStr = d.toDateString();
    return forms.filter((f) => new Date(f.createdAt).toDateString() === dayStr).length;
  });

  const avgByDay = submissionsByDay.map((v) => (forms.length > 0 ? v / forms.length : 0));

  const toSparklinePoints = (values: number[], width: number, height: number) => {
    const max = Math.max(...values, 1);
    const step = width / Math.max(values.length - 1, 1);
    return values.map((v, i) => `${(i * step).toFixed(1)},${(height - (v / max) * height).toFixed(1)}`).join(" ");
  };

  const toBarHeights = (values: number[]) => {
    const max = Math.max(...values, 1);
    return values.map((v) => (v <= 0 ? "4%" : `${Math.max((v / max) * 100, 6)}%`));
  };

  // Filtered Racks
  const filteredForms = forms.filter((f) => {
    const matchesFilter = rackFilter === "all" || f.status === rackFilter;
    const matchesSearch = f.title.toLowerCase().includes(rackSearch.toLowerCase()) || f.description.toLowerCase().includes(rackSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col lg:flex-row selection:bg-[#ab1f09] selection:text-[#fff7d3] font-sans antialiased">
      
      {/* MOBILE TOP HEADER */}
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
          {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </header>

      {/* SIDEBAR NAVIGATION */}
            <aside
        style={{ width: sidebarWidth, maxWidth: "85vw" }}
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-[#0a0a0a] border-r border-neutral-800/80 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
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

          {/* Navigation Items */}
          <nav className="space-y-6">
            
            {/* Main Menu */}
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                Main Menu
              </div>
                            {[
                { id: "overview", label: "Dashboard", icon: FiGrid },
                { id: "racks", label: "My Racks", icon: FiBox },
                { id: "analytics", label: "Analytics", icon: FiBarChart2 },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                    activeTab === item.id
                      ? "bg-[#ab1f09]/15 text-[#fff7d3] border border-[#ab1f09]/30 font-medium shadow-sm shadow-[#ab1f09]/20"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-[#fff7d3]" : "text-[#ab1f09]"}`} />
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
                { id: "profile", label: "Profile", icon: FiUsers },
                { id: "settings", label: "Settings", icon: FiSettings },
                { id: "notifications", label: "Notifications", icon: FiBell },
                { id: "security", label: "Security", icon: FiShield },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                    activeTab === item.id
                      ? "bg-[#ab1f09]/15 text-[#fff7d3] border border-[#ab1f09]/30 font-medium shadow-sm shadow-[#ab1f09]/20"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-[#fff7d3]" : "text-neutral-400"}`} />
                  <span className="flex-1">{item.label}</span>
                  {activeTab === item.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ab1f09]" />
                  )}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="border-t border-neutral-800/80 pt-4 space-y-3">
          <div
            onClick={() => setActiveTab("profile")}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-900/60 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-mono font-bold text-[#fff7d3] text-sm uppercase shadow-inner overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                displayName ? displayName.charAt(0).toUpperCase() : "A"
              )}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-xs font-semibold text-white capitalize truncate">{displayName}</h3>
              <p className="text-[10px] font-mono text-neutral-500 truncate">{userEmail}</p>
            </div>
          </div>
                    <button 
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-mono text-neutral-400 hover:text-[#fff7d3] hover:bg-neutral-900/80 transition-colors flex items-center justify-between cursor-pointer"
          >
            <span>LOGOUT</span>
            <FiLogOut className="w-3.5 h-3.5" />
          </button>
        </div>
                <div
    onMouseDown={() => setIsResizing(true)}
    className="hidden lg:block absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-[#ab1f09]/50 active:bg-[#ab1f09] transition-colors"
  />
</aside>

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/80 z-30 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* MAIN VIEWPORT CONTAINER */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 space-y-8 max-w-6xl mx-auto w-full relative z-10 overflow-y-auto">
        
        {/* Ambient Glow */}
        <div className="absolute top-10 right-10 w-[500px] h-[250px] bg-[#ab1f09]/10 blur-[130px] pointer-events-none rounded-full" />

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW / DASHBOARD */}
        {/* ========================================================= */}
                {activeTab === "overview" && (
          <div className="space-y-8">
            {/* TOP HEADER: Welcome Title & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white capitalize">
                  Heyyyy, {displayName}!
                </h1>
                <p className="text-xs text-neutral-400 font-light mt-1">
                  Improve your rack management for better growth
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                  <input
                    type="text"
                    value={rackSearch}
                    onChange={(e) => setRackSearch(e.target.value)}
                    placeholder="Search racks..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ab1f09] transition-colors"
                  />
                </div>
                <button
                  onClick={() => window.open("/android/form", "_blank")}
                  className="px-4 py-2.5 bg-[#ab1f09] hover:bg-[#c2240b] text-[#fff7d3] font-mono font-medium text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-[#ab1f09]/20 cursor-pointer whitespace-nowrap"
                >
                  + New Rack
                </button>
              </div>
            </div>

            {/* TIME RANGE TAB FILTERS */}
            <div className="flex items-center gap-6 border-b border-neutral-800/80 pb-3 text-xs font-mono overflow-x-auto">
              {["Last 24 hour", "Last weeks", "Last month", "Last year"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`pb-3 -mb-3 transition-colors relative whitespace-nowrap ${
                    timeFilter === filter
                      ? "text-[#fff7d3] font-semibold"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {filter}
                  {timeFilter === filter && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ab1f09] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* TOP METRIC CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <div className="p-5 border border-neutral-800/80 rounded-2xl bg-[#0a0a0a] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#ab1f09]/20 border border-[#ab1f09]/30 flex items-center justify-center text-[#ab1f09]">
                    <FiUsers className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono text-neutral-400 uppercase">Workspace Members</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-bold text-white tracking-tight">{members.length}</span>
                    </div>
                  </div>
                </div>
                <button className="text-neutral-600 hover:text-neutral-400">
                  <FiMoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 border border-neutral-800/80 rounded-2xl bg-[#0a0a0a] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#ab1f09]/20 border border-[#ab1f09]/30 flex items-center justify-center text-[#fff7d3]">
                    <FiTrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono text-neutral-400 uppercase">Paid Voting Revenue</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-bold text-white tracking-tight">${totalRevenue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button className="text-neutral-600 hover:text-neutral-400">
                  <FiMoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 border border-neutral-800/80 rounded-2xl bg-[#0a0a0a] flex items-center justify-between sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
                    <FiBox className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono text-neutral-400 uppercase">Total Racks</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-bold text-white tracking-tight">{forms.length}</span>
                    </div>
                  </div>
                </div>
                <button className="text-neutral-600 hover:text-neutral-400">
                  <FiMoreHorizontal className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* MIDDLE ANALYTICS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              <div className="lg:col-span-7 border border-neutral-800/80 rounded-2xl bg-[#0a0a0a] p-6 space-y-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">Submissions Overview</h3>
                    <p className="text-xs text-neutral-500 font-light">Your rack submissions this week</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className="text-xs font-mono text-[#ab1f09] hover:text-[#fff7d3] transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>

                                <div className="space-y-2 pt-4">
                  <div className="h-48 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-neutral-800 pb-2">
                    {[
                      { day: "Mon", h1: forms.length > 0 ? "60%" : "4%", h2: forms.length > 0 ? "45%" : "2%" },
                      { day: "Tue", h1: forms.length > 0 ? "50%" : "4%", h2: forms.length > 0 ? "30%" : "2%" },
                      { day: "Wed", h1: forms.length > 0 ? "65%" : "4%", h2: forms.length > 0 ? "50%" : "2%" },
                      { day: "Thu", h1: forms.length > 0 ? "95%" : "4%", h2: forms.length > 0 ? "70%" : "2%" },
                      { day: "Fri", h1: forms.length > 0 ? "55%" : "4%", h2: forms.length > 0 ? "40%" : "2%" },
                      { day: "Sat", h1: forms.length > 0 ? "80%" : "4%", h2: forms.length > 0 ? "60%" : "2%" },
                      { day: "Sun", h1: forms.length > 0 ? "70%" : "4%", h2: forms.length > 0 ? "50%" : "2%" },
                    ].map((bar, idx) => (
                      <div key={idx} className="flex-1 flex items-end justify-center gap-1 h-full">
                        <div
                          style={{ height: bar.h1 }}
                          className="w-full bg-[#ab1f09] rounded-t-md transition-all hover:bg-[#c2240b]"
                        />
                        <div
                          style={{ height: bar.h2 }}
                          className="w-full bg-[#ab1f09]/40 rounded-t-md transition-all hover:bg-[#ab1f09]/60"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-[11px] font-mono text-neutral-500 px-2 pt-2">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>

                            <div className="lg:col-span-5 border border-neutral-800/80 rounded-2xl bg-[#0a0a0a] p-6 space-y-4 relative flex flex-col justify-between overflow-hidden">
                <div>
                  <h3 className="text-base font-semibold text-white">Link Reach</h3>
                  <p className="text-xs text-neutral-500 font-light">Where your rack links have been opened</p>
                </div>

                <div className="relative my-auto min-h-[220px] rounded-xl overflow-hidden">
<GlobeStudy
  background="#0a0a0a"
  baseColor="#ab1f09"
  pinColor="#ab1f09"
  locations={linkLocations}
  globe={{ radius: 115 }}
  style={{ minWidth: 0, minHeight: 0 }}
/>
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-neutral-800/80 text-neutral-400">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ab1f09]" /> Link reach
                  </span>
                  <span className="text-[#fff7d3]">{linkLocations.length} of {totalSubmissions} submissions</span>
                </div>
              </div>

            </div>

            {/* BOTTOM SECTION: RECENT RACKS TABLE */}
            <div className="border border-neutral-800/80 rounded-2xl bg-[#0a0a0a] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">Recent Racks</h3>
                <button
                  onClick={() => setActiveTab("racks")}
                  className="text-xs font-mono text-[#ab1f09] hover:text-[#fff7d3] transition-colors cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-neutral-500 border-b border-neutral-800/80">
                      <th className="pb-3 font-normal">RACK</th>
                      <th className="pb-3 font-normal">DESCRIPTION</th>
                      <th className="pb-3 font-normal">UPDATED</th>
                      <th className="pb-3 font-normal">SUBMISSIONS</th>
                      <th className="pb-3 font-normal">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50 text-neutral-300">
                    {filteredForms.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-neutral-500">
                          No racks match your search yet.
                        </td>
                      </tr>
                    ) : (
                      filteredForms.slice(0, 6).map((form) => (
                        <tr
                          key={form.id}
                          onClick={() => window.open(`/android/form?id=${form.id}`, "_blank")}
                          className="hover:bg-neutral-900/40 transition-colors cursor-pointer"
                        >
                          <td className="py-3 text-[#fff7d3]">{form.title}</td>
                          <td className="py-3 text-neutral-400 max-w-[220px] truncate">{form.description || "No description"}</td>
                          <td className="py-3 text-neutral-500">{form.updatedAt}</td>
                          <td className="py-3 font-semibold text-white">{form.responses?.length || 0}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${
                              form.status === "published"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}>
                              {form.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
        {/* ========================================================= */}
        {activeTab === "racks" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">My Racks</h1>
                <p className="text-xs text-neutral-400 mt-1">Manage, filter, and modify all your active and draft forms.</p>
              </div>
              <button
                onClick={() => window.open("/android/form", "_blank")}
                className="px-4 py-2 bg-[#ab1f09] hover:bg-[#c2240b] text-[#fff7d3] text-xs font-mono font-medium rounded-xl self-start sm:self-auto cursor-pointer"
              >
                + New Rack
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0d0d0d] border border-neutral-800">
              <div className="flex items-center gap-2 text-xs font-mono">
                {(["all", "published", "draft"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setRackFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                      rackFilter === filter ? "bg-[#ab1f09] text-[#fff7d3] font-bold" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={rackSearch}
                onChange={(e) => setRackSearch(e.target.value)}
                placeholder="Search racks by title..."
                className="px-3.5 py-1.5 bg-[#111111] border border-neutral-800 rounded-xl text-xs text-white outline-none focus:border-[#ab1f09] w-64"
              />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="p-6 border border-neutral-800 rounded-2xl bg-[#0d0d0d] space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 uppercase">
                      {form.status}
                    </span>
                    <button
                      onClick={(e) => handleDeleteForm(form.id, e)}
                      className="text-neutral-500 hover:text-red-400 text-xs cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                  <h3 className="text-base font-semibold text-white truncate">{form.title}</h3>
                  <p className="text-xs text-neutral-400 font-light line-clamp-2">{form.description}</p>
                  
                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-500">{form.responses?.length || 0} Responses</span>
                    <div className="flex items-center gap-3">
                      {form.status === "published" && (
                        <button
                          onClick={(e) => handleCopyShareLink(form.id, e)}
                          className="text-neutral-400 hover:text-[#fff7d3] cursor-pointer"
                        >
                          {copiedFormId === form.id ? "Copied!" : "Share"}
                        </button>
                      )}
                                          <button
                      onClick={() => window.open(`/android/form?id=${form.id}`, "_blank")}
                      className="text-[#ab1f09] hover:underline cursor-pointer"
                    >
                      Open Studio →
                    </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ANALYTICS */}
        {/* ========================================================= */}
                {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Live Analytics</h1>
                <p className="text-xs text-neutral-400 mt-1">Real-time performance, contestant votes, and submissions.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-[#0d0d0d] border border-neutral-800 text-xs font-mono text-neutral-300 flex items-center gap-1.5 cursor-pointer">
                  All racks <FiMoreHorizontal className="w-3 h-3 rotate-90" />
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-[#0d0d0d] border border-neutral-800 text-xs font-mono text-neutral-300">
                  Last 7 days
                </span>
                <button className="px-3 py-1.5 rounded-lg bg-[#ab1f09] hover:bg-[#c2240b] text-[#fff7d3] text-xs font-mono font-semibold cursor-pointer">
                  Set up dashboard
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Total Racks</span>
                  <span className="text-[10px] font-mono text-emerald-400">+{forms.length}</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white">{forms.length}</div>
                <svg viewBox="0 0 100 24" className="w-full h-6" preserveAspectRatio="none">
                  <polyline points={toSparklinePoints(racksByDay, 100, 24)} fill="none" stroke="#ab1f09" strokeWidth="2" />
                </svg>
              </div>

              <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Submissions</span>
                  <span className="text-[10px] font-mono text-emerald-400">+{totalSubmissions}</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white">{totalSubmissions}</div>
                <svg viewBox="0 0 100 24" className="w-full h-6" preserveAspectRatio="none">
                  <polyline points={toSparklinePoints(submissionsByDay, 100, 24)} fill="none" stroke="#ab1f09" strokeWidth="2" />
                </svg>
              </div>

              <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Revenue</span>
                  <span className="text-[10px] font-mono text-emerald-400">USD</span>
                </div>
                <div className="text-2xl font-bold font-mono text-[#fff7d3]">${totalRevenue.toFixed(2)}</div>
                <svg viewBox="0 0 100 24" className="w-full h-6" preserveAspectRatio="none">
                  <polyline points={toSparklinePoints(revenueByDay, 100, 24)} fill="none" stroke="#fff7d3" strokeWidth="2" />
                </svg>
              </div>

              <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Avg / Rack</span>
                  <span className="text-[10px] font-mono text-neutral-500">submissions</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  {forms.length > 0 ? (totalSubmissions / forms.length).toFixed(1) : "0.0"}
                </div>
                <svg viewBox="0 0 100 24" className="w-full h-6" preserveAspectRatio="none">
                  <polyline points={toSparklinePoints(avgByDay, 100, 24)} fill="none" stroke="#737373" strokeWidth="2" />
                </svg>
              </div>

              <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Link Clicks</span>
                  <span className="text-[10px] font-mono text-neutral-500">{clickConversionRate}% convert</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white">{totalClicks}</div>
                <p className="text-[10px] font-mono text-neutral-500">Total times your live links were opened</p>
              </div>
            </div>

            {/* Main Grid: Trend + Top Racks */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0d0d0d] border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono text-[#fff7d3] uppercase">Submissions Trend</h3>
                  <span className="text-[10px] font-mono text-neutral-500">Last 7 days</span>
                </div>
                                <svg viewBox="0 0 300 100" className="w-full h-40" preserveAspectRatio="none">
                  <polyline
                    points={toSparklinePoints(submissionsByDay, 300, 100)}
                    fill="none"
                    stroke="#ab1f09"
                    strokeWidth="2.5"
                  />
                </svg>
                <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                  {dayLabels.map((label, idx) => (
                    <span key={idx}>{label}</span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0d0d0d] border border-neutral-800 space-y-3">
                <h3 className="text-sm font-mono text-[#fff7d3] uppercase">Top Racks</h3>
                {forms.length === 0 ? (
                  <div className="text-xs font-mono text-neutral-500 py-4">No racks created yet.</div>
                ) : (
                  <div className="space-y-3">
                    {[...forms]
                      .sort((a, b) => (b.responses?.length || 0) - (a.responses?.length || 0))
                      .slice(0, 5)
                      .map((f) => (
                        <div key={f.id} className="flex items-center justify-between text-xs font-mono">
                          <span className="flex items-center gap-2 text-neutral-300 truncate">
                            <span className="w-2 h-2 rounded-full bg-[#ab1f09] shrink-0" />
                            {f.title}
                          </span>
                          <span className="text-white font-semibold">{f.responses?.length || 0}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Second Grid: Weekly Bar Chart + Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0d0d0d] border border-neutral-800 space-y-4">
                <h3 className="text-sm font-mono text-[#fff7d3] uppercase">Weekly Submissions</h3>
                <div className="h-40 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-neutral-800 pb-2">
                  {toBarHeights(submissionsByDay).map((h, idx) => (
                    <div key={idx} className="flex-1 flex items-end justify-center h-full">
                      <div
                        style={{ height: h }}
                        className="w-full bg-[#ab1f09] rounded-t-md transition-all hover:bg-[#c2240b]"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-neutral-500 px-2">
                  {dayLabels.map((label, idx) => (
                    <span key={idx}>{label}</span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0d0d0d] border border-neutral-800 space-y-3">
                <h3 className="text-sm font-mono text-[#fff7d3] uppercase">Status Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-2 text-neutral-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Published
                    </span>
                    <span className="text-white font-semibold">
                      {forms.filter((f) => f.status === "published").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-2 text-neutral-300">
                      <span className="w-2 h-2 rounded-full bg-amber-400" /> Draft
                    </span>
                    <span className="text-white font-semibold">
                      {forms.filter((f) => f.status === "draft").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-2 text-neutral-300">
                      <span className="w-2 h-2 rounded-full bg-neutral-500" /> Closed
                    </span>
                    <span className="text-white font-semibold">
                      {forms.filter((f) => f.status === "closed").length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rack Breakdown */}
            <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-neutral-800 space-y-4">
              <h3 className="text-sm font-mono text-[#fff7d3] uppercase">Rack Submissions Log</h3>
              {forms.length === 0 ? (
                <div className="text-xs font-mono text-neutral-500 py-4">No forms created yet.</div>
              ) : (
                <div className="divide-y divide-neutral-800">
                  {forms.map((f) => (
                    <div key={f.id} className="py-3 flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="font-semibold text-white">{f.title}</div>
                        <div className="text-[10px] text-neutral-500">{f.viewCount || 0} Clicks • {f.responses?.length || 0} Submissions • Status: {f.status}</div>
                      </div>
                      <button
                        onClick={() => setSelectedFormForAnalytics(f)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:text-[#fff7d3] cursor-pointer"
                      >
                        View Breakdown →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: USER PROFILE */}
        {/* ========================================================= */}
        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="border-b border-neutral-800 pb-6">
              <h1 className="text-2xl font-bold text-white">Profile Information</h1>
              <p className="text-xs text-neutral-400 mt-1">Manage your account details and display badge.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-2xl bg-[#0d0d0d] border border-neutral-800 space-y-6">
              
              <div className="flex items-center gap-4">
                <label className="relative w-16 h-16 rounded-2xl bg-[#ab1f09] flex items-center justify-center font-mono font-bold text-xl text-[#fff7d3] shadow-lg shadow-[#ab1f09]/20 overflow-hidden cursor-pointer group">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    displayName.charAt(0).toUpperCase()
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] font-mono uppercase">
                    Change
                  </div>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
                <div>
                  <h3 className="text-sm font-semibold text-white capitalize">{displayName}</h3>
                  <p className="text-xs font-mono text-neutral-500">{userEmail}</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-neutral-800 pt-6">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#111111] border border-neutral-800 rounded-xl text-xs text-white focus:border-[#ab1f09] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={userEmail}
                    className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-neutral-800/60 rounded-xl text-xs text-neutral-500 outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">Role / Bio</label>
                  <input
                    type="text"
                    value={userBio}
                    onChange={(e) => setUserBio(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#111111] border border-neutral-800 rounded-xl text-xs text-white focus:border-[#ab1f09] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                <span className="text-xs font-mono text-emerald-400">
                  {profileSavedNotice ? "✓ Profile Updated!" : ""}
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#ab1f09] hover:bg-[#c2240b] text-[#fff7d3] font-mono text-xs font-semibold rounded-xl transition-all shadow-md shadow-[#ab1f09]/20 cursor-pointer"
                >
                  Save Profile
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: SETTINGS */}
        {/* ========================================================= */}
        {activeTab === "settings" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border-b border-neutral-800 pb-6">
              <h1 className="text-2xl font-bold text-white">Workspace Settings</h1>
              <p className="text-xs text-neutral-400 mt-1">Configure payments, rack defaults, notifications, and your workspace.</p>
            </div>

            {/* Workspace */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0d0d0d] border border-neutral-800 space-y-6">
              <h3 className="text-sm font-mono text-[#fff7d3] uppercase">Workspace</h3>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">Workspace Name</label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#111111] border border-neutral-800 rounded-xl text-xs text-white focus:border-[#ab1f09] outline-none"
                />
              </div>

              <div className="space-y-2 border-t border-neutral-800 pt-4">
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">Restrict Invites to Domain</label>
                <input
                  type="text"
                  value={restrictDomain}
                  onChange={(e) => setRestrictDomain(e.target.value)}
                  placeholder="e.g. company.com (leave blank to allow any email)"
                  className="w-full px-4 py-2.5 bg-[#111111] border border-neutral-800 rounded-xl text-xs text-white focus:border-[#ab1f09] outline-none"
                />
              </div>

              <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
                <div>
                  <h4 className="text-xs font-semibold text-white">Manage Team</h4>
                  <p className="text-[11px] text-neutral-500">Invite teammates and adjust access roles</p>
                </div>
                <button
                  onClick={() => setShowMembersModal(true)}
                  className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-[#ab1f09] text-white text-xs font-mono rounded-xl cursor-pointer"
                >
                  Open →
                </button>
              </div>
            </div>



            {/* Rack Defaults */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0d0d0d] border border-neutral-800 space-y-6">
              <h3 className="text-sm font-mono text-[#fff7d3] uppercase">Rack Defaults</h3>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Default Visibility</h4>
                  <p className="text-[11px] text-neutral-500">Status applied when you create a new rack</p>
                </div>
                <select
                  value={defaultVisibility}
                  onChange={(e) => setDefaultVisibility(e.target.value as "draft" | "published")}
                  className="px-3 py-1.5 bg-[#111111] border border-neutral-800 rounded-lg text-xs font-mono text-white outline-none cursor-pointer"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
                <div>
                  <h4 className="text-xs font-semibold text-white">Default Voting Type</h4>
                  <p className="text-[11px] text-neutral-500">Whether new racks charge for votes by default</p>
                </div>
                <select
                  value={defaultVotingType}
                  onChange={(e) => setDefaultVotingType(e.target.value as "free" | "paid")}
                  className="px-3 py-1.5 bg-[#111111] border border-neutral-800 rounded-lg text-xs font-mono text-white outline-none cursor-pointer"
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
                <div>
                  <h4 className="text-xs font-semibold text-white">Auto-Close Racks</h4>
                  <p className="text-[11px] text-neutral-500">Automatically close a rack after this many days (0 = never)</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={autoCloseDays}
                    onChange={(e) => setAutoCloseDays(Number(e.target.value))}
                    className="w-16 px-3 py-1.5 bg-[#111111] border border-neutral-800 rounded-lg text-xs font-mono text-white outline-none text-right"
                  />
                  <span className="text-xs font-mono text-neutral-500">days</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
                <div>
                  <h4 className="text-xs font-semibold text-white">Require Email to Submit</h4>
                  <p className="text-[11px] text-neutral-500">Respondents must enter an email before submitting</p>
                </div>
                <button
                  onClick={() => setRequireEmailToSubmit(!requireEmailToSubmit)}
                  className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    requireEmailToSubmit ? "bg-[#ab1f09]" : "bg-neutral-800"
                  }`}
                >
                  <div
                    className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                      requireEmailToSubmit ? "translate-x-3.5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
                <div>
                  <h4 className="text-xs font-semibold text-white">Auto-Save Cloud Drafts</h4>
                  <p className="text-[11px] text-neutral-500">Automatically save every keystroke in Form Studio</p>
                </div>
                <button
                  onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                  className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    autoSaveEnabled ? "bg-[#ab1f09]" : "bg-neutral-800"
                  }`}
                >
                  <div
                    className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                      autoSaveEnabled ? "translate-x-3.5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0d0d0d] border border-neutral-800 space-y-6">
              <h3 className="text-sm font-mono text-[#fff7d3] uppercase">Notifications</h3>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">New Submission Emails</h4>
                  <p className="text-[11px] text-neutral-500">Get emailed every time a rack receives a response</p>
                </div>
                <button
                  onClick={() => setNotifyOnSubmission(!notifyOnSubmission)}
                  className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    notifyOnSubmission ? "bg-[#ab1f09]" : "bg-neutral-800"
                  }`}
                >
                  <div
                    className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                      notifyOnSubmission ? "translate-x-3.5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
                <div>
                  <h4 className="text-xs font-semibold text-white">Rack Closed Emails</h4>
                  <p className="text-[11px] text-neutral-500">Get notified when one of your racks closes</p>
                </div>
                <button
                  onClick={() => setNotifyOnClose(!notifyOnClose)}
                  className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    notifyOnClose ? "bg-[#ab1f09]" : "bg-neutral-800"
                  }`}
                >
                  <div
                    className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                      notifyOnClose ? "translate-x-3.5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
                <div>
                  <h4 className="text-xs font-semibold text-white">Weekly Summary</h4>
                  <p className="text-[11px] text-neutral-500">A digest of submissions and revenue every Monday</p>
                </div>
                <button
                  onClick={() => setWeeklySummary(!weeklySummary)}
                  className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    weeklySummary ? "bg-[#ab1f09]" : "bg-neutral-800"
                  }`}
                >
                  <div
                    className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                      weeklySummary ? "translate-x-3.5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0d0d0d] border border-red-900/40 space-y-6">
              <h3 className="text-sm font-mono text-red-400 uppercase">Danger Zone</h3>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Export Workspace Data</h4>
                  <p className="text-[11px] text-neutral-500">Download every rack and member as a JSON file</p>
                </div>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-[#ab1f09] text-white text-xs font-mono rounded-xl cursor-pointer"
                >
                  Export →
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-red-900/40 pt-4">
                <div>
                  <h4 className="text-xs font-semibold text-white">Delete Workspace</h4>
                  <p className="text-[11px] text-neutral-500">Permanently delete all racks. This cannot be undone</p>
                </div>
                <button
                  onClick={handleDeleteWorkspace}
                  className="px-4 py-2 bg-red-900/20 border border-red-900/50 hover:bg-red-900/40 text-red-400 text-xs font-mono rounded-xl cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: NOTIFICATIONS */}
        {/* ========================================================= */}
        {activeTab === "notifications" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Notifications</h1>
                <p className="text-xs text-neutral-400 mt-1">Real-time alerts for form activity and submissions.</p>
              </div>
              <button
                onClick={() => {
                  const token = localStorage.getItem("rack_token");
                  setNotifications(notifications.map((n) => ({ ...n, read: true })));
                  fetch(`${API_BASE}/api/notifications/read-all`, {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` },
                  }).catch((err) => console.error("Failed to mark notifications read", err));
                }}
                className="text-xs font-mono text-[#ab1f09] hover:underline cursor-pointer"
              >
                Mark All as Read
              </button>
            </div>

            <div className="space-y-3">
              {notifications.length === 0 && (
                <div className="p-10 text-center rounded-2xl border border-neutral-800 bg-[#0d0d0d] text-sm text-neutral-500 font-mono">
                  No notifications yet.
                </div>
              )}
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between ${
                    notif.read ? "bg-[#0d0d0d] border-neutral-800/80 text-neutral-400" : "bg-[#111111] border-[#ab1f09]/40 text-white"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-xs font-semibold">{notif.title}</div>
                    <div className="text-[11px] text-neutral-400">{notif.desc}</div>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 whitespace-nowrap">{notif.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: SECURITY */}
        {/* ========================================================= */}
        {activeTab === "security" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="border-b border-neutral-800 pb-6">
              <h1 className="text-2xl font-bold text-white">Security & Access</h1>
              <p className="text-xs text-neutral-400 mt-1">Manage authentication, 2FA, and active tokens.</p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-[#0d0d0d] border border-neutral-800 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-neutral-500">Require an authenticator code upon login</p>
                </div>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    twoFactorEnabled ? "bg-[#ab1f09]" : "bg-neutral-800"
                  }`}
                >
                  <div
                    className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                      twoFactorEnabled ? "translate-x-3.5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="border-t border-neutral-800 pt-4 space-y-3">
                <h4 className="text-xs font-semibold text-white">Active Session Token</h4>
                <div className="p-3 bg-black border border-neutral-800 rounded-xl font-mono text-[11px] text-neutral-400 truncate">
                  JWT_TOKEN_ACTIVE_09f8e4a938b8c199
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL: MANAGE TEAM MEMBERS */}
        {/* ========================================================= */}
        {showMembersModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Workspace Members</h3>
                  <p className="text-xs text-neutral-400">Invite teammates and adjust access roles.</p>
                </div>
                <button
                  onClick={() => setShowMembersModal(false)}
                  className="text-neutral-500 hover:text-white text-xs font-mono cursor-pointer"
                >
                  CLOSE ✕
                </button>
              </div>

              {/* Invite Form */}
              <form onSubmit={handleAddMember} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="flex-1 px-3.5 py-2 bg-[#111111] border border-neutral-800 rounded-xl text-xs text-white outline-none focus:border-[#ab1f09]"
                />
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as any)}
                  className="px-2.5 py-2 bg-[#111111] border border-neutral-800 rounded-xl text-xs font-mono text-white outline-none cursor-pointer"
                >
                  <option value="Editor">Editor</option>
                  <option value="Admin">Admin</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ab1f09] hover:bg-[#c2240b] text-[#fff7d3] font-mono text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Invite
                </button>
              </form>

              {/* Members List */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {members.map((m) => (
                  <div key={m.id} className="p-3 bg-[#111111] border border-neutral-800 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{m.name}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">{m.email}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-[#fff7d3] border border-neutral-800">
                        {m.role}
                      </span>
                      {members.length > 1 && (
                        <button
                          onClick={() => handleRemoveMember(m.id)}
                          className="text-neutral-500 hover:text-red-400 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL: SINGLE RACK BREAKDOWN */}
        {/* ========================================================= */}
        {selectedFormForAnalytics && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">{selectedFormForAnalytics.title}</h3>
                  <p className="text-xs text-neutral-400">Total Responses: {selectedFormForAnalytics.responses?.length || 0}</p>
                </div>
                <button
                  onClick={() => setSelectedFormForAnalytics(null)}
                  className="text-neutral-500 hover:text-white text-xs font-mono cursor-pointer"
                >
                  CLOSE ✕
                </button>
              </div>

              {/* Contestant Breakdown */}
              {selectedFormForAnalytics.questions.find((q) => q.type === "paid_voting") && (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono text-[#fff7d3] uppercase">Contestant Leaderboard</h4>
                  <div className="space-y-2">
                    {selectedFormForAnalytics.questions
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

              {/* Submissions List */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-neutral-400 uppercase">Submissions</h4>
                {selectedFormForAnalytics.responses?.length === 0 ? (
                  <div className="text-xs text-neutral-500 italic py-4">No submissions recorded yet.</div>
                ) : (
                  <div className="space-y-2">
                    {selectedFormForAnalytics.responses?.map((r) => (
                      <div key={r.id} className="p-3 bg-[#111111] border border-neutral-800 rounded-xl text-xs font-mono flex items-center justify-between">
                        <span className="text-white">{r.email || "Anonymous"}</span>
                        <span className="text-neutral-500">{r.submittedAt}</span>
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