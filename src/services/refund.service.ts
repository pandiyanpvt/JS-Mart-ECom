import api from "./apiClient";

export type RefundMethod = "BANK" | "POINTS";

export interface RefundRequestPayload {
    orderId: number;
    productId: number;
    quantity: number;
    reason: string;
    refundMethod: RefundMethod;
}

export interface Refund {
    id: number;
    orderId: number;
    productId: number | null;
    userId: number;
    quantity: number;
    refundAmount: number;
    reason: string;
    refundMethod: RefundMethod;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const refundService = {
    async requestRefund(payload: RefundRequestPayload | FormData): Promise<Refund> {
        const isFormData = payload instanceof FormData;
        const response = await api.post("/refunds/request", payload, {
            headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
        });
        return response.data.refund || response.data;
    },

    async getMyRefunds(): Promise<Refund[]> {
        const response = await api.get("/refunds/my-refunds");
        return response.data;
    },
};

export default refundService;

