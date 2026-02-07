"use client";
import Link from "next/link";
import Cookies from "js-cookie";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Search, ShoppingBag, Menu, ChevronDown, User, LogOut, Package, Percent, Heart, Apple, Milk, Cake, Coffee, Beef, Fish, Leaf, Smartphone, Shirt, Home, Baby, Sparkles, Grid3x3 } from "lucide-react";
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
            const user = Cookies.get("user");
            if (user) {
                try {
                    const userData = JSON.parse(user);
                    setIsLoggedIn(true);

                    // Construct full name if possible
                    let fullName = "User";
                    if (userData.firstName && userData.lastName) {
                        fullName = `${userData.firstName} ${userData.lastName}`;
                    } else if (userData.fullName) {
                        fullName = userData.fullName;
                    } else if (userData.firstName) {
                        fullName = userData.firstName;
                    } else if (userData.name) {
                        fullName = userData.name;
                    }

                    setUserName(fullName);
                } catch (error) {
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();

        // Custom event listener for auth changes
        const handleAuthChange = () => checkLoginStatus();
        window.addEventListener("auth-change", handleAuthChange);

        return () => {
            window.removeEventListener("auth-change", handleAuthChange);
        };
    }, [pathname]);

    const handleLogout = () => {
        Cookies.remove("user");
        Cookies.remove("token");
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
            <div className="py-5 px-4 md:px-8 flex items-center fixed bg-white w-full z-50 justify-between gap-8">
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

                    {/* Account */}
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 group outline-none ml-2">
                                    <div className="p-2 rounded-full bg-[#3BB77E]/10 group-hover:bg-[#3BB77E]/20 transition-colors border border-[#3BB77E]/20">
                                        <User className="h-5 w-5 text-[#3BB77E]" />
                                    </div>
                                    <div className="hidden lg:flex flex-col items-start text-left">
                                        <span className="text-[11px] text-gray-500 font-medium">Account</span>
                                        <span className="text-sm font-bold text-gray-900 line-clamp-1 max-w-[120px]">{userName}</span>
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
                        <Button asChild className="bg-[#3BB77E] hover:bg-[#299E63] text-white font-bold text-sm px-5 py-2 rounded shadow-sm hover:shadow-md transition-all">
                            <Link href="/signin">
                                Sign In
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Bottom Bar - Navigation */}
            <div className="border-y border-gray-100 py-3 px-4 md:px-8 flex items-center pt-32 justify-between">
                <div className="flex items-center gap-8">
                    {/* Categories Trigger */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 font-bold text-sm text-white bg-[#3BB77E] hover:bg-[#299E63] px-6 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg outline-none">
                                <Menu className="h-5 w-5" />
                                Browse All Categories
                                <ChevronDown className="h-4 w-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-72" align="start">
                            <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wide">All Categories</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Food & Groceries */}
                            <div className="px-2 py-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Food & Groceries</p>
                            </div>
                            <DropdownMenuItem asChild>
                                <Link href="/shop?category=vegetables" className="cursor-pointer hover:bg-[#3BB77E]/10 hover:text-[#3BB77E] transition-colors pl-4 flex items-center w-full">
                                    <Apple className="h-4 w-4 mr-3 text-[#3BB77E]" />
                                    <span className="font-medium">Fruits & Vegetables</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/shop?category=dairy" className="cursor-pointer hover:bg-[#3BB77E]/10 hover:text-[#3BB77E] transition-colors pl-4 flex items-center w-full">
                                    <Milk className="h-4 w-4 mr-3 text-[#3BB77E]" />
                                    <span className="font-medium">Dairy & Eggs</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/shop?category=bakery" className="cursor-pointer hover:bg-[#3BB77E]/10 hover:text-[#3BB77E] transition-colors pl-4 flex items-center w-full">
                                    <Cake className="h-4 w-4 mr-3 text-[#3BB77E]" />
                                    <span className="font-medium">Bakery & Snacks</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/shop?category=beverages" className="cursor-pointer hover:bg-[#3BB77E]/10 hover:text-[#3BB77E] transition-colors pl-4 flex items-center w-full">
                                    <Coffee className="h-4 w-4 mr-3 text-[#3BB77E]" />
                                    <span className="font-medium">Beverages</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/shop?category=meats" className="cursor-pointer hover:bg-[#3BB77E]/10 hover:text-[#3BB77E] transition-colors pl-4 flex items-center w-full">
                                    <Beef className="h-4 w-4 mr-3 text-[#3BB77E]" />
                                    <span className="font-medium">Meat & Seafood</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/shop?category=frozen_food" className="cursor-pointer hover:bg-[#3BB77E]/10 hover:text-[#3BB77E] transition-colors pl-4 flex items-center w-full">
                                    <Fish className="h-4 w-4 mr-3 text-[#3BB77E]" />
                                    <span className="font-medium">Frozen Foods</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Lifestyle & More */}
                            <div className="px-2 py-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Lifestyle & More</p>
                            </div>
                            <DropdownMenuItem asChild>
                                <Link href="/shop?category=household" className="cursor-pointer hover:bg-[#3BB77E]/10 hover:text-[#3BB77E] transition-colors pl-4 flex items-center w-full">
                                    <Home className="h-4 w-4 mr-3 text-[#3BB77E]" />
                                    <span className="font-medium">Home & Kitchen</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/shop?category=baby_products" className="cursor-pointer hover:bg-[#3BB77E]/10 hover:text-[#3BB77E] transition-colors pl-4 flex items-center w-full">
                                    <Baby className="h-4 w-4 mr-3 text-[#3BB77E]" />
                                    <span className="font-medium">Baby Care</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/shop" className="cursor-pointer font-bold text-[#3BB77E] hover:bg-[#3BB77E]/10 justify-center">
                                    View All Categories →
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

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
                                    className={`text-sm font-semibold flex items-center gap-1 transition-colors ${isActive
                                        ? "text-[#3BB77E]"
                                        : "text-gray-900 hover:text-[#3BB77E]"
                                        }`}
                                >
                                    {link.name}
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
