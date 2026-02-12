import api from './apiClient';

export interface OrderItem {
    productId: number;
    quantity: number;
}

/**
 * Frontend form data for checkout address.
 * Mapped to backend ShippingAddress fields in createShippingAddress().
 * Backend model (ShippingAddress.js) has no fullName/phoneNumber — only address fields.
 */
export interface AddressData {
    fullName: string;
    streetAddress: string;
    province: string;
    district: string;
    postalCode: string;
    phoneNumber: string;
    isDefault?: boolean;
}

/**
 * Matches JS-Mart-Backend src/models/ShippingAddress.js exactly.
 * Fields: id, userId, addressLine1, addressLine2, city, state, postalCode, country, isPrimary, isActive.
 */
export interface ShippingAddressBackend {
    id: number;
    userId?: number;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country?: string;
    isPrimary: boolean;
    isActive?: boolean;
}

export interface CreateOrderData {
    details: OrderItem[];
    paymentTypeId: number;
    subtotal: number;
    tax: number;
    totalAmount: number;
    shippingAddressId?: number;
    shippingAddress?: AddressData; // In case backend supports creating inline
    couponCode?: string;
    isPointsRedeemed?: boolean;
}

export const orderService = {
    // Orders
    async getMyOrders(userId: number | string) {
        const response = await api.get(`/orders/user/${userId}`);
        return response.data;
    },

    async getOrderById(id: string | number) {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    async createOrder(data: CreateOrderData) {
        const response = await api.post('/orders', data);
        return response.data;
    },

    /**
     * Create shipping address. Payload matches backend ShippingAddress model only:
     * addressLine1, addressLine2, city, state, postalCode, country, isPrimary.
     */
    async createShippingAddress(data: AddressData) {
        const payload: Omit<ShippingAddressBackend, 'id' | 'userId'> = {
            addressLine1: data.streetAddress,
            addressLine2: '',
            city: data.district,
            state: data.province,
            postalCode: data.postalCode || '',
            country: 'Sri Lanka',
            isPrimary: !!data.isDefault,
        };
        const response = await api.post('/shipping-addresses', payload);
        return response.data;
    },

    /** Create address from backend shape (for account/addresses page) */
    async createShippingAddressFromBackend(data: Omit<ShippingAddressBackend, 'id' | 'userId'>) {
        const response = await api.post('/shipping-addresses', data);
        return response.data;
    },

    async getShippingAddresses(): Promise<ShippingAddressBackend[]> {
        const response = await api.get('/shipping-addresses/my-addresses');
        return response.data;
    },

    async updateShippingAddress(id: number, data: Partial<Omit<ShippingAddressBackend, 'id' | 'userId'>>) {
        const response = await api.put(`/shipping-addresses/${id}`, data);
        return response.data;
    },

    async deleteShippingAddress(id: number) {
        const response = await api.delete(`/shipping-addresses/${id}`);
        return response.data;
    },

    // Lookup Data
    async getPaymentTypes() {
        // Mock or real endpoint
        return [
            { id: 1, type: 'Cash on Delivery' },
            { id: 2, type: 'Bank Transfer' }
        ];
        // If backend has endpoint: return (await api.get('/payment-types')).data;
    }
};

export default orderService;
