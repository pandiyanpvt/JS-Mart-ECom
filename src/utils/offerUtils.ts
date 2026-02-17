// Utility functions for handling product offers and discounts

export interface Offer {
    id: number;
    name: string;
    offerTypeId: number;
    productId: number;
    discountPercentage?: number;
    discountAmount?: number;
    buyQuantity?: number;
    getQuantity?: number;
    minOrderAmount?: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    bannerImg?: string;
    targetMembershipLevel?: number;
    freeProduct?: {
        id: number;
        productName: string;
        productImg?: string;
    };
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
 */
/**
 * Calculate the discounted price for a product based on active offers
 */
export function calculateProductDiscount(
    productPrice: number,
    offers: Offer[],
    userLevel: number = 0
): ProductWithOffer {
    // Filter active offers that are currently valid
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

    // Try to find the best discount offer (Type 2)
    let bestOffer = activeOffers[0];
    let minPrice = productPrice;
    let bestDiscountPercentage: number | undefined;

    // Check all active offers to find the one that gives the lowest price
    for (const offer of activeOffers) {
        let currentPrice = productPrice;
        let currentDiscountPercentage: number | undefined;

        // Type 2: Discount (Percentage or Fixed Amount)
        if (offer.offerTypeId === 2) {
            // Convert to number in case backend sends as string
            const percentDiscount = offer.discountPercentage ? Number(offer.discountPercentage) : 0;
            const amountDiscount = offer.discountAmount ? Number(offer.discountAmount) : 0;

            if (percentDiscount > 0) {
                currentPrice = productPrice - (productPrice * (percentDiscount / 100));
                currentDiscountPercentage = percentDiscount;
            } else if (amountDiscount > 0) {
                currentPrice = Math.max(0, productPrice - amountDiscount);
                currentDiscountPercentage = Math.round((amountDiscount / productPrice) * 100);
            }

            // If this offer gives a better price, use it
            if (currentPrice < minPrice) {
                minPrice = currentPrice;
                bestOffer = offer;
                bestDiscountPercentage = currentDiscountPercentage;
            }
        }
    }

    return {
        originalPrice: productPrice,
        discountedPrice: Math.round(minPrice * 100) / 100, // Round to 2 decimals
        discountPercentage: bestDiscountPercentage,
        offer: bestOffer,
        hasDiscount: minPrice < productPrice,
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

    // Calculate days remaining
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
        // Format as "Till DD MMM YYYY"
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
    const activeOffers = offers.filter(
        (offer) => {
            if (!offer.isActive || offer.offerTypeId !== 2) return false;
            const now = new Date();
            const start = new Date(offer.startDate);
            const end = offer.endDate ? new Date(offer.endDate) : null;

            const hasStarted = isNaN(start.getTime()) || start <= now;
            const havenNotEnded = !end || isNaN(end.getTime()) || end >= now;

            return hasStarted && havenNotEnded;
        }
    );

    if (activeOffers.length === 0) return null;

    // Calculate discount for each offer and pick the best one
    return activeOffers.reduce((best, current) => {
        const currentDiscount = current.discountPercentage
            ? (productPrice * current.discountPercentage / 100)
            : (current.discountAmount || 0);

        const bestDiscount = best.discountPercentage
            ? (productPrice * best.discountPercentage / 100)
            : (best.discountAmount || 0);

        return currentDiscount > bestDiscount ? current : best;
    });
}
