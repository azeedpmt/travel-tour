// import api from './api';
// import type { FoodItem } from '../types';

// export const foodService = {
//   async getAllFoodItems(params?: {
//     hotelId?: string;
//     category?: string;
//     cuisine?: string;
//     vegetarian?: boolean;
//     vegan?: boolean;
//   }): Promise<{ success: boolean; data: FoodItem[] }> {
//     const response = await api.get('/food', { params });
//     return response.data;
//   },

//   async getFoodItemById(id: string): Promise<{ success: boolean; data: FoodItem }> {
//     const response = await api.get(`/food/${id}`);
//     return response.data;
//   },

//   async getMenuByHotel(hotelId: string): Promise<{ success: boolean; data: Record<string, FoodItem[]> }> {
//     const response = await api.get(`/food/hotel/${hotelId}/menu`);
//     return response.data;
//   },

//   async searchFoodItems(query: string): Promise<{ success: boolean; data: FoodItem[] }> {
//     const response = await api.get('/food/search', { params: { q: query } });
//     return response.data;
//   },

//   async getPopularFoodItems(limit?: number): Promise<{ success: boolean; data: FoodItem[] }> {
//     const response = await api.get('/food/popular', { params: { limit } });
//     return response.data;
//   },
// };

import api from './api';

export const foodService = {
    async getAllFoodItems(params?: any) {
        const response = await api.get('/food', { params });
        return response.data;
    },

    async getFoodItemById(id: string) {
        const response = await api.get(`/food/${id}`);
        return response.data;
    },

    async getMenuByHotel(hotelId: string) {
        const response = await api.get(`/food/hotel/${hotelId}/menu`);
        return response.data;
    },

    async searchFoodItems(query: string) {
        const response = await api.get('/food/search', { params: { q: query } });
        return response.data;
    },

    async getPopularFoodItems(limit?: number) {
        const response = await api.get('/food/popular', { params: { limit } });
        return response.data;
    },
};