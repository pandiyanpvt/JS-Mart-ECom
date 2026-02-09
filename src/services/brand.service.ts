import apiClient from './apiClient';

export interface Brand {
    id: number;
    brand: string;
    brandImg?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const brandService = {
    // Get all brands
    async getAll(): Promise<Brand[]> {
        const response = await apiClient.get('/brands');
        return response.data;
    },

    // Get active brands only
    async getActive(): Promise<Brand[]> {
        const brands = await this.getAll();
        return brands.filter(brand => brand.isActive);
    },

    // Get brand by ID
    async getById(id: number): Promise<Brand> {
        const response = await apiClient.get(`/brands/${id}`);
        return response.data;
    },

    // Search brands
    async search(query: string): Promise<Brand[]> {
        const response = await apiClient.get(`/brands/search/query?q=${query}`);
        return response.data;
    }
};
