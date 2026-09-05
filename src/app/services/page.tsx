import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Sparkles, Scissors, Clock, ArrowRight, ShieldCheck, Check } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const allServices = await prisma.service.findMany({
    where: { status: "ACTIVE" },
  });

  const getService = (name: string) => allServices.find((s) => s.name === name);

  // Treatment table rows
  const treatments = [
    {
      name: "Global Colour",
      desc: "Complete global hair colour with rich pigments and long-lasting shine.",
      s: getService("Global Colour (Short Hair)"),
      m: getService("Global Colour (Medium Hair)"),
      b: getService("Global Colour (Long Hair)"),
    },
    {
      name: "Kera Smooth",
      desc: "Deep protein smoothing treatment for sleek, glossy, and frizz-free hair.",
      s: getService("Kera Smooth (Short Hair)"),
      m: getService("Kera Smooth (Medium Hair)"),
      b: getService("Kera Smooth (Long Hair)"),
    },
    {
      name: "Botox Treatment",
      desc: "Anti-aging restorative therapy to rebuild damaged hair fibers.",
      s: getService("Botox Treatment (Short Hair)"),
      m: getService("Botox Treatment (Medium Hair)"),
      b: getService("Botox Treatment (Long Hair)"),
    },
    {
      name: "Cysteine Treatment",
      desc: "Formaldehyde-free natural curl smoothing and moisture infuser.",
      s: getService("Cysteine Treatment (Short Hair)"),
      m: getService("Cysteine Treatment (Medium Hair)"),
      b: getService("Cysteine Treatment (Long Hair)"),
    },
    {
      name: "Keratin Treatment",
      desc: "Intense keratin infusion for maximum frizz control and high gloss.",
      s: getService("Keratin (Short Hair)"),
      m: getService("Keratin (Medium Hair)"),
      b: getService("Keratin (Long Hair)"),
    },
    {
      name: "Hair Smoothing",
      desc: "Permanent smoothing service for straight, silky, and manageable hair.",
      s: getService("Hair Smoothing (Short Hair)"),
      m: getService("Hair Smoothing (Medium Hair)"),
      b: getService("Hair Smoothing (Long Hair)"),
    },
    {
      name: "Nanoplastia",
      desc: "Advanced organic reconstruction with intense mirror-like shine.",
      s: getService("Nanoplastia (Short Hair)"),
      m: getService("Nanoplastia (Medium Hair)"),
      b: getService("Nanoplastia (Long Hair)"),
    },
  ];

  // Waxing rows
  const waxingItems = [
    {
      name: "Full Hand Wax",
      honey: getService("Full Hand Wax (Honey)"),
      rica: getService("Full Hand Wax (Rica)"),
    },
    {
      name: "Full Leg Wax",
      honey: getService("Full Leg Wax (Honey)"),
      rica: getService("Full Leg Wax (Rica)"),
    },
    {
      name: "Half Hand Wax",
      honey: getService("Half Hand Wax (Honey)"),
      rica: getService("Half Hand Wax (Rica)"),
    },
    {
      name: "Half Leg Wax",
      honey: getService("Half Leg Wax (Honey)"),
      rica: getService("Half Leg Wax (Rica)"),
    },
    {
      name: "Under Arm's Wax",
      honey: getService("Under Arm's Wax (Honey)"),
      rica: getService("Under Arm's Wax (Rica)"),
    },
    {
      name: "Face Wax",
      honey: getService("Face Wax (Honey)"),
      rica: getService("Face Wax (Rica)"),
    },
    {
      name: "Upper Lips Wax",
      honey: getService("Upper Lips Wax (Honey)"),
      rica: getService("Upper Lips Wax (Rica)"),
    },
    {
      name: "Chin Wax",
      honey: getService("Chin Wax (Honey)"),
      rica: getService("Chin Wax (Rica)"),
    },
    {
      name: "Full Body Wax",
      honey: null,
      rica: getService("Full Body Wax (Rica)"),
    },
  ];

  const basicHairCare = [
    {
      service: getService("Hair Cut (Trimming)"),
      fallbackPrice: 150,
      name: "Hair Cut (Trimming)",
      duration: "25 min",
      desc: "Split-end trimming, shaping, and length maintenance.",
      icon: "✂️",
    },
    {
      service: getService("Hair Cut (Advance)"),
      fallbackPrice: 300,
      name: "Hair Cut (Advance)",
      duration: "40 min",
      desc: "Precision customized haircut styled to flatter your face profile.",
      icon: "💇",
    },
    {
      service: getService("Hair Wash"),
      fallbackPrice: 150,
      name: "Hair Wash",
      duration: "20 min",
      desc: "Scalp cleansing wash with premium professional shampoo and conditioner.",
      icon: "🫧",
    },
    {
      service: getService("Head Massage"),
      fallbackPrice: 400,
      name: "Head Massage",
      duration: "30 min",
      desc: "Relaxing stress-relief head massage using revitalizing warm herbal oils.",
      icon: "💆",
    },
    {
      service: getService("Hair Spa"),
      fallbackPrice: 700,
      name: "Hair Spa",
      duration: "60 min",
      desc: "Intensive deep nourishing hair spa for smooth, lustrous, damage-free locks.",
      icon: "✨",
    },
    {
      service: getService("Hair Root Touchup"),
      fallbackPrice: 800,
      name: "Hair Root Touchup",
      duration: "60 min",
      desc: "Precise root touchup colour application to blend regrowth seamlessly.",
      icon: "🎨",
    },
    {
      service: getService("Highlights (Per Strip)"),
      fallbackPrice: 150,
      name: "Highlights (Per Strip)",
      duration: "30 min",
      desc: "Individual custom foil highlight streak or strip with bespoke toner.",
      icon: "🪄",
    },
    {
      service: getService("Highlights (Full)"),
      fallbackPrice: 3000,
      name: "Highlights (Full)",
      duration: "120 min",
      desc: "Full head dimensional highlights for luminous texture, depth, and contrast.",
      icon: "🌟",
    },
  ];

  return (
    <div className="py-14 animate-fade-in" style={{ background: "#faf9f7" }}>
      <div className="container">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#c19d60",
            display: "inline-block",
            marginBottom: "12px"
          }}>
            Official Salon Rate Card
          </span>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
            fontWeight: 800,
            color: "#121315",
            marginBottom: "16px",
            lineHeight: 1.15
          }}>
            Hair Care & Waxing Menu
          </h1>
          <p style={{ color: "#6b7280", fontSize: "1.05rem", lineHeight: 1.7 }}>
            Explore our complete certified rate card directly from SS Hair Studio. Transparent pricing with no hidden charges.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
            <a href="#hair-care" style={{
              background: "#1f2937",
              color: "#fff",
              padding: "10px 22px",
              borderRadius: "30px",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}>
              ✂️ Hair Care Menu
            </a>
            <a href="#hair-treatments" style={{
              background: "#1f2937",
              color: "#fff",
              padding: "10px 22px",
              borderRadius: "30px",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}>
              ✨ Treatments (S / M / B)
            </a>
            <a href="#waxing" style={{
              background: "#c19d60",
              color: "#fff",
              padding: "10px 22px",
              borderRadius: "30px",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}>
              🍯 Waxing (Honey & Rica)
            </a>
          </div>
        </div>

        {/* ── SECTION 1: HAIR CARE (DAILY & STYLING) ── */}
        <section id="hair-care" style={{ marginBottom: "80px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "32px",
            borderBottom: "2px solid #ede8df",
            paddingBottom: "16px",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#c19d60", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                Menu 1 • Part A
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 700, color: "#121315" }}>
                Hair Care Services
              </h2>
            </div>
            <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              Classic cuts, wash, relaxing head massage & spa
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {basicHairCare.map((item, i) => {
              const bookId = item.service?.id || "haircare";
              const price = item.service ? item.service.price : item.fallbackPrice;

              return (
                <div key={i} style={{
                  background: "#fff",
                  borderRadius: "16px",
                  border: "1px solid #ede8df",
                  padding: "26px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  transition: "all 0.25s ease"
                }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div style={{ fontSize: "1.8rem" }}>{item.icon}</div>
                      <span style={{
                        background: "rgba(193,157,96,0.12)",
                        color: "#c19d60",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        <Clock size={12} /> {item.duration}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 700, color: "#121315", marginBottom: "6px" }}>
                      {item.name}
                    </h3>
                    <p style={{ color: "#6b7280", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "20px" }}>
                      {item.desc}
                    </p>
                  </div>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #f3f4f6",
                    paddingTop: "16px"
                  }}>
                    <div>
                      <span style={{ fontSize: "0.7rem", color: "#9ca3af", display: "block", textTransform: "uppercase" }}>Price</span>
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "#121315" }}>
                        ₹{price}
                      </span>
                    </div>
                    <Link
                      href={`/book?service=${bookId}`}
                      style={{
                        background: "#121315",
                        color: "#fff",
                        padding: "8px 18px",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        textDecoration: "none",
                        transition: "all 0.2s ease"
                      }}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 2: SPECIALIST HAIR TREATMENTS (S / M / B) ── */}
        <section id="hair-treatments" style={{ marginBottom: "80px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "24px",
            borderBottom: "2px solid #ede8df",
            paddingBottom: "16px",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#c19d60", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                Menu 1 • Part B
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 700, color: "#121315" }}>
                Hair Care Treatments & Colouring
              </h2>
            </div>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", background: "#fff", padding: "8px 16px", borderRadius: "8px", border: "1px solid #ede8df" }}>
              <strong>S:</strong> Short Hair &nbsp;|&nbsp; <strong>M:</strong> Medium Hair &nbsp;|&nbsp; <strong>B:</strong> Long / Big Hair
            </div>
          </div>

          {/* Rate Card Table */}
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            border: "1px solid #ede8df",
            overflowX: "auto",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "640px" }}>
              <thead>
                <tr style={{ background: "#253b2f", color: "#fff" }}>
                  <th style={{ padding: "18px 24px", fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, width: "40%" }}>
                    Hair Care Service
                  </th>
                  <th style={{ padding: "18px 16px", textAlign: "center", fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem", fontWeight: 700 }}>
                    S (Short)
                  </th>
                  <th style={{ padding: "18px 16px", textAlign: "center", fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem", fontWeight: 700 }}>
                    M (Medium)
                  </th>
                  <th style={{ padding: "18px 16px", textAlign: "center", fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem", fontWeight: 700 }}>
                    B (Long)
                  </th>
                  <th style={{ padding: "18px 20px", textAlign: "right", fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", fontWeight: 700 }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {treatments.map((t, idx) => (
                  <tr
                    key={t.name}
                    style={{
                      borderBottom: "1px solid #f0ede8",
                      background: idx % 2 === 0 ? "#fff" : "#faf9f7",
                      transition: "background 0.2s"
                    }}
                  >
                    <td style={{ padding: "20px 24px" }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: "#121315" }}>
                        {t.name}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "3px" }}>
                        {t.desc}
                      </div>
                    </td>
                    <td style={{ padding: "20px 16px", textAlign: "center" }}>
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "#121315" }}>
                        ₹{t.s?.price || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "20px 16px", textAlign: "center" }}>
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "#121315" }}>
                        ₹{t.m?.price || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "20px 16px", textAlign: "center" }}>
                      <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "#c19d60" }}>
                        ₹{t.b?.price || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "20px 20px", textAlign: "right" }}>
                      <Link
                        href={`/book?service=${t.s?.id || t.m?.id || t.b?.id || ""}`}
                        style={{
                          background: "#c19d60",
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          textDecoration: "none",
                          display: "inline-block"
                        }}
                      >
                        Book
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── SECTION 3: WAXING (HONEY VS RICA) ── */}
        <section id="waxing" style={{ marginBottom: "60px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "24px",
            borderBottom: "2px solid #ede8df",
            paddingBottom: "16px",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#c19d60", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                Menu 2
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 700, color: "#121315" }}>
                Waxing Rate Card
              </h2>
            </div>
            <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
              Natural <strong>Honey Wax</strong> &amp; Premium Pain-Free <strong>Rica Liposoluble Wax</strong>
            </div>
          </div>

          <div style={{
            background: "#fff",
            borderRadius: "16px",
            border: "1px solid #ede8df",
            overflowX: "auto",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "640px" }}>
              <thead>
                <tr style={{ background: "#253b2f", color: "#fff" }}>
                  <th style={{ padding: "18px 24px", fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, width: "45%" }}>
                    Service / Area
                  </th>
                  <th style={{ padding: "18px 20px", textAlign: "center", fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem", fontWeight: 700 }}>
                    🍯 Honey Wax
                  </th>
                  <th style={{ padding: "18px 20px", textAlign: "center", fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem", fontWeight: 700 }}>
                    ✨ Rica Wax
                  </th>
                  <th style={{ padding: "18px 24px", textAlign: "right", fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", fontWeight: 700 }}>
                    Book
                  </th>
                </tr>
              </thead>
              <tbody>
                {waxingItems.map((item, idx) => (
                  <tr
                    key={item.name}
                    style={{
                      borderBottom: "1px solid #f0ede8",
                      background: idx % 2 === 0 ? "#fff" : "#faf9f7"
                    }}
                  >
                    <td style={{ padding: "18px 24px" }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: "#121315" }}>
                        {item.name}
                      </span>
                    </td>
                    <td style={{ padding: "18px 20px", textAlign: "center" }}>
                      {item.honey ? (
                        <Link
                          href={`/book?service=${item.honey.id}`}
                          style={{
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: "#121315",
                            textDecoration: "none",
                            background: "rgba(193,157,96,0.08)",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            border: "1px solid rgba(193,157,96,0.2)",
                            display: "inline-block"
                          }}
                        >
                          ₹{item.honey.price}
                        </Link>
                      ) : (
                        <span style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "0.85rem" }}>N/A</span>
                      )}
                    </td>
                    <td style={{ padding: "18px 20px", textAlign: "center" }}>
                      {item.rica ? (
                        <Link
                          href={`/book?service=${item.rica.id}`}
                          style={{
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: "#c19d60",
                            textDecoration: "none",
                            background: "rgba(193,157,96,0.14)",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            border: "1px solid rgba(193,157,96,0.4)",
                            display: "inline-block"
                          }}
                        >
                          ₹{item.rica.price}
                        </Link>
                      ) : (
                        <span style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "0.85rem" }}>N/A</span>
                      )}
                    </td>
                    <td style={{ padding: "18px 24px", textAlign: "right" }}>
                      <Link
                        href={`/book?service=${item.rica?.id || item.honey?.id || ""}`}
                        style={{
                          background: "#121315",
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          textDecoration: "none",
                          display: "inline-block"
                        }}
                      >
                        Book Now
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <div style={{
          background: "#121315",
          borderRadius: "20px",
          padding: "48px 36px",
          color: "#fff",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", marginBottom: "12px" }}>
            Ready to book your salon session?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: "540px", margin: "0 auto 28px", fontSize: "0.95rem" }}>
            Choose your preferred service, select your time slot, and pay at the salon or securely online.
          </p>
          <Link
            href="/book"
            style={{
              background: "#c19d60",
              color: "#fff",
              padding: "14px 34px",
              borderRadius: "8px",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            Book Appointment Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
