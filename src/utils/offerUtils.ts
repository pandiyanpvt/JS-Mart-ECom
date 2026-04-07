// Utility functions for handling product offers and discounts

import { resolveImageSrc } from "@/lib/images";

export interface Offer {
    id: number;
    name: string;
    offerTypeId: number;
    productId?: number | null;
    discountPercentage?: number | null;
    discountAmount?: number | null;
    buyQuantity?: number | null;
    getQuantity?: number | null;
    startDate: string;
    endDate: string;
    isActive: boolean;
    bannerImg?: string;
    freeProductId?: number | null;
    targetMembershipLevel?: number;
    freeProduct?: {
        id: number;
        productName: string;
        productImg?: string;
        price?: number;
    };
    maxUsage?: number;
    currentUsage?: number;
    couponCode?: string;
    offerName?: string; // Added to support various API response formats
    minOrderAmount?: number | null;
    description?: string;
    product?: {
        id: number;
        productName: string;
        productImages?: { image: string }[];
        images?: { productImg?: string }[];
    };
}

/** Get display image for an offer: admin banner first, then product image, then empty placeholder */
export function getOfferImageUrl(offer: Offer): string {
    if (offer.bannerImg?.trim()) return resolveImageSrc(offer.bannerImg);
    const p = offer.product;
    if (!p) return resolveImageSrc(null);
    const first =
        p.images && p.images[0]?.productImg
            ? p.images[0].productImg
            : p.productImages && p.productImages[0]?.image
              ? p.productImages[0].image
              : null;
    return resolveImageSrc(first);
}

export interface ProductWithOffer {
    originalPrice: number;
    discountedPrice: number;
    discountPercentage?: number;
    offer?: Offer;
    hasDiscount: boolean;
}

/**
 * Calculate the discounted price for a product based on active offers
 * Matches backend logic: Type 2 (Percentage discount) takes priority
 */
export function calculateProductDiscount(
    productPrice: number,
    offers: Offer[],
    userLevel: number = 0
): ProductWithOffer {
    const now = new Date();
    const activeOffers = offers.filter(
        (offer) => {
            if (!offer.isActive) return false;

            // Membership level filter
            if ((offer.targetMembershipLevel || 0) > userLevel) return false;

            const start = new Date(offer.startDate);
            const end = offer.endDate ? new Date(offer.endDate) : null;

            const hasStarted = isNaN(start.getTime()) || start <= now;
            const hasnNotEnded = !end || isNaN(end.getTime()) || end >= now;

            return hasStarted && hasnNotEnded;
        }
    );

    if (activeOffers.length === 0) {
        return {
            originalPrice: productPrice,
            discountedPrice: productPrice,
            hasDiscount: false,
        };
    }

    // Type 2: Percentage discount (takes priority)
    const type2Offer = activeOffers.find(o => o.offerTypeId === 2);
    if (type2Offer && type2Offer.discountPercentage) {
        const discountPercent = Number(type2Offer.discountPercentage);
        const discountedPrice = productPrice - (productPrice * (discountPercent / 100));
        return {
            originalPrice: productPrice,
            discountedPrice: Math.round(discountedPrice * 100) / 100,
            discountPercentage: discountPercent,
            offer: type2Offer,
            hasDiscount: true,
        };
    }

    // If Type 2 not found, check Type 1 (BOGO) - but this affects line total, not unit price
    // For unit price display, we return original price
    const type1Offer = activeOffers.find(o => o.offerTypeId === 1);
    if (type1Offer) {
        return {
            originalPrice: productPrice,
            discountedPrice: productPrice, // Unit price unchanged, discount applied at line level
            offer: type1Offer,
            hasDiscount: false, // Will be calculated at line level
        };
    }

    return {
        originalPrice: productPrice,
        discountedPrice: productPrice,
        hasDiscount: false,
    };
}

/**
 * Format the offer validity date
 */
