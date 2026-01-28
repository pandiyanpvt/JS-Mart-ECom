"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/signin" || pathname === "/signup";

    return (
        <CartProvider>
            <WishlistProvider>
                {!isAuthPage && <Navbar />}
                {children}
                {!isAuthPage && <Footer />}
            </WishlistProvider>
        </CartProvider>
    );
}
