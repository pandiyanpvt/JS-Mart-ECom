import api from './apiClient';

export interface OrderItem {
    productId: number;
    quantity: number;
}

export interface AddressData {
    fullName: string;
    streetAddress: string;
    province: string;
    district: string;
    postalCode: string;
    phoneNumber: string;
    isDefault?: boolean;
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

    // Shipping Addresses
    async createShippingAddress(data: AddressData) {
        const response = await api.post('/shipping-addresses', data);
        return response.data;
    },

    async getShippingAddresses() {
        const response = await api.get('/shipping-addresses');
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