export function formatOfferValidity(endDate: string): string {
    if (!endDate) return "Permanent Offer";
    const end = new Date(endDate);
    if (isNaN(end.getTime())) return "Permanent Offer";
    const now = new Date();

    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
        return "Expired";
    } else if (daysLeft === 0) {
        return "Ends today";
    } else if (daysLeft === 1) {
        return "Ends tomorrow";
    } else if (daysLeft <= 7) {
        return `${daysLeft} days left`;
    } else {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        };
        return `Till ${end.toLocaleDateString('en-GB', options)}`;
    }
}

/**
 * Get the best offer for a product (highest discount)
 */
export function getBestOffer(offers: Offer[], productPrice: number): Offer | null {
    const now = new Date();
    const activeOffers = offers.filter((offer) => {
        if (!offer.isActive || offer.offerTypeId !== 2) return false;
        const start = new Date(offer.startDate);
        const end = offer.endDate ? new Date(offer.endDate) : null;
        const hasStarted = isNaN(start.getTime()) || start <= now;
        const havenNotEnded = !end || isNaN(end.getTime()) || end >= now;
        return hasStarted && havenNotEnded;
    });

    if (activeOffers.length === 0) return null;

    return activeOffers.reduce((best, current) => {
        const currentDiscount = current.discountPercentage
            ? (productPrice * Number(current.discountPercentage) / 100)
            : (Number(current.discountAmount) || 0);

        const bestDiscount = best.discountPercentage
            ? (productPrice * Number(best.discountPercentage) / 100)
            : (Number(best.discountAmount) || 0);

        return currentDiscount > bestDiscount ? current : best;
    });
}

export interface CartItem {
    id: string | number;
    name: string;
    price: number | string;
    image: string;
    quantity: number;
    weight?: string;
}

/**
 * Calculate line item total with offers applied
 */
export function calculateLineItemTotal(
    unitPrice: number,
    quantity: number,
    offers: Offer[]
): number {
    const now = new Date();
    const activeOffers = offers.filter((offer) => {
        if (!offer.isActive) return false;
        const start = new Date(offer.startDate);
        const end = offer.endDate ? new Date(offer.endDate) : null;
        return (isNaN(start.getTime()) || start <= now) && (!end || isNaN(end.getTime()) || end >= now);
    });

    let totalSavings = 0;

    // Type 2 (Percentage) - Stacked
    activeOffers.filter(o => o.offerTypeId === 2).forEach(o => {
        const perc = Number(o.discountPercentage) || 0;
        totalSavings += (unitPrice * quantity) * (perc / 100);
    });

    // Type 1 (BOGO)
    activeOffers.filter(o => o.offerTypeId === 1).forEach(o => {
        const buyQty = o.buyQuantity || 1;
        const getQty = o.getQuantity || 1;
        const cycle = buyQty + getQty;
        if (quantity >= cycle) {
            const freeGroups = Math.floor(quantity / cycle);
            const freeQty = freeGroups * getQty;
            totalSavings += freeQty * unitPrice;
        }
    });

    return Math.max(0, Math.round((unitPrice * quantity - totalSavings) * 100) / 100);
}

export interface CartCalculationResult {
    subtotal: number;
    shipping: number;
    automaticDiscountTotal: number;
    itemLevelDiscountTotal: number;
    couponDiscountTotal: number;
    total: number;
    itemsWithDiscount: {
        id: string;
        name: string;
        image: string;
        quantity: number;
        originalPrice: number;
        unitPrice: number;
        lineTotal: number;
        savings: number;
        appliedOffer?: Offer;
        isFreeItem?: boolean;
        originalId: string;
        weight?: string;
    }[];
    suggestedFreeProducts?: {
        productId: number;
        productName: string;
        quantity: number;
        offerId: number;
    }[];
    couponError?: string;
    appliedAutomaticOffer?: Offer;
    appliedCoupon?: Offer;
    pointsDiscountTotal: number;
    pointsRedeemed: number;
}

