"use client";

import Link from "next/link";
import { Search, ShoppingBag, Bell, Menu, ChevronDown, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import {
//     Bars3Icon,
// } from "@heroicons/react/16/solid";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Navbar() {
    const pathname = usePathname();


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
            <div className="bg-lime-500 h-16 px-4 md:px-8 flex items-center justify-between gap-4">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 group py-1">
                    <div className="relative h-14 w-14 md:h-16 md:w-16 flex items-center justify-center">
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
                        className="w-full h-10 bg-white border-0 rounded-r-none focus-visible:ring-0 text-black placeholder:text-gray-400"
                        placeholder="Search for products..."
                    />
                    <Button className="h-10 rounded-l-none bg-black text-white hover:bg-zinc-800 px-8 font-bold text-base">
                        Search
                    </Button>
                </div>

                {/* Mobile Search Icon (visible only on small screens) */}
                <Button size="icon" variant="ghost" className="md:hidden text-white">
                    <Search className="h-6 w-6" />
                </Button>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <Link href="/signin" className="flex items-center gap-2">
                        <Avatar className="h-9 w-9 border-2 border-white cursor-pointer">
                            <AvatarFallback className="bg-white text-lime-600 flex items-center justify-center">
                                <User className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>

                        <Button
                            variant="ghost"
                            className="text-white font-semibold hover:bg-white/20"
                        >
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Bottom Bar - Black */}
            <div className="bg-black text-white h-12 flex items-center px-4 md:px-8 justify-between">

                <div className="flex items-center h-full">
                    {/* Hamburger Menu - Categories? */}
                    <div className="bg-lime-500 h-full w-12 flex items-center justify-center cursor-pointer hover:brightness-110 mr-6 -ml-4 md:-ml-8 pl-4 md:pl-8 pr-4">
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
