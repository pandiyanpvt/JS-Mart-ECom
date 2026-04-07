import api from './apiClient';
import { EMPTY_IMAGE_SRC, resolveImageSrc } from '@/lib/images';

export interface Product {
    id: number;
    productName: string;
    productCategoryId: number;
    brandId: number;
    description?: string;
    quantity: number;
    price: number;
    isActive: boolean;
    isFeatured: boolean;
    isReturnable: boolean | number;
    createdAt?: string;
    updatedAt?: string;
    /** Backend returns alias "images" */
    images?: ProductImage[];
    product_images?: ProductImage[];
    product_category?: ProductCategory;
    brand?: Brand;
}

export interface ProductImage {
    id: number;
    productId: number;
    /** Backend uses productImg; we support both */
    productImg?: string;
    imageUrl?: string;
    isPrimary: boolean;
    createdAt?: string;
    updatedAt?: string;
}

/** Get image URL from backend (productImg) or frontend (imageUrl); missing → empty placeholder */
export function getProductImageUrl(img: ProductImage | null | undefined): string {
    if (!img) return EMPTY_IMAGE_SRC;
    return resolveImageSrc(img.productImg ?? img.imageUrl);
}

/** Get images array (backend uses "images" alias) */
export function getProductImages(product: Product): ProductImage[] {
    return product?.images ?? product?.product_images ?? [];
}

export interface ProductCategory {
    id: number;
    category: string;
    categoryImg?: string;
    bannerImg?: string;
    level: number;
    parentId?: number;
    isActive: boolean;
    subCategories?: ProductCategory[];
}

export interface Brand {
    id: number;
    brandName?: string;
    brand?: string;
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
        const response = await api.get(`/products/search/query?query=${encodeURIComponent(query)}`);
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
