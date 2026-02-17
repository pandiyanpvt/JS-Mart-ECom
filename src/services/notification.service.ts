import api from './apiClient';

export interface Notification {
    id: number;
    userId: number | null;
    targetRole: string | null;
    title: string;
    message: string | null;
    type: string | null;
    entityType: string | null;
    entityId: number | null;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationsResponse {
    items: Notification[];
    total: number;
    page: number;
    limit: number;
}

const notificationService = {
    getMyNotifications: async (page = 1, limit = 15): Promise<NotificationsResponse> => {
        const response = await api.get('/notifications/me', {
            params: { page, limit }
        });
        return response.data;
    },

    markAsRead: async (id: number): Promise<Notification> => {
        const response = await api.patch(`/notifications/${id}/read`);
        return response.data;
    },

    markAllAsRead: async (): Promise<{ message: string }> => {
        const response = await api.patch('/notifications/read-all');
        return response.data;
    }
};

export default notificationService;
