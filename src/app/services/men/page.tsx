import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Clock, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MenServices() {
  const services = await prisma.service.findMany({
    where: {
      status: "ACTIVE",
      category: { in: ["Hair Care", "Hair Treatments"] },
    },
    orderBy: { price: "asc" },
  });

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
          Menu 1
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-secondary mb-4">Men's Hair Care & Styling</h1>
        <p className="text-muted text-lg">
          Precision haircuts, rejuvenating head massages, deep conditioning hair spa, and advanced hair treatments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="card p-6 flex flex-col justify-between h-full border-l-4 border-primary">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{service.name}</h3>
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
  );
}
