import React from "react";
import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react";
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

/** Monochrome TikTok (Simple Icons) — filled mark reads clearly on lime bg next to Lucide stroke icons */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

/** Default public profiles; override with NEXT_PUBLIC_SOCIAL_* in .env.local if needed. */
const FOOTER_SOCIAL_DEFAULTS = {
  facebook: "https://www.facebook.com/share/1DaDZzXk5Y/",
  instagram: "https://www.instagram.com/js_mart_26?igsh=Y2s4Mmp5djR1ZDFh",
  tiktok: "https://www.tiktok.com/@js_mart_26?_r=1&_t=ZS-95KhmAPSGWa",
} as const;

const FOOTER_SOCIAL: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    href:
      process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL?.trim() ||
      FOOTER_SOCIAL_DEFAULTS.facebook,
    label: "Facebook",
    Icon: Facebook,
  },
  {
    href:
      process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL?.trim() ||
      FOOTER_SOCIAL_DEFAULTS.instagram,
    label: "Instagram",
    Icon: Instagram,
  },
  {
    href:
      process.env.NEXT_PUBLIC_SOCIAL_TIKTOK_URL?.trim() ||
      FOOTER_SOCIAL_DEFAULTS.tiktok,
    label: "TikTok",
    Icon: TikTokIcon,
  },
].filter((item) => item.href.length > 0);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f141a] text-gray-300 pt-4 md:pt-6 lg:pt-8 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-5 lg:pb-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-full opacity-15 pointer-events-none z-0">
        <Image
          src="/images/category-section/footer_bg.png"
          alt="Fruits and Vegetables"
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>

      <div className="w-full mx-auto px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-4 md:mb-6 lg:mb-8">
          {/* Column 1: Company Info */}
          <div>
            <Link href="/" className="inline-block mb-2 md:mb-3 lg:mb-4">
              <div className="relative h-14 w-40 md:h-20 md:w-56 lg:h-[5.5rem] lg:w-64">
                <Image
                  src="/logo/Web_Logo_Mart-01%20(1).png"
                  alt="JS Mart Australia"
                  fill
                  sizes="192px"
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <ul className="space-y-2 md:space-y-3 text-sm md:text-base leading-relaxed">
              <li className="flex items-start gap-2 md:gap-3">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-500 shrink-0 mt-0.5" />
                <span className="border-b border-gray-700 pb-2 md:pb-3 w-full text-sm md:text-base">
                  Dubbo, NSW 2830, Australia
                </span>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <Phone className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-500 shrink-0 mt-0.5" />
                <span className="border-b border-gray-700 pb-2 md:pb-3 w-full text-sm md:text-base">
                  +61 2 0000 0000
                </span>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-500 shrink-0 mt-0.5" />
                <span className="text-sm md:text-base">
                  support@jsmart.com.au
                </span>
              </li>
            </ul>

            {FOOTER_SOCIAL.length > 0 && (
              <div className="flex flex-wrap gap-1.5 md:gap-2 lg:gap-2.5 mt-4 md:mt-5 lg:mt-6">
                {FOOTER_SOCIAL.map(({ href, label, Icon }) => {
                  const external = href.startsWith("http");
                  return (
                    <a
                      key={label}
                      href={href}
                      {...(external
                        ? { target: "_blank" as const, rel: "noopener noreferrer" }
                        : {})}
                      aria-label={label}
                      className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-[#84CC16] rounded-full flex items-center justify-center text-white hover:bg-[#65a30d] transition-colors"
                    >
                      <Icon className="shrink-0 w-[18px] h-[18px] md:w-5 md:h-5 text-white" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-[#84CC16] font-bold mb-4 md:mb-6 uppercase tracking-wider text-sm md:text-base">Quick Links</h3>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
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
            <h3 className="text-[#84CC16] font-bold mb-4 md:mb-6 uppercase tracking-wider text-sm md:text-base">My Account</h3>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
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
            <h3 className="text-[#84CC16] font-bold mb-4 md:mb-6 uppercase tracking-wider text-sm md:text-base">Information</h3>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
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

        {/* Bottom bar — copyright + credit on one line */}
        <div className="border-t border-gray-800/60 pt-3 md:pt-4 lg:pt-5 text-center text-[11px] md:text-xs text-gray-500">
          <p className="inline-flex flex-nowrap justify-center items-center gap-x-2 text-center max-w-full overflow-x-auto [scrollbar-width:thin]">
            <span>© {currentYear} JS Mart Australia. All rights reserved.</span>
            <span className="text-gray-600 select-none" aria-hidden>
              ·
            </span>
            <a
              href="https://thepandiyan.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#84CC16] transition-colors underline-offset-2 hover:underline shrink-0"
            >
              Developed by Pandiyan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}