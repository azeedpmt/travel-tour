// import api from './api';
// import type{ Booking, GuestDetails } from '../types';

// export interface CreateBookingData {
//   dealId?: string;
//   hotelId: string;
//   foodItems?: { itemId: string; quantity: number }[];
//   guestDetails: GuestDetails;
//   checkInDate: string;
//   checkOutDate: string;
//   numberOfGuests: number;
//   numberOfRooms: number;
//   totalAmount: number;
//   specialRequests?: string;
// }

// export const bookingService = {
//   async createBooking(data: CreateBookingData): Promise<{ success: boolean; data: Booking }> {
//     const response = await api.post('/bookings', data);
//     return response.data;
//   },

//   async getUserBookings(): Promise<{ success: boolean; data: Booking[] }> {
//     const response = await api.get('/bookings/user');
//     return response.data;
//   },

//   async getBookingById(id: string): Promise<{ success: boolean; data: Booking }> {
//     const response = await api.get(`/bookings/${id}`);
//     return response.data;
//   },

//   async cancelBooking(id: string, cancellationReason?: string): Promise<{ success: boolean; data: Booking }> {
//     const response = await api.put(`/bookings/${id}/cancel`, { cancellationReason });
//     return response.data;
//   },

//   async updatePaymentStatus(id: string, paymentStatus: string, paymentId: string): Promise<{ success: boolean; data: Booking }> {
//     const response = await api.put(`/bookings/${id}/payment`, { paymentStatus, paymentId });
//     return response.data;
//   },

//   async checkAvailability(hotelId: string, checkInDate: string, checkOutDate: string, numberOfRooms: number): Promise<{ success: boolean; data: any }> {
//     const response = await api.get('/bookings/availability', {
//       params: { hotelId, checkInDate, checkOutDate, numberOfRooms }
//     });
//     return response.data;
//   },
// };
import api from './api';

export const bookingService = {
    async createBooking(data: any) {
        const response = await api.post('/bookings', data);
        return response.data;
    },

    async getUserBookings() {
        const response = await api.get('/bookings/user');
        return response.data;
    },

    async getBookingById(id: string) {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },

    async cancelBooking(id: string, reason?: string) {
        const response = await api.put(`/bookings/${id}/cancel`, { cancellationReason: reason });
        return response.data;
    },

    async updatePaymentStatus(id: string, paymentStatus: string, paymentId: string) {
        const response = await api.put(`/bookings/${id}/payment`, { paymentStatus, paymentId });
        return response.data;
    },

    async checkAvailability(hotelId: string, checkInDate: string, checkOutDate: string, numberOfRooms: number) {
        const response = await api.get('/bookings/availability', {
            params: { hotelId, checkInDate, checkOutDate, numberOfRooms }
        });
        return response.data;
    },
};