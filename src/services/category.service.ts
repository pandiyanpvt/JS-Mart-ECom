import api from './apiClient';

export interface Category {
    id: number;
    category: string;
    categoryImg?: string;
    bannerImg?: string;
    level: number;
    parentId?: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    subCategories?: Category[];
}

const categoryService = {
    // Get all categories
    getAll: async (): Promise<Category[]> => {
        const response = await api.get('/product-categories');
        return response.data;
    },

    // Get active categories only
    getActive: async (): Promise<Category[]> => {
        const categories = await categoryService.getAll();
        return categories.filter(c => c.isActive);
    },

    // Get category by ID
    getById: async (id: number): Promise<Category> => {
        const response = await api.get(`/product-categories/${id}`);
        return response.data;
    },

    // Search categories
    search: async (query: string): Promise<Category[]> => {
        const response = await api.get(`/product-categories/search/query?query=${encodeURIComponent(query)}`);
        return response.data;
    },
};

export default categoryService;
