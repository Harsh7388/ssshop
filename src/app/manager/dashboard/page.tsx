"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { 
  Check, 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  IndianRupee, 
  LogOut, 
  Scissors, 
  Search, 
  Filter, 
  AlertCircle, 
  Plus, 
  CalendarDays, 
  CheckCircle2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Coffee,
  Users,
  Timer,
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  RefreshCw,
  Bell,
  ArrowRight,
  ShieldAlert,
  Award
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const DEFAULT_STAFF = [
  "Rahul Sharma",
  "Priya Singh",
  "Amit Verma",
  "Sneha Patel",
  "Kunal Mehra"
];

function ManagerDashboardContent() {
  const [requests, setRequests] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab State
  const [activeTab, setActiveTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // New Request Alert & Audio State
  const [newRequestAlert, setNewRequestAlert] = useState<any>(null);
  const prevPendingCountRef = useRef<number>(-1);

  // Modal states for Request Action
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [actionType, setActionType] = useState<"ACCEPT" | "RESCHEDULE" | "REJECT">("ACCEPT");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [assignedStaff, setAssignedStaff] = useState("");
  const [managerNote, setManagerNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  // Block time modal state
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockDate, setBlockDate] = useState(new Date().toISOString().split("T")[0]);
  const [blockTime, setBlockTime] = useState("12:00 PM");
  const [blockTitle, setBlockTitle] = useState("Staff Break");

  // Calendar View state
  const [calendarViewMode, setCalendarViewMode] = useState<"TODAY" | "DAY" | "WEEK" | "MONTH">("TODAY");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // Analytics & Service Time Records State
  const [analyticsPeriod, setAnalyticsPeriod] = useState<"DAY" | "WEEK" | "MONTH">("DAY");
  const [selectedAnalyticsDate, setSelectedAnalyticsDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedAnalyticsMonth, setSelectedAnalyticsMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [analyticsStatusFilter, setAnalyticsStatusFilter] = useState("ALL");
  const [analyticsSearchTerm, setAnalyticsSearchTerm] = useState("");

  const [staffMembers, setStaffMembers] = useState<string[]>(DEFAULT_STAFF);

  const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM", "07:00 PM"];

  // Play pleasant notification chime when new request arrives
  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  const fetchManagerData = async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const res = await fetch("/api/manager/requests", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        const reqList = data.requests || [];
        setRequests(reqList);
        setSchedules(data.schedules || []);
        if (data.staff && data.staff.length > 0) {
          setStaffMembers(data.staff.map((s: any) => s.name));
        }

        // Check for new pending booking requests
        const currentPending = reqList.filter((r: any) => r.status === "REQUESTED");
        if (prevPendingCountRef.current !== -1 && currentPending.length > prevPendingCountRef.current) {
          const newest = currentPending[0];
          setNewRequestAlert(newest);
          playChime();
        }
        prevPendingCountRef.current = currentPending.length;
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Fetch manager data error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchManagerData();
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      if (tabParam === "calendar" || tabParam === "schedule") setActiveTab("calendar");
      else if (tabParam === "appointments") setActiveTab("appointments");
      else if (tabParam === "requests") setActiveTab("requests");
      else if (tabParam === "analytics" || tabParam === "records") setActiveTab("analytics");
    }

    // Auto-poll every 8 seconds for real-time manager request alerts
    const interval = setInterval(() => {
      fetchManagerData(true);
    }, 8000);

    return () => clearInterval(interval);
  }, [searchParams]);

  const openActionModal = (req: any, type: "ACCEPT" | "RESCHEDULE" | "REJECT") => {
    setSelectedRequest(req);
    setActionType(type);
    setNewDate(new Date(req.booking_date).toISOString().split("T")[0]);
    setNewTime(req.booking_time);
    setAssignedStaff(req.assigned_staff || staffMembers[0] || DEFAULT_STAFF[0]);
    setManagerNote(req.manager_note || "");
    setActionError("");
  };

  const handleExecuteAction = async () => {
    if (!selectedRequest) return;
    setActionLoading(true);
    setActionError("");

    try {
      const res = await fetch(`/api/manager/requests/${selectedRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType === "ACCEPT" ? "CONFIRM" : actionType,
          booking_date: newDate,
          booking_time: newTime,
          assigned_staff: assignedStaff,
          manager_note: managerNote,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Failed to update booking");

      setSelectedRequest(null);
      if (newRequestAlert?.id === selectedRequest.id) {
        setNewRequestAlert(null);
      }
      fetchManagerData();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickConfirm = async (req: any) => {
    try {
      const staffChoice = req.assigned_staff || staffMembers[0] || DEFAULT_STAFF[0];
      const res = await fetch(`/api/manager/requests/${req.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CONFIRM",
          assigned_staff: staffChoice,
          manager_note: "Quick-confirmed by Salon Manager"
        }),
      });
      if (res.ok) {
        if (newRequestAlert?.id === req.id) setNewRequestAlert(null);
        fetchManagerData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuickStatusChange = async (id: string, action: string) => {
    try {
      const res = await fetch(`/api/manager/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) fetchManagerData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddBlockTime = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/manager/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: blockDate,
          start_time: blockTime,
          title: blockTitle,
          availability: false,
        }),
      });
      if (res.ok) {
        setBlockModalOpen(false);
        fetchManagerData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    try {
      const res = await fetch(`/api/manager/schedule?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchManagerData();
    } catch (error) {
      console.error(error);
    }
  };

  // Filtered lists
  const pendingRequests = requests.filter((r) => r.status === "REQUESTED");
  const confirmedAppointments = requests.filter((r) => ["CONFIRMED", "SCHEDULED", "RESCHEDULED"].includes(r.status));
  const completedToday = requests.filter((r) => {
    if (r.status !== "COMPLETED") return false;
    const bDate = new Date(r.booking_date).toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];
    return bDate === today;
  });
  const revenueToday = completedToday.reduce((acc, r) => acc + (r.total_amount || 0), 0);

  // Search & Status filter for appointments tab
  const filteredAppointments = requests.filter((r) => {
    const userName = r.user?.name || "";
    const userPhone = r.user?.phone || "";
    const serviceName = r.service?.name || "";
    const bookingNum = r.booking_number || "";

    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userPhone.includes(searchTerm) ||
      serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookingNum.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calendar filtering
  const calendarDateBookings = requests.filter((r) => {
    const bDate = new Date(r.booking_date).toISOString().split("T")[0];
    return bDate === selectedCalendarDate && r.status !== "CANCELLED" && r.status !== "REJECTED";
  });

  const calendarDateBlocks = schedules.filter((s) => {
    const sDate = new Date(s.date).toISOString().split("T")[0];
    return sDate === selectedCalendarDate && !s.availability;
  });

  // -------------------------------------------------------------
  // Analytics & Service Records Computation (Day / Week / Month)
  // -------------------------------------------------------------
  const analyticsData = useMemo(() => {
    let startDate: Date;
    let endDate: Date;
    let label = "";

    if (analyticsPeriod === "DAY") {
      const parts = selectedAnalyticsDate.split("-").map(Number);
      startDate = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
      endDate = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999);
      label = startDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    } else if (analyticsPeriod === "WEEK") {
      const anchor = new Date(selectedAnalyticsDate);
      const dayOfWeek = anchor.getDay(); // 0 is Sunday
      // Start on Monday
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(anchor);
      monday.setDate(anchor.getDate() + diffToMonday);
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      startDate = monday;
      endDate = sunday;
      label = `Week of ${monday.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${sunday.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
    } else {
      // Month
      const [yearStr, monthStr] = selectedAnalyticsMonth.split("-");
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10) - 1;
      startDate = new Date(year, month, 1, 0, 0, 0, 0);
      endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
      label = startDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    }

    // Filter requests matching period
    const periodBookings = requests.filter((r) => {
      const bDate = new Date(r.booking_date).getTime();
      return bDate >= startDate.getTime() && bDate <= endDate.getTime();
    });

    // Unique users
    const uniqueUserIds = new Set<string>();
    periodBookings.forEach((b) => {
      if (b.user_id) uniqueUserIds.add(b.user_id);
      else if (b.user?.id) uniqueUserIds.add(b.user.id);
      else if (b.user?.phone) uniqueUserIds.add(b.user.phone);
    });

    // Service Time (Duration) calculation in minutes
    let totalServiceMinutes = 0;
    let completedRevenue = 0;
    let totalRevenue = 0;
    const slotCounts: Record<string, number> = {};
    const serviceMap: Record<string, { count: number; totalMinutes: number; revenue: number; duration: number }> = {};
    const staffMap: Record<string, { count: number; totalMinutes: number }> = {};

    periodBookings.forEach((b) => {
      const dur = b.service?.duration || 30;
      if (b.status !== "CANCELLED" && b.status !== "REJECTED") {
        totalServiceMinutes += dur;
      }
      totalRevenue += (b.total_amount || 0);
      if (b.status === "COMPLETED") {
        completedRevenue += (b.total_amount || 0);
      }

      // Slot count
      if (b.booking_time) {
        slotCounts[b.booking_time] = (slotCounts[b.booking_time] || 0) + 1;
      }

      // Service breakdown
      const sName = b.service?.name || "Other Service";
      if (!serviceMap[sName]) {
        serviceMap[sName] = { count: 0, totalMinutes: 0, revenue: 0, duration: dur };
      }
      serviceMap[sName].count += 1;
      serviceMap[sName].totalMinutes += dur;
      serviceMap[sName].revenue += (b.total_amount || 0);

      // Staff breakdown
      const staffName = b.assigned_staff || "Unassigned";
      if (!staffMap[staffName]) {
        staffMap[staffName] = { count: 0, totalMinutes: 0 };
      }
      staffMap[staffName].count += 1;
      staffMap[staffName].totalMinutes += dur;
    });

    // Busiest slot
    let busiestSlot = "None";
    let maxSlotCount = 0;
    Object.entries(slotCounts).forEach(([slot, count]) => {
      if (count > maxSlotCount) {
        maxSlotCount = count;
        busiestSlot = `${slot} (${count} bookings)`;
      }
    });

    // Daily breakdown for Week or Month view
    const daysList: { dateStr: string; label: string; usersCount: number; bookingsCount: number; serviceMinutes: number; revenue: number }[] = [];
    if (analyticsPeriod === "WEEK" || analyticsPeriod === "MONTH") {
      const cur = new Date(startDate);
      while (cur <= endDate) {
        const dStr = cur.toISOString().split("T")[0];
        const dayBookings = periodBookings.filter(b => new Date(b.booking_date).toISOString().split("T")[0] === dStr);
        const dayUsers = new Set(dayBookings.map(b => b.user_id || b.user?.id || b.user?.phone)).size;
        const dayMins = dayBookings.reduce((sum, b) => b.status !== "CANCELLED" && b.status !== "REJECTED" ? sum + (b.service?.duration || 30) : sum, 0);
        const dayRev = dayBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);

        daysList.push({
          dateStr: dStr,
          label: cur.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: analyticsPeriod === "MONTH" ? "short" : undefined }),
          usersCount: dayUsers,
          bookingsCount: dayBookings.length,
          serviceMinutes: dayMins,
          revenue: dayRev,
        });

        cur.setDate(cur.getDate() + 1);
      }
    }

    return {
      startDate,
      endDate,
      label,
      totalUsers: uniqueUserIds.size,
      totalBookings: periodBookings.length,
      completedCount: periodBookings.filter(b => b.status === "COMPLETED").length,
      confirmedCount: periodBookings.filter(b => ["CONFIRMED", "SCHEDULED", "RESCHEDULED"].includes(b.status)).length,
      requestedCount: periodBookings.filter(b => b.status === "REQUESTED").length,
      cancelledCount: periodBookings.filter(b => ["CANCELLED", "REJECTED"].includes(b.status)).length,
      totalServiceMinutes,
      totalRevenue,
      completedRevenue,
      avgDuration: periodBookings.length > 0 ? Math.round(totalServiceMinutes / Math.max(1, periodBookings.length)) : 0,
      busiestSlot,
      serviceMap,
      staffMap,
      daysList,
      periodBookings
    };
  }, [requests, analyticsPeriod, selectedAnalyticsDate, selectedAnalyticsMonth]);

  // Format minutes into hours & mins
  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    if (hours === 0) return `${m} mins`;
    if (m === 0) return `${hours} hrs`;
    return `${hours}h ${m}m`;
  };

  // Filtered service records table in Analytics Tab
  const filteredAnalyticsRecords = useMemo(() => {
    return analyticsData.periodBookings.filter((b) => {
      const userName = b.user?.name || "";
      const userPhone = b.user?.phone || "";
      const serviceName = b.service?.name || "";
      const staffName = b.assigned_staff || "";

      const matchesSearch =
        userName.toLowerCase().includes(analyticsSearchTerm.toLowerCase()) ||
        userPhone.includes(analyticsSearchTerm) ||
        serviceName.toLowerCase().includes(analyticsSearchTerm.toLowerCase()) ||
        staffName.toLowerCase().includes(analyticsSearchTerm.toLowerCase());

      const matchesStatus = analyticsStatusFilter === "ALL" || b.status === analyticsStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [analyticsData.periodBookings, analyticsSearchTerm, analyticsStatusFilter]);

  // Export Analytics Service Records as CSV
  const handleExportCSV = () => {
    if (filteredAnalyticsRecords.length === 0) {
      alert("No service records available to export for the selected period.");
      return;
    }

    const headers = [
      "Booking ID",
      "Date",
      "Time Slot",
      "Customer Name",
      "Customer Phone",
      "Service Name",
      "Duration (mins)",
      "Assigned Staff",
      "Status",
      "Total Amount (INR)",
      "Payment Preference"
    ];

    const rows = filteredAnalyticsRecords.map((b) => [
      `"${b.booking_number}"`,
      `"${new Date(b.booking_date).toLocaleDateString("en-IN")}"`,
      `"${b.booking_time}"`,
      `"${(b.user?.name || "").replace(/"/g, '""')}"`,
      `"${b.user?.phone || ""}"`,
      `"${(b.service?.name || "").replace(/"/g, '""')}"`,
      b.service?.duration || 30,
      `"${b.assigned_staff || "Unassigned"}"`,
      `"${b.status}"`,
      b.total_amount || 0,
      `"${b.payment_preference || "PAY_AFTER_SERVICE"}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SS_Salon_Service_Records_${analyticsPeriod}_${selectedAnalyticsDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Badge Renderer
  const renderBadge = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300">🟡 Requested</span>;
      case "SCHEDULED":
      case "RESCHEDULED":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-300">🔵 Scheduled</span>;
      case "CONFIRMED":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">🟢 Confirmed</span>;
      case "COMPLETED":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800 border border-purple-300">🟣 Completed</span>;
      case "REJECTED":
      case "CANCELLED":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800 border border-rose-300">🔴 {status}</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="container py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted font-medium">Loading Service Manager Portal & Records...</p>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in max-w-7xl">
      {/* Real-time Notification Banner for Incoming Request */}
      {newRequestAlert && (
        <div className="mb-6 p-4 bg-amber-500/15 border-2 border-amber-500 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg animate-bounce-short">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Bell size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                🔔 New Appointment Request Received Just Now!
              </div>
              <div className="text-base font-bold text-secondary">
                #{newRequestAlert.booking_number} — {newRequestAlert.service?.name} for{" "}
                <span className="text-primary">{newRequestAlert.user?.name}</span> on{" "}
                {new Date(newRequestAlert.booking_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} at {newRequestAlert.booking_time}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveTab("requests");
                openActionModal(newRequestAlert, "ACCEPT");
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all"
            >
              <Check size={15} /> Review & Confirm
            </button>
            <button
              onClick={() => setNewRequestAlert(null)}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-bold transition-all"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Top Operations Banner */}
      <div className="bg-secondary text-white rounded-2xl p-8 mb-8 shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-gray-800">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-wider mb-2">
            <Scissors size={16} /> Service Manager Operations
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">
            Salon Operations, Scheduling & Analytics
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl">
            Accept, reschedule, or decline appointment requests, monitor stylist schedules, and inspect day-wise, week-wise, and month-wise service time records.
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap gap-3 shrink-0">
          <button
            onClick={() => fetchManagerData()}
            disabled={refreshing}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
            title="Refresh latest requests and records"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin text-primary" : ""} />
            {refreshing ? "Updating..." : "Live Refresh"}
          </button>
          <button
            onClick={() => setBlockModalOpen(true)}
            className="btn-primary flex items-center gap-2 text-xs shadow-md py-2.5 px-4"
          >
            <Plus size={15} /> Block Time / Add Break
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div 
          onClick={() => setActiveTab("requests")}
          className={`card p-6 bg-surface border transition-all shadow-sm cursor-pointer ${
            activeTab === "requests" ? "border-amber-500 ring-2 ring-amber-500/20" : "border-border hover:border-amber-400"
          }`}
        >
          <div className="text-muted text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Pending Requests</span>
            <AlertCircle size={18} className="text-amber-500" />
          </div>
          <div className="text-3xl font-serif font-bold text-amber-600">{pendingRequests.length}</div>
          <div className="text-xs text-muted mt-1">
            {pendingRequests.length > 0 ? "Requires accept / reschedule" : "All requests handled"}
          </div>
        </div>

        <div 
          onClick={() => setActiveTab("appointments")}
          className={`card p-6 bg-surface border transition-all shadow-sm cursor-pointer ${
            activeTab === "appointments" ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-border hover:border-emerald-400"
          }`}
        >
          <div className="text-muted text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Confirmed Appointments</span>
            <CalendarDays size={18} className="text-emerald-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-600">{confirmedAppointments.length}</div>
          <div className="text-xs text-muted mt-1">Active customer bookings</div>
        </div>

        <div 
          onClick={() => setActiveTab("analytics")}
          className={`card p-6 bg-surface border transition-all shadow-sm cursor-pointer ${
            activeTab === "analytics" ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary"
          }`}
        >
          <div className="text-muted text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Service Time (Today)</span>
            <Timer size={18} className="text-primary" />
          </div>
          <div className="text-3xl font-serif font-bold text-secondary">
            {formatDuration(completedToday.reduce((acc, r) => acc + (r.service?.duration || 30), 0))}
          </div>
          <div className="text-xs text-muted mt-1">{completedToday.length} services completed today</div>
        </div>

        <div className="card p-6 bg-surface border border-border hover:border-primary/40 transition-all shadow-sm">
          <div className="text-muted text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Revenue Completed</span>
            <IndianRupee size={18} className="text-primary" />
          </div>
          <div className="text-3xl font-serif font-bold text-secondary">₹{revenueToday}</div>
          <div className="text-xs text-muted mt-1">Earned from today's services</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border mb-8 gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("requests")}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === "requests" ? "border-primary text-primary" : "border-transparent text-muted hover:text-secondary"
          }`}
        >
          📋 Booking Requests
          {pendingRequests.length > 0 && (
            <span className="bg-amber-500 text-white text-[11px] px-2 py-0.5 rounded-full font-bold animate-pulse">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("calendar")}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === "calendar" ? "border-primary text-primary" : "border-transparent text-muted hover:text-secondary"
          }`}
        >
          📅 Schedule & Calendar
        </button>

        <button
          onClick={() => setActiveTab("appointments")}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === "appointments" ? "border-primary text-primary" : "border-transparent text-muted hover:text-secondary"
          }`}
        >
          ✂️ All Appointments ({requests.length})
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === "analytics" ? "border-primary text-primary" : "border-transparent text-muted hover:text-secondary"
          }`}
        >
          📊 User & Service Time Records
          <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">
            Day / Week / Month
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: NEW BOOKING REQUESTS (ACCEPT / RESCHEDULE / REJECT) */}
      {/* ======================================================== */}
      {activeTab === "requests" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
            <div>
              <h2 className="text-2xl font-serif text-secondary flex items-center gap-2">
                <AlertCircle size={22} className="text-amber-500" /> Pending Booking Requests ({pendingRequests.length})
              </h2>
              <p className="text-xs text-muted mt-1">
                Appointments submitted by customers awaiting manager approval, time slot confirmation, or staff assignment.
              </p>
            </div>
            <div className="text-xs text-gray-500">
              Auto-refreshes live • Last sync: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="card text-center p-12 text-muted bg-surface border border-border">
              <CheckCircle2 size={48} className="mx-auto mb-3 text-emerald-500" />
              <h3 className="text-xl font-bold mb-1 text-secondary">All Caught Up!</h3>
              <p className="text-sm">There are no pending booking requests right now. New requests will appear here instantly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="card p-6 bg-surface border-l-4 border-l-amber-500 border-t border-r border-b border-border shadow-md rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-lg transition-all"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-serif font-bold text-2xl text-secondary">{req.service?.name || "Salon Service"}</span>
                      {renderBadge(req.status)}
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                        #{req.booking_number}
                      </span>
                      <span className="text-xs text-gray-400">
                        Requested on {new Date(req.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700 my-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div>
                        <span className="text-xs text-muted block uppercase font-bold">Customer Name</span>
                        <strong className="text-secondary">{req.user?.name || "Customer"}</strong>
                      </div>
                      <div>
                        <span className="text-xs text-muted block uppercase font-bold">Phone Number</span>
                        <a href={`tel:${req.user?.phone || ""}`} className="text-primary font-bold hover:underline">
                          📞 {req.user?.phone || "N/A"}
                        </a>
                      </div>
                      <div>
                        <span className="text-xs text-muted block uppercase font-bold">Requested Slot</span>
                        <strong className="text-secondary">
                          {new Date(req.booking_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })} at {req.booking_time}
                        </strong>
                      </div>
                      <div>
                        <span className="text-xs text-muted block uppercase font-bold">Service Price</span>
                        <span className="text-primary font-bold">₹{req.total_amount}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted block uppercase font-bold">Service Duration</span>
                        <span>{req.service?.duration || 30} minutes</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted block uppercase font-bold">Payment Preference</span>
                        <span>{req.payment_preference === "PAY_NOW" ? "Paid Online" : "Pay After Service (Cash/UPI)"}</span>
                      </div>
                    </div>

                    {req.notes && (
                      <p className="text-xs text-gray-700 bg-amber-50 p-2.5 rounded border border-amber-200">
                        <strong>Customer Note:</strong> {req.notes}
                      </p>
                    )}
                  </div>

                  {/* Manager Action Buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "190px", flexShrink: 0 }}>
                    <button
                      onClick={() => handleQuickConfirm(req)}
                      style={{ background: "#059669", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 14px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", boxShadow: "0 2px 8px rgba(5,150,105,0.25)", transition: "all 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#047857")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#059669")}
                    >
                      <Check size={15} /> Quick Accept & Confirm
                    </button>
                    <button
                      onClick={() => openActionModal(req, "ACCEPT")}
                      style={{ background: "#1f2937", color: "#fff", border: "none", borderRadius: "8px", padding: "9px 14px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "all 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#111827")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#1f2937")}
                    >
                      <Scissors size={14} /> Assign Stylist & Schedule
                    </button>
                    <button
                      onClick={() => openActionModal(req, "RESCHEDULE")}
                      style={{ background: "#fff", color: "#121315", border: "2px solid #d1d5db", borderRadius: "8px", padding: "8px 14px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "all 0.2s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#c19d60"; (e.currentTarget as HTMLElement).style.color = "#c19d60"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#d1d5db"; (e.currentTarget as HTMLElement).style.color = "#121315"; }}
                    >
                      <Calendar size={14} /> Reschedule Date/Time
                    </button>
                    <button
                      onClick={() => openActionModal(req, "REJECT")}
                      style={{ background: "#fef2f2", color: "#dc2626", border: "2px solid #fecaca", borderRadius: "8px", padding: "8px 14px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "all 0.2s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#fee2e2"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fef2f2"; }}
                    >
                      <X size={14} /> Reject Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MANAGER SCHEDULE & CALENDAR                       */}
      {/* ======================================================== */}
      {activeTab === "calendar" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface p-6 rounded-xl border border-border shadow-sm">
            <div>
              <h2 className="text-2xl font-serif text-secondary flex items-center gap-2">
                <Calendar size={22} className="text-primary" /> Manager Salon Schedule & Calendar
              </h2>
              <p className="text-xs text-muted mt-1">
                View occupied appointment slots, assign staff, and block unavailable time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200">
                <input
                  type="date"
                  value={selectedCalendarDate}
                  onChange={(e) => setSelectedCalendarDate(e.target.value)}
                  className="bg-transparent text-xs font-semibold px-2 py-1 outline-none text-secondary"
                />
              </div>
            </div>
          </div>

          {/* Time Slots Grid for Selected Day */}
          <div className="card p-6 bg-surface border border-border shadow-md rounded-xl">
            <h3 className="text-lg font-serif font-bold text-secondary mb-4 flex items-center justify-between">
              <span>
                Schedule for {new Date(selectedCalendarDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="text-xs font-normal text-muted">
                {calendarDateBookings.length} booking(s) • {calendarDateBlocks.length} break(s)
              </span>
            </h3>

            <div className="space-y-3">
              {timeSlots.map((slot) => {
                const bookingInSlot = calendarDateBookings.find((b) => b.booking_time === slot);
                const blockInSlot = calendarDateBlocks.find((s) => s.start_time === slot);

                return (
                  <div
                    key={slot}
                    className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                      bookingInSlot
                        ? "bg-emerald-50/60 border-emerald-300"
                        : blockInSlot
                        ? "bg-rose-50 border-rose-200"
                        : "bg-gray-50/50 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-[140px]">
                      <span className="font-mono font-bold text-base text-secondary bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
                        {slot}
                      </span>
                    </div>

                    <div className="flex-1">
                      {bookingInSlot ? (
                        <div className="flex flex-wrap items-center gap-3">
                          <strong className="text-lg text-secondary font-serif">{bookingInSlot.service?.name}</strong>
                          <span className="text-xs font-bold bg-white text-emerald-800 px-2.5 py-1 rounded border border-emerald-200">
                            👤 Customer: {bookingInSlot.user?.name || "Customer"} ({bookingInSlot.user?.phone || "No phone"})
                          </span>
                          <span className="text-xs font-bold bg-primary/15 text-secondary px-2.5 py-1 rounded border border-primary/30">
                            ✂️ Stylist: {bookingInSlot.assigned_staff || "Unassigned"}
                          </span>
                          <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                            ⏱️ {bookingInSlot.service?.duration || 30} mins
                          </span>
                          {renderBadge(bookingInSlot.status)}
                        </div>
                      ) : blockInSlot ? (
                        <div className="flex items-center gap-3 text-rose-800 font-semibold text-sm">
                          <Coffee size={18} />
                          <span>Unavailable / Blocked ({blockInSlot.title || "Break Time"})</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium italic">Available Slot — Ready for Booking</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {bookingInSlot && (
                        <>
                          {bookingInSlot.status !== "COMPLETED" && (
                            <button
                              onClick={() => handleQuickStatusChange(bookingInSlot.id, "COMPLETE")}
                              className="btn-primary text-xs py-1.5 px-3 bg-purple-600 hover:bg-purple-700 border-purple-600"
                            >
                              Mark Completed
                            </button>
                          )}
                          <button
                            onClick={() => openActionModal(bookingInSlot, "RESCHEDULE")}
                            className="btn-secondary text-xs py-1.5 px-3"
                          >
                            Reschedule
                          </button>
                        </>
                      )}

                      {blockInSlot && (
                        <button
                          onClick={() => handleDeleteBlock(blockInSlot.id)}
                          className="btn-secondary text-red-600 border-red-200 text-xs py-1.5 px-3"
                        >
                          Unblock Slot
                        </button>
                      )}

                      {!bookingInSlot && !blockInSlot && (
                        <button
                          onClick={() => {
                            setBlockDate(selectedCalendarDate);
                            setBlockTime(slot);
                            setBlockModalOpen(true);
                          }}
                          className="btn-secondary text-xs py-1.5 px-3"
                        >
                          Block Slot
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ALL APPOINTMENTS TABLE                            */}
      {/* ======================================================== */}
      {activeTab === "appointments" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-serif text-secondary flex items-center gap-2">
                <Scissors size={22} className="text-primary" /> All Salon Appointments ({filteredAppointments.length})
              </h2>
              <p className="text-xs text-muted mt-1">Complete history of all customer appointments across all statuses.</p>
            </div>

            {/* Search & Status Filters */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customer, phone, service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input text-xs pl-9 py-2"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input text-xs py-2 w-auto"
              >
                <option value="ALL">All Statuses</option>
                <option value="REQUESTED">Requested</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="card p-0 overflow-hidden bg-surface border border-border shadow-md rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-border text-xs uppercase font-bold text-gray-600">
                    <th className="py-3.5 px-4">Ref ID</th>
                    <th className="py-3.5 px-4">Customer Details</th>
                    <th className="py-3.5 px-4">Service & Duration</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Assigned Staff</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-muted">
                        No appointments found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-xs text-secondary">
                          {b.booking_number}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-secondary">{b.user?.name || "Customer"}</div>
                          <a href={`tel:${b.user?.phone || ""}`} className="text-xs text-primary hover:underline">
                            📞 {b.user?.phone || "N/A"}
                          </a>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-secondary">
                          {b.service?.name || "Service"}
                          <div className="text-xs font-normal text-muted flex items-center gap-2">
                            <span>₹{b.total_amount}</span>
                            <span>•</span>
                            <span>{b.service?.duration || 30} mins</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-xs">
                            {new Date(b.booking_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                          <span className="text-xs font-bold text-primary">{b.booking_time}</span>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-gray-700">
                          {b.assigned_staff || <span className="text-gray-400 font-normal italic">Unassigned</span>}
                        </td>
                        <td className="py-3.5 px-4">{renderBadge(b.status)}</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            {b.status === "REQUESTED" && (
                              <button
                                onClick={() => openActionModal(b, "ACCEPT")}
                                className="btn-primary text-xs py-1 px-3 bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                              >
                                Accept
                              </button>
                            )}
                            {["CONFIRMED", "SCHEDULED", "RESCHEDULED"].includes(b.status) && (
                              <button
                                onClick={() => handleQuickStatusChange(b.id, "COMPLETE")}
                                className="btn-primary text-xs py-1 px-3 bg-purple-600 hover:bg-purple-700 border-purple-600"
                              >
                                Complete
                              </button>
                            )}
                            <button
                              onClick={() => openActionModal(b, "RESCHEDULE")}
                              className="btn-secondary text-xs py-1 px-3"
                            >
                              Edit / Reschedule
                            </button>
                          </div>
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

      {/* ======================================================== */}
      {/* TAB 4: USER & SERVICE TIME RECORDS (DAY / WEEK / MONTH)   */}
      {/* ======================================================== */}
      {activeTab === "analytics" && (
        <div className="space-y-8 animate-fade-in">
          {/* Controls Bar: Period Toggle & Date Selector */}
          <div className="card p-6 bg-surface border border-border shadow-md rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                <BarChart3 size={16} /> Operational Intelligence
              </div>
              <h2 className="text-2xl font-serif text-secondary">
                User & Service Time Records
              </h2>
              <p className="text-xs text-muted">
                Showing analytics and service duration logs for: <strong className="text-secondary">{analyticsData.label}</strong>
              </p>
            </div>

            {/* Time Period Switches */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Day / Week / Month Pill Selector */}
              <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => setAnalyticsPeriod("DAY")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    analyticsPeriod === "DAY" ? "bg-white text-secondary shadow-sm" : "text-gray-500 hover:text-secondary"
                  }`}
                >
                  📅 Day-Wise
                </button>
                <button
                  onClick={() => setAnalyticsPeriod("WEEK")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    analyticsPeriod === "WEEK" ? "bg-white text-secondary shadow-sm" : "text-gray-500 hover:text-secondary"
                  }`}
                >
                  📆 Week-Wise
                </button>
                <button
                  onClick={() => setAnalyticsPeriod("MONTH")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    analyticsPeriod === "MONTH" ? "bg-white text-secondary shadow-sm" : "text-gray-500 hover:text-secondary"
                  }`}
                >
                  🗓️ Month-Wise
                </button>
              </div>

              {/* Dynamic Date/Month Selector */}
              {analyticsPeriod !== "MONTH" ? (
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1">
                  <button
                    onClick={() => {
                      const d = new Date(selectedAnalyticsDate);
                      d.setDate(d.getDate() - (analyticsPeriod === "WEEK" ? 7 : 1));
                      setSelectedAnalyticsDate(d.toISOString().split("T")[0]);
                    }}
                    className="p-1 hover:bg-gray-200 rounded text-gray-600"
                    title="Previous"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <input
                    type="date"
                    value={selectedAnalyticsDate}
                    onChange={(e) => setSelectedAnalyticsDate(e.target.value)}
                    className="bg-transparent text-xs font-semibold px-2 py-1 outline-none text-secondary"
                  />
                  <button
                    onClick={() => {
                      const d = new Date(selectedAnalyticsDate);
                      d.setDate(d.getDate() + (analyticsPeriod === "WEEK" ? 7 : 1));
                      setSelectedAnalyticsDate(d.toISOString().split("T")[0]);
                    }}
                    className="p-1 hover:bg-gray-200 rounded text-gray-600"
                    title="Next"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedAnalyticsDate(new Date().toISOString().split("T")[0])}
                    className="text-[11px] text-primary font-bold hover:underline px-1"
                  >
                    Today
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1">
                  <input
                    type="month"
                    value={selectedAnalyticsMonth}
                    onChange={(e) => setSelectedAnalyticsMonth(e.target.value)}
                    className="bg-transparent text-xs font-semibold px-2 py-1 outline-none text-secondary"
                  />
                  <button
                    onClick={() => setSelectedAnalyticsMonth(new Date().toISOString().slice(0, 7))}
                    className="text-[11px] text-primary font-bold hover:underline px-1"
                  >
                    Current
                  </button>
                </div>
              )}

              {/* Action Buttons: Export CSV & Print */}
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 bg-secondary hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow transition-all"
                title="Download CSV report"
              >
                <Download size={14} /> Export CSV
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                title="Print service records"
              >
                <Printer size={14} /> Print
              </button>
            </div>
          </div>

          {/* 6 Key Performance Metrics for Selected Period */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Metric 1: Total Users */}
            <div className="card p-5 bg-surface border border-border shadow-sm rounded-xl">
              <div className="flex items-center justify-between text-muted text-xs font-bold uppercase mb-1">
                <span>Total Users</span>
                <Users size={16} className="text-blue-500" />
              </div>
              <div className="text-2xl font-serif font-bold text-secondary">
                {analyticsData.totalUsers}
              </div>
              <div className="text-[11px] text-muted mt-1">Unique customer profiles</div>
            </div>

            {/* Metric 2: Total Service Time */}
            <div className="card p-5 bg-surface border border-primary/30 shadow-sm rounded-xl bg-gradient-to-br from-amber-500/5 to-transparent">
              <div className="flex items-center justify-between text-muted text-xs font-bold uppercase mb-1">
                <span>Service Time</span>
                <Timer size={16} className="text-primary" />
              </div>
              <div className="text-2xl font-serif font-bold text-primary">
                {formatDuration(analyticsData.totalServiceMinutes)}
              </div>
              <div className="text-[11px] text-muted mt-1">{analyticsData.totalServiceMinutes} total minutes</div>
            </div>

            {/* Metric 3: Total Appointments */}
            <div className="card p-5 bg-surface border border-border shadow-sm rounded-xl">
              <div className="flex items-center justify-between text-muted text-xs font-bold uppercase mb-1">
                <span>Appointments</span>
                <Scissors size={16} className="text-purple-500" />
              </div>
              <div className="text-2xl font-serif font-bold text-secondary">
                {analyticsData.totalBookings}
              </div>
              <div className="text-[11px] text-muted mt-1">
                {analyticsData.completedCount} completed • {analyticsData.confirmedCount} confirmed
              </div>
            </div>

            {/* Metric 4: Avg Service Duration */}
            <div className="card p-5 bg-surface border border-border shadow-sm rounded-xl">
              <div className="flex items-center justify-between text-muted text-xs font-bold uppercase mb-1">
                <span>Avg Duration</span>
                <Clock size={16} className="text-amber-500" />
              </div>
              <div className="text-2xl font-serif font-bold text-secondary">
                {analyticsData.avgDuration} <span className="text-xs font-normal">mins</span>
              </div>
              <div className="text-[11px] text-muted mt-1">Per appointment</div>
            </div>

            {/* Metric 5: Revenue */}
            <div className="card p-5 bg-surface border border-border shadow-sm rounded-xl">
              <div className="flex items-center justify-between text-muted text-xs font-bold uppercase mb-1">
                <span>Revenue</span>
                <IndianRupee size={16} className="text-emerald-500" />
              </div>
              <div className="text-2xl font-serif font-bold text-emerald-600">
                ₹{analyticsData.totalRevenue}
              </div>
              <div className="text-[11px] text-muted mt-1">₹{analyticsData.completedRevenue} paid</div>
            </div>

            {/* Metric 6: Peak Slot */}
            <div className="card p-5 bg-surface border border-border shadow-sm rounded-xl">
              <div className="flex items-center justify-between text-muted text-xs font-bold uppercase mb-1">
                <span>Peak Slot</span>
                <TrendingUp size={16} className="text-indigo-500" />
              </div>
              <div className="text-sm font-bold text-secondary truncate mt-1">
                {analyticsData.busiestSlot}
              </div>
              <div className="text-[11px] text-muted mt-1">Most requested slot</div>
            </div>
          </div>

          {/* Time Series Breakdown: Day-by-Day (if Week/Month) or Time Slot Breakdown (if Day) */}
          {analyticsPeriod !== "DAY" && analyticsData.daysList.length > 0 && (
            <div className="card p-6 bg-surface border border-border shadow-md rounded-2xl">
              <h3 className="text-lg font-serif font-bold text-secondary mb-4 flex items-center justify-between">
                <span>Daily Service Time & Customer Distribution ({analyticsPeriod === "WEEK" ? "7 Days" : "Monthly"})</span>
                <span className="text-xs text-muted font-normal">Values represent service time and unique users per day</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {analyticsData.daysList.map((day) => {
                  const hasActivity = day.bookingsCount > 0;
                  return (
                    <div
                      key={day.dateStr}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        hasActivity
                          ? "bg-primary/5 border-primary/30 shadow-sm"
                          : "bg-gray-50/50 border-gray-200 opacity-60"
                      }`}
                    >
                      <div className="text-xs font-bold text-secondary mb-1">{day.label}</div>
                      <div className="text-xl font-serif font-bold text-primary my-1">
                        {formatDuration(day.serviceMinutes)}
                      </div>
                      <div className="text-[11px] text-gray-600 flex items-center justify-center gap-1">
                        <Users size={12} /> {day.usersCount} users • {day.bookingsCount} svcs
                      </div>
                      <div className="text-[11px] font-bold text-emerald-700 mt-1">
                        ₹{day.revenue}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dual Breakdowns: Service Category & Staff Service Time */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Service Time Breakdown per Service */}
            <div className="card p-6 bg-surface border border-border shadow-md rounded-2xl">
              <h3 className="text-lg font-serif font-bold text-secondary mb-4 flex items-center gap-2">
                <Scissors size={18} className="text-primary" /> Service Breakdown & Chair Time
              </h3>
              {Object.keys(analyticsData.serviceMap).length === 0 ? (
                <div className="text-center py-8 text-muted text-sm">No services recorded in this period.</div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(analyticsData.serviceMap).map(([sName, sData]) => {
                    const pct = analyticsData.totalServiceMinutes > 0
                      ? Math.round((sData.totalMinutes / analyticsData.totalServiceMinutes) * 100)
                      : 0;
                    return (
                      <div key={sName} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="flex justify-between items-center mb-1 text-xs">
                          <strong className="text-secondary font-serif text-sm">{sName}</strong>
                          <span className="font-bold text-primary">{formatDuration(sData.totalMinutes)} ({pct}%)</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(5, pct)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-500">
                          <span>{sData.count} booking(s) • {sData.duration} min avg</span>
                          <span className="font-semibold text-secondary">₹{sData.revenue} earned</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Staff Service Hours Leaderboard */}
            <div className="card p-6 bg-surface border border-border shadow-md rounded-2xl">
              <h3 className="text-lg font-serif font-bold text-secondary mb-4 flex items-center gap-2">
                <Award size={18} className="text-primary" /> Stylist & Staff Service Time
              </h3>
              {Object.keys(analyticsData.staffMap).length === 0 ? (
                <div className="text-center py-8 text-muted text-sm">No staff assignments recorded in this period.</div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(analyticsData.staffMap).map(([stName, stData]) => {
                    return (
                      <div key={stName} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                            {stName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-secondary">{stName}</div>
                            <div className="text-[11px] text-muted">{stData.count} appointment(s) handled</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary text-sm">{formatDuration(stData.totalMinutes)}</div>
                          <div className="text-[11px] text-gray-400">Total time on services</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Complete Service Records Table for Period */}
          <div className="card p-6 bg-surface border border-border shadow-md rounded-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-secondary flex items-center gap-2">
                  <CalendarDays size={18} className="text-primary" /> Service Time Records Log ({filteredAnalyticsRecords.length})
                </h3>
                <p className="text-xs text-muted">
                  Every user, service duration, and stylist record within the selected period.
                </p>
              </div>

              {/* In-table Search and Filter */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-56">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search user, service, stylist..."
                    value={analyticsSearchTerm}
                    onChange={(e) => setAnalyticsSearchTerm(e.target.value)}
                    className="form-input text-xs pl-8 py-1.5"
                  />
                </div>

                <select
                  value={analyticsStatusFilter}
                  onChange={(e) => setAnalyticsStatusFilter(e.target.value)}
                  className="form-input text-xs py-1.5 w-auto"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="REQUESTED">Requested</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-border text-xs uppercase font-bold text-gray-600">
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Date & Time Slot</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Service Time</th>
                    <th className="py-3 px-4">Assigned Stylist</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {filteredAnalyticsRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-muted">
                        No service records found for the selected filter and period.
                      </td>
                    </tr>
                  ) : (
                    filteredAnalyticsRecords.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-secondary">
                          {b.booking_number}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-secondary">
                            {new Date(b.booking_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                          <span className="text-primary font-bold">{b.booking_time}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-secondary">{b.user?.name || "Customer"}</div>
                          <a href={`tel:${b.user?.phone || ""}`} className="text-gray-500 hover:text-primary">
                            📞 {b.user?.phone || "N/A"}
                          </a>
                        </td>
                        <td className="py-3 px-4 font-semibold text-secondary">
                          {b.service?.name || "Service"}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded font-bold">
                            ⏱️ {b.service?.duration || 30} mins
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-700">
                          {b.assigned_staff || <span className="text-gray-400 italic">Unassigned</span>}
                        </td>
                        <td className="py-3 px-4 font-bold text-secondary">
                          ₹{b.total_amount}
                        </td>
                        <td className="py-3 px-4">
                          {renderBadge(b.status)}
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

      {/* ======================================================== */}
      {/* MANAGER ACCEPT / RESCHEDULE / REJECT MODAL               */}
      {/* ======================================================== */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-secondary p-1"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-serif text-secondary mb-1">
              {actionType === "ACCEPT"
                ? "Accept & Confirm Booking"
                : actionType === "RESCHEDULE"
                ? "Reschedule Appointment"
                : "Decline Booking Request"}
            </h3>
            <p className="text-xs text-muted mb-6">
              Ref ID: <span className="font-mono font-bold text-secondary">#{selectedRequest.booking_number}</span>
            </p>

            {actionError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-xs mb-4">
                {actionError}
              </div>
            )}

            {/* Customer & Service Summary Box */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted">Customer Name:</span>
                <strong className="text-secondary">{selectedRequest.user?.name || "Customer"}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Phone Number:</span>
                <strong className="text-primary">{selectedRequest.user?.phone || "N/A"}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Service & Duration:</span>
                <strong className="text-secondary">{selectedRequest.service?.name} ({selectedRequest.service?.duration || 30} mins)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Service Price:</span>
                <strong className="text-emerald-700">₹{selectedRequest.total_amount}</strong>
              </div>
              {selectedRequest.notes && (
                <div className="pt-1 border-t border-gray-200 text-amber-900">
                  <span className="text-muted block font-semibold">Customer Note:</span>
                  {selectedRequest.notes}
                </div>
              )}
            </div>

            {actionType !== "REJECT" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group mb-0">
                    <label className="form-label text-xs">Appointment Date</label>
                    <input
                      type="date"
                      className="form-input text-xs"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-0">
                    <label className="form-label text-xs">Available Time Slot</label>
                    <select
                      className="form-input text-xs"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                    >
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group mb-0">
                  <label className="form-label text-xs">Assign Staff / Stylist</label>
                  <select
                    className="form-input text-xs"
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                  >
                    {staffMembers.map((staff) => (
                      <option key={staff} value={staff}>
                        {staff}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-0">
                  <label className="form-label text-xs">Manager Note to Customer (Optional)</label>
                  <textarea
                    className="form-input text-xs"
                    rows={3}
                    placeholder="e.g. Please arrive 5 minutes early. Station #3 assigned."
                    value={managerNote}
                    onChange={(e) => setManagerNote(e.target.value)}
                  ></textarea>
                </div>
              </div>
            )}

            {actionType === "REJECT" && (
              <div className="p-4 bg-red-50 text-red-800 text-xs rounded-lg border border-red-200 mb-4">
                Are you sure you want to decline this request? An in-app notification will be dispatched to {selectedRequest.user?.name}.
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "2px solid #d1d5db", background: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#374151", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                disabled={actionLoading}
                style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", background: actionType === "REJECT" ? "#dc2626" : "#059669", color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: actionLoading ? "not-allowed" : "pointer", opacity: actionLoading ? 0.6 : 1 }}
              >
                {actionLoading
                  ? "Processing..."
                  : actionType === "ACCEPT"
                  ? "✓ Confirm & Notify Customer"
                  : actionType === "RESCHEDULE"
                  ? "✓ Confirm Reschedule"
                  : "✗ Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* BLOCK TIME MODAL                                         */}
      {/* ======================================================== */}
      {blockModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setBlockModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-secondary p-1"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-serif text-secondary mb-2">Block Unavailable Time Slot</h3>
            <p className="text-xs text-muted mb-6">
              Prevent customer bookings during break times or workstation maintenance.
            </p>

            <form onSubmit={handleAddBlockTime} className="space-y-4">
              <div className="form-group mb-0">
                <label className="form-label text-xs">Date</label>
                <input
                  type="date"
                  className="form-input text-xs"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs">Time Slot to Block</label>
                <select
                  className="form-input text-xs"
                  value={blockTime}
                  onChange={(e) => setBlockTime(e.target.value)}
                  required
                >
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-xs">Reason / Title</label>
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="e.g. Staff Lunch Break, Stylist Training, Sanitation"
                  value={blockTitle}
                  onChange={(e) => setBlockTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setBlockModalOpen(false)}
                  className="btn-secondary flex-1 text-xs py-2.5"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 text-xs py-2.5">
                  Block Time Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ManagerDashboard() {
  return (
    <Suspense fallback={<div className="container py-32 text-center text-muted">Loading manager portal...</div>}>
      <ManagerDashboardContent />
    </Suspense>
  );
}
