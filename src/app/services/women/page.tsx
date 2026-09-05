import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Clock, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WomenServices() {
  const services = await prisma.service.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: [{ category: "desc" }, { price: "asc" }],
  });

  const waxingServices = services.filter((s) => s.category === "Waxing");
  const hairServices = services.filter((s) => s.category !== "Waxing");

  return (
    <div className="container py-20 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: "0.75rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#c19d60",
          display: "block",
          marginBottom: "10px"
        }}>
          Menus 1 &amp; 2
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-secondary mb-4">Women's Hair Care &amp; Waxing</h1>
        <p className="text-muted text-lg">
          Complete Hair Care treatments, cuts, spa, styling, and premium Honey &amp; Rica waxing services.
        </p>
      </div>

      {/* Waxing Section */}
      <div className="mb-16">
        <div className="flex justify-between items-end mb-8 border-b border-border pb-4">
          <div>
            <span className="text-xs font-bold text-primary tracking-widest uppercase">Specialist Waxing</span>
            <h2 className="text-3xl font-serif text-secondary">Honey &amp; Rica Waxing</h2>
          </div>
          <Link href="/services#waxing" className="text-primary hover:underline text-sm font-semibold">
            View Table Comparison
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {waxingServices.map((service) => (
            <div key={service.id} className="card p-6 flex flex-col justify-between h-full border-l-4 border-amber-400">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{service.name}</h3>
                  <span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded flex items-center gap-1 font-semibold border border-amber-200">
                    <Clock size={12} /> {service.duration} mins
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide font-medium">{service.category}</p>
                <p className="text-muted mb-6 text-sm leading-relaxed">{service.description}</p>
              </div>
              <div className="flex justify-between items-center mt-auto border-t border-border pt-4">
                <div className="text-2xl font-bold text-primary">₹{service.price}</div>
                <Link href={`/book?service=${service.id}`} className="btn-primary text-sm px-4 py-2 flex items-center gap-1">
                  Book Now <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hair Care & Treatments Section */}
      <div>
        <div className="flex justify-between items-end mb-8 border-b border-border pb-4">
          <div>
            <span className="text-xs font-bold text-primary tracking-widest uppercase">Hair Care &amp; Treatments</span>
            <h2 className="text-3xl font-serif text-secondary">Hair Care Menu</h2>
          </div>
          <Link href="/services#hair-treatments" className="text-primary hover:underline text-sm font-semibold">
            View S / M / B Rates
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hairServices.map((service) => (
            <div key={service.id} className="card p-6 flex flex-col justify-between h-full border-l-4 border-primary">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{service.name}</h3>
                  <span className="bg-primary-light text-primary text-xs px-2 py-1 rounded flex items-center gap-1 font-semibold">
                    <Clock size={12} /> {service.duration} mins
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide font-medium">{service.category}</p>
                <p className="text-muted mb-6 text-sm leading-relaxed">{service.description}</p>
              </div>
              <div className="flex justify-between items-center mt-auto border-t border-border pt-4">
                <div className="text-2xl font-bold text-primary">₹{service.price}</div>
                <Link href={`/book?service=${service.id}`} className="btn-primary text-sm px-4 py-2 flex items-center gap-1">
                  Book Now <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
