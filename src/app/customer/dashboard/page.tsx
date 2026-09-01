"use client";

import React, { useState, useEffect, Suspense } from "react";
import { 
  CalendarDays, 
  CheckCircle2, 
  Clock, 
  Bell, 
  Star, 
  IndianRupee, 
  User, 
  LogOut, 
  Sparkles, 
  X, 
  MessageSquare,
  AlertCircle,
  Scissors
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

function CustomerDashboardContent() {
  const [data, setData] = useState<any>({ user: null, bookings: [], notifications: [] });
  const [loading, setLoading] = useState(true);
  const { user: authUser, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<string>("overview");

  // Feedback Modal state
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState<any>(null);
  const [starRating, setStarRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState("");
  const [feedbackErrorMsg, setFeedbackErrorMsg] = useState("");

  // Booking detail view modal state
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/customer/dashboard", { cache: "no-store" });
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleOpenRatingModal = (booking: any) => {
    setSelectedBookingForRating(booking);
    setStarRating(5);
    setFeedbackComment("");
    setFeedbackSuccessMsg("");
    setFeedbackErrorMsg("");
    setRatingModalOpen(true);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForRating) return;

    if (!feedbackComment.trim()) {
      setFeedbackErrorMsg("Please enter a written comment about your experience.");
      return;
    }

    setSubmittingFeedback(true);
    setFeedbackErrorMsg("");
    setFeedbackSuccessMsg("");

    try {
      const res = await fetch("/api/customer/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: selectedBookingForRating.id,
          rating: starRating,
          comment: feedbackComment,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Failed to submit feedback");
      }

      setFeedbackSuccessMsg("Thank you! Your feedback has been submitted for admin approval.");
      setTimeout(() => {
        setRatingModalOpen(false);
        fetchDashboardData();
      }, 1500);

    } catch (err: any) {
      setFeedbackErrorMsg(err.message);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  const { bookings, notifications } = data;
  const currentUser = data.user || authUser;

  // Filter lists
  const upcomingConfirmedBooking = bookings.find((b: any) => b.status === "CONFIRMED");
  const upcomingBookings = bookings.filter((b: any) => ["CONFIRMED", "SCHEDULED", "RESCHEDULED", "REQUESTED"].includes(b.status));
  const completedBookings = bookings.filter((b: any) => b.status === "COMPLETED");
  const totalSpent = bookings
    .filter((b: any) => ["CONFIRMED", "COMPLETED"].includes(b.status))
    .reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0);

  // Status Badge Helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            🟡 Requested
          </span>
        );
      case "SCHEDULED":
      case "RESCHEDULED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            🔵 Scheduled
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            🟢 Confirmed
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
            🟣 Completed
          </span>
        );
      case "REJECTED":
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            🔴 {status === "REJECTED" ? "Rejected" : "Cancelled"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="container py-10 animate-fade-in max-w-6xl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-secondary via-secondary-hover to-secondary rounded-2xl p-8 text-white mb-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary rounded-full filter blur-[70px] opacity-30"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-wider mb-2">
            <Sparkles size={16} /> SS SALON Customer Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">
            Welcome back to SS SALON 👋
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Manage your bookings, view appointment confirmations, and share your experience.
          </p>
        </div>
        <div className="relative z-10 flex gap-3">
          <Link href="/book" className="btn-primary flex items-center gap-2 shadow-md">
            <CalendarDays size={18} /> Book Appointment
          </Link>
        </div>
      </div>

      {/* Item 5: AUTOMATIC CONFIRMATION BANNER */}
      {upcomingConfirmedBooking && (
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-xl p-6 mb-8 border-2 border-emerald-500/50 shadow-lg relative overflow-hidden animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/40">
                    Appointment Confirmed 🎉
                  </span>
                  <span className="text-xs text-gray-400">ID: {upcomingConfirmedBooking.booking_number}</span>
                </div>
                <h3 className="text-2xl font-serif text-white font-bold mb-2">
                  {upcomingConfirmedBooking.service.name}
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-emerald-100 mb-3">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={16} className="text-emerald-400" />
                    <strong>Date:</strong> {new Date(upcomingConfirmedBooking.booking_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={16} className="text-emerald-400" />
                    <strong>Time:</strong> {upcomingConfirmedBooking.booking_time}
                  </span>
                  <span className="flex items-center gap-1.5 bg-emerald-800/60 px-2.5 py-0.5 rounded border border-emerald-500/40 text-emerald-100">
                    <User size={15} className="text-emerald-300" />
                    <strong>Assigned Staff:</strong> {upcomingConfirmedBooking.assigned_staff || "Rahul Sharma"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Scissors size={16} className="text-emerald-400" />
                    <strong>Duration:</strong> {upcomingConfirmedBooking.service.duration} mins
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IndianRupee size={16} className="text-emerald-400" />
                    <strong>Amount:</strong> ₹{upcomingConfirmedBooking.total_amount}
                  </span>
                </div>
                <p className="text-xs text-emerald-300 mt-3 font-medium flex items-center gap-1">
                  <AlertCircle size={14} /> “Please arrive 5–10 minutes before your appointment.”
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedBookingDetail(upcomingConfirmedBooking)}
              className="btn-primary bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shrink-0 shadow"
            >
              View Appointment Details
            </button>
          </div>
        </div>
      )}

      {/* Item 19: Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        <div className="card p-6 bg-surface border border-border hover:border-primary/40 transition-all shadow-sm">
          <div className="text-muted text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Upcoming Appointments</span>
            <CalendarDays size={18} className="text-primary" />
          </div>
          <div className="text-3xl font-serif font-bold text-secondary">{upcomingBookings.length}</div>
          <div className="text-xs text-muted mt-1">Confirmed or Scheduled</div>
        </div>

        <div className="card p-6 bg-surface border border-border hover:border-primary/40 transition-all shadow-sm">
          <div className="text-muted text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Total Bookings</span>
            <Scissors size={18} className="text-primary" />
          </div>
          <div className="text-3xl font-serif font-bold text-secondary">{bookings.length}</div>
          <div className="text-xs text-muted mt-1">All time bookings</div>
        </div>

        <div className="card p-6 bg-surface border border-border hover:border-primary/40 transition-all shadow-sm">
          <div className="text-muted text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Completed Services</span>
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-secondary">{completedBookings.length}</div>
          <div className="text-xs text-muted mt-1">Services received</div>
        </div>

        <div className="card p-6 bg-surface border border-border hover:border-primary/40 transition-all shadow-sm">
          <div className="text-muted text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Total Spent</span>
            <IndianRupee size={18} className="text-primary" />
          </div>
          <div className="text-3xl font-serif font-bold text-secondary">₹{totalSpent}</div>
          <div className="text-xs text-muted mt-1">Payments total</div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-border mb-8 gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "overview" || activeTab === "bookings"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-secondary"
          }`}
        >
          📅 My Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "notifications"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-secondary"
          }`}
        >
          🔔 Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "profile"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-secondary"
          }`}
        >
          👤 Profile Information
        </button>
      </div>

      {/* Tab Content: Bookings */}
      {(activeTab === "overview" || activeTab === "bookings") && (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif text-secondary mb-4 flex items-center gap-2">
            <CalendarDays size={22} className="text-primary" /> Booking History & Services
          </h2>

          {bookings.length === 0 ? (
            <div className="card text-center p-12 text-muted bg-surface">
              <Scissors size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold mb-2">No Bookings Yet</h3>
              <p className="text-sm text-gray-500 mb-6">Explore our services and book your first appointment with SS SALON.</p>
              <Link href="/services" className="btn-primary inline-block">
                Browse Services & Book
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="card p-6 bg-surface border border-border hover:border-gray-300 transition-all rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-bold text-xl text-secondary">{booking.service.name}</h3>
                      {renderStatusBadge(booking.status)}
                      <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        #{booking.booking_number}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted mb-3">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={16} className="text-primary" />
                        {new Date(booking.booking_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={16} className="text-primary" />
                        {booking.booking_time} ({booking.service.duration} mins)
                      </span>
                      <span className="flex items-center gap-1.5 font-bold text-secondary">
                        <IndianRupee size={16} className="text-primary" />
                        ₹{booking.total_amount}
                      </span>
                    </div>

                    {booking.notes && (
                      <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded border border-gray-200 mb-2">
                        <strong>My Notes:</strong> {booking.notes}
                      </p>
                    )}

                    {booking.manager_note && (
                      <p className="text-xs text-blue-800 bg-blue-50 p-2.5 rounded border border-blue-200">
                        <strong>Manager Note:</strong> {booking.manager_note}
                      </p>
                    )}
                  </div>

                  {/* Right Action Column */}
                  <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-border">
                    <button
                      onClick={() => setSelectedBookingDetail(booking)}
                      className="btn-secondary text-xs py-2 px-4 w-full md:w-auto"
                    >
                      View Details
                    </button>

                    {/* Item 20: COMPLETED SERVICE → FEEDBACK REMINDER */}
                    {booking.status === "COMPLETED" && (
                      <div>
                        {booking.feedback ? (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-center text-xs text-amber-900 font-semibold">
                            <div className="flex items-center gap-1 text-amber-500 mb-1 justify-center">
                              {[...Array(booking.feedback.rating)].map((_, i) => (
                                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            Thank you for your feedback!
                            <span className="block text-[10px] text-gray-500 font-normal">
                              Status: {booking.feedback.status}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-gray-600 font-semibold">How was your experience?</span>
                            <button
                              onClick={() => handleOpenRatingModal(booking)}
                              className="btn-primary bg-amber-500 hover:bg-amber-600 border-amber-500 text-white text-xs py-2 px-4 flex items-center gap-1.5 shadow"
                            >
                              <Star size={14} className="fill-white" /> Rate Your Service
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Notifications */}
      {activeTab === "notifications" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-serif text-secondary mb-4 flex items-center gap-2">
            <Bell size={22} className="text-primary" /> Notification Center
          </h2>

          {notifications.length === 0 ? (
            <div className="card text-center p-12 text-muted bg-surface">
              <Bell size={40} className="mx-auto mb-3 text-gray-300" />
              <p>No notifications at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {notifications.map((n: any) => (
                <div
                  key={n.id}
                  className={`p-5 rounded-xl border transition-all ${
                    n.title.includes("Confirmed")
                      ? "bg-emerald-50/80 border-emerald-200"
                      : n.title.includes("Completed")
                        ? "bg-purple-50/80 border-purple-200"
                        : "bg-surface border-border"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-base text-secondary">{n.title}</h4>
                    <span className="text-xs text-gray-400">
                      {new Date(n.created_at).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Profile */}
      {activeTab === "profile" && (
        <div className="card p-8 max-w-xl mx-auto bg-surface">
          <h2 className="text-2xl font-serif text-secondary mb-6 flex items-center gap-2">
            <User size={22} className="text-primary" /> Profile Details
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted font-medium">Full Name:</span>
              <span className="font-bold text-secondary">{currentUser.name}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted font-medium">Email Address:</span>
              <span className="font-bold text-secondary">{currentUser.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted font-medium">Phone Number:</span>
              <span className="font-bold text-secondary">{currentUser.phone || "Not provided"}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted font-medium">Account Role:</span>
              <span className="font-bold text-primary uppercase">{currentUser.role || "CUSTOMER"}</span>
            </div>
          </div>
          <button onClick={logout} className="btn-secondary text-error border-error hover:bg-error hover:text-white w-full mt-8 flex items-center justify-center gap-2 py-2.5">
            <LogOut size={16} /> Logout from SS SALON
          </button>
        </div>
      )}

      {/* Items 7 & 8: CUSTOMER FEEDBACK & RATING MODAL */}
      {ratingModalOpen && selectedBookingForRating && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setRatingModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-secondary p-1"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star size={24} className="fill-amber-500 text-amber-500" />
              </div>
              <h3 className="text-2xl font-serif text-secondary mb-1">⭐ Rate Your Experience</h3>
              <p className="text-sm text-muted">
                Service: <strong>{selectedBookingForRating.service.name}</strong>
              </p>
            </div>

            {feedbackSuccessMsg ? (
              <div className="p-6 bg-green-50 text-green-800 rounded-xl border border-green-200 text-center font-medium">
                {feedbackSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-6">
                {feedbackErrorMsg && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-xs">
                    {feedbackErrorMsg}
                  </div>
                )}

                {/* Clickable Star Rating Control */}
                <div className="text-center">
                  <label className="form-label text-sm text-gray-600 mb-3 block">Select Your Star Rating</label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setStarRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-125"
                      >
                        <Star
                          size={36}
                          className={`${
                            (hoverRating || starRating) >= star
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-600 mt-2 block uppercase tracking-wider">
                    {starRating === 5 && "⭐ 5/5 — Excellent!"}
                    {starRating === 4 && "⭐ 4/5 — Very Good"}
                    {starRating === 3 && "⭐ 3/5 — Good"}
                    {starRating === 2 && "⭐ 2/5 — Fair"}
                    {starRating === 1 && "⭐ 1/5 — Poor"}
                  </span>
                </div>

                {/* Feedback Comment */}
                <div className="form-group mb-0">
                  <label className="form-label font-bold text-secondary">Tell us about your experience *</label>
                  <textarea
                    className="form-input text-sm"
                    rows={4}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    required
                    placeholder="Write your feedback about the service..."
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRatingModalOpen(false)}
                    className="btn-secondary flex-1 text-sm py-2.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="btn-primary flex-1 text-sm py-2.5 bg-amber-500 hover:bg-amber-600 border-amber-500 shadow"
                  >
                    {submittingFeedback ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBookingDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedBookingDetail(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-secondary p-1"
            >
              <X size={20} />
            </button>

            <div className="mb-6 border-b border-border pb-4">
              <span className="text-xs text-primary font-bold uppercase tracking-wider">Booking Receipt</span>
              <h3 className="text-2xl font-serif text-secondary font-bold">{selectedBookingDetail.service.name}</h3>
              <div className="mt-1">{renderStatusBadge(selectedBookingDetail.status)}</div>
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-muted">Booking Reference:</span>
                <span className="font-mono font-bold text-secondary">{selectedBookingDetail.booking_number}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-muted">Appointment Date:</span>
                <span className="font-bold">{new Date(selectedBookingDetail.booking_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-muted">Appointment Time:</span>
                <span className="font-bold">{selectedBookingDetail.booking_time}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-muted">Duration:</span>
                <span>{selectedBookingDetail.service.duration} mins</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-muted">Payment Preference:</span>
                <span>{selectedBookingDetail.payment_preference === "PAY_NOW" ? "Paid Online" : "Pay After Service"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100 font-bold text-base text-primary">
                <span>Total Amount:</span>
                <span>₹{selectedBookingDetail.total_amount}</span>
              </div>
            </div>

            <button onClick={() => setSelectedBookingDetail(null)} className="btn-secondary w-full text-sm">
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerDashboard() {
  return (
    <Suspense fallback={<div className="container py-32 text-center text-muted">Loading dashboard...</div>}>
      <CustomerDashboardContent />
    </Suspense>
  );
}
