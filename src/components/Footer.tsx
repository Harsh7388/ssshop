"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Phone, Mail, MapPin, Scissors, CalendarDays } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "#0e0c0a", color: "#fff", padding: "80px 0 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "48px", paddingBottom: "60px" }}>

        {/* Brand */}
        <div style={{ gridColumn: "span 1" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: "20px" }}>
            <Logo size="md" light={true} />
          </Link>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginBottom: "20px" }}>
            Premium unisex salon experience in Bhayandar East. Haircuts, spa, facials, waxing, and styling tailored for your style and confidence.
          </p>
          <div style={{ display: "flex", gap: "4px" }}>
            {["★","★","★","★","★"].map((s, i) => <span key={i} style={{ color: "#c19d60", fontSize: "1rem" }}>{s}</span>)}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c19d60", marginBottom: "20px" }}>Quick Links</h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
            {[["Home", "/"], ["Services", "/services"], ["Offers", "/offers"], ["About Us", "/about"], ["Contact Us", "/contact"]].map(([l, h]) => (
              <li key={l}>
                <Link href={h} style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#c19d60")}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                >{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c19d60", marginBottom: "20px" }}>Services</h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
            {[["Men's Grooming", "/services/men"], ["Women's Beauty", "/services/women"], ["Waxing (Honey & Rica)", "/services/women"], ["Hair Spa", "/services"], ["Beard Styling", "/services/men"]].map(([l, h]) => (
              <li key={l}>
                <Link href={h} style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#c19d60")}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                >{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c19d60", marginBottom: "20px" }}>Contact Us</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <a href="tel:8087799315" style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#c19d60")}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            >
              <Phone size={15} color="#c19d60" /> 8087799315
            </a>
            <a href="mailto:sshairstudio@gmail.com" style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#c19d60")}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            >
              <Mail size={15} color="#c19d60" /> sshairstudio@gmail.com
            </a>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
              <MapPin size={15} color="#c19d60" style={{ marginTop: "3px", flexShrink: 0 }} /> Shop no. 3 Rashmi Laxmi Sadan, Opposite Mira Bhayandar Mahanagar Palika, Navghar Road, Bhayandar East, Thane-401105, Maharastra
            </div>
          </div>

          <Link href="/book" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            marginTop: "24px",
            background: "#c19d60", color: "#fff",
            padding: "11px 22px", borderRadius: "8px",
            fontFamily: "Montserrat, sans-serif", fontWeight: 700,
            fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase",
            textDecoration: "none", transition: "all 0.25s ease"
          }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { (e.currentTarget as HTMLElement).style.background = "#a8854a"; }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { (e.currentTarget as HTMLElement).style.background = "#c19d60"; }}
          >
            <CalendarDays size={14} /> Book Appointment
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "22px 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>
            © {new Date().getFullYear()} SS Hair Studio. All rights reserved.
          </p>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: "6px" }}>
            <Scissors size={13} color="#c19d60" /> Premium Salon Services
          </p>
        </div>
      </div>
    </footer>
  );
}
