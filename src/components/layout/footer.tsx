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
    <footer className="bg-[#1a1e24] text-gray-400 pt-8 md:pt-16 pb-6 md:pb-8 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-full opacity-15 pointer-events-none z-0">
        <Image
          src="/images/category-section/footer_bg.png"
          alt="Fruits and Vegetables"
          fill
          className="object-cover object-bottom"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Column 1: Company Info */}
          <div>
            <Link href="/" className="inline-block mb-4 md:mb-8">
              <div className="relative h-12 w-36 md:h-16 md:w-44">
                <Image
                  src="/logo/Web_Logo_Mart-01%20(1).png"
                  alt="JS Mart Australia"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <ul className="space-y-3 md:space-y-6 text-xs md:text-sm">
              <li className="flex items-start gap-2 md:gap-3">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-500 shrink-0 mt-0.5" />
                <span className="border-b border-gray-700 pb-3 md:pb-4 w-full text-xs md:text-sm">
                  ABC Town Luton Street, New York 226688
                </span>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-500 shrink-0 mt-0.5" />
                <span className="border-b border-gray-700 pb-3 md:pb-4 w-full text-xs md:text-sm">
                  + 0800 567 345
                </span>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-500 shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm">
                  abc@example.com
                </span>
              </li>
            </ul>

            <div className="flex gap-1.5 md:gap-2 mt-6 md:mt-8">
              {[Facebook, Twitter, Dribbble, Youtube, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-7 h-7 md:w-8 md:h-8 bg-[#84CC16] rounded-full flex items-center justify-center text-white hover:bg-[#65a30d] transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-[#84CC16] font-semibold mb-4 md:mb-6 uppercase tracking-wider text-xs md:text-sm">Quick Links</h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              <li>
                <Link href="/offers" className="hover:text-[#84CC16] transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  Offers
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#84CC16] transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-[#84CC16] transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#84CC16] transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  Start Shopping
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: My Account */}
          <div>
            <h3 className="text-[#84CC16] font-semibold mb-4 md:mb-6 uppercase tracking-wider text-xs md:text-sm">My Account</h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              <li>
                <Link href="/account/profile" className="hover:text-[#84CC16] transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-[#84CC16] transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[#84CC16] transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#84CC16] transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Information */}
          <div>
            <h3 className="text-[#84CC16] font-semibold mb-4 md:mb-6 uppercase tracking-wider text-xs md:text-sm">Information</h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              <li>
                <Link href="/about" className="hover:text-[#84CC16] transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#84CC16] transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#84CC16] transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#84CC16] transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}