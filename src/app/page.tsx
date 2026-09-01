"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Scissors, Clock, Phone, MapPin, CheckCircle2, Sparkles, ChevronDown } from "lucide-react";

// Reviews section
function PublicReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/feedback/public").then(r => r.json()).then(d => setReviews(d.reviews || [])).catch(() => {});
  }, []);

  if (!reviews.length) return null;

  return (
    <section style={{ padding: "90px 0", background: "#faf9f7", borderTop: "1px solid #f0ede8" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#c19d60", display: "block", marginBottom: "14px" }}>
            ★ Verified Feedback
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 700, color: "#121315", marginBottom: "14px" }}>
            What Our Clients Say
          </h2>
          <p style={{ color: "#6b7280", fontSize: "1rem", maxWidth: "500px", margin: "0 auto" }}>
            Real reviews from our valued clients after their salon experience.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "28px" }}>
          {reviews.slice(0, 6).map((r: any) => (
            <div key={r.id} style={{
              background: "#fff", border: "1px solid #ede8df", borderRadius: "16px",
              padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              display: "flex", flexDirection: "column", gap: "16px",
              transition: "box-shadow 0.25s ease, transform 0.25s ease"
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(0,0,0,0.09)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", gap: "3px" }}>
                {[...Array(r.rating)].map((_: any, i: number) => (
                  <Star key={i} size={17} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#374151", fontSize: "1rem", lineHeight: 1.65 }}>
                "{r.comment}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "12px", borderTop: "1px solid #f0ede8", marginTop: "auto" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#c19d60", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                  {r.user?.name?.charAt(0) || "C"}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#121315" }}>{r.user?.name || "Verified Client"}</div>
                  <div style={{ fontSize: "0.75rem", color: "#c19d60", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Scissors size={11} /> {r.service?.name || "Salon Service"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const services = [
    { name: "Premium Haircut", price: "₹500", duration: "45 min", category: "Men's", icon: "✂️" },
    { name: "Beard Styling", price: "₹300", duration: "30 min", category: "Men's", icon: "🪒" },
    { name: "Head Massage", price: "₹400", duration: "30 min", category: "Men's", icon: "💆" },
    { name: "Advanced Facial", price: "₹1500", duration: "60 min", category: "Women's", icon: "✨" },
    { name: "Hair Spa", price: "₹1200", duration: "75 min", category: "Women's", icon: "💆‍♀️" },
    { name: "Bridal Makeup", price: "₹5000", duration: "150 min", category: "Women's", icon: "💍" },
  ];

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        minHeight: "92vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#0e0c0a"
      }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/hero.png"
            alt="SS SALON"
            fill
            className="object-cover"
            priority
            style={{ opacity: 0.4, objectPosition: "center 30%" }}
          />
          {/* Elegant gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(14,12,10,0.85) 0%, rgba(14,12,10,0.5) 60%, rgba(193,157,96,0.08) 100%)"
          }} />
        </div>

        {/* Decorative gold accent line */}
        <div style={{
          position: "absolute", left: "5%", top: "50%", transform: "translateY(-50%)",
          width: "3px", height: "200px", background: "linear-gradient(to bottom, transparent, #c19d60, transparent)",
          zIndex: 2, display: "none"
        }} />

        <div className="container" style={{ position: "relative", zIndex: 3, paddingTop: "80px", paddingBottom: "80px" }}>
          <div style={{ maxWidth: "680px" }}>
            {/* Eyebrow label */}
            <span style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#c19d60",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "22px"
            }}>
              <span style={{ display: "inline-block", width: "40px", height: "1px", background: "#c19d60" }} />
              Premium Salon Experience
              <span style={{ display: "inline-block", width: "40px", height: "1px", background: "#c19d60" }} />
            </span>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: "24px",
              letterSpacing: "-0.02em"
            }}>
              Your Style.{" "}
              <span style={{
                color: "#c19d60",
                fontStyle: "italic",
                display: "inline-block"
              }}>Your Confidence.</span>
              <br />Your SS Salon.
            </h1>

            <p style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.7,
              marginBottom: "40px",
              maxWidth: "520px"
            }}>
              Premium beauty & grooming for everyone. Look good, feel confident, and be yourself with our professional salon services for men and women.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link href="/book" style={{
                background: "#c19d60",
                color: "#fff",
                padding: "15px 36px",
                borderRadius: "8px",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 4px 20px rgba(193,157,96,0.4)",
                transition: "all 0.25s ease",
                textDecoration: "none"
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(193,157,96,0.5)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(193,157,96,0.4)"; }}
              >
                Book Appointment <ArrowRight size={18} />
              </Link>
              <Link href="/services" style={{
                background: "transparent",
                color: "#fff",
                padding: "15px 36px",
                borderRadius: "8px",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                border: "2px solid rgba(255,255,255,0.35)",
                transition: "all 0.25s ease",
                textDecoration: "none"
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#c19d60"; (e.currentTarget as HTMLElement).style.color = "#c19d60"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.35)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              >
                Explore Services
              </Link>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "40px", marginTop: "60px", paddingTop: "40px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              {[
                { value: "500+", label: "Happy Clients" },
                { value: "15+", label: "Services" },
                { value: "5★", label: "Avg. Rating" },
              ].map(s => (
                <div key={s.value}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "#c19d60" }}>{s.value}</div>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em", marginTop: "2px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
          zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
          color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.12em", fontFamily: "Montserrat, sans-serif"
        }}>
          SCROLL
          <ChevronDown size={18} style={{ animation: "bounce 1.8s infinite" }} />
        </div>
        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)}50%{transform:translateY(6px)} }`}</style>
      </section>

      {/* ── WHY CHOOSE US STRIP ── */}
      <section style={{ background: "#121315", padding: "60px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0" }}>
            {[
              { icon: "✂️", label: "Expert Stylists", desc: "Trained professionals" },
              { icon: "✨", label: "Premium Products", desc: "Top-grade brands only" },
              { icon: "📅", label: "Easy Booking", desc: "Book in 2 minutes" },
              { icon: "⭐", label: "5-Star Rated", desc: "By our clients" },
            ].map((f, i) => (
              <div key={i} style={{
                padding: "36px 32px",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{f.icon}</div>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#fff", marginBottom: "4px" }}>{f.label}</div>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section style={{ padding: "100px 0", background: "#faf9f7" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#c19d60", display: "block", marginBottom: "14px" }}>
              ✂ What We Offer
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 700, color: "#121315", marginBottom: "14px" }}>
              Our Popular Services
            </h2>
            <p style={{ color: "#6b7280", fontSize: "1rem", maxWidth: "460px", margin: "0 auto", lineHeight: 1.7 }}>
              Discover our most sought-after treatments delivered by our team of expert stylists.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: "24px" }}>
            {services.map((svc, i) => (
              <div key={i} style={{
                background: "#fff",
                border: "1px solid #ede8df",
                borderRadius: "16px",
                padding: "32px 28px",
                display: "flex",
                alignItems: "flex-start",
                gap: "20px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                transition: "all 0.25s ease",
                cursor: "default"
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.09)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.borderColor = "#c19d60"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.borderColor = "#ede8df"; }}
              >
                <div style={{
                  width: "56px", height: "56px", borderRadius: "14px",
                  background: "rgba(193,157,96,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.6rem", flexShrink: 0
                }}>
                  {svc.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, color: "#121315" }}>{svc.name}</h3>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "#c19d60" }}>{svc.price}</span>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <span style={{ fontSize: "0.78rem", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={12} /> {svc.duration}
                    </span>
                    <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#c19d60", background: "rgba(193,157,96,0.1)", padding: "2px 8px", borderRadius: "30px" }}>
                      {svc.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Link href="/services" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.875rem",
              letterSpacing: "0.05em", textTransform: "uppercase", color: "#121315",
              borderBottom: "2px solid #c19d60", paddingBottom: "4px",
              transition: "color 0.2s ease", textDecoration: "none"
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#c19d60"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#121315"}
            >
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SPECIAL OFFER BANNER ── */}
      <section style={{ padding: "90px 0", background: "#121315", position: "relative", overflow: "hidden" }}>
        {/* Gold blobs */}
        <div style={{ position: "absolute", top: "-80px", right: "-60px", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle, rgba(193,157,96,0.18) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "5%", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle, rgba(193,157,96,0.1) 0%, transparent 70%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: "40px", flexWrap: "wrap"
          }}>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#c19d60", display: "block", marginBottom: "14px" }}>
                Limited Time Offer
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "16px" }}>
                Weekend Grooming Package
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "28px", maxWidth: "420px" }}>
                Premium haircut, beard styling & head massage at an exclusive weekend price. Treat yourself to the full experience.
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8rem", fontWeight: 700, color: "#c19d60" }}>₹999</span>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.1rem", color: "rgba(255,255,255,0.35)", textDecoration: "line-through" }}>₹1200</span>
                <span style={{ background: "#c19d60", color: "#fff", fontSize: "0.75rem", fontWeight: 700, padding: "4px 10px", borderRadius: "6px" }}>Save ₹201</span>
              </div>
            </div>
            <div>
              <Link href="/offers" style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                background: "#c19d60", color: "#fff",
                padding: "16px 40px", borderRadius: "8px",
                fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase",
                boxShadow: "0 6px 24px rgba(193,157,96,0.35)",
                transition: "all 0.25s ease", textDecoration: "none"
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(193,157,96,0.45)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(193,157,96,0.35)"; }}
              >
                View All Offers <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY SS SALON ── */}
      <section style={{ padding: "100px 0", background: "#fff" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#c19d60", display: "block", marginBottom: "14px" }}>
              Why Us
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 700, color: "#121315" }}>
              The SS SALON Difference
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "32px" }}>
            {[
              { icon: <Star size={28} />, title: "Expert Professionals", body: "Highly trained and experienced stylists dedicated to excellence and your satisfaction." },
              { icon: <CheckCircle2 size={28} />, title: "Premium Products", body: "We use only the highest quality, professional-grade products for your hair and skin." },
              { icon: <Sparkles size={28} />, title: "Relaxing Atmosphere", body: "Step into an oasis of calm. Our luxurious environment is designed to help you unwind." },
            ].map((f, i) => (
              <div key={i} style={{
                padding: "44px 36px", textAlign: "center",
                border: "1px solid #ede8df", borderRadius: "20px",
                background: "#faf9f7",
                transition: "all 0.25s ease"
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#c19d60"; (e.currentTarget as HTMLElement).style.background = "#fff"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(0,0,0,0.07)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#ede8df"; (e.currentTarget as HTMLElement).style.background = "#faf9f7"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <div style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  background: "rgba(193,157,96,0.12)", color: "#c19d60",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 24px"
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", marginBottom: "12px", color: "#121315" }}>{f.title}</h3>
                <p style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.7 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <Suspense fallback={null}>
        <PublicReviews />
      </Suspense>

      {/* ── CONTACT CTA ── */}
      <section style={{ padding: "90px 0", background: "#faf9f7", borderTop: "1px solid #ede8df" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#c19d60", display: "block", marginBottom: "14px" }}>
            Get In Touch
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.6rem)", fontWeight: 700, color: "#121315", marginBottom: "16px" }}>
            Ready for a New Look?
          </h2>
          <p style={{ color: "#6b7280", fontSize: "1rem", marginBottom: "40px" }}>
            Book an appointment or reach us directly — we'd love to have you.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "40px" }}>
            <Link href="/book" style={{
              background: "#c19d60", color: "#fff",
              padding: "14px 36px", borderRadius: "8px",
              fontFamily: "Montserrat, sans-serif", fontWeight: 700,
              fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase",
              display: "inline-flex", alignItems: "center", gap: "10px",
              boxShadow: "0 4px 16px rgba(193,157,96,0.3)", textDecoration: "none",
              transition: "all 0.25s ease"
            }}>
              Book Now <ArrowRight size={16} />
            </Link>
            <Link href="/contact" style={{
              background: "transparent", color: "#121315",
              padding: "14px 36px", borderRadius: "8px",
              fontFamily: "Montserrat, sans-serif", fontWeight: 600,
              fontSize: "0.9rem", letterSpacing: "0.04em", textTransform: "uppercase",
              display: "inline-flex", alignItems: "center", gap: "10px",
              border: "2px solid #d1d5db", textDecoration: "none",
              transition: "all 0.25s ease"
            }}>
              Contact Us
            </Link>
          </div>
          <div style={{ display: "flex", gap: "32px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="tel:7388917730" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "0.875rem", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
              <Phone size={16} color="#c19d60" /> 7388917730
            </a>
            <span style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "0.875rem", fontFamily: "Montserrat, sans-serif" }}>
              <MapPin size={16} color="#c19d60" /> SS SALON, Your City
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
