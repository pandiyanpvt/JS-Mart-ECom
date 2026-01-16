"use client";

import Link from "next/link";
import { Search, ShoppingBag, Bell, Menu, ChevronDown, User, LogOut, Package, MapPin, CreditCard, LayoutDashboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
// import {
//     Bars3Icon,
// } from "@heroicons/react/16/solid";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");

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


    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        { name: "Offers", href: "/offers" },
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" },
    ];


    return (
        <div className="w-full flex flex-col font-sans">
            {/* Top Bar - Green */}
            <div className="bg-emerald-600 h-20 px-4 md:px-8 flex items-center justify-between gap-4">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 group py-1">
                    <div className="relative h-16 w-16 md:h-20 md:w-20 flex items-center justify-center transition-transform hover:scale-105">
                        <Image
                            src="/logo.png"
                            alt="JS Mart Australia Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Search Bar */}
                <div className="flex-1 max-w-2xl hidden md:flex relative">
                    <Input
                        className="w-full h-11 bg-white border-0 rounded-r-none focus-visible:ring-2 focus-visible:ring-emerald-300 text-black placeholder:text-gray-500 px-4 text-base"
                        placeholder="Search for products..."
                    />
                    <Button className="h-11 rounded-l-none bg-emerald-700 text-white hover:bg-emerald-800 px-8 font-semibold text-base shadow-md transition-all">
                        <Search className="h-5 w-5 mr-2" />
                        Search
                    </Button>
                </div>

                {/* Mobile Search Icon (visible only on small screens) */}
                <Button size="icon" variant="ghost" className="md:hidden text-white hover:bg-white/20">
                    <Search className="h-6 w-6" />
                </Button>

                {/* User Profile - Conditional based on login status */}
                <div className="flex items-center gap-2">
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border-2 border-white/30 transition-all hover:border-white/50 outline-none">
                                <Avatar className="h-8 w-8 border-2 border-white">
                                    <AvatarFallback className="bg-white text-emerald-600 flex items-center justify-center font-bold">
                                        {userName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-white font-semibold text-sm hidden lg:inline">
                                    {userName}
                                </span>
                                <ChevronDown className="h-4 w-4 text-white hidden lg:inline" />
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
                                <DropdownMenuItem asChild>
                                    <Link href="/account/addresses" className="cursor-pointer">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Saved Addresses
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/account/cards" className="cursor-pointer">
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        Saved Cards
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
                        <Link href="/signin" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border-2 border-white/30 transition-all hover:border-white/50">
                            <Avatar className="h-8 w-8 border-2 border-white">
                                <AvatarFallback className="bg-white text-emerald-600 flex items-center justify-center">
                                    <User className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-white font-semibold text-sm hidden lg:inline">
                                Sign In
                            </span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Bottom Bar - Black */}
            <div className="bg-black text-white h-12 flex items-center px-4 md:px-8 justify-between">

                <div className="flex items-center h-full">
                    {/* Hamburger Menu - Categories? */}
                    <div className="bg-emerald-600 h-full w-12 flex items-center justify-center cursor-pointer hover:brightness-110 mr-6 -ml-4 md:-ml-8 pl-4 md:pl-8 pr-4">
                        <Menu className="h-6 w-6 text-white" />
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`transition-colors ${pathname === link.href
                                    ? "text-white font-bold"
                                    : "text-gray-300 hover:text-white"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Membership Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 hover:text-white transition-colors outline-none">
                                Membership <ChevronDown className="h-3 w-3" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/membership/silver"
                                        className={`${pathname === "/membership/silver"
                                            ? "text-gray-600 font-bold"
                                            : "text-gray-700 hover:text-white"
                                            }`}
                                    >
                                        Silver
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/membership/gold"
                                        className={`${pathname === "/membership/gold"
                                            ? "text-gray-600 font-bold"
                                            : "text-gray-700 hover:text-white"
                                            }`}
                                    >
                                        Gold
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>

                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-6 text-white">
                    {/* Shopping Bag */}
                    <div className="relative cursor-pointer hover:text-gray-300 transition-colors">
                        <ShoppingBag className="h-6 w-6" />
                        {/* Optional badge */}
                        {/* <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span> */}
                    </div>

                    {/* Notification Bell */}
                    <div className="relative cursor-pointer hover:text-gray-300 transition-colors">
                        <Bell className="h-6 w-6" />
                        {/* Optional badge */}
                        {/* <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
