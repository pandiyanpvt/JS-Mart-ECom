import api from './apiClient';

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
}

const userService = {
    // Get current user profile
    getProfile: async (): Promise<User> => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    // Update user profile
    updateProfile: async (data: UpdateProfileData): Promise<User> => {
        const response = await api.put('/users/profile', data);
        return response.data;
    },

    // Get user by ID
    getById: async (id: number): Promise<User> => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    // Upload profile image
    uploadProfileImage: async (file: File): Promise<{ imageUrl: string }> => {
        const formData = new FormData();
        formData.append('profileImg', file);

        const response = await api.post('/users/profile/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

export default userService;
