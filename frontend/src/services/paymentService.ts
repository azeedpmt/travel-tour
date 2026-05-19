import api from './api';

export const paymentService = {
    async initiatePayment(bookingId: string, amount: number, provider: 'razorpay' | 'stripe' = 'razorpay'): Promise<{ success: boolean; data: any }> {
        const response = await api.post('/payments/initiate', { bookingId, amount, provider });
        return response.data;
    },

    async createRazorpayOrder(amount: number, bookingId: string): Promise<{ success: boolean; data: any }> {
        const response = await api.post('/payments/razorpay/create-order', { amount, bookingId });
        return response.data;
    },

    async verifyRazorpayPayment(data: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
        bookingId: string;
    }): Promise<{ success: boolean; message: string }> {
        const response = await api.post('/payments/razorpay/verify', data);
        return response.data;
    },

    async createStripeIntent(amount: number, bookingId: string, currency?: string): Promise<{ success: boolean; data: any }> {
        const response = await api.post('/payments/stripe/create-intent', { amount, bookingId, currency });
        return response.data;
    },

    async confirmStripePayment(paymentIntentId: string, bookingId: string): Promise<{ success: boolean; message: string }> {
        const response = await api.post('/payments/stripe/confirm', { paymentIntentId, bookingId });
        return response.data;
    },
};