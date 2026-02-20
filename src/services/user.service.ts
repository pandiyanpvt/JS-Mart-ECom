import Cookies from 'js-cookie';
import api from './apiClient';

function getCurrentUserId(): number | null {
    const userStr = Cookies.get('user');
    if (!userStr) return null;
    try {
        const user = JSON.parse(userStr);
        return user?.id ?? null;
    } catch {
        return null;
    }
}

export interface User {
    id: number;
    fullName?: string;
    emailAddress: string;
    phoneNumber?: string;
    userRoleId: number;
    profileImg?: string;
    isVerified: boolean;
    verifiedAt?: string;
    isActive: boolean;
    dateOfBirth?: string;
    gender?: string;
    occupation?: string;
    preferredLanguage?: string;
    maritalStatus?: string;
    secondaryPhone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    interests?: string;
    referralSource?: string;
    createdAt?: string;
    updatedAt?: string;
    user_role?: UserRole;
}

export interface UserRole {
    id: number;
    role: string;
    description?: string;
}

export interface UpdateProfileData {
    fullName?: string;
    phoneNumber?: string;
    profileImg?: string;
    dateOfBirth?: string;
    gender?: string;
    occupation?: string;
    preferredLanguage?: string;
    maritalStatus?: string;
    secondaryPhone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    interests?: string;
    referralSource?: string;
}

const userService = {
    // Get current user profile (uses GET /api/users/:id with id from cookie)
    getProfile: async (): Promise<User | null> => {
        const id = getCurrentUserId();
        if (!id) return null;
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    // Update user profile (uses PUT /api/users/:id). Backend returns { message }; refetch getProfile() for fresh data.
    updateProfile: async (data: UpdateProfileData): Promise<void> => {
        const id = getCurrentUserId();
        if (!id) throw new Error('Not authenticated');
        await api.put(`/users/${id}`, data);
    },

    // Get user by ID
    getById: async (id: number): Promise<User> => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    // Upload profile image (uses POST /api/users/:id/profile-image, field name "image")
    uploadProfileImage: async (file: File): Promise<User> => {
        const id = getCurrentUserId();
        if (!id) throw new Error('Not authenticated');
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post(`/users/${id}/profile-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get user points
    getPoints: async (): Promise<any> => {
        const id = getCurrentUserId();
        if (!id) return null;
        const response = await api.get(`/user-points/user/${id}`);
        return response.data;
    },
};

export default userService;
