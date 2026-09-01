"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { LogIn, UserPlus, CalendarDays, LogOut, Menu, X, Calendar, ChevronDown, Sun, Moon } from "lucide-react";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setMobileMenuOpen(false);

  const navLinkStyle: React.CSSProperties = {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 600,
    fontSize: "0.8rem",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#374151",
    textDecoration: "none",
    padding: "6px 0",
    position: "relative",
    transition: "color 0.2s",
    display: "inline-block",
  };

  const activeLinkStyle: React.CSSProperties = {
    ...navLinkStyle,
    color: "#c19d60",
  };

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: scrolled ? "rgba(255,255,255,0.98)" : "#ffffff",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(229,231,235,0.7)",
      boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
      transition: "box-shadow 0.3s ease, background 0.3s ease",
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: "72px" }}>

        {/* ── Logo ── */}
        <Link href="/" onClick={close} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%",
            background: "#c19d60", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700, fontSize: "1.1rem",
            boxShadow: "0 2px 10px rgba(193,157,96,0.35)",
            flexShrink: 0, transition: "transform 0.2s ease"
          }}>
            SS
          </div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700, fontSize: "1.2rem",
            color: "#121315", letterSpacing: "-0.01em"
          }}>
            SS SALON
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav style={{ display: "none", alignItems: "center", gap: "28px" }} className="desktop-nav">
          {/* Guest */}
          {!user && (
            <>
              {["Home", "Services", "Offers", "About Us", "Contact"].map((label, i) => {
                const href = ["/", "/services", "/offers", "/about", "/contact"][i];
                return (
                  <Link key={label} href={href} style={navLinkStyle}
                    onMouseEnter={e => (e.currentTarget.style.color = "#c19d60")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
                  >{label}</Link>
                );
              })}
            </>
          )}

          {/* Customer */}
          {user?.role === "CUSTOMER" && (
            <>
              {[["Home", "/"], ["Services", "/services"], ["Offers", "/offers"]].map(([l, h]) => (
                <Link key={l} href={h} style={navLinkStyle}
                  onMouseEnter={e => (e.currentTarget.style.color = "#c19d60")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
                >{l}</Link>
              ))}
              <Link href="/customer/dashboard" style={activeLinkStyle}>Dashboard</Link>
              <Link href="/customer/dashboard?tab=bookings" style={navLinkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = "#c19d60")}
                onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
              >My Bookings</Link>
              <Link href="/customer/dashboard?tab=notifications" style={navLinkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = "#c19d60")}
                onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
              >Notifications</Link>
            </>
          )}

          {/* Manager */}
          {user?.role === "MANAGER" && (
            <>
              <Link href="/manager/dashboard" style={activeLinkStyle}>Dashboard</Link>
              <Link href="/manager/dashboard?tab=requests" style={navLinkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = "#c19d60")}
                onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
              >Requests</Link>
              <Link href="/manager/dashboard?tab=calendar" style={navLinkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = "#c19d60")}
                onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
              >Schedule</Link>
              <Link href="/manager/dashboard?tab=appointments" style={navLinkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = "#c19d60")}
                onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
              >Appointments</Link>
            </>
          )}

          {/* Admin */}
          {user?.role === "ADMIN" && (
            <>
              <Link href="/admin/dashboard" style={activeLinkStyle}>Dashboard</Link>
              {[
                ["Users", "/admin/dashboard?tab=users"],
                ["Services", "/admin/dashboard?tab=services"],
                ["Offers", "/admin/dashboard?tab=offers"],
                ["Bookings", "/admin/dashboard?tab=bookings"],
                ["Feedback", "/admin/dashboard?tab=feedback"],
                ["Analytics", "/admin/dashboard?tab=analytics"],
              ].map(([l, h]) => (
                <Link key={l} href={h} style={navLinkStyle}
                  onMouseEnter={e => (e.currentTarget.style.color = "#c19d60")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
                >{l}</Link>
              ))}
            </>
          )}
        </nav>

        {/* ── Right Actions ── */}
        <div style={{ display: "none", alignItems: "center", gap: "12px" }} className="desktop-nav">
          {!loading && !user && (
            <>
              <Link href="/login" style={{
                fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "0.8rem",
                letterSpacing: "0.05em", color: "#374151", textDecoration: "none",
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 0", transition: "color 0.2s"
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c19d60")}
                onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
              >
                <LogIn size={16} /> Login
              </Link>
              <Link href="/register" style={{
                fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "0.8rem",
                letterSpacing: "0.05em", color: "#374151", textDecoration: "none",
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 0", transition: "color 0.2s"
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c19d60")}
                onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
              >
                <UserPlus size={16} /> Register
              </Link>
              <Link href="/book" style={{
                background: "#c19d60", color: "#fff",
                padding: "10px 22px", borderRadius: "8px",
                fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                fontSize: "0.8rem", letterSpacing: "0.05em", textTransform: "uppercase",
                display: "flex", alignItems: "center", gap: "8px",
                textDecoration: "none", transition: "all 0.25s ease",
                boxShadow: "0 2px 10px rgba(193,157,96,0.25)"
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#a8854a"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#c19d60"; (e.currentTarget as HTMLElement).style.transform = ""; }}
              >
                <CalendarDays size={15} /> Book Now
              </Link>
            </>
          )}

          {!loading && user && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* User avatar + role */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f9f8f6", border: "1px solid #ede8df", padding: "6px 14px 6px 8px", borderRadius: "30px" }}>
                <div style={{
                  width: "30px", height: "30px", borderRadius: "50%",
                  background: "#c19d60", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "0.85rem"
                }}>
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#121315", lineHeight: 1 }}>{user.name}</div>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "0.65rem", color: "#c19d60", letterSpacing: "0.06em", textTransform: "uppercase" }}>{user.role}</div>
                </div>
              </div>
              <button onClick={logout} style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "0.78rem",
                color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca",
                padding: "8px 14px", borderRadius: "8px", cursor: "pointer",
                transition: "all 0.2s ease"
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#fee2e2"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fef2f2"; }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid rgba(193,157,96,0.3)",
              background: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(193,157,96,0.1)",
              color: "#c19d60",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* ── Mobile Hamburger ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className="lg:hidden">
          <button
            onClick={toggleTheme}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "1px solid rgba(193,157,96,0.3)",
              background: "rgba(193,157,96,0.1)",
              color: "#c19d60",
              cursor: "pointer",
            }}
            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {user && (
            <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#c19d60", background: "rgba(193,157,96,0.12)", padding: "4px 10px", borderRadius: "20px", border: "1px solid rgba(193,157,96,0.25)" }}>
              {user.role}
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(p => !p)}
            style={{ padding: "8px", color: "#374151", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div style={{
          background: "#fff", borderTop: "1px solid #ede8df",
          padding: "24px", display: "flex", flexDirection: "column", gap: "0",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)", animation: "fadeIn 0.2s ease"
        }}>
          {/* User Card */}
          {user && (
            <div style={{
              display: "flex", alignItems: "center", gap: "12px",
              background: "rgba(193,157,96,0.08)", border: "1px solid rgba(193,157,96,0.2)",
              borderRadius: "12px", padding: "14px 16px", marginBottom: "20px"
            }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#c19d60", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", flexShrink: 0 }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#121315" }}>{user.name}</div>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.72rem", fontWeight: 600, color: "#c19d60", letterSpacing: "0.06em", textTransform: "uppercase" }}>{user.role}</div>
              </div>
            </div>
          )}

          {/* Mobile Links */}
          {[
            ...(!user ? [
              ["Home", "/"], ["Services", "/services"], ["Offers", "/offers"],
              ["About Us", "/about"], ["Contact", "/contact"]
            ] : []),
            ...(user?.role === "CUSTOMER" ? [
              ["Customer Dashboard", "/customer/dashboard"],
              ["My Bookings", "/customer/dashboard?tab=bookings"],
              ["Notifications", "/customer/dashboard?tab=notifications"],
              ["Profile", "/customer/dashboard?tab=profile"],
            ] : []),
            ...(user?.role === "MANAGER" ? [
              ["Manager Dashboard", "/manager/dashboard"],
              ["Requests", "/manager/dashboard?tab=requests"],
              ["Schedule / Calendar", "/manager/dashboard?tab=calendar"],
              ["Appointments", "/manager/dashboard?tab=appointments"],
            ] : []),
            ...(user?.role === "ADMIN" ? [
              ["Admin Dashboard", "/admin/dashboard"],
              ["Users", "/admin/dashboard?tab=users"],
              ["Service Managers", "/admin/dashboard?tab=managers"],
              ["Services", "/admin/dashboard?tab=services"],
              ["Offers", "/admin/dashboard?tab=offers"],
              ["Bookings", "/admin/dashboard?tab=bookings"],
              ["Payments", "/admin/dashboard?tab=payments"],
              ["Feedback & Reviews", "/admin/dashboard?tab=feedback"],
              ["Analytics", "/admin/dashboard?tab=analytics"],
            ] : []),
          ].map(([label, href]) => (
            <Link key={label} href={href} onClick={close} style={{
              fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "0.875rem",
              color: "#374151", padding: "13px 4px", borderBottom: "1px solid #f3f4f6",
              display: "block", textDecoration: "none", transition: "color 0.2s"
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "#c19d60")}
              onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
            >
              {label}
            </Link>
          ))}

          {/* Mobile CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
            {!user ? (
              <>
                <Link href="/login" onClick={close} style={{ textAlign: "center", padding: "12px", borderRadius: "8px", border: "2px solid #d1d5db", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#121315", textDecoration: "none" }}>
                  Login
                </Link>
                <Link href="/book" onClick={close} style={{ textAlign: "center", padding: "12px", borderRadius: "8px", background: "#c19d60", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#fff", textDecoration: "none" }}>
                  Book Appointment
                </Link>
              </>
            ) : (
              <>
                {user.role === "CUSTOMER" && (
                  <Link href="/book" onClick={close} style={{ textAlign: "center", padding: "12px", borderRadius: "8px", background: "#c19d60", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#fff", textDecoration: "none" }}>
                    Book Appointment
                  </Link>
                )}
                <button onClick={() => { close(); logout(); }} style={{
                  padding: "12px", borderRadius: "8px",
                  background: "#fef2f2", border: "1px solid #fecaca",
                  fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                  fontSize: "0.875rem", color: "#dc2626", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                }}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
