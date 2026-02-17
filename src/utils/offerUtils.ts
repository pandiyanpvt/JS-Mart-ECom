// Utility functions for handling product offers and discounts

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
    minOrderAmount?: number | null;
    description?: string;
    product?: {
        id: number;
        productName: string;
        productImages?: { image: string }[];
    };
    targetMembershipLevel?: number;
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
    const activeOffers = offers.filter(
        (offer) =>
            offer.isActive &&
            offer.offerTypeId === 2 &&
            new Date(offer.startDate) <= now &&
            new Date(offer.endDate) >= now
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

/**
 * Calculate line item total with offers applied
 * Matches backend logic exactly:
 * 1. Type 2 (Percentage) applied first
 * 2. Type 1 (BOGO) applied if Type 2 not found
 * 3. Type 4 (Free product) handled separately
 */
export function calculateLineItemTotal(
    unitPrice: number,
    quantity: number,
    offers: Offer[]
): number {
    const now = new Date();
    const activeOffers = offers.filter(
        o => o.isActive &&
        new Date(o.startDate) <= now &&
        new Date(o.endDate) >= now
    );

    // Step 1: Apply Type 2 (Percentage discount) first
    const type2Offer = activeOffers.find(o => o.offerTypeId === 2);
    if (type2Offer && type2Offer.discountPercentage) {
        const discountPercent = Number(type2Offer.discountPercentage);
        const discountedUnitPrice = unitPrice - (unitPrice * (discountPercent / 100));
        return Math.round(discountedUnitPrice * quantity * 100) / 100;
    }

    // Step 2: Apply Type 1 (BOGO) if Type 2 not found
    const type1Offer = activeOffers.find(o => o.offerTypeId === 1);
    if (type1Offer) {
        const buyQty = type1Offer.buyQuantity || 1;
        const getQty = type1Offer.getQuantity || 1;
        const cycleSize = buyQty + getQty;

        // Backend logic: only apply if quantity >= cycleSize
        if (quantity >= cycleSize) {
            const freeGroups = Math.floor(quantity / cycleSize);
            const freeQty = freeGroups * getQty;
            const payableQty = quantity - freeQty;
            return Math.round(unitPrice * payableQty * 100) / 100;
        }
    }

    // No discount
    return Math.round(unitPrice * quantity * 100) / 100;
}

export interface CartCalculationResult {
    subtotal: number;
    shipping: number;
    discountTotal: number;
    total: number;
    itemsWithDiscount: {
        id: string;
        name: string;
        image: string;
        quantity: number;
        originalPrice: number;
        unitPrice: number; // After Type 2 discount if any
        lineTotal: number; // After all item-level offers
        savings: number;
        appliedOffer?: Offer;
        isFreeItem?: boolean;
        freeProductInfo?: {
            productId: number;
            productName: string;
            quantity: number;
        };
    }[];
    suggestedFreeProducts?: {
        productId: number;
        productName: string;
        quantity: number;
        offerId: number;
    }[];
}

/**
 * Calculate cart totals matching backend logic exactly:
 * 1. Apply Type 2 (Percentage) discounts first
 * 2. Apply Type 1 (BOGO) for same product
 * 3. Apply Type 4 (Buy X get Y free) - discount free items if in cart
 * 4. Calculate subtotal after line discounts
 * 5. Apply Type 3 (Cart-level) discount if minOrderAmount met
 */
export function calculateCartTotals(
    items: any[],
    allOffers: Offer[],
    shippingCost: number = 0,
    appliedCouponCode?: string
): CartCalculationResult {
    const now = new Date();
    const activeOffers = allOffers.filter(
        o => o.isActive &&
        new Date(o.startDate) <= now &&
        new Date(o.endDate) >= now
    );

    // Step 1: Process items with Type 2 (Percentage) discounts first
    let processedItems = items.map(item => {
        const itemId = String(item.id);
        const itemOffers = activeOffers.filter(
            o => o.productId && String(o.productId) === itemId
        );

        const originalPrice = Number(item.price);
        let unitPrice = originalPrice;
        let appliedOffer: Offer | undefined;
        let savings = 0;

        // Apply Type 2 first (takes priority)
        const type2Offer = itemOffers.find(o => o.offerTypeId === 2);
        if (type2Offer && type2Offer.discountPercentage) {
            const discountPercent = Number(type2Offer.discountPercentage);
            unitPrice = originalPrice - (originalPrice * (discountPercent / 100));
            appliedOffer = type2Offer;
            savings = (originalPrice - unitPrice) * (item.quantity || 1);
        }

        const quantity = item.quantity || 1;
        let lineTotal = unitPrice * quantity;

        // Step 2: Apply Type 1 (BOGO) only if Type 2 not applied
        if (!type2Offer) {
            const type1Offer = itemOffers.find(o => o.offerTypeId === 1);
            if (type1Offer) {
                const buyQty = type1Offer.buyQuantity || 1;
                const getQty = type1Offer.getQuantity || 1;
                const cycleSize = buyQty + getQty;

                // Backend logic: only if quantity >= cycleSize
                if (quantity >= cycleSize) {
                    const freeGroups = Math.floor(quantity / cycleSize);
                    const freeQty = freeGroups * getQty;
                    const payableQty = quantity - freeQty;
                    lineTotal = unitPrice * payableQty;
                    savings = (originalPrice * quantity) - lineTotal;
                    appliedOffer = type1Offer;
                }
            }
        }

        return {
            ...item,
            originalPrice,
            unitPrice: Math.round(unitPrice * 100) / 100,
            lineTotal: Math.round(lineTotal * 100) / 100,
            savings: Math.round(savings * 100) / 100,
            appliedOffer,
            quantity,
            isFreeItem: false,
        };
    });

    // Step 3: Apply Type 4 (Buy X get Y free) - discount free items if already in cart
    const type4Offers = activeOffers.filter(o => o.offerTypeId === 4 && o.freeProductId);
    
    // Track which items are free products
    type4Offers.forEach(offer => {
        if (!offer.productId || !offer.freeProductId) return;
        
        const triggerItem = processedItems.find(
            item => String(item.id) === String(offer.productId)
        );
        
        if (!triggerItem) return;

        const buyQty = offer.buyQuantity || 1;
        const getQty = offer.getQuantity || 1;
        const eligibleFreeQty = Math.floor(triggerItem.quantity / buyQty) * getQty;

        // Find free product in cart
        const freeItem = processedItems.find(
            item => String(item.id) === String(offer.freeProductId)
        );

        if (freeItem && eligibleFreeQty > 0) {
            const discountedQty = Math.min(freeItem.quantity, eligibleFreeQty);
            const freeDiscount = freeItem.unitPrice * discountedQty;
            
            freeItem.lineTotal = Math.max(0, freeItem.lineTotal - freeDiscount);
            freeItem.savings += freeDiscount;
            freeItem.appliedOffer = offer;
            if (freeItem.lineTotal === 0) {
                freeItem.isFreeItem = true;
            }
        }
    });

    // Step 4: Calculate subtotal after all line discounts
    const subtotal = processedItems.reduce((sum, item) => sum + item.lineTotal, 0);

    // Step 5: Apply Type 3 (Cart-level discount) if minOrderAmount met
    let cartDiscount = 0;
    let appliedCartOffer: Offer | undefined;

    // Check Type 3 offers (cart-level)
    const type3Offers = activeOffers.filter(o => o.offerTypeId === 3);
    for (const offer of type3Offers) {
        const minAmount = offer.minOrderAmount ? Number(offer.minOrderAmount) : 0;
        
        // Backend checks subtotal AFTER line discounts
        if (subtotal >= minAmount) {
            if (offer.discountPercentage) {
                const discountPercent = Number(offer.discountPercentage);
                cartDiscount = subtotal * (discountPercent / 100);
                appliedCartOffer = offer;
                break; // Backend uses first matching offer
            } else if (offer.discountAmount) {
                cartDiscount = Number(offer.discountAmount);
                appliedCartOffer = offer;
                break;
            }
        }
    }

    // Step 6: Handle coupon code (if provided)
    if (appliedCouponCode) {
        const coupon = activeOffers.find(
            o => (o.couponCode?.toUpperCase() === appliedCouponCode.toUpperCase() ||
                  o.name?.toUpperCase() === appliedCouponCode.toUpperCase()) &&
                 (o.offerTypeId === 3 || o.couponCode)
        );

        if (coupon) {
            const minAmount = coupon.minOrderAmount ? Number(coupon.minOrderAmount) : 0;
            if (subtotal >= minAmount) {
                if (coupon.discountPercentage) {
                    cartDiscount = subtotal * (Number(coupon.discountPercentage) / 100);
                } else if (coupon.discountAmount) {
                    cartDiscount = Number(coupon.discountAmount);
                }
                appliedCartOffer = coupon;
            }
        }
    }

    // Step 7: Find Type 4 offers where free product is NOT in cart (suggestions)
    const suggestedFreeProducts: {
        productId: number;
        productName: string;
        quantity: number;
        offerId: number;
    }[] = [];

    type4Offers.forEach(offer => {
        if (!offer.productId || !offer.freeProductId) return;
        
        const triggerItem = processedItems.find(
            item => String(item.id) === String(offer.productId)
        );
        
        if (!triggerItem) return;

        const freeItemInCart = processedItems.find(
            item => String(item.id) === String(offer.freeProductId)
        );

        // If free product NOT in cart, suggest it
        if (!freeItemInCart && offer.freeProduct) {
            const buyQty = offer.buyQuantity || 1;
            const getQty = offer.getQuantity || 1;
            const eligibleFreeQty = Math.floor(triggerItem.quantity / buyQty) * getQty;
            
            if (eligibleFreeQty > 0) {
                suggestedFreeProducts.push({
                    productId: offer.freeProductId,
                    productName: offer.freeProduct.productName || 'Free Product',
                    quantity: eligibleFreeQty,
                    offerId: offer.id,
                });
            }
        }
    });

    const total = Math.max(0, subtotal + shippingCost - cartDiscount);

    return {
        subtotal: Math.round(subtotal * 100) / 100,
        shipping: shippingCost,
        discountTotal: Math.round(cartDiscount * 100) / 100,
        total: Math.round(total * 100) / 100,
        itemsWithDiscount: processedItems.map(item => ({
            id: String(item.id),
            name: item.name || '',
            image: item.image || '/placeholder.png',
            quantity: item.quantity,
            originalPrice: item.originalPrice,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
            savings: item.savings,
            appliedOffer: item.appliedOffer,
            isFreeItem: item.isFreeItem,
        })),
        suggestedFreeProducts: suggestedFreeProducts.length > 0 ? suggestedFreeProducts : undefined,
    };
}
