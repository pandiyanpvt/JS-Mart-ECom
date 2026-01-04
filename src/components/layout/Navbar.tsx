import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Bell, Menu, ChevronDown, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    return (
        <div className="w-full flex flex-col font-sans">
            {/* Top Bar - Green */}
            <div className="bg-[#5DC440] h-16 px-4 md:px-8 flex items-center justify-between gap-4">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative flex items-center justify-center p-1">
                        {/* Approximate logo icon */}
                        <div className="relative h-10 w-10 flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-white fill-white absolute" />
                            <span className="relative z-10 text-[10px] font-bold text-[#5DC440] pt-2">JS</span>
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">mart</span>
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
                <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border-2 border-white cursor-pointer">
                        <AvatarImage src="/profile-placeholder.jpg" />
                        <AvatarFallback className="bg-zinc-200 text-zinc-900 border-2 border-white">
                            <Image
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Ph1L2j9z5sQ6x75v4b0n3m1.png"
                                alt="User"
                                fill
                                className="object-cover"
                            />
                            <User className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>

            {/* Bottom Bar - Black */}
            <div className="bg-black text-white h-12 flex items-center px-4 md:px-8 justify-between">

                <div className="flex items-center h-full">
                    {/* Hamburger Menu - Categories? */}
                    <div className="bg-[#5DC440] h-full w-12 flex items-center justify-center cursor-pointer hover:brightness-110 mr-6 -ml-4 md:-ml-8 pl-4 md:pl-8 pr-4">
                        <Menu className="h-6 w-6 text-white" />
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 hover:text-white transition-colors outline-none">
                                Home <ChevronDown className="h-3 w-3" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Home 1</DropdownMenuItem>
                                <DropdownMenuItem>Home 2</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 hover:text-white transition-colors outline-none">
                                Membership <ChevronDown className="h-3 w-3" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Silver</DropdownMenuItem>
                                <DropdownMenuItem>Gold</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link href="/offers" className="hover:text-white transition-colors">Offers</Link>
                        <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
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
