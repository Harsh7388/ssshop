"use client";

import React, { useState, useEffect, Suspense } from "react";
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
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Coffee
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function ManagerDashboardContent() {
  const [requests, setRequests] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal states
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

  // Calendar View state (Today, Day, Week, Month)
  const [calendarViewMode, setCalendarViewMode] = useState<"TODAY" | "DAY" | "WEEK" | "MONTH">("TODAY");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(new Date().toISOString().split("T")[0]);

  const [staffMembers, setStaffMembers] = useState<string[]>([]);

  const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM", "07:00 PM"];

  const fetchManagerData = async () => {
    try {
      const res = await fetch("/api/manager/requests", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests || []);
        setSchedules(data.schedules || []);
        setStaffMembers((data.staff || []).map((s: any) => s.name));
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchManagerData();
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      if (tabParam === "calendar" || tabParam === "schedule") setActiveTab("calendar");
      else if (tabParam === "appointments") setActiveTab("appointments");
      else if (tabParam === "requests") setActiveTab("requests");
    }
  }, [searchParams]);

  const openActionModal = (req: any, type: "ACCEPT" | "RESCHEDULE" | "REJECT") => {
    setSelectedRequest(req);
    setActionType(type);
    setNewDate(new Date(req.booking_date).toISOString().split("T")[0]);
    setNewTime(req.booking_time);
    setAssignedStaff(req.assigned_staff || staffMembers[0]);
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
      fetchManagerData();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
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

  if (loading) {
    return (
      <div className="container py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted font-medium">Loading Service Manager Portal...</p>
      </div>
    );
  }

  // Filtered lists
  const pendingRequests = requests.filter((r) => r.status === "REQUESTED");
  const confirmedAppointments = requests.filter((r) => ["CONFIRMED", "SCHEDULED", "RESCHEDULED"].includes(r.status));
  const completedToday = requests.filter((r) => r.status === "COMPLETED");
  const revenueToday = completedToday.reduce((acc, r) => acc + (r.total_amount || 0), 0);

  // Search & Status filter for appointments tab
  const filteredAppointments = requests.filter((r) => {
    const matchesSearch =
      r.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.user.phone?.includes(searchTerm) ||
      r.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.booking_number.toLowerCase().includes(searchTerm.toLowerCase());

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

  return (
    <div className="container py-10 animate-fade-in max-w-7xl">
      {/* Top Banner */}
      <div className="bg-secondary text-white rounded-2xl p-8 mb-8 shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-gray-800">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-wider mb-2">
            <Scissors size={16} /> Service Manager Operations
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">
            Salon Operations & Scheduling
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl">
            Manage customer booking requests, schedule appointments, assign staff, and update calendar availability.
          </p>
        </div>
        <div className="relative z-10 flex gap-3 shrink-0">
          <button
            onClick={() => setBlockModalOpen(true)}
            className="btn-primary flex items-center gap-2 text-sm shadow-md"
          >
            <Plus size={16} /> Block Time / Add Break
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <div className="card p-6 bg-surface border border-border hover:border-primary/40 transition-all shadow-sm">
          <div className="text-muted text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Pending Requests</span>
            <AlertCircle size={18} className="text-amber-500" />
          </div>
          <div className="text-3xl font-serif font-bold text-amber-600">{pendingRequests.length}</div>
          <div className="text-xs text-muted mt-1">Action required</div>
        </div>

        <div className="card p-6 bg-surface border border-border hover:border-primary/40 transition-all shadow-sm">
          <div className="text-muted text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Confirmed Appointments</span>
            <CalendarDays size={18} className="text-emerald-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-600">{confirmedAppointments.length}</div>
          <div className="text-xs text-muted mt-1">Scheduled for service</div>
        </div>

        <div className="card p-6 bg-surface border border-border hover:border-primary/40 transition-all shadow-sm">
          <div className="text-muted text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Completed Today</span>
            <CheckCircle2 size={18} className="text-purple-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-purple-600">{completedToday.length}</div>
          <div className="text-xs text-muted mt-1">Services finished</div>
        </div>

        <div className="card p-6 bg-surface border border-border hover:border-primary/40 transition-all shadow-sm">
          <div className="text-muted text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Revenue Completed</span>
            <IndianRupee size={18} className="text-primary" />
          </div>
          <div className="text-3xl font-serif font-bold text-secondary">₹{revenueToday}</div>
          <div className="text-xs text-muted mt-1">Total earned today</div>
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
            <span className="bg-amber-500 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
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
      </div>

      {/* TAB 1: NEW BOOKING REQUESTS */}
      {activeTab === "requests" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-serif text-secondary flex items-center gap-2">
              <AlertCircle size={22} className="text-amber-500" /> Pending Booking Requests ({pendingRequests.length})
            </h2>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="card text-center p-12 text-muted bg-surface">
              <CheckCircle2 size={48} className="mx-auto mb-3 text-emerald-500" />
              <h3 className="text-xl font-bold mb-1">All Caught Up!</h3>
              <p className="text-sm">There are no pending booking requests right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="card p-6 bg-surface border-l-4 border-l-amber-500 border-t border-r border-b border-border shadow-md rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-serif font-bold text-2xl text-secondary">{req.service.name}</span>
                      {renderBadge(req.status)}
                      <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        #{req.booking_number}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700 my-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div>
                        <span className="text-xs text-muted block uppercase font-bold">Customer Name</span>
                        <strong className="text-secondary">{req.user.name}</strong>
                      </div>
                      <div>
                        <span className="text-xs text-muted block uppercase font-bold">Phone Number</span>
                        <a href={`tel:${req.user.phone}`} className="text-primary font-bold hover:underline">
                          📞 {req.user.phone || "N/A"}
                        </a>
                      </div>
                      <div>
                        <span className="text-xs text-muted block uppercase font-bold">Requested Time</span>
                        <strong>
                          {new Date(req.booking_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })} at {req.booking_time}
                        </strong>
                      </div>
                      <div>
                        <span className="text-xs text-muted block uppercase font-bold">Service Price</span>
                        <span className="text-primary font-bold">₹{req.total_amount}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted block uppercase font-bold">Service Duration</span>
                        <span>{req.service.duration} minutes</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted block uppercase font-bold">Payment Preference</span>
                        <span>{req.payment_preference === "PAY_NOW" ? "Paid Online" : "Pay After Service"}</span>
                      </div>
                    </div>

                    {req.notes && (
                      <p className="text-xs text-gray-600 bg-amber-50 p-2.5 rounded border border-amber-200">
                        <strong>Customer Notes:</strong> {req.notes}
                      </p>
                    )}
                  </div>

                  {/* Manager Action Buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "180px", flexShrink: 0 }}>
                    <button
                      onClick={() => openActionModal(req, "ACCEPT")}
                      style={{ background: "#059669", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 16px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", boxShadow: "0 2px 8px rgba(5,150,105,0.25)", transition: "all 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#047857")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#059669")}
                    >
                      <Check size={15} /> Accept & Schedule
                    </button>
                    <button
                      onClick={() => openActionModal(req, "RESCHEDULE")}
                      style={{ background: "#fff", color: "#121315", border: "2px solid #d1d5db", borderRadius: "8px", padding: "9px 16px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "all 0.2s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#c19d60"; (e.currentTarget as HTMLElement).style.color = "#c19d60"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#d1d5db"; (e.currentTarget as HTMLElement).style.color = "#121315"; }}
                    >
                      <Calendar size={14} /> Reschedule
                    </button>
                    <button
                      onClick={() => openActionModal(req, "REJECT")}
                      style={{ background: "#fef2f2", color: "#dc2626", border: "2px solid #fecaca", borderRadius: "8px", padding: "9px 16px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "all 0.2s" }}
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

      {/* TAB 2: MANAGER SCHEDULE & CALENDAR */}
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
              {/* Calendar Mode Selectors */}
              <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                {(["TODAY", "DAY", "WEEK", "MONTH"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCalendarViewMode(mode)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      calendarViewMode === mode ? "bg-primary text-white shadow" : "text-gray-600 hover:text-secondary"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <input
                type="date"
                className="form-input text-xs py-1.5 px-3 w-auto"
                value={selectedCalendarDate}
                onChange={(e) => setSelectedCalendarDate(e.target.value)}
              />
            </div>
          </div>

          {/* Calendar Display Grid */}
          <div className="card p-6 bg-surface border border-border shadow-md rounded-xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
              <h3 className="text-xl font-serif text-secondary font-bold flex items-center gap-2">
                <Clock size={20} className="text-primary" />
                Schedule for {new Date(selectedCalendarDate).toLocaleDateString("en-IN", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>
              <span className="text-xs font-bold text-muted uppercase">
                {calendarDateBookings.length} Appointments &bull; {calendarDateBlocks.length} Blocked Slots
              </span>
            </div>

            {/* Time Slot Timeline Cards (Example: 10:00 AM — Haircut — Rahul) */}
            <div className="space-y-4">
              {timeSlots.map((slot) => {
                const bookingInSlot = calendarDateBookings.find((b) => b.booking_time === slot);
                const blockInSlot = calendarDateBlocks.find((b) => b.start_time === slot);

                return (
                  <div
                    key={slot}
                    className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                      bookingInSlot
                        ? "bg-emerald-50/70 border-emerald-300"
                        : blockInSlot
                          ? "bg-rose-50/70 border-rose-300"
                          : "bg-gray-50/50 border-gray-200"
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
                          <strong className="text-lg text-secondary font-serif">{bookingInSlot.service.name}</strong>
                          <span className="text-xs font-bold bg-white text-emerald-800 px-2.5 py-1 rounded border border-emerald-200">
                            👤 Customer: {bookingInSlot.user.name} ({bookingInSlot.user.phone || "No phone"})
                          </span>
                          <span className="text-xs font-bold bg-primary-light text-primary px-2.5 py-1 rounded border border-primary/20">
                            ✂️ Staff: {bookingInSlot.assigned_staff || "Unassigned"}
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

      {/* TAB 3: ALL APPOINTMENTS TABLE */}
      {activeTab === "appointments" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-serif text-secondary flex items-center gap-2">
              <Scissors size={22} className="text-primary" /> All Salon Appointments ({filteredAppointments.length})
            </h2>

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
                    <th className="py-3.5 px-4">Service</th>
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
                          <div className="font-bold text-secondary">{b.user.name}</div>
                          <a href={`tel:${b.user.phone}`} className="text-xs text-primary hover:underline">
                            📞 {b.user.phone || "N/A"}
                          </a>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-secondary">
                          {b.service.name}
                          <span className="block text-xs font-normal text-muted">₹{b.total_amount}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-xs">
                            {new Date(b.booking_date).toLocaleDateString("en-IN")}
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

      {/* Item 3 Step 3: MANAGER ACCEPT / RESCHEDULE / REJECT MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-secondary p-1"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-serif text-secondary mb-1">
              {actionType === "ACCEPT" ? "Accept & Confirm Booking" : actionType === "RESCHEDULE" ? "Reschedule Appointment" : "Decline Booking Request"}
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
                <strong className="text-secondary">{selectedRequest.user.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Phone Number:</span>
                <strong className="text-primary">{selectedRequest.user.phone || "N/A"}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Service & Price:</span>
                <strong className="text-secondary">{selectedRequest.service.name} (₹{selectedRequest.total_amount})</strong>
              </div>
            </div>

            {actionType !== "REJECT" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group mb-0">
                    <label className="form-label text-xs">Select Appointment Date</label>
                    <input
                      type="date"
                      className="form-input text-xs"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-0">
                    <label className="form-label text-xs">Select Available Time Slot</label>
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
                  <label className="form-label text-xs">Assign Staff / Service Provider</label>
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
                  <label className="form-label text-xs">Add Manager Note (Optional)</label>
                  <textarea
                    className="form-input text-xs"
                    rows={3}
                    placeholder="Instructions for customer or salon workstation notes..."
                    value={managerNote}
                    onChange={(e) => setManagerNote(e.target.value)}
                  ></textarea>
                </div>
              </div>
            )}

            {actionType === "REJECT" && (
              <div className="p-4 bg-red-50 text-red-800 text-xs rounded-lg border border-red-200 mb-4">
                Are you sure you want to reject this request? An in-app rejection notification will be sent to {selectedRequest.user.name}.
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
                {actionLoading ? "Processing..." : actionType === "ACCEPT" ? "✓ Confirm & Notify Customer" : actionType === "RESCHEDULE" ? "✓ Confirm Reschedule" : "✗ Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BLOCK TIME MODAL */}
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
              Prevent bookings during break times or staff unavailability.
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
                  placeholder="e.g. Lunch Break, Stylist Off, Sanitation"
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
