"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronRight, CalendarDays, Clock, CreditCard } from "lucide-react";

function BookAppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedService = searchParams?.get("service");

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentPreference, setPaymentPreference] = useState("PAY_AFTER_SERVICE");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM", "07:00 PM"];

  useEffect(() => {
    if (selectedDate) {
      setCheckingAvailability(true);
      fetch(`/api/bookings/availability?date=${selectedDate}`)
        .then(res => res.json())
        .then(data => {
          if (data.occupiedSlots) {
            setOccupiedSlots(data.occupiedSlots);
            // If currently selected slot is occupied, clear selection
            if (data.occupiedSlots.includes(selectedTime)) {
              setSelectedTime("");
            }
          }
          setCheckingAvailability(false);
        })
        .catch(() => setCheckingAvailability(false));
    }
  }, [selectedDate]);

  useEffect(() => {
    // Fetch services
    fetch("/api/services")
      .then(res => res.json())
      .then(data => {
        setServices(data.services || []);
        if (preselectedService && data.services) {
          const s = data.services.find((x: any) => x.id === preselectedService);
          if (s) setSelectedService(s);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [preselectedService]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setBookingLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: selectedService.id,
          booking_date: selectedDate,
          booking_time: selectedTime,
          notes,
          payment_preference: paymentPreference,
          total_amount: selectedService.price
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setError("Please log in to your account to complete your booking.");
          setTimeout(() => {
            router.push(`/login?redirect=/book?service=${selectedService?.id || ''}`);
          }, 1500);
          return;
        }
        throw new Error(data.message || "Failed to book appointment");
      }

      router.push(`/book/success?id=${data.booking.booking_number}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="container py-32 text-center text-muted">Loading booking system...</div>;
  }

  return (
    <div className="container py-12 animate-fade-in max-w-4xl">
      <h1 className="text-3xl font-serif text-secondary mb-8 text-center">Book Your Appointment</h1>
      
      {/* Stepper */}
      <div className="flex justify-between items-center mb-12 relative">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-border -z-10 -translate-y-1/2"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
            step >= i ? 'bg-primary text-white' : 'bg-surface border-2 border-border text-gray-400'
          }`}>
            {step > i ? <CheckCircle2 size={20} /> : i}
          </div>
        ))}
      </div>

      <div className="card shadow-lg p-8">
        {error && (
          <div className="bg-red-50 text-error p-4 rounded-md mb-6 border border-red-200">
            {error}
          </div>
        )}

        {/* Step 1: Select Service */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl mb-6 font-serif">Select a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div 
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedService?.id === service.id ? 'border-primary bg-primary-light' : 'border-border hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{service.name}</h3>
                    <span className="text-primary font-bold">₹{service.price}</span>
                  </div>
                  <div className="text-sm text-muted">{service.duration} mins &bull; {service.gender}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={handleNext} disabled={!selectedService} className="btn-primary disabled:opacity-50">
                Continue <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 & 3: Date and Time */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl mb-6 font-serif">Select Date & Time</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="form-label mb-4 flex items-center gap-2"><CalendarDays size={18}/> Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2"><Clock size={18}/> Time Slots</span>
                  {checkingAvailability && <span className="text-xs text-primary animate-pulse">Checking availability...</span>}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map(time => {
                    const isOccupied = occupiedSlots.includes(time);
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => !isOccupied && setSelectedTime(time)}
                        className={`p-3 text-center text-sm border rounded-md transition-all flex flex-col items-center justify-center relative ${
                          isOccupied 
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through'
                            : isSelected 
                              ? 'bg-primary text-white border-primary font-bold shadow' 
                              : 'border-border hover:border-primary hover:text-primary bg-white'
                        }`}
                      >
                        <span>{time}</span>
                        {isOccupied && (
                          <span className="text-[10px] text-red-500 font-normal no-underline uppercase tracking-tighter">Booked</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={handleBack} className="btn-secondary">Back</button>
              <button onClick={handleNext} disabled={!selectedDate || !selectedTime} className="btn-primary disabled:opacity-50">
                Continue <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Details */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl mb-6 font-serif">Add Details</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-border">
              <h4 className="font-bold mb-2">Booking Summary</h4>
              <p className="text-sm mb-1"><span className="text-muted w-24 inline-block">Service:</span> {selectedService.name}</p>
              <p className="text-sm mb-1"><span className="text-muted w-24 inline-block">Date:</span> {selectedDate}</p>
              <p className="text-sm"><span className="text-muted w-24 inline-block">Time:</span> {selectedTime}</p>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="notes">Special Requests / Notes (Optional)</label>
              <textarea 
                id="notes"
                className="form-input" 
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for the stylist..."
              ></textarea>
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={handleBack} className="btn-secondary">Back</button>
              <button onClick={handleNext} className="btn-primary">
                Continue <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Payment */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl mb-6 font-serif">Payment Preference</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div 
                onClick={() => setPaymentPreference("PAY_NOW")}
                className={`p-6 border rounded-lg cursor-pointer ${
                  paymentPreference === "PAY_NOW" ? 'border-primary bg-primary-light' : 'border-border'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="text-primary" />
                  <h3 className="font-bold">Pay Now (Razorpay)</h3>
                </div>
                <p className="text-sm text-muted">Secure online payment. *Simulation for demo</p>
              </div>
              
              <div 
                onClick={() => setPaymentPreference("PAY_AFTER_SERVICE")}
                className={`p-6 border rounded-lg cursor-pointer ${
                  paymentPreference === "PAY_AFTER_SERVICE" ? 'border-primary bg-primary-light' : 'border-border'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="text-primary" />
                  <h3 className="font-bold">Pay After Service</h3>
                </div>
                <p className="text-sm text-muted">Pay at the salon after your service is completed.</p>
              </div>
            </div>

            <div className="flex justify-between items-center py-4 border-t border-border mb-8">
              <span className="text-lg font-medium">Total Amount to Pay</span>
              <span className="text-2xl font-bold text-primary">₹{selectedService.price}</span>
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={handleBack} className="btn-secondary" disabled={bookingLoading}>Back</button>
              <button onClick={handleSubmit} disabled={bookingLoading} className="btn-primary">
                {bookingLoading ? "Confirming..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookAppointment() {
  return (
    <Suspense fallback={<div className="container py-32 text-center text-muted">Loading booking system...</div>}>
      <BookAppointmentContent />
    </Suspense>
  );
}
