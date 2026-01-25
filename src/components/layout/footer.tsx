import React from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Dribbble
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// The following imports are no longer needed for the new Footer component
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Clock,
//   Send,
//   Truck,
//   RefreshCw,
//   ShieldCheck,
//   Tag
// } from "lucide-react";


export default function Footer() {
  return (
    <footer className="bg-[#1a1e24] text-gray-400 pt-16 pb-8 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-full opacity-15 pointer-events-none z-0">
        <Image
          src="/images/category-section/footer_bg.png"
          alt="Fruits and Vegetables"
          fill
          className="object-cover object-bottom"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Company Info */}
          <div>
            <Link href="/" className="inline-block mb-8">
              <div className="relative h-16 w-40">
                <Image
                  src="/logo.png"
                  alt="JS Mart Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            <ul className="space-y-6 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                <span className="border-b border-gray-700 pb-4 w-full">
                  ABC Town Luton Street, New York 226688
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                <span className="border-b border-gray-700 pb-4 w-full">
                  + 0800 567 345
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                <span>
                  abc@example.com
                </span>
              </li>
            </ul>

            <div className="flex gap-2 mt-8">
              {[Facebook, Twitter, Dribbble, Youtube, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-8 h-8 bg-[#84CC16] rounded-full flex items-center justify-center text-white hover:bg-[#65a30d] transition-colors"
                >
                  <Icon className="w-4 h-4 fill-current" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-[#84CC16] font-semibold mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {["Blog", "FAQs", "Payment", "Shipment", "Where is my order?", "Return policy"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-[#84CC16] transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Style Advisor */}
          <div>
            <h3 className="text-[#84CC16] font-semibold mb-6 uppercase tracking-wider text-sm">Style Advisor</h3>
            <ul className="space-y-3 text-sm">
              {["Your Account", "Information", "Addresses", "Discount", "Order History", "Additional Information"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-[#84CC16] transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Information */}
          <div>
            <h3 className="text-[#84CC16] font-semibold mb-6 uppercase tracking-wider text-sm">Information</h3>
            <ul className="space-y-3 text-sm">
              {["Site Map", "Search Terms", "Advanced Search", "About Us", "Contact Us", "Suppliers"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-[#84CC16] transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}