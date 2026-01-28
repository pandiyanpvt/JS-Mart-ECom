"use client";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Search, ShoppingBag, Menu, ChevronDown, User, LogOut, Package, Percent, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import {
//     Bars3Icon,
// } from "@heroicons/react/16/solid";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import CartModal from "@/components/layout/add-cart-modal";

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const { cart } = useCart(); // get current cart items
    const { wishlist } = useWishlist(); // get current wishlist items
    const [isOpen, setIsOpen] = useState(false);

    // Check login status on component mount and when pathname changes
    useEffect(() => {
        const checkLoginStatus = () => {
            const user = localStorage.getItem("user");
            if (user) {
                try {
                    const userData = JSON.parse(user);
                    setIsLoggedIn(true);
                    setUserName(userData.name || "User");
                } catch (error) {
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
        // Add event listener for storage changes (when user logs in/out in another tab)
        window.addEventListener("storage", checkLoginStatus);

        return () => {
            window.removeEventListener("storage", checkLoginStatus);
        };
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/");
    };

    const toggleModal = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        { name: "Offers", href: "/offers" },
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" },
    ];


    return (
        <div className="w-full flex flex-col font-sans bg-white">
            {/* Main Bar */}
            <div className="py-5 px-4 md:px-8 flex items-center justify-between gap-8">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0">
                    <div className="relative h-12 w-40 md:h-16 md:w-56">
                        <Image
                            src="/logo.png"
                            alt="JS Mart Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Search Bar */}
                <div className="flex-1 max-w-3xl hidden md:flex items-center border-2 border-gray-100 rounded-lg overflow-hidden focus-within:border-[#3BB77E] transition-colors">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="px-5 py-2 flex items-center gap-2 text-sm font-semibold border-r border-gray-100 hover:bg-gray-50 outline-none whitespace-nowrap">
                            All Categories <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuItem>Fruits & Vegetables</DropdownMenuItem>
                            <DropdownMenuItem>Dairy & Eggs</DropdownMenuItem>
                            <DropdownMenuItem>Bakery</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex-1 relative">
                        <Input
                            className="w-full h-11 border-0 focus-visible:ring-0 text-gray-900 placeholder:text-gray-400 px-4 text-sm"
                            placeholder="Search for products..."
                        />
                    </div>
                    <Button className="h-11 rounded-none bg-[#3BB77E] hover:bg-[#299E63] text-white px-8 font-bold text-sm transition-all">
                        Search
                    </Button>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6">
                    {/* Account */}
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-3 group outline-none">
                                    <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
                                        <User className="h-6 w-6 text-gray-700" />
                                    </div>
                                    <div className="hidden lg:flex flex-col items-start text-left">
                                        <span className="text-[11px] text-gray-500 font-medium">Welcome</span>
                                        <span className="text-sm font-bold text-gray-900">{userName}</span>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/account/profile" className="cursor-pointer">
                                        <User className="h-4 w-4 mr-2" />
                                        My Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/account/orders" className="cursor-pointer">
                                        <Package className="h-4 w-4 mr-2" />
                                        My Orders
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/signin" className="flex items-center gap-3 group">
                            <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
                                <User className="h-6 w-6 text-gray-700" />
                            </div>
                            <div className="hidden lg:flex flex-col items-start">
                                <span className="text-[11px] text-gray-500 font-medium leading-none">Login</span>
                                <span className="text-sm font-bold text-gray-900">Account</span>
                            </div>
                        </Link>
                    )}

                    {/* Wishlist */}
                    <Link href="/wishlist" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors group">
                        <Heart className={`h-6 w-6 ${wishlist.length > 0 ? "text-red-500 fill-red-500" : "text-gray-700"}`} />
                        {wishlist.length > 0 && (
                            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                {wishlist.length}
                            </span>
                        )}
                    </Link>

                    {/* Cart */}
                    <div className="relative">
                        <button
                            onClick={toggleModal}
                            className="flex items-center gap-3 group outline-none"
                        >
                            <div className="relative p-2 rounded-full group-hover:bg-gray-100 transition-colors">
                                <ShoppingBag className="h-6 w-6 text-gray-700" />
                                {cart.length > 0 && (
                                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                        {cart.length}
                                    </span>
                                )}
                            </div>
                            <div className="hidden lg:flex flex-col items-start">
                                <span className="text-[11px] text-gray-500 font-medium leading-none">Your Cart</span>
                                <span className="text-sm font-bold text-gray-900">
                                    ${cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
                                </span>
                            </div>
                        </button>
                        <CartModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
                    </div>
                </div>
            </div>

            {/* Bottom Bar - Navigation */}
            <div className="border-y border-gray-100 py-3 px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    {/* Categories Trigger */}
                    <button className="flex items-center gap-3 font-bold text-sm text-gray-900 hover:text-[#3BB77E] transition-colors group">
                        <Menu className="h-5 w-5" />
                        Browse All Categories
                    </button>

                    <div className="h-6 w-px bg-gray-200 hidden lg:block" />

                    {/* Nav Links */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => {
                            // Check if current path matches the link
                            // For exact matches (like /about, /contact) use strict equality
                            // For routes with nested paths (like /shop), check if pathname starts with the href
                            const isActive = link.href === "/" 
                                ? pathname === "/"
                                : pathname === link.href || pathname.startsWith(link.href + "/");
                            
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-bold flex items-center gap-1 transition-colors ${
                                        isActive
                                            ? "text-[#3BB77E]"
                                            : "text-gray-900 hover:text-[#3BB77E]"
                                    }`}
                                >
                                    {link.name}
                                    {link.name === "Shop" && (
                                        <ChevronDown className="h-3 w-3 opacity-50" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Promo Badge */}
                <div className="hidden xl:flex items-center gap-2 text-sm">
                    <div className="h-6 w-6 bg-red-100 rounded-full flex items-center justify-center">
                        <Percent className="h-3 w-3 text-red-600" />
                    </div>
                    <span className="font-bold text-gray-900">Sale $20 Off Your First Order.</span>
                </div>
            </div>
        </div>
    );
}
