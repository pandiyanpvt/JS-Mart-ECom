import api from './apiClient';

export const offerService = {
    // Get all offers
    async getAllOffers() {
        const response = await api.get('/offers'); // match your backend route
        return response.data;
    },

    // Get one offer by ID
    async getOfferById(id) {
        const response = await api.get(`/offers/${id}`);
        return response.data;
    },

    // Get offers by offer type ID
    async getOffersByType(typeId) {
        const response = await api.get(`/offers/offer-type/${typeId}`);
        return response.data;
    },

    // Get offers by product ID
    async getOffersByProduct(productId) {
        const response = await api.get(`/offers/product/${productId}`);
        return response.data;
    }
};
