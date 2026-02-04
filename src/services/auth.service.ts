import Cookies from 'js-cookie';
import api from './apiClient';

export const authService = {
    async register(data: any) {
        const response = await api.post('/users/register', data);
        return response.data;
    },

    async login(data: any) {
        const response = await api.post('/users/login', data);
        if (response.data.token) {
            Cookies.set('token', response.data.token, { expires: 1 }); // Expires in 1 day
            Cookies.set('user', JSON.stringify(response.data.user), { expires: 1 });
        }
        return response.data;
    },

    async verifyOtp(data: { emailAddress: string; otp: string }) {
        const response = await api.post('/users/verify-email-otp', data);
        return response.data;
    },

    async resendOtp(emailAddress: string) {
        // Placeholder or future implementation
        return Promise.resolve();
    },

    logout() {
        Cookies.remove('token');
        Cookies.remove('user');
        window.location.href = '/signin';
    },

    getCurrentUser() {
        const userStr = Cookies.get('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated() {
        return !!Cookies.get('token');
    }
};
