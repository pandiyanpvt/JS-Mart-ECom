import api from './apiClient';

export interface ShopDetails {
    name: string;
    email: string;
    phone: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    logoUrl?: string;
}

export interface StoreSetting {
    configKey: string;
    configValue: string;
    description?: string;
}

export interface SettingsResponse {
    shopDetails: ShopDetails;
    storeSettings: StoreSetting[];
}

export const settingsService = {
    getSettings: async (): Promise<SettingsResponse> => {
        const response = await api.get('/settings');
        return response.data;
    }
};
