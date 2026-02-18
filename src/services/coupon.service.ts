import api from './apiClient';

export interface Coupon {
    id: number;
    code?: string; // Backend field
    couponCode?: string; // Frontend used field
    discountType?: "PERCENTAGE" | "FIXED";
    discountValue?: number | string;
    discountPercentage?: number | string;
    discountAmount?: number | string;
    minOrderAmount?: number | string;
    startDate?: string;
    endDate?: string;
    expiryDate?: string; // Backend field
    isActive: boolean;
    description?: string;
    maxUsage?: number;
    currentUsage?: number;
}

export const couponService = {
    getAllCoupons: async (): Promise<Coupon[]> => {
        const response = await api.get('/coupons');
        return response.data;
    },

    getCouponByCode: async (code: string): Promise<Coupon> => {
        const response = await api.get(`/coupons/code/${code}`);
        return response.data;
    },

    validateCoupon: async (code: string): Promise<Coupon> => {
        const response = await api.get(`/coupons/validate/${code}`);
        return response.data;
    }
};

export default couponService;
