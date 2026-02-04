"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from "react-hot-toast";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAuthPage = [
        "/signin",
        "/signup",
        "/forgot-password",
        "/verify-otp",
        "/reset-password",
        "/password-reset-success"
    ].includes(pathname);

    return (
        <CartProvider>
            <WishlistProvider>
                {!isAuthPage && <Navbar />}
                {children}
                {!isAuthPage && <Footer />}
                <Toaster position="top-right" />
            </WishlistProvider>
        </CartProvider>
    );
}
