"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams?.get("id");

  return (
    <div className="container py-32 flex justify-center items-center">
      <div className="card text-center max-w-md p-12">
        <CheckCircle className="text-emerald-600 mx-auto mb-6" size={64} />
        <h1 className="text-3xl font-serif text-secondary mb-4">Booking Requested!</h1>
        {bookingId && <p className="text-lg mb-2">Booking ID: <span className="font-bold">{bookingId}</span></p>}
        <p className="text-muted mb-8">
          Your booking request has been sent to the SS Hair Studio service manager. You will receive a confirmation once your appointment is scheduled.
        </p>
        <div className="flex flex-col gap-4">
          <Link href="/customer/dashboard" className="btn-primary w-full">
            Go to My Dashboard
          </Link>
          <Link href="/" className="btn-secondary w-full">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccess() {
  return (
    <Suspense fallback={<div className="container py-32 text-center text-muted">Loading confirmation...</div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}
