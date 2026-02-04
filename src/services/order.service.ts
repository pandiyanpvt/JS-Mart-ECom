import api from './apiClient';

export const orderService = {
    async getMyOrders(userId: string | number) {
        const response = await api.get(`/orders/user/${userId}`);
        return response.data;
    },

    async getOrderById(id: string | number) {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    }
};
