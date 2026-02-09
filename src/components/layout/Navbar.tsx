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
import { MapPin, Search, ShoppingBag, Menu, ChevronDown, User, LogOut, Package, Heart, Apple, Milk, Cake, Coffee, Beef, Fish, Home, Baby } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    const { cart } = useCart();
    const { wishlist } = useWishlist();
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<Array<{ id: number; name: string; href: string }>>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { categoryService } = await import('@/services');
                const categoriesData = await categoryService.getActive();

                // Transform backend categories to navbar format and deduplicate by name
                const seenNames = new Set<string>();
                const transformedCategories = categoriesData
                    .map(cat => ({
                        id: cat.id,
                        name: cat.category,
                        href: `/shop?category=${cat.id}`
                    }))
                    .filter(cat => {
                        const key = cat.name.trim().toLowerCase();
                        if (seenNames.has(key)) return false;
                        seenNames.add(key);
                        return true;
                    });

                setCategories(transformedCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
                // Fallback to default categories if fetch fails
                setCategories([
                    { id: 0, name: "All", href: "/shop" },
                    { id: 1, name: "Fresh", href: "/shop?category=fresh" },
                    { id: 2, name: "Bestsellers", href: "/shop?category=bestsellers" },
                ]);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const checkLoginStatus = () => {
            const user = Cookies.get("user");
            if (user) {
                try {
                    const userData = JSON.parse(user);
                    setIsLoggedIn(true);

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
            {/* Main Navbar */}
            <div className="py-3 px-4 md:px-8 fixed top-0 bg-white w-full z-50 border-b border-gray-200 shadow-sm">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
                    {/* Hamburger Menu + Logo */}
                    <div className="flex items-center gap-3">
                        {/* Hamburger Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-6 h-6 text-gray-700"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMobileMenuOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>

                        {/* Logo with Location */}
                        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
                            <div className="relative h-10 w-24 md:h-12 md:w-32">
                                <Image
                                    src="/logo.png"
                                    alt="JS Mart Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <div className="hidden md:flex items-center gap-1.5 text-xs">
                                <MapPin className="h-3.5 w-3.5 text-gray-600" />
                                <span className="text-gray-600">Hello - <span className="font-semibold text-gray-900">AUSTRALIA</span></span>
                            </div>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-3xl hidden md:flex items-center">
                        <div className="flex w-full items-center border-2 border-gray-300 rounded-md overflow-hidden focus-within:border-[#3BB77E] transition-all">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border-r border-gray-300 text-sm font-medium text-gray-700 flex items-center gap-1.5 outline-none transition-colors whitespace-nowrap">
                                        All
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48 max-h-[400px] overflow-y-auto">
                                    <DropdownMenuItem asChild>
                                        <Link href="/shop" className="cursor-pointer">All Categories</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {categories.map((category) => (
                                        <DropdownMenuItem key={category.id} asChild>
                                            <Link href={category.href} className="cursor-pointer">
                                                {category.name}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Input
                                className="flex-1 h-9 border-0 focus-visible:ring-0 text-gray-900 placeholder:text-gray-500 px-3 text-sm bg-white"
                                placeholder="Search Here"
                            />

                            <Button className="h-9 rounded-none bg-[#3BB77E] hover:bg-[#2a9d5f] text-white px-5 font-semibold text-sm transition-all">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Sign In / User Account */}
                        {isLoggedIn ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="hidden md:flex items-center gap-1.5 hover:text-[#3BB77E] transition-colors p-1.5 rounded outline-none">
                                        <User className="h-5 w-5 text-gray-700" />
                                        <ChevronDown className="h-3.5 w-3.5 text-gray-600" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel className="font-normal truncate">{userName}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/account/profile" className="cursor-pointer flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            My Account
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/account/orders" className="cursor-pointer flex items-center gap-2">
                                            <Package className="h-4 w-4" />
                                            Orders
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer text-red-600 focus:text-red-600 flex items-center gap-2"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                href="/signin"
                                className="hidden md:inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md bg-[#3BB77E] hover:bg-[#2a9d5f] text-white text-sm font-semibold transition-colors"
                            >
                                Sign In
                            </Link>
                        )}

                        {/* Wishlist */}
                        <Link href="/wishlist" className="hidden md:flex items-center gap-1.5 hover:text-[#3BB77E] transition-colors relative p-1.5 rounded">
                            <Heart className={`h-5 w-5 ${wishlist.length > 0 ? "text-red-500 fill-red-500" : "text-gray-700"}`} />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <button
                            onClick={toggleModal}
                            className="flex items-center gap-1.5 hover:text-[#3BB77E] transition-colors relative p-1.5 rounded outline-none"
                        >
                            <ShoppingBag className="h-6 w-6 text-gray-900" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#3BB77E] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                        <CartModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
                    </div>
                </div>
            </div>

            {/* Green Category Navigation Bar */}
            <div className="bg-[#1F5632] text-white py-2 px-4 md:px-8 fixed top-[60px] w-full z-40 shadow-md">
                <div className="max-w-[1600px] mx-auto flex items-center gap-3 overflow-x-auto scrollbar-hide">
                    {/* All Categories Dropdown Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 bg-[#174428] hover:bg-[#0f3319] px-4 py-2 rounded text-sm font-semibold whitespace-nowrap transition-colors">
                                <Menu className="h-4 w-4" />
                                All Categories
                                <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56 bg-white max-h-[400px] overflow-y-auto">
                            <DropdownMenuLabel className="text-gray-700 font-bold">Product Categories</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/shop" className="cursor-pointer font-semibold">
                                    All Products
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {categories.map((category, index) => (
                                <DropdownMenuItem key={index} asChild>
                                    <Link
                                        href={category.href}
                                        className="cursor-pointer"
                                    >
                                        {category.name}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Pages Dropdown Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 bg-[#174428] hover:bg-[#0f3319] px-4 py-2 rounded text-sm font-semibold whitespace-nowrap transition-colors">
                                Pages
                                <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56 bg-white">
                            <DropdownMenuLabel className="text-gray-700 font-bold">Main Pages</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {navLinks.map((link, index) => (
                                <DropdownMenuItem key={index} asChild>
                                    <Link
                                        href={link.href}
                                        className={`cursor-pointer ${pathname === link.href ? "bg-[#3BB77E] text-white font-semibold" : ""
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Category Links */}
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            href={category.href}
                            className="px-3 py-2 text-sm font-medium hover:bg-[#174428] rounded transition-colors whitespace-nowrap"
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed top-[100px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-30 animate-slide-down">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${pathname === link.href
                                    ? "bg-[#3BB77E] text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-2"></div>

                        {/* Additional Mobile Links */}
                        <Link
                            href="/wishlist"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <Heart className="h-4 w-4" />
                            Wishlist
                            {wishlist.length > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>

                        {isLoggedIn ? (
                            <>
                                <Link
                                    href="/account/profile"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <User className="h-4 w-4" />
                                    My Account
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/signin"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <User className="h-4 w-4" />
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
