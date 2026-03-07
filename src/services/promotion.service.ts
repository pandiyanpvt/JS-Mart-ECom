import api from './apiClient';

export interface Promotion {
    id: number;
    level: number;
    order: number;
    promotionImg: string;
    isActive: boolean;
    redirectLink?: string;
}

const promotionService = {
    getAll: async () => {
        const response = await api.get<Promotion[]>('/promotions');
        return response.data;
    },
    getByLevel: async (level: number) => {
        const response = await api.get<Promotion[]>(`/promotions/level/${level}`);
        return response.data;
    },
};

export default promotionService;
