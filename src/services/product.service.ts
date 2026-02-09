import api from './apiClient';

export interface Product {
    id: number;
    productName: string;
    productCategoryId: number;
    brandId: number;
    description?: string;
    quantity: number;
    weight?: number;
    price: number;
    isActive: boolean;
    isFeatured: boolean;
    createdAt?: string;
    updatedAt?: string;
    product_images?: ProductImage[];
    product_category?: ProductCategory;
    brand?: Brand;
}

export interface ProductImage {
    id: number;
    productId: number;
    imageUrl: string;
    isPrimary: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductCategory {
    id: number;
    category: string;
    categoryImg?: string;
    isWeightBased: boolean;
    isActive: boolean;
}

export interface Brand {
    id: number;
    brandName: string;
    brandImg?: string;
    isActive: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

const productService = {
    // Get all products
    getAll: async (): Promise<Product[]> => {
        const response = await api.get('/products');
        return response.data;
    },

    // Get paginated products
    getAllPaginated: async (page: number = 1, limit: number = 12): Promise<PaginatedResponse<Product>> => {
        const response = await api.get(`/products/paginated?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Get product by ID
    getById: async (id: number): Promise<Product> => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    // Search products
    search: async (query: string): Promise<Product[]> => {
        const response = await api.get(`/products/search/query?q=${query}`);
        return response.data;
    },

    // Get products by brand
    getByBrand: async (brandId: number): Promise<Product[]> => {
        const response = await api.get(`/products/brand/${brandId}`);
        return response.data;
    },

    // Get products by category
    getByCategory: async (categoryId: number): Promise<Product[]> => {
        const response = await api.get(`/products/category/${categoryId}`);
        return response.data;
    },

    // Get products by price range
    getByPriceRange: async (minPrice: number, maxPrice: number): Promise<Product[]> => {
        const response = await api.get(`/products/price/range?min=${minPrice}&max=${maxPrice}`);
        return response.data;
    },

    // Get featured products
    getFeatured: async (): Promise<Product[]> => {
        const products = await productService.getAll();
        return products.filter(p => p.isFeatured && p.isActive);
    },
};

export default productService;
