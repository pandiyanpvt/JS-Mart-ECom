import apiClient from './apiClient';

export interface MembershipPlan {
    id: number;
    name: string;
    priceMonth: number;
    description: string;
    features: string;
    level: number;
    isActive: boolean;
}

export interface UserSubscription {
    id: number;
    userId: number;
    planId: number;
    startDate: string;
    endDate: string;
    status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
    paymentId: string;
    autoRenew: boolean;
    stripeSubscriptionId?: string;
    plan?: MembershipPlan;
}

export const membershipService = {
    getPlans: async (): Promise<MembershipPlan[]> => {
        const response = await apiClient.get('/membership/plans');
        return response.data;
    },

    getMySubscription: async (): Promise<UserSubscription | null> => {
        try {
            const response = await apiClient.get('/membership/me');
            return response.data;
        } catch (error) {
            return null;
        }
    },

    subscribe: async (planId: number): Promise<any> => {
        const response = await apiClient.post('/membership/subscribe', { planId });
        return response.data;
    },

    toggleAutoRenew: async (autoRenew: boolean): Promise<any> => {
        const response = await apiClient.post('/membership/toggle-autorenew', { autoRenew });
        return response.data;
    },

    verifySession: async (sessionId: string): Promise<any> => {
        const response = await apiClient.get(`/payment/verify-session?session_id=${sessionId}`);
        return response.data;
    }
};
