import api from './apiClient';

export interface ShippingAddress {
    id: number;
    userId: number;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    isPrimary: boolean;
}

const shippingAddressService = {
    getMyAddresses: async (): Promise<ShippingAddress[]> => {
        const response = await api.get('/shipping-addresses/my-addresses');
        return response.data;
    },

    saveAddress: async (address: Omit<ShippingAddress, 'id' | 'userId'>): Promise<ShippingAddress> => {
        const response = await api.post('/shipping-addresses', address);
        return response.data;
    },

    updateAddress: async (id: number, address: Partial<ShippingAddress>): Promise<ShippingAddress> => {
        const response = await api.put(`/shipping-addresses/${id}`, address);
        return response.data;
    },

    deleteAddress: async (id: number): Promise<void> => {
        await api.delete(`/shipping-addresses/${id}`);
    }
};

export default shippingAddressService;
