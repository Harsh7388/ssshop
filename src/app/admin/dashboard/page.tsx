"use client";

import React, { useState, useEffect, Suspense } from "react";
import { 
  Users, 
  Briefcase, 
  IndianRupee, 
  LogOut, 
  CheckCircle2, 
  Scissors, 
  Gift, 
  Calendar, 
  CreditCard, 
  Star, 
  BarChart3, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Eye, 
  Search, 
  ShieldCheck, 
  Sparkles,
  AlertCircle
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function AdminDashboardContent() {
  const [data, setData] = useState<any>({
    stats: {},
    users: [],
    managers: [],
    services: [],
    offers: [],
    bookings: [],
    feedbacks: [],
    payments: []
  });

  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals for Services
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    category: "Hair",
    gender: "MEN",
    description: "",
    price: "",
    discount_price: "",
    duration: "30",
    image: "",
    status: "ACTIVE"
  });

  // Modals for Offers
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [offerForm, setOfferForm] = useState({
    title: "",
    description: "",
    discount: "10",
    discountType: "PERCENTAGE",
    original_price: "",
    offer_price: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    status: "ACTIVE",
    service_id: "",
    gender: "BOTH",
    image: ""
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
      const d = await res.json();
      if (res.ok) setData(d);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const tabParam = searchParams.get("tab");
    if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  // --- SERVICE MANAGEMENT ACTIONS ---
  const handleOpenServiceModal = (service: any = null) => {
    setEditingService(service);
    if (service) {
      setServiceForm({
        name: service.name,
        category: service.category,
        gender: service.gender,
        description: service.description,
        price: service.price.toString(),
        discount_price: service.discount_price ? service.discount_price.toString() : "",
        duration: service.duration.toString(),
        image: service.image || "",
        status: service.status
      });
    } else {
      setServiceForm({
        name: "",
        category: "Hair",
        gender: "MEN",
        description: "",
        price: "",
        discount_price: "",
        duration: "30",
        image: "",
        status: "ACTIVE"
      });
    }
    setFormError("");
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      const url = "/api/admin/services";
      const method = editingService ? "PUT" : "POST";
      const payload = editingService ? { ...serviceForm, id: editingService.id } : serviceForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Failed to save service");

      setServiceModalOpen(false);
      fetchAdminData();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleServiceStatus = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const res = await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus })
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- OFFER MANAGEMENT ACTIONS ---
  const handleOpenOfferModal = (offer: any = null) => {
    setEditingOffer(offer);
    if (offer) {
      setOfferForm({
        title: offer.title,
        description: offer.description,
        discount: offer.discount.toString(),
        discountType: offer.discountType,
        original_price: offer.original_price ? offer.original_price.toString() : "",
        offer_price: offer.offer_price ? offer.offer_price.toString() : "",
        start_date: new Date(offer.start_date).toISOString().split("T")[0],
        end_date: new Date(offer.end_date).toISOString().split("T")[0],
        status: offer.status,
        service_id: offer.service_id || "",
        gender: offer.gender || "BOTH",
        image: offer.image || ""
      });
    } else {
      setOfferForm({
        title: "",
        description: "",
        discount: "10",
        discountType: "PERCENTAGE",
        original_price: "",
        offer_price: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
        status: "ACTIVE",
        service_id: "",
        gender: "BOTH",
        image: ""
      });
    }
    setFormError("");
    setOfferModalOpen(true);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      const url = "/api/admin/offers";
      const method = editingOffer ? "PUT" : "POST";
      const payload = editingOffer ? { ...offerForm, id: editingOffer.id } : offerForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Failed to save offer");

      setOfferModalOpen(false);
      fetchAdminData();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleOfferStatus = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const res = await fetch("/api/admin/offers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus })
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      const res = await fetch(`/api/admin/offers?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- FEEDBACK MANAGEMENT ACTIONS ---
  const handleUpdateFeedbackStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch("/api/admin/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback review?")) return;
    try {
      const res = await fetch(`/api/admin/feedback?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted font-medium">Loading Main Admin Console...</p>
      </div>
    );
  }

  const { stats, users, managers, services, offers, bookings, feedbacks, payments } = data;
  const feedbackStats = stats.feedbackStats || {};

  const navigationItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "👥 Users", count: users.length },
    { id: "managers", label: "👨‍💼 Service Managers", count: managers.length },
    { id: "services", label: "✂️ Services", count: services.length },
    { id: "offers", label: "🎁 Offers", count: offers.length },
    { id: "bookings", label: "📅 Bookings", count: bookings.length },
    { id: "payments", label: "💳 Payments", count: payments.length },
    { id: "feedback", label: "⭐ Feedback & Reviews", count: feedbacks.length },
    { id: "analytics", label: "📊 Analytics", icon: BarChart3 },
  ];

  return (
    <div className="container py-10 animate-fade-in flex flex-col md:flex-row min-h-screen gap-8">
      {/* Item 18: Sidebar Navigation Menu with icons and readable labels */}
      <div className="w-full md:w-64 bg-surface border border-border rounded-xl p-6 shadow-sm shrink-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldCheck size={16} /> Admin Console
          </div>
          <h2 className="text-xl font-serif font-bold text-secondary mb-6 pb-3 border-b border-border">
            SS SALON Admin
          </h2>

          <ul className="flex flex-col gap-1">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg font-medium text-xs md:text-sm flex items-center justify-between transition-all ${
                    activeTab === item.id
                      ? "bg-primary text-white font-bold shadow"
                      : "text-gray-700 hover:bg-gray-100 hover:text-secondary"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                        activeTab === item.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-6 mt-6 border-t border-border">
          <button
            onClick={logout}
            className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
          >
            <LogOut size={16} /> Logout Admin
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {/* OVERVIEW / ANALYTICS TAB */}
        {(activeTab === "overview" || activeTab === "analytics") && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-serif text-secondary">Dashboard Overview</h2>
              <span className="text-xs text-muted font-mono">Live SS SALON Analytics</span>
            </div>

            {/* Quick KPI Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="card bg-gradient-to-br from-secondary to-secondary-hover text-white p-6 shadow-md rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm text-gray-300">Total Revenue</h3>
                  <IndianRupee size={22} className="text-primary" />
                </div>
                <div className="text-3xl font-bold text-white">₹{stats.totalRevenue || 0}</div>
              </div>

              <div className="card p-6 bg-surface border border-border shadow-sm rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm text-muted">Total Users</h3>
                  <Users size={22} className="text-primary" />
                </div>
                <div className="text-3xl font-bold text-secondary">{stats.totalUsers || 0}</div>
              </div>

              <div className="card p-6 bg-surface border border-border shadow-sm rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm text-muted">Total Bookings</h3>
                  <Calendar size={22} className="text-primary" />
                </div>
                <div className="text-3xl font-bold text-secondary">{stats.totalBookings || 0}</div>
              </div>

              <div className="card p-6 bg-surface border border-border shadow-sm rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm text-muted">Active Services</h3>
                  <Scissors size={22} className="text-primary" />
                </div>
                <div className="text-3xl font-bold text-secondary">{stats.totalServices || 0}</div>
              </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="card p-6 bg-surface border border-border shadow-md rounded-xl">
              <h3 className="text-xl font-serif text-secondary font-bold mb-4">Recent Bookings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-border text-gray-500 uppercase font-bold">
                      <th className="pb-3">Ref ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {bookings.slice(0, 5).map((b: any) => (
                      <tr key={b.id} className="hover:bg-gray-50/80">
                        <td className="py-3 font-mono font-bold">{b.booking_number}</td>
                        <td className="py-3 font-medium">{b.user.name}</td>
                        <td className="py-3">{b.service.name}</td>
                        <td className="py-3">{new Date(b.booking_date).toLocaleDateString("en-IN")}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100">{b.status}</span>
                        </td>
                        <td className="py-3 text-right font-bold text-primary">₹{b.total_amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Item 12: ADMIN SERVICES MANAGEMENT */}
        {activeTab === "services" && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif text-secondary">✂️ Manage Services</h2>
                <p className="text-xs text-muted">Add new salon services or edit price, category, and status.</p>
              </div>
              <button
                onClick={() => handleOpenServiceModal()}
                className="btn-primary text-sm flex items-center gap-2 shadow"
              >
                <Plus size={16} /> Add New Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((s: any) => (
                <div key={s.id} className="card p-5 bg-surface border border-border shadow-sm rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-secondary">{s.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${s.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {s.status}
                      </span>
                    </div>
                    <div className="text-xs text-primary font-bold mb-2">
                      Category: {s.category} &bull; For: {s.gender}
                    </div>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4">
                      {s.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold text-primary">₹{s.price}</span>
                      <span className="text-xs text-muted block">{s.duration} mins</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleServiceStatus(s.id, s.status)}
                        className={`text-xs px-2.5 py-1 rounded font-semibold border ${
                          s.status === 'ACTIVE' ? 'border-orange-300 text-orange-700 bg-orange-50' : 'border-green-300 text-green-700 bg-green-50'
                        }`}
                      >
                        {s.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleOpenServiceModal(s)} className="p-1.5 text-gray-600 hover:text-primary">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteService(s.id)} className="p-1.5 text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Item 13: ADMIN OFFERS MANAGEMENT */}
        {activeTab === "offers" && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif text-secondary">🎁 Manage Special Offers</h2>
                <p className="text-xs text-muted">Create promotions, discount percentages, and validity dates.</p>
              </div>
              <button
                onClick={() => handleOpenOfferModal()}
                className="btn-primary text-sm flex items-center gap-2 shadow"
              >
                <Plus size={16} /> Add New Offer
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((o: any) => (
                <div key={o.id} className="bg-secondary text-white rounded-xl p-6 relative overflow-hidden flex flex-col justify-between shadow-md">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-primary uppercase">Offer — {o.discount}% OFF</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${o.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                        {o.status}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-2">{o.title}</h3>
                    <p className="text-xs text-gray-300 mb-4">{o.description}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-700 flex justify-between items-center text-xs text-gray-300">
                    <div>
                      <div>Valid: {new Date(o.start_date).toLocaleDateString("en-IN")} – {new Date(o.end_date).toLocaleDateString("en-IN")}</div>
                      <div className="text-primary font-bold">Target: {o.gender}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleOfferStatus(o.id, o.status)}
                        className="btn-secondary text-[11px] py-1 px-2.5 text-white bg-white/10 hover:bg-white/20 border-transparent"
                      >
                        {o.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleOpenOfferModal(o)} className="p-1 text-gray-300 hover:text-white">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteOffer(o.id)} className="p-1 text-red-400 hover:text-red-300">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Item 9, 17: ADMIN FEEDBACK & REVIEWS SECTION */}
        {activeTab === "feedback" && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif text-secondary">⭐ Customer Feedback & Approval</h2>
                <p className="text-xs text-muted">Review customer ratings. Only APPROVED reviews display publicly on website.</p>
              </div>
            </div>

            {/* Feedback Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="card p-4 bg-surface text-center border border-border shadow-sm rounded-xl">
                <div className="text-2xl font-bold text-secondary">{feedbackStats.totalReviews || 0}</div>
                <div className="text-[11px] text-muted uppercase font-bold">Total Reviews</div>
              </div>
              <div className="card p-4 bg-amber-50 text-center border border-amber-200 shadow-sm rounded-xl">
                <div className="text-2xl font-bold text-amber-800">{feedbackStats.pendingReviews || 0}</div>
                <div className="text-[11px] text-amber-800 uppercase font-bold">Pending Approval</div>
              </div>
              <div className="card p-4 bg-emerald-50 text-center border border-emerald-200 shadow-sm rounded-xl">
                <div className="text-2xl font-bold text-emerald-800">{feedbackStats.approvedReviews || 0}</div>
                <div className="text-[11px] text-emerald-800 uppercase font-bold">Approved</div>
              </div>
              <div className="card p-4 bg-rose-50 text-center border border-rose-200 shadow-sm rounded-xl">
                <div className="text-2xl font-bold text-rose-800">{feedbackStats.rejectedReviews || 0}</div>
                <div className="text-[11px] text-rose-800 uppercase font-bold">Rejected</div>
              </div>
              <div className="card p-4 bg-surface text-center border border-border shadow-sm rounded-xl">
                <div className="text-2xl font-bold text-primary">⭐ {feedbackStats.avgRating || "0.0"}</div>
                <div className="text-[11px] text-muted uppercase font-bold">Avg Rating</div>
              </div>
            </div>

            {/* Feedback Table */}
            <div className="card p-0 overflow-hidden bg-surface border border-border shadow-md rounded-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b border-border text-xs uppercase font-bold text-gray-600">
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Service</th>
                      <th className="py-3.5 px-4">Rating</th>
                      <th className="py-3.5 px-4">Comment</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {feedbacks.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-muted">
                          No feedback submissions yet.
                        </td>
                      </tr>
                    ) : (
                      feedbacks.map((f: any) => (
                        <tr key={f.id} className="hover:bg-gray-50/80">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-secondary">{f.user.name}</div>
                            <span className="text-[11px] text-muted">{f.user.email}</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-secondary">{f.service.name}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center text-amber-500 font-bold">
                              {[...Array(f.rating)].map((_, i) => (
                                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                              ))}
                              <span className="ml-1 text-xs font-bold text-secondary">({f.rating})</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs text-xs text-gray-700 leading-relaxed">
                            "{f.comment}"
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                                f.status === "APPROVED"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : f.status === "REJECTED"
                                    ? "bg-rose-100 text-rose-800 border border-rose-300"
                                    : "bg-amber-100 text-amber-800 border border-amber-300"
                              }`}
                            >
                              {f.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              {f.status !== "APPROVED" && (
                                <button
                                  onClick={() => handleUpdateFeedbackStatus(f.id, "APPROVED")}
                                  className="btn-primary text-xs py-1 px-3 bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                                >
                                  Approve
                                </button>
                              )}
                              {f.status !== "REJECTED" && (
                                <button
                                  onClick={() => handleUpdateFeedbackStatus(f.id, "REJECTED")}
                                  className="btn-secondary text-xs py-1 px-3 text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  Reject
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteFeedback(f.id)}
                                className="p-1 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 size={16} />
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

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-serif text-secondary">👥 Registered Customers ({users.length})</h2>
            <div className="card p-0 overflow-hidden bg-surface border border-border shadow-md rounded-xl">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-border uppercase font-bold text-gray-600">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Gender</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u: any) => (
                    <tr key={u.id}>
                      <td className="py-3 px-4 font-bold text-secondary">{u.name}</td>
                      <td className="py-3 px-4">{u.email}</td>
                      <td className="py-3 px-4">{u.phone || "N/A"}</td>
                      <td className="py-3 px-4">{u.gender || "N/A"}</td>
                      <td className="py-3 px-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded font-bold">{u.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MANAGERS TAB */}
        {activeTab === "managers" && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-serif text-secondary">👨‍💼 Service Managers ({managers.length})</h2>
            <div className="card p-0 overflow-hidden bg-surface border border-border shadow-md rounded-xl">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-border uppercase font-bold text-gray-600">
                    <th className="py-3 px-4">Manager Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {managers.map((m: any) => (
                    <tr key={m.id}>
                      <td className="py-3 px-4 font-bold text-secondary">{m.name}</td>
                      <td className="py-3 px-4">{m.email}</td>
                      <td className="py-3 px-4">{m.phone || "N/A"}</td>
                      <td className="py-3 px-4"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-bold">{m.role}</span></td>
                      <td className="py-3 px-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded font-bold">{m.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-serif text-secondary">📅 All Customer Bookings ({bookings.length})</h2>
            <div className="card p-0 overflow-hidden bg-surface border border-border shadow-md rounded-xl">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-border uppercase font-bold text-gray-600">
                    <th className="py-3 px-4">Ref ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookings.map((b: any) => (
                    <tr key={b.id}>
                      <td className="py-3 px-4 font-mono font-bold">{b.booking_number}</td>
                      <td className="py-3 px-4 font-semibold">{b.user.name}</td>
                      <td className="py-3 px-4">{b.service.name}</td>
                      <td className="py-3 px-4">{new Date(b.booking_date).toLocaleDateString("en-IN")} at {b.booking_time}</td>
                      <td className="py-3 px-4"><span className="bg-gray-100 text-xs px-2 py-0.5 rounded font-bold">{b.status}</span></td>
                      <td className="py-3 px-4 text-right font-bold text-primary">₹{b.total_amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-serif text-secondary">💳 Payment Transactions ({payments.length})</h2>
            <div className="card p-0 overflow-hidden bg-surface border border-border shadow-md rounded-xl">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-border uppercase font-bold text-gray-600">
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payments.map((p: any) => (
                    <tr key={p.id}>
                      <td className="py-3 px-4 font-mono font-bold text-xs">{p.transaction_id || "N/A (Cash)"}</td>
                      <td className="py-3 px-4 font-semibold">{p.booking?.user?.name || "N/A"}</td>
                      <td className="py-3 px-4">{p.booking?.service?.name || "N/A"}</td>
                      <td className="py-3 px-4">{p.payment_method}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 text-xs rounded font-bold ${p.payment_status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                          {p.payment_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-primary">₹{p.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SERVICE MODAL */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setServiceModalOpen(false)} className="absolute right-4 top-4 text-gray-400 hover:text-secondary">
              <X size={20} />
            </button>
            <h3 className="text-2xl font-serif text-secondary mb-4">
              {editingService ? "Edit Service" : "Add New Service"}
            </h3>

            {formError && <div className="bg-red-50 text-red-700 p-3 rounded text-xs mb-4">{formError}</div>}

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div className="form-group mb-0">
                <label className="form-label">Service Name *</label>
                <input
                  type="text"
                  className="form-input text-xs"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-input text-xs"
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                  >
                    <option value="Hair">Hair</option>
                    <option value="Skin">Skin</option>
                    <option value="Spa">Spa</option>
                    <option value="Grooming">Grooming</option>
                    <option value="Nail">Nail</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Package">Package</option>
                  </select>
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">Gender *</label>
                  <select
                    className="form-input text-xs"
                    value={serviceForm.gender}
                    onChange={(e) => setServiceForm({ ...serviceForm, gender: e.target.value })}
                  >
                    <option value="MEN">MEN</option>
                    <option value="WOMEN">WOMEN</option>
                    <option value="BOTH">BOTH</option>
                  </select>
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-input text-xs"
                  rows={3}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="form-group mb-0">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    className="form-input text-xs"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Discount Price (₹)</label>
                  <input
                    type="number"
                    className="form-input text-xs"
                    value={serviceForm.discount_price}
                    onChange={(e) => setServiceForm({ ...serviceForm, discount_price: e.target.value })}
                  />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Duration (Mins) *</label>
                  <input
                    type="number"
                    className="form-input text-xs"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setServiceModalOpen(false)} className="btn-secondary flex-1 py-2 text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={formLoading} className="btn-primary flex-1 py-2 text-xs">
                  {formLoading ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFER MODAL */}
      {offerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setOfferModalOpen(false)} className="absolute right-4 top-4 text-gray-400 hover:text-secondary">
              <X size={20} />
            </button>
            <h3 className="text-2xl font-serif text-secondary mb-4">
              {editingOffer ? "Edit Offer" : "Add New Offer"}
            </h3>

            {formError && <div className="bg-red-50 text-red-700 p-3 rounded text-xs mb-4">{formError}</div>}

            <form onSubmit={handleSaveOffer} className="space-y-4 text-xs">
              <div className="form-group mb-0">
                <label className="form-label">Offer Title *</label>
                <input
                  type="text"
                  className="form-input text-xs"
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-input text-xs"
                  rows={2}
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label className="form-label">Discount % *</label>
                  <input
                    type="number"
                    className="form-input text-xs"
                    value={offerForm.discount}
                    onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Target Gender *</label>
                  <select
                    className="form-input text-xs"
                    value={offerForm.gender}
                    onChange={(e) => setOfferForm({ ...offerForm, gender: e.target.value })}
                  >
                    <option value="BOTH">BOTH (Men & Women)</option>
                    <option value="MEN">MEN</option>
                    <option value="WOMEN">WOMEN</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    className="form-input text-xs"
                    value={offerForm.start_date}
                    onChange={(e) => setOfferForm({ ...offerForm, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">End Date *</label>
                  <input
                    type="date"
                    className="form-input text-xs"
                    value={offerForm.end_date}
                    onChange={(e) => setOfferForm({ ...offerForm, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setOfferModalOpen(false)} className="btn-secondary flex-1 py-2 text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={formLoading} className="btn-primary flex-1 py-2 text-xs">
                  {formLoading ? "Saving..." : "Save Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="container py-32 text-center text-muted">Loading admin dashboard...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
