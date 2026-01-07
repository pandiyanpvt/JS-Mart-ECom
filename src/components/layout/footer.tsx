// "use client";

// const navigation = {
//   footer_navigation: {
//     shop: [
//       { name: "All Products", href: "/products" },
//       { name: "Christmas Donation", href: "/products?category=donation" },
//       { name: "Fresh Vegetables", href: "/products?category=vegetables" },
//       { name: "Fruits", href: "/products?category=fruits" },
//     ],
//     account: [
//       { name: "My Account", href: "/account" },
//       { name: "Orders", href: "/orders" },
//       { name: "Wishlist", href: "/wishlist" },
//       { name: "Track Order", href: "/track-order" },
//     ],
//     company: [
//       { name: "About Us", href: "/about" },
//       { name: "Contact Us", href: "/contact" },
//       { name: "Privacy Policy", href: "/privacy-policy" },
//       { name: "Terms & Conditions", href: "/terms" },
//     ],
//   },
// };

// export default function Footer() {
//   return (
//     <footer aria-labelledby="footer-heading" className="mt-8 bg-gray-900">
//       <h2 id="footer-heading" className="sr-only">
//         Footer
//       </h2>

//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 hidden sm:block">
//         <div className="py-20 xl:grid xl:grid-cols-3 xl:gap-8">
//           <div className="grid grid-cols-2 gap-8 xl:col-span-2">

//             {/* Shop */}
//             <div>
//               <h3 className="text-sm font-medium text-white">Shop</h3>
//               <ul role="list" className="mt-6 space-y-4">
//                 {navigation.footer_navigation.shop.map((item) => (
//                   <li key={item.name} className="text-sm">
//                     <a href={item.href} className="text-gray-300 hover:text-white">
//                       {item.name}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Account */}
//             <div>
//               <h3 className="text-sm font-medium text-white">Account</h3>
//               <ul role="list" className="mt-6 space-y-4">
//                 {navigation.footer_navigation.account.map((item) => (
//                   <li key={item.name} className="text-sm">
//                     <a href={item.href} className="text-gray-300 hover:text-white">
//                       {item.name}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Company */}
//             <div>
//               <h3 className="text-sm font-medium text-white">Company</h3>
//               <ul role="list" className="mt-6 space-y-4">
//                 {navigation.footer_navigation.company.map((item) => (
//                   <li key={item.name} className="text-sm">
//                     <a href={item.href} className="text-gray-300 hover:text-white">
//                       {item.name}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//           </div>
//         </div>

//         {/* Bottom bar */}
//         <div className="border-t border-gray-800 py-10">
//           <p className="text-sm text-gray-400">
//             &copy; {new Date().getFullYear()} JS Mart. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }


import React from "react";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const navigation = {
  categories: [
    { name: "Christmas Donation", href: "/products?category=donation" },
    { name: "Baby Products", href: "/products?category=baby" },
    { name: "Food Cupboard", href: "/products?category=food" },
    { name: "Bakery", href: "/products?category=bakery" },
    { name: "Seafood", href: "/products?category=seafood" },
    { name: "Pet Products", href: "/products?category=pets" },
    { name: "Party Shop", href: "/products?category=party" },
    { name: "Health & Beauty", href: "/products?category=health" },
  ],
  categories2: [
    { name: "Vegetables", href: "/products?category=vegetables" },
    { name: "Dairy", href: "/products?category=dairy" },
    { name: "Household", href: "/products?category=household" },
    { name: "Frozen Food", href: "/products?category=frozen" },
    { name: "Seeds & Spices", href: "/products?category=seeds" },
    { name: "Christmas Treats", href: "/products?category=treats" },
    { name: "Gifting", href: "/products?category=gifts" },
    { name: "Fashion", href: "/products?category=fashion" },
  ],
  categories3: [
    { name: "Fruits", href: "/products?category=fruits" },
    { name: "Beverages", href: "/products?category=beverages" },
    { name: "Cooking Essentials", href: "/products?category=cooking" },
    { name: "Meats", href: "/products?category=meats" },
    { name: "Snacks & Confectionery", href: "/products?category=snacks" },
    { name: "Desserts & Ingredients", href: "/products?category=desserts" },
    { name: "Rice", href: "/products?category=rice" },
    { name: "Tea & Coffee", href: "/products?category=tea" },
    { name: "Christmas Hampers", href: "/products?category=hampers" },
    { name: "Auto Care", href: "/products?category=auto" },
    { name: "Stationery", href: "/products?category=stationery" },
  ],
  useful: [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
  ],
  policies: [
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Return Policy", href: "/return-policy" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Top Section - Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="relative h-24 w-24 mb-6">
            <Image
              src="/logo.png"
              alt="JS Mart Australia Logo"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-gray-600 text-sm leading-relaxed max-w-4xl mx-auto">
            Enter Australia's freshest online grocery store for all your grocery needs- fresh to frozen and everything in between! Now, you can order ALL your daily necessities from the comfort of your home or anywhere you want! Choose from same-day, next-day & saver to ensure you get what you need when you need it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Best Prices */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Best Prices & Offers</h3>
              <p className="text-sm text-gray-600">Enjoy the same lowest prices as your local Cargills Food City, Express & Food Hall store!</p>
            </div>
          </div>

          {/* Wide Assortment */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Wide Assortment</h3>
              <p className="text-sm text-gray-600">Choose from a variety of products from branded, chilled, fresh & frozen. New products added weekly!</p>
            </div>
          </div>

          {/* Easy Returns */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Easy Returns</h3>
              <p className="text-sm text-gray-600">Not satisfied with a product? Return it at the doorstep & get a refund within hours.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Categories Column 1 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-3">
                {navigation.categories.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories Column 2 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 invisible">Categories</h3>
              <ul className="space-y-3">
                {navigation.categories2.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories Column 3 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 invisible">Categories</h3>
              <ul className="space-y-3">
                {navigation.categories3.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Useful Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Useful Links</h3>
              <ul className="space-y-3 mb-6">
                {navigation.useful.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="space-y-3">
                {navigation.policies.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Payment Methods</h4>
                <div className="flex gap-2">
                  <img src="/api/placeholder/60/40" alt="Visa" className="h-8 border border-gray-200 rounded" />
                  <img src="/api/placeholder/60/40" alt="Mastercard" className="h-8 border border-gray-200 rounded" />
                </div>
              </div> */}
            </div>

            {/* Download App & Social */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Download App</h3>
              <div className="space-y-3 mb-6">
                <a href="#" className="block">
                  <img src="/images/footer/google.png" alt="Google Play" className="h-10" />
                </a>
                <a href="#" className="block">
                  <img src="/images/footer/appstore.png" alt="App Store" className="h-10" />
                </a>
              </div>

              <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-lime-600 transition-colors">
                  <Facebook className="w-5 h-5 text-gray-600" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-lime-600 transition-colors">
                  <Twitter className="w-5 h-5 text-gray-600" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-lime-600 transition-colors">
                  <Instagram className="w-5 h-5 text-gray-600" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-lime-600 transition-colors">
                  <Youtube className="w-5 h-5 text-gray-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            ©JS Mart Online 2026
          </p>
        </div>
      </div>
    </footer>
  );
}