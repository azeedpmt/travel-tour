import api from './api';

export const hotelService = {
    async getAllHotels(params?: any) {
        const response = await api.get('/hotels', { params });
        return response.data;
    },

    async getHotelById(id: string) {
        const response = await api.get(`/hotels/${id}`);
        return response.data;
    },

    async searchHotels(query: string) {
        const response = await api.get('/hotels/search', { params: { q: query } });
        return response.data;
    },
 
};



// import api from './api';
// import type { Hotel } from '../types';

// export const hotelService = {
//   async getAllHotels(params?: {
//     city?: string;
//     state?: string;
//     minRating?: number;
//     sort?: 'rating' | 'newest';
//   }): Promise<{ success: boolean; data: Hotel[] }> {
//     const response = await api.get('/hotels', { params });
//     return response.data;
//   },

//   async getHotelById(id: string): Promise<{ success: boolean; data: Hotel }> {
//     const response = await api.get(`/hotels/${id}`);
//     return response.data;
//   },

//   async searchHotels(query: string): Promise<{ success: boolean; data: Hotel[] }> {
//     const response = await api.get('/hotels/search', { params: { q: query } });
//     return response.data;
//   },

//   async getAvailableRooms(hotelId: string): Promise<{ success: boolean; data: Hotel['roomTypes'] }> {
//     const response = await api.get(`/hotels/${hotelId}/rooms`);
//     return response.data;
//   },

//   async getHotelsByOwner(): Promise<{ success: boolean; data: Hotel[] }> {
//     const response = await api.get('/hotels/owner');
//     return response.data;
//   },
// };