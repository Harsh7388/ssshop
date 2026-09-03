"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, Scissors } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }, 800);
  };

  return (
    <div className="container py-16 animate-fade-in max-w-5xl">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">Contact SS Hair Studio</span>
        <h1 className="text-4xl md:text-5xl font-serif text-secondary mb-4">Get In Touch With Us</h1>
        <p className="text-muted text-lg">
          Have questions or need assistance with your booking? Reach out directly via call, email, or visit our studio in Bhayandar East.
        </p>
      </div>

      {/* Direct Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Direct Call Card */}
        <div className="card bg-gradient-to-br from-secondary to-secondary-hover text-white p-8 rounded-xl flex flex-col justify-between shadow-lg">
          <div>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6">
              <Phone size={24} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-2">📞 Call Us Directly</h3>
            <p className="text-gray-300 text-sm mb-4">
              Speak with our customer care and service team immediately.
            </p>
            <div className="text-3xl font-bold text-primary mb-2 tracking-wide">
              8087799315
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700">
            <a 
              href="tel:8087799315" 
              className="btn-primary w-full text-center block text-lg font-bold py-3 shadow-md hover:scale-[1.02] transition-transform"
            >
              Call 8087799315 Now
            </a>
          </div>
        </div>

        {/* Direct Email Card */}
        <div className="card bg-surface border-2 border-primary/20 p-8 rounded-xl flex flex-col justify-between shadow-lg">
          <div>
            <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary mb-6">
              <Mail size={24} />
            </div>
            <h3 className="text-2xl font-serif text-secondary mb-2">📧 Email Us</h3>
            <p className="text-muted text-sm mb-4">
              Send us your inquiries, custom requirements, or feedback anytime.
            </p>
            <div className="text-xl font-bold text-secondary mb-2 break-all">
              sshairstudio@gmail.com
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border">
            <a 
              href="mailto:sshairstudio@gmail.com" 
              className="btn-secondary w-full text-center block text-lg font-bold py-3 shadow-sm hover:scale-[1.02] transition-transform"
            >
              Email sshairstudio@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Contact Form and Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 card p-8 shadow-md">
          <h2 className="text-2xl font-serif text-secondary mb-6 flex items-center gap-2">
            <MessageSquare size={22} className="text-primary" /> Contact Form
          </h2>

          {submitted ? (
            <div className="p-8 bg-green-50 border border-green-200 rounded-lg text-center animate-fade-in">
              <CheckCircle2 size={48} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-900 mb-2">Message Sent!</h3>
              <p className="text-green-700 text-sm mb-6">
                Thank you for contacting SS Hair Studio. Our team will get back to you shortly.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn-primary text-sm">
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Customer Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    placeholder="8087799315" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Email Address *</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="your.email@gmail.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Your Message *</label>
                <textarea 
                  className="form-input" 
                  rows={4} 
                  placeholder="How can we help you today? Ask about services, bookings, or packages..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={sending}
                className="btn-primary mt-2 flex items-center justify-center gap-2 py-3 text-lg"
              >
                {sending ? "Sending..." : (
                  <>
                    <Send size={18} /> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Salon Details */}
        <div className="flex flex-col gap-6">
          <div className="card p-6 border-l-4 border-primary">
            <h3 className="font-bold text-lg mb-2 text-secondary flex items-center gap-2">
              <Scissors size={20} className="text-primary" /> SS Hair Studio
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Premium Unisex Beauty & Grooming Services for Men & Women.
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary-light p-3 rounded-full text-primary shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wide mb-1">Official Phone</h4>
                <a href="tel:8087799315" className="text-lg font-bold text-primary hover:underline">
                  8087799315
                </a>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary-light p-3 rounded-full text-primary shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wide mb-1">Studio Address</h4>
                <p className="text-sm text-secondary font-medium leading-relaxed">
                  Shop no. 3 Rashmi Laxmi Sadan, Opposite Mira Bhayandar Mahanagar Palika, Navghar Road, Bhayandar East, Thane-401105, Maharastra
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary-light p-3 rounded-full text-primary shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wide mb-1">Salon Timing</h4>
                <p className="text-sm text-muted">
                  Monday – Sunday<br/>
                  <strong className="text-secondary">9:00 AM – 9:00 PM</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
