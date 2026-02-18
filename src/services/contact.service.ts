import api from './apiClient';

export interface SendContactPayload {
  fullName: string;
  emailAddress: string;
  subject: string;
  message: string;
}

export interface SendContactResponse {
  message: string;
  contactMessage: { id: number; fullName: string; emailAddress: string; subject: string; message: string };
}

export const contactService = {
  sendMessage: async (payload: SendContactPayload): Promise<SendContactResponse> => {
    const { data } = await api.post<SendContactResponse>('/contact/send', payload);
    return data;
  },
};
