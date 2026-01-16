// import { Button } from "@/components/ui/button";
//
// export default function Home() {
//   return (
//     <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
//       <div className="flex flex-col items-center space-y-4 text-center">
//         <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//           JS Mart
//         </h1>
//         <p className="max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
//             contact us
//         </p>
//       </div>
//     </div>
//   );
// }


import Image from "next/image";
import ContactForm from "@/components/contact-form";
import HelpSidebar from "@/components/help-sidebar";

export default function ContactPage() {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <div className="relative h-[300px] w-full">
                <Image
                    src="/images/contact.jpg" // replace with your image
                    alt="Customer Help"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center px-12">
                    <div className="text-white">
                        <h1 className="text-4xl font-serif mb-2">Customer Help</h1>
                        <p className="text-sm max-w-md">
                            If talking to a real-life human is more your thing, you can reach
                            our Customer Happiness Team via email below.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Left Sidebar */}
                <HelpSidebar />

                {/* Contact Form */}
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-serif mb-8">Contact Us</h2>
                    <ContactForm />
                </div>

                {/* Support Hours */}
                <div className="text-sm space-y-4">
                    <h3 className="font-semibold">Support Hours</h3>
                    <p>Mon–Fri: 9:00am – 5:00pm PST</p>
                    <p className="text-gray-500">*Excludes Holidays</p>

                    <p className="pt-4">
                        Looking for more info on products, shipping, fabric, and more?
                    </p>
                    <a href="#" className="underline text-sm">
                        VIEW FAQ
                    </a>
                </div>
            </div>

            {/* Get in Touch */}
            <div className="bg-gray-100 py-20 text-center">
                <h3 className="text-2xl font-serif mb-2">Get in Touch</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Have questions about your order, or a general inquiry?
                </p>
                <button className="bg-black text-white px-8 py-3 text-sm uppercase">
                    Email Us
                </button>
            </div>
        </div>
    );
}
