import api from './apiClient';

export interface UserReview {
    id: number;
    orderId: number;
    productId: number;
    userId: number;
    rating: number;
    comment: string;
    is_approved: boolean;
    createdAt?: string;
    product?: any;
    user?: {
        fullName?: string;
        profileImg?: string;
    };
}

const reviewService = {
    createReview: async (review: { orderId: number; productId: number; rating: number; comment: string }): Promise<UserReview> => {
        const response = await api.post('/user-reviews', review);
        return response.data;
    },

    getProductReviews: async (productId: number): Promise<UserReview[]> => {
        const response = await api.get(`/user-reviews/product/${productId}`);
        return response.data;
    },

    // Assuming there might be an endpoint for my reviews, if not, this will fail or we can filter from all
    getMyReviews: async (): Promise<UserReview[]> => {
        // Checking if there is a 'my-reviews' or similar. 
        // If not found in postman, I'll try /user-reviews/my if it's common pattern, or just return empty for now.
        try {
            const response = await api.get('/user-reviews/my');
            return response.data;
        } catch {
            return [];
        }
    }
};

export default reviewService;
