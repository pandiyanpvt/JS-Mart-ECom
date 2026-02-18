"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import HeroSection, { HeroSlide } from "@/components/hero-section";
import { contactService } from "@/services/contact.service";

const contactHeroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Get in Touch",
    subtitle: "Contact Us",
    description: "Have a question or need assistance? We're here to help. Reach out to our friendly customer support team.",
    buttonText: "Visit FAQ",
    buttonLink: "/faq",
    image: "/images/headers/contact-header.png"
  }
];

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contactInfo = [
    { icon: Phone, title: "Phone", details: ["02 1234 5678", "0400 123 456"], color: "text-[#005000]" },
    { icon: Mail, title: "Email", details: ["support@jsmart.com.au", "info@jsmart.com.au"], color: "text-[#005000]" },
    { icon: MapPin, title: "Address", details: ["123 Main Street", "Dubbo NSW 2830, Australia"], color: "text-[#005000]" },
    { icon: Clock, title: "Working Hours", details: ["Mon – Sat: 8:00 AM – 8:00 PM", "Sunday: 9:00 AM – 6:00 PM"], color: "text-[#005000]" }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const fullName = [form.firstName, form.lastName].filter(Boolean).join(" ").trim();
    if (!fullName) {
      setError("Please enter your name.");
      return;
    }
    if (!form.email?.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!form.subject?.trim()) {
      setError("Please enter a subject.");
      return;
    }
    if (!form.message?.trim()) {
      setError("Please enter your message.");
      return;
    }

    setLoading(true);
    try {
      await contactService.sendMessage({
        fullName,
        emailAddress: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim()
      });
      setSuccess(true);
      setForm(initialForm);
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setError(msg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <HeroSection slides={contactHeroSlides} className="min-h-[300px] md:min-h-[400px]" />

      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-10 mb-8 sm:mb-10 md:mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-slate-100 hover:shadow-md transition-all">
                <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#005000]/10 flex items-center justify-center ${info.color} mb-3 sm:mb-4`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#253D4E] mb-1.5 sm:mb-2">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-slate-600 text-xs sm:text-sm">
                    {detail}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <section className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-10 sm:pb-12 md:pb-20">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6 md:p-8 lg:p-10">
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#253D4E] mb-1.5 sm:mb-2">Send us a message</h2>
            <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6">Fill out the form and we'll get back to you as soon as we can.</p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#253D4E] mb-1.5">First name</label>
                  <Input
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="h-10 sm:h-11 border-slate-200 focus:border-[#005000] focus:ring-[#005000] text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#253D4E] mb-1.5">Last name</label>
                  <Input
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="h-10 sm:h-11 border-slate-200 focus:border-[#005000] focus:ring-[#005000] text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#253D4E] mb-1.5">Email address *</label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="h-10 sm:h-11 border-slate-200 focus:border-[#005000] focus:ring-[#005000] text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#253D4E] mb-1.5">Phone (optional)</label>
                <Input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="04XX XXX XXX"
                  className="h-10 sm:h-11 border-slate-200 focus:border-[#005000] focus:ring-[#005000] text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#253D4E] mb-1.5">Subject *</label>
                <Input
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="h-10 sm:h-11 border-slate-200 focus:border-[#005000] focus:ring-[#005000] text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#253D4E] mb-1.5">Message *</label>
                <Textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your enquiry..."
                  rows={4}
                  className="border-slate-200 focus:border-[#005000] focus:ring-[#005000] resize-none text-base min-h-[120px]"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-[#005000] text-sm bg-[#005000]/10 border border-[#005000]/20 rounded-lg px-4 py-3">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  Message sent. We'll get back to you soon.
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] h-12 bg-[#005000] hover:bg-[#006600] text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 touch-manipulation"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send message
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-slate-100 rounded-xl sm:rounded-2xl overflow-hidden h-[240px] sm:h-[320px] md:h-[400px] border border-slate-200">
              <iframe
                title="JS Mart location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2911.400789!2d148.6017!3d-32.243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b0f3b2a2a2a2a2b%3A0x2a2a2a2a2a2a2a2a!2sDubbo%20NSW%2C%20Australia!5e0!3m2!1sen!2sau!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="bg-[#253D4E] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Need quick answers?</h3>
              <p className="text-slate-300 text-xs sm:text-sm mb-4 sm:mb-5">
                Check our FAQ for answers about orders, delivery and more.
              </p>
              <Link href="/faq">
                <Button className="bg-[#005000] hover:bg-[#006600] text-white font-semibold h-11 px-6 rounded-lg">
                  Visit FAQ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10 md:py-16 border-t border-slate-100">
        <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#253D4E] mb-1.5 sm:mb-2">Customer support hours</h3>
          <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6 max-w-xl mx-auto">
            Our support team is available during the following hours.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
            <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100">
              <p className="font-bold text-[#253D4E] text-sm sm:text-base mb-0.5 sm:mb-1">Weekdays</p>
              <p className="text-slate-500 text-xs sm:text-sm">Monday – Saturday</p>
              <p className="text-[#005000] font-bold text-sm sm:text-base mt-1.5 sm:mt-2">8:00 AM – 8:00 PM</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100">
              <p className="font-bold text-[#253D4E] text-sm sm:text-base mb-0.5 sm:mb-1">Weekend</p>
              <p className="text-slate-500 text-xs sm:text-sm">Sunday</p>
              <p className="text-[#005000] font-bold text-sm sm:text-base mt-1.5 sm:mt-2">9:00 AM – 6:00 PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