export function calculateCartTotals(
    items: CartItem[],
    offers: Offer[],
    shippingFee: number,
    couponCode?: string,
    userLevel: number = 0,
    redeemPoints: boolean = false,
    userPointsBalance: number = 0,
    pointsToAudRatio: number = 0.01
): CartCalculationResult {
    const now = new Date();
    const activeOffers = offers.filter((offer) => {
        if (!offer.isActive) return false;
        if ((offer.targetMembershipLevel || 0) > userLevel) return false;
        const start = new Date(offer.startDate);
        const end = offer.endDate ? new Date(offer.endDate) : null;
        return (isNaN(start.getTime()) || start <= now) && (!end || isNaN(end.getTime()) || end >= now);
    });

    const orderItemsMap: Record<string, {
        paidQty: number;
        freeQty: number;
        price: number;
        appliedOffers: Offer[];
        item: CartItem;
        percentageDiscount: number;
    }> = {};

    // 1. Initialize
    items.forEach(item => {
        const id = String(item.id);
        if (!orderItemsMap[id]) {
            orderItemsMap[id] = {
                paidQty: 0,
                freeQty: 0,
                price: Number(item.price),
                appliedOffers: [],
                item,
                percentageDiscount: 0
            };
        }
        orderItemsMap[id].paidQty += (item.quantity || 1);
    });

    // 2. Item-level (BOGO & Percentage)
    for (const id in orderItemsMap) {
        const entry = orderItemsMap[id];
        activeOffers.filter(o => o.offerTypeId === 2 && String(o.productId) === id).forEach(o => {
            const disc = (entry.paidQty * entry.price) * ((Number(o.discountPercentage) || 0) / 100);
            entry.percentageDiscount += disc;
            entry.appliedOffers.push(o);
        });
        activeOffers.filter(o => o.offerTypeId === 1 && String(o.productId) === id).forEach(o => {
            const cycles = Math.floor(entry.paidQty / (o.buyQuantity || 1));
            const freeCount = cycles * (o.getQuantity || 1);
            if (freeCount > 0) {
                entry.freeQty += freeCount;
                entry.appliedOffers.push(o);
            }
        });
    }

    // 3. Free Gifts (Type 4)
    Object.keys(orderItemsMap).forEach(id => {
        const entry = orderItemsMap[id];
        const offer = activeOffers.find(o => o.offerTypeId === 4 && String(o.productId) === id);
        if (offer && offer.freeProduct) {
            const cycles = Math.floor(entry.paidQty / (offer.buyQuantity || 1));
            const freeCount = cycles * (offer.getQuantity || 1);
            if (freeCount > 0) {
                const freeId = String(offer.freeProductId);
                if (!orderItemsMap[freeId]) {
                    orderItemsMap[freeId] = {
                        paidQty: 0, freeQty: 0, price: Number(offer.freeProduct.price || 0),
                        appliedOffers: [], item: { id: freeId, name: offer.freeProduct.productName, price: Number(offer.freeProduct.price || 0), image: resolveImageSrc((offer.freeProduct as any).productImg) } as any,
                        percentageDiscount: 0
                    };
                }
                orderItemsMap[freeId].freeQty += freeCount;
                orderItemsMap[freeId].appliedOffers.push(offer);
            }
        }
    });



    // 4. Finalize Items and Gross Totals
    let grossSubtotal = 0;
    let itemLevelDiscountTotal = 0;
    const processedItems: CartCalculationResult['itemsWithDiscount'] = [];

    for (const id in orderItemsMap) {
        const entry = orderItemsMap[id];
        const totalQty = entry.paidQty + entry.freeQty;
        grossSubtotal += entry.price * totalQty;
        itemLevelDiscountTotal += (entry.price * entry.freeQty) + entry.percentageDiscount;

        if (entry.paidQty > 0) {
            processedItems.push({
                ...entry.item, id, originalId: id, originalPrice: entry.price, unitPrice: entry.price,
                lineTotal: (entry.price * entry.paidQty) - entry.percentageDiscount,
                savings: entry.percentageDiscount, appliedOffer: entry.appliedOffers[0],
                isFreeItem: false, quantity: entry.paidQty
            });
        }
        if (entry.freeQty > 0) {
            processedItems.push({
                ...entry.item, id: `${id}-free`, name: `${entry.item.name} (FREE)`,
                originalId: id, originalPrice: entry.price, unitPrice: 0, lineTotal: 0,
                savings: entry.price * entry.freeQty, isFreeItem: true, quantity: entry.freeQty,
                appliedOffer: entry.appliedOffers.find(o => o.offerTypeId === 1 || o.offerTypeId === 4)
            });
        }
    }

    const subtotal = Math.round(grossSubtotal * 100) / 100;
    let automaticDiscountTotal = 0;
    let appliedAutomaticOffer: Offer | undefined;

    // 5. Order-level (Type 3)
    let balanceForType3 = subtotal - itemLevelDiscountTotal;
    activeOffers.filter(o => o.offerTypeId === 3 && (!o.couponCode || o.couponCode === "")).forEach(o => {
        if (balanceForType3 >= (Number(o.minOrderAmount) || 0)) {
            const d = o.discountPercentage ? (balanceForType3 * (Number(o.discountPercentage) / 100)) : (Number(o.discountAmount) || 0);
            automaticDiscountTotal += d;
            balanceForType3 -= d;
            if (!appliedAutomaticOffer) appliedAutomaticOffer = o;
        }
    });

    // 6. Coupon
    let couponDiscountTotal = 0;
    let appliedCoupon: Offer | undefined;
    let couponError: string | undefined;

    if (couponCode) {
        const coupon = activeOffers.find(o => o.couponCode?.toUpperCase() === couponCode.toUpperCase());
        const finalBalance = subtotal - itemLevelDiscountTotal - automaticDiscountTotal;
        if (!coupon) {
            couponError = "Invalid or expired coupon";
        } else if (finalBalance < (Number(coupon.minOrderAmount) || 0)) {
            couponError = `Min order AUD ${coupon.minOrderAmount} required`;
        } else {
            couponDiscountTotal = coupon.discountPercentage ? (finalBalance * (Number(coupon.discountPercentage) / 100)) : (Number(coupon.discountAmount) || 0);
            appliedCoupon = coupon;
        }
    }

    const finalShipping = userLevel > 0 ? 0 : shippingFee;
    let totalBeforePoints = Math.max(0, subtotal + finalShipping - itemLevelDiscountTotal - automaticDiscountTotal - couponDiscountTotal);

    let pointsDiscountTotal = 0;
    let pointsRedeemed = 0;

    if (redeemPoints && userPointsBalance > 0) {
        const potentialDiscount = Math.round(userPointsBalance * pointsToAudRatio * 100) / 100;
        pointsDiscountTotal = Math.min(totalBeforePoints, potentialDiscount);
        pointsRedeemed = Math.round(pointsDiscountTotal / pointsToAudRatio);
    }

    const total = Math.round((totalBeforePoints - pointsDiscountTotal) * 100) / 100;

    return {
        subtotal, shipping: finalShipping,
        itemLevelDiscountTotal: Math.round(itemLevelDiscountTotal * 100) / 100,
        automaticDiscountTotal: Math.round(automaticDiscountTotal * 100) / 100,
        couponDiscountTotal: Math.round(couponDiscountTotal * 100) / 100,
        pointsDiscountTotal: Math.round(pointsDiscountTotal * 100) / 100,
        pointsRedeemed,
        total,
        itemsWithDiscount: processedItems.map(item => ({ ...item, id: String(item.id), originalId: String(item.originalId) })),
        appliedAutomaticOffer, appliedCoupon, couponError,
        suggestedFreeProducts: []
    };
}
