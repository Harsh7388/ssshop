"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquareQuote, Scissors, Sparkles } from "lucide-react";

export default function PublicCustomerReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feedback/public", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container text-center text-muted">
          Loading customer reviews...
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Don't show empty section if no approved reviews yet
  }

  return (
    <section className="py-20 bg-background border-t border-border">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block flex items-center justify-center gap-1.5">
            <Sparkles size={16} /> Verified Feedback
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-secondary mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted text-base md:text-lg">
            Real experiences and reviews shared by our valued clients after their completed salon services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="card p-8 bg-surface border border-border shadow-md hover:shadow-xl transition-all rounded-2xl flex flex-col justify-between relative group"
            >
              <div className="absolute top-6 right-6 text-primary/20 group-hover:text-primary/40 transition-colors">
                <MessageSquareQuote size={40} />
              </div>

              <div>
                {/* 5-Star Rating Icons */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-gray-700 text-sm md:text-base leading-relaxed italic mb-6 relative z-10">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold font-serif text-sm">
                  {review.user?.name?.charAt(0) || "C"}
                </div>
                <div>
                  <h4 className="font-bold text-secondary text-sm">{review.user?.name || "Verified Customer"}</h4>
                  <span className="text-xs text-primary font-semibold flex items-center gap-1">
                    <Scissors size={12} /> Service: {review.service?.name || "Salon Service"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
