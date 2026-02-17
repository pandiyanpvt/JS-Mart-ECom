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
import { MapPin, Search, ShoppingBag, Menu, ChevronDown, User, LogOut, Package, Heart, Apple, Milk, Cake, Coffee, Beef, Fish, Home, Baby, ChevronRight, Loader2 } from "lucide-react";
import { MapPin, Search, ShoppingBag, Menu, ChevronDown, User, LogOut, Package, Heart, Apple, Milk, Cake, Coffee, Beef, Fish, Home, Baby, ChevronRight, Bell, MessageSquare, Star, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import CartModal from "@/components/layout/add-cart-modal";
import { categoryService, productService, notificationService } from "@/services";
import { type Category } from "@/services/category.service";
import { type Product } from "@/services/product.service";
import { getProductImages, getProductImageUrl } from "@/services/product.service";

function buildCategoryTree(categories: Category[]): Category[] {
    const categoryMap = new Map<number, Category>();
    // Clone objects to avoid mutation issues and initialize subCategories
    categories.forEach(cat => {
        categoryMap.set(cat.id, { ...cat, subCategories: [] });
    });

    const rootCategories: Category[] = [];

    categoryMap.forEach((cat) => {
        if (cat.parentId && cat.parentId !== 0) {
            const parent = categoryMap.get(cat.parentId);
            if (parent) {
                parent.subCategories?.push(cat);
            } else {
                // If parent not found, maybe treat as root? 
                // For safety, let's treat top-level ones (level 1 or null parent) as roots
                if (cat.level === 1) rootCategories.push(cat);
            }
        } else {
            rootCategories.push(cat);
        }
    });

    return rootCategories;
}

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [userProfileImg, setUserProfileImg] = useState<string | null>(null);
    const { cart } = useCart();
    const { wishlist } = useWishlist();
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [allMenuOpen, setAllMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);
    const [activeSubCategory, setActiveSubCategory] = useState<Category | null>(null);
    const [categoryProducts, setCategoryProducts] = useState<Record<number, Product[]>>({});
    const [loadingCategories, setLoadingCategories] = useState<Set<number>>(new Set());
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);

    // Fetch unread notifications
    useEffect(() => {
        if (isLoggedIn) {
            notificationService.getMyNotifications(1, 5)
                .then(data => {
                    setNotifications(data.items);
                    const unread = data.items.filter(n => !n.isRead).length;
                    setUnreadCount(unread);
                })
                .catch(err => console.error("Error fetching notifications:", err));
        }
    }, [isLoggedIn, pathname]);

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    // Fetch categories from backend (used in dropdown + green bar)
    useEffect(() => {
        categoryService
            .getActive()
            .then((categoriesData) => {
                const tree = buildCategoryTree(categoriesData);
                setCategories(tree);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                setCategories([]);
            });
    }, []);

    // When category is selected: if it has subcategories, auto-select first so product list shows beside the list
    useEffect(() => {
        if (activeCategory?.subCategories && activeCategory.subCategories.length > 0) {
            setActiveSubCategory(activeCategory.subCategories[0]);
        } else {
            setActiveSubCategory(null);
        }
    }, [activeCategory]);

    // Fetch products helper
    const fetchProductsForCategory = (categoryId: number) => {
        if (!categoryProducts[categoryId] && !loadingCategories.has(categoryId)) {
            setLoadingCategories(prev => new Set(prev).add(categoryId));
            productService.getByCategory(categoryId)
                .then(products => {
                    setCategoryProducts(prev => ({ ...prev, [categoryId]: products }));
                })
                .catch(error => {
                    console.error(`Error fetching products for category ${categoryId}:`, error);
                    setCategoryProducts(prev => ({ ...prev, [categoryId]: [] }));
                })
                .finally(() => {
                    setLoadingCategories(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(categoryId);
                        return newSet;
                    });
                });
        }
    };

    // Search functionality
    const handleSearch = async (query: string) => {
        if (query.trim().length < 2) {
            setShowSearchResults(false);
            return;
        }

        setSearchLoading(true);
        try {
            const results = await productService.search(query.trim());
            setSearchResults(results.slice(0, 5)); // Show top 5 results
            setShowSearchResults(true);
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
            setShowSearchResults(false);
        } finally {
            setSearchLoading(false);
        }
    };

    // Fetch products for active category (if no subs) or active subcategory
    useEffect(() => {
        if (activeCategory) {
            // Case 1: Parent has no subs, fetch parent products
            if (!activeCategory.subCategories || activeCategory.subCategories.length === 0) {
                fetchProductsForCategory(activeCategory.id);
            }
        }
    }, [activeCategory, categoryProducts, loadingCategories]);

    useEffect(() => {
        // Case 2: Subcategory is active, fetch its products
        if (activeSubCategory) {
            fetchProductsForCategory(activeSubCategory.id);
        }
    }, [activeSubCategory, categoryProducts, loadingCategories]);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.search-container')) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
                    setUserProfileImg(userData.profileImg || null);
                } catch (error) {
                    setIsLoggedIn(false);
                    setUserProfileImg(null);
                }
            } else {
                setIsLoggedIn(false);
                setUserProfileImg(null);
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
        { name: "Membership", href: "/membership" },
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" },
    ];

    return (
        <div className="w-full flex flex-col font-sans bg-white">
            {/* Main Navbar */}
            <div className="py-2 pl-0 pr-2 md:pr-4 fixed top-0 bg-white w-full z-50 border-b border-gray-100 shadow-sm h-[80px] flex items-center">
                <div className="flex items-center justify-between gap-6 w-full max-w-[1920px] mx-auto">
                    {/* Hamburger Menu + Logo */}
                    <div className="flex items-center gap-2">
                        {/* Mobile Hamburger Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-6 h-6 text-gray-700" />
                        </button>

                        {/* Logo with Location */}
                        <div className="flex items-center gap-6">
                            <Link href="/" className="relative h-16 w-40 md:h-20 md:w-48 lg:h-24 lg:w-64 flex-shrink-0">
                                <Image
                                    src="/logo/Web_Logo_Mart-01%20(1).png"
                                    alt="JS Mart Australia"
                                    fill
                                    sizes="(max-width: 768px) 160px, (max-width: 1024px) 192px, 256px"
                                    className="object-contain"
                                    priority
                                />
                            </Link>

                            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-800 font-medium border-l border-gray-300 pl-6 h-10">
                                <MapPin className="h-5 w-5 text-gray-900" strokeWidth={2} />
                                <div className="flex flex-col leading-tight">
                                    <span className="text-gray-900 font-bold">Dubbo</span>
                                    <span className="text-gray-600 text-xs">AUSTRALIA</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-4xl hidden md:flex items-center px-4 search-container relative">
                        <div className="flex w-full h-11 items-center bg-[#F3F4F6] rounded-md overflow-hidden ring-1 ring-gray-200">
                            {/* All Dropdown Button */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="h-full px-5 bg-[#E5E7EB] hover:bg-[#D1D5DB] text-gray-800 text-sm font-bold flex items-center gap-2 transition-colors min-w-[80px] justify-between border-r border-gray-300">
                                        All
                                        <ChevronDown className="h-3 w-3 fill-current opacity-70" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56">
                                    <DropdownMenuLabel className="px-3 py-2 text-gray-700 font-bold text-sm">
                                        Categories
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="my-1" />
                                    <DropdownMenuItem asChild>
                                        <Link href="/shop" className="flex cursor-pointer px-3 py-2 text-sm hover:bg-gray-100">
                                            All Products
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="my-1" />
                                    {categories.map((category) => (
                                        <DropdownMenuItem key={category.id} asChild>
                                            <Link href={`/shop?category=${category.id}`} className="flex cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                {category.category}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (e.target.value.trim().length > 0) {
                                        handleSearch(e.target.value);
                                    } else {
                                        setShowSearchResults(false);
                                        setSearchResults([]);
                                    }
                                }}
                                onFocus={() => {
                                    if (searchResults.length > 0) {
                                        setShowSearchResults(true);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && searchQuery.trim()) {
                                        router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                                        setShowSearchResults(false);
                                        setSearchQuery("");
                                    }
                                }}
                                className="flex-1 h-full border-0 focus-visible:ring-0 text-gray-700 placeholder:text-gray-500 px-4 text-base bg-[#F3F4F6] shadow-none"
                                placeholder="Search products..."
                            />
                            <button 
                                onClick={() => {
                                    if (searchQuery.trim()) {
                                        router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                                        setShowSearchResults(false);
                                        setSearchQuery("");
                                    }
                                }}
                                className="h-full px-4 text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center"
                            >
                                {searchLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Search className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        {/* Search Results Dropdown */}
                        {showSearchResults && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[400px] overflow-y-auto">
                                <div className="p-2">
                                    {searchResults.map((product) => {
                                        const imgs = getProductImages(product);
                                        const primary = imgs.find((img) => img.isPrimary) || imgs[0];
                                        const imageUrl = primary ? getProductImageUrl(primary) : "/placeholder.png";
                                        return (
                                            <Link
                                                key={product.id}
                                                href={`/shop/${product.id}`}
                                                onClick={() => {
                                                    setShowSearchResults(false);
                                                    setSearchQuery("");
                                                }}
                                                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                                    <Image
                                                        src={imageUrl}
                                                        alt={product.productName}
                                                        fill
                                                        className="object-contain"
                                                        sizes="64px"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-sm text-[#253D4E] truncate">
                                                        {product.productName}
                                                    </h4>
                                                    <p className="text-sm text-[#005000] font-bold">
                                                        AUD {Number(product.price).toFixed(2)}
                                                    </p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                    {searchQuery.trim() && (
                                        <Link
                                            href={`/shop?search=${encodeURIComponent(searchQuery.trim())}`}
                                            onClick={() => {
                                                setShowSearchResults(false);
                                                setSearchQuery("");
                                            }}
                                            className="block p-3 text-center text-sm font-semibold text-[#005000] hover:bg-gray-50 rounded-lg border-t border-gray-200 mt-2"
                                        >
                                            View all results for "{searchQuery}"
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Sign In / User Account */}
                        {isLoggedIn ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="hidden md:flex items-center gap-2 hover:opacity-90 transition-opacity p-1 rounded-full outline-none ring-2 ring-transparent hover:ring-[#005000]/30 focus:ring-2 focus:ring-[#005000]/50">
                                        {userProfileImg ? (
                                            <span className="relative h-9 w-9 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                                <Image
                                                    src={userProfileImg}
                                                    alt={userName}
                                                    fill
                                                    className="object-cover"
                                                    sizes="32px"
                                                />
                                            </span>
                                        ) : (
                                            <span className="h-9 w-9 rounded-full bg-[#1F5632] flex items-center justify-center flex-shrink-0 text-white shadow-md">
                                                <User className="h-5 w-5" />
                                            </span>
                                        )}
                                        <ChevronDown className="h-3.5 w-3.5 text-gray-600" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 p-2">
                                    <div className="px-3 py-2 mb-1">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Signed in as</p>
                                        <p className="font-bold text-gray-900 truncate mt-0.5">{userName}</p>
                                    </div>
                                    <DropdownMenuSeparator className="mx-1" />

                                    <DropdownMenuItem asChild>
                                        <Link href="/account/profile?tab=profile" className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                                            <User className="h-4 w-4 text-gray-500" />
                                            My Profile
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link href="/account/profile?tab=orders" className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                                            <Package className="h-4 w-4 text-gray-500" />
                                            My Orders
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link href="/account/profile?tab=reviews" className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                                            <MessageSquare className="h-4 w-4 text-gray-500" />
                                            My Reviews
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link href="/account/profile?tab=addresses" className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            Shipping Address
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link href="/account/profile?tab=points" className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                                            <Star className="h-4 w-4 text-gray-500" />
                                            My Loyalty Points
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link href="/account/profile?tab=notifications" className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                                            <div className="relative">
                                                <Bell className="h-4 w-4 text-gray-500" />
                                                {unreadCount > 0 && <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>}
                                            </div>
                                            Notifications
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link href="/account/profile?tab=membership" className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                                            <Crown className="h-4 w-4 text-gray-500" />
                                            Membership
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="mx-1" />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer text-red-600 focus:text-red-600 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout Account
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                href="/signin"
                                className="hidden md:inline-flex items-center justify-center gap-2 h-10 px-6 rounded-full bg-[#1F5632] hover:bg-[#174428] text-white text-sm font-bold transition-transform active:scale-95 shadow-md"
                            >
                                Sign In
                            </Link>
                        )}

                        {/* Notifications */}
                        {isLoggedIn && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="hidden md:flex items-center justify-center h-10 w-10 hover:bg-gray-100 rounded-full transition-colors relative outline-none">
                                        <Bell className={`h-6 w-6 ${unreadCount > 0 ? "text-[#1F5632] fill-[#1F5632]/10" : "text-gray-700"}`} />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden rounded-xl shadow-xl">
                                    <div className="bg-[#1F5632] p-4 text-white flex items-center justify-between">
                                        <h3 className="font-bold text-sm">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <span className="text-[10px] bg-red-500 px-2 py-0.5 rounded-full font-bold">
                                                {unreadCount} NEW
                                            </span>
                                        )}
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-gray-400">
                                                <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                                <p className="text-xs">No notifications yet</p>
                                            </div>
                                        ) : (
                                            notifications.map((notif) => (
                                                <button
                                                    key={notif.id}
                                                    onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                                                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 relative ${!notif.isRead ? "bg-green-50/30" : ""
                                                        }`}
                                                >
                                                    {!notif.isRead && (
                                                        <span className="absolute left-2 top-4 w-1.5 h-1.5 bg-[#1F5632] rounded-full"></span>
                                                    )}
                                                    <h4 className={`text-xs font-bold mb-0.5 ${!notif.isRead ? "text-gray-900" : "text-gray-600"}`}>
                                                        {notif.title}
                                                    </h4>
                                                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                                                        {notif.message}
                                                    </p>
                                                    <span className="text-[9px] text-gray-400 mt-2 block">
                                                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                    <Link
                                        href="/account/profile?tab=notifications"
                                        className="block p-3 text-center text-[11px] font-bold text-[#1F5632] bg-gray-50 hover:bg-gray-100 transition-colors border-t border-gray-100"
                                    >
                                        View All Notifications
                                    </Link>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* Wishlist */}
                        <Link href="/wishlist" className="hidden md:flex items-center justify-center h-10 w-10 hover:bg-gray-100 rounded-full transition-colors relative">
                            <Heart className={`h-6 w-6 ${wishlist.length > 0 ? "text-red-500 fill-red-500" : "text-gray-700"}`} />
                            {wishlist.length > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <button
                            onClick={toggleModal}
                            className="flex items-center justify-center h-10 w-10 hover:bg-gray-100 rounded-full transition-colors relative outline-none"
                        >
                            <ShoppingBag className="h-6 w-6 text-gray-800" />
                            {cart.length > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 bg-[#1F5632] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                        <CartModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
                    </div>
                </div>
            </div>

            {/* Green Category Navigation Bar - Fixed alignment */}
            <div className="hidden md:flex bg-[#1F5632] text-white h-12 fixed top-[80px] left-0 right-0 w-full z-40 shadow-md">
                <div className="flex items-center h-full w-full pl-0 min-w-0">
                    {/* All Button - Left Side with Hamburger */}
                    <DropdownMenu open={allMenuOpen} onOpenChange={(open) => {
                        setAllMenuOpen(open);
                        if (!open) {
                            setActiveCategory(null);
                            setActiveSubCategory(null);
                        }
                    }}>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="h-full flex items-center gap-3 bg-[#174428] hover:bg-[#0f3319] px-6 text-base font-bold whitespace-nowrap transition-colors border-r border-[#2a6b40]"
                            >
                                <Menu className="h-6 w-6" strokeWidth={2.5} />
                                All
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="start"
                            sideOffset={0}
                            className="bg-white text-gray-900 border-t-0 p-0 flex h-[500px] w-[1000px] shadow-2xl rounded-b-lg overflow-hidden z-[100]"
                        >
                            {/* Col 1: Parent Categories (Roots) */}
                            <div className="w-[20%] bg-gray-50 overflow-y-auto py-2 border-r border-gray-100 custom-scrollbar flex-shrink-0">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        onMouseEnter={() => setActiveCategory(category)}
                                        onClick={() => setActiveCategory(category)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === "Enter" && setActiveCategory(category)}
                                        className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-all ${activeCategory?.id === category.id
                                            ? "bg-white text-[#1F5632] font-bold border-l-4 border-[#1F5632] shadow-sm"
                                            : "text-gray-700 hover:bg-gray-100 border-l-4 border-transparent"
                                            }`}
                                    >
                                        <span className="text-sm truncate mr-2">{category.category}</span>
                                        <ChevronRight className={`h-4 w-4 flex-shrink-0 transition-opacity ${activeCategory?.id === category.id ? "opacity-100 text-[#1F5632]" : "opacity-0"}`} />
                                    </div>
                                ))}
                            </div>

                            {/* Right side (subcategories + products) - shows when cursor hovers over category */}
                            {activeCategory && activeCategory.subCategories && activeCategory.subCategories.length > 0 ? (
                                <>
                                    {/* Col 2: Subcategories List */}
                                    <div className="w-[25%] bg-white border-r border-gray-100 overflow-y-auto custom-scrollbar p-2 flex-shrink-0">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 py-2 mb-2">
                                            {activeCategory.category}
                                        </h3>
                                        {activeCategory.subCategories.map((sub) => (
                                            <div
                                                key={sub.id}
                                                onClick={() => setActiveSubCategory(sub)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => e.key === "Enter" && setActiveSubCategory(sub)}
                                                className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-all border-l-4 ${activeSubCategory?.id === sub.id
                                                    ? "bg-green-50 text-[#1F5632] font-bold border-l-[#1F5632]"
                                                    : "text-gray-700 hover:bg-gray-50 border-l-transparent"
                                                    }`}
                                            >
                                                <span className="text-sm truncate mr-2">{sub.category}</span>
                                                <ChevronRight className={`h-4 w-4 flex-shrink-0 transition-opacity ${activeSubCategory?.id === sub.id ? "opacity-100 text-[#1F5632]" : "opacity-0"}`} />

                                                {/* Render Sub-Sub Categories inline if needed, or keep simple keys */}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Col 3: Products for Active Subcategory */}
                                    <div className="w-[55%] bg-white p-6 overflow-y-auto custom-scrollbar">
                                        {activeSubCategory ? (
                                            <div className="h-full flex flex-col">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-lg font-bold text-gray-800">{activeSubCategory.category} Products</h4>
                                                    <Link href={`/shop?category=${activeSubCategory.id}`} className="text-xs font-bold text-[#1F5632] hover:underline">
                                                        View All
                                                    </Link>
                                                </div>

                                                {loadingCategories.has(activeSubCategory.id) ? (
                                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F5632] mb-2"></div>
                                                        <p className="text-sm">Loading products...</p>
                                                    </div>
                                                ) : categoryProducts[activeSubCategory.id] && categoryProducts[activeSubCategory.id].length > 0 ? (
                                                    <div className="space-y-1">
                                                        {categoryProducts[activeSubCategory.id].slice(0, 9).map((product) => (
                                                            <Link key={product.id} href={`/shop/${product.id}`} className="block py-2 px-2 text-sm font-medium text-gray-700 hover:text-[#1F5632] hover:bg-gray-50 rounded truncate">
                                                                {product.productName}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                                        <p className="text-sm">No products found in this category.</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                    <ChevronRight className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <p>Click a subcategory to see products</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : activeCategory ? (
                                // No Subcategories - Fallback to showing products for the Parent Category directly (only when category clicked)
                                <div className="w-[80%] bg-white p-6 overflow-y-auto custom-scrollbar">
                                    <div className="h-full flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-lg font-bold text-gray-800">{activeCategory.category} Products</h4>
                                            <Link href={`/shop?category=${activeCategory.id}`} className="text-xs font-bold text-[#1F5632] hover:underline">
                                                View All
                                            </Link>
                                        </div>
                                        {loadingCategories.has(activeCategory.id) ? (
                                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F5632] mb-2"></div>
                                                <p className="text-sm">Loading products...</p>
                                            </div>
                                        ) : categoryProducts[activeCategory.id] && categoryProducts[activeCategory.id].length > 0 ? (
                                            <div className="space-y-1">
                                                {categoryProducts[activeCategory.id].slice(0, 12).map((product) => (
                                                    <Link key={product.id} href={`/shop/${product.id}`} className="block py-2 px-2 text-sm font-medium text-gray-700 hover:text-[#1F5632] hover:bg-gray-50 rounded truncate">
                                                    <Link key={product.id} href={`/product/${product.id}`} className="block py-2 px-2 text-sm font-medium text-gray-700 hover:text-[#1F5632] hover:bg-gray-50 rounded truncate">
                                                        {product.productName}
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
                                                <ShoppingBag className="h-12 w-12 mb-3 opacity-20" />
                                                <p className="text-sm font-medium">No products found</p>
                                                <Link
                                                    href={`/shop?category=${activeCategory.id}`}
                                                    className="mt-4 px-6 py-2 bg-[#1F5632] text-white text-sm font-bold rounded-full hover:bg-[#174428] transition-all"
                                                >
                                                    Shop {activeCategory.category}
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Main Navigation Links - Horizontal */}
                    <div className="flex-1 flex items-center h-full overflow-x-auto scrollbar-hide px-2">
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="h-full flex items-center px-6 text-sm font-bold text-white hover:bg-[#174428] transition-colors whitespace-nowrap uppercase tracking-wider"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Spacer to prevent content from being hidden behind fixed header */}
            <div className="h-[80px] md:h-[92px]" />

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed top-[80px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-30 animate-slide-down">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${pathname === link.href
                                    ? "bg-[#005000] text-white"
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
