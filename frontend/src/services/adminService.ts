import api from './api';
import type { Hotel, Deal, FoodItem, Booking } from '../types';

// ❌ REMOVE manual fetch API (not needed)
// const API = 'http://localhost:9000/api/admin';

export const adminService = {

  // ---------- Hotels ----------
  async getAllHotels(params?: { status?: string; isVerified?: boolean }) {
    const { data } = await api.get('/admin/hotels', { params });
    return data;
  },

  async addHotel(hotelData: Partial<Hotel>) {
    const { data } = await api.post('/admin/hotels', hotelData);
    return data;
  },

  async getHotelById(id: string) {
    const { data } = await api.get(`/admin/hotels/${id}`);
    return data;
  },

  async updateHotel(id: string, hotelData: Partial<Hotel>) {
    const { data } = await api.put(`/admin/hotels/${id}`, hotelData);
    return data;
  },

  async deleteHotel(id: string) {
    const { data } = await api.delete(`/admin/hotels/${id}`);
    return data;
  },

  async verifyHotel(id: string, isVerified: boolean, status: string, rejectionReason?: string) {
    const { data } = await api.put(`/admin/hotels/${id}/verify`, {
      isVerified,
      status,
      rejectionReason,
    });
    return data;
  },

  async updateHotelStatus(id: string, status: string) {
    const { data } = await api.patch(`/admin/hotels/${id}/status`, { status });
    return data;
  },

  // ---------- Deals ----------
  async getAllDeals(params?: { status?: string; hotelId?: string }) {
    const { data } = await api.get('/admin/deals', { params });
    return data;
  },

  async addDeal(dealData: Partial<Deal>) {
    const { data } = await api.post('/admin/deals', dealData);
    return data;
  },

  async getDealById(id: string) {
    const { data } = await api.get(`/admin/deals/${id}`);
    return data;
  },

  async updateDeal(id: string, dealData: Partial<Deal>) {
    const { data } = await api.put(`/admin/deals/${id}`, dealData);
    return data;
  },

  async deleteDeal(id: string) {
    const { data } = await api.delete(`/admin/deals/${id}`);
    return data;
  },

  // ---------- Food Items ----------
  async getAllFoodItems(params?: { hotelId?: string; category?: string }) {
    const { data } = await api.get('/admin/food', { params });
    return data;
  },

  async addFoodItem(foodData: Partial<FoodItem>) {
    const { data } = await api.post('/admin/food', foodData);
    return data;
  },

  async getFoodItemById(id: string) {
    const { data } = await api.get(`/admin/food/${id}`);
    return data;
  },

  async updateFoodItem(id: string, foodData: Partial<FoodItem>) {
    const { data } = await api.put(`/admin/food/${id}`, foodData);
    return data;
  },

  async deleteFoodItem(id: string) {
    const { data } = await api.delete(`/admin/food/${id}`);
    return data;
  },

  // ---------- Bookings ----------
  async getAllBookings(params?: { status?: string; page?: number; limit?: number }) {
    const { data } = await api.get('/bookings/admin/all', { params });
    return data;
  },
//  // ---------- OfferType----------
//   async createOfferType(data: any) {
//   const { data: res } = await api.post('/admin/offer-types', data);
//   return res;
//  },
// async updateOfferType(id: string, data: any) {
//   const { data: res } = await api.put(`/admin/offer-types/${id}`, data);
//   return res;
// },
// async deleteOfferType(id: string) {
//   const { data: res } = await api.delete(`/admin/offer-types/${id}`);
//   return res;
// },
// // ---------- hohidaystype----------
// // Holiday Styles
// async getAllHolidayStyles() {
//   const { data } = await api.get('/admin/holiday-styles');
//   return data;
// },
// async createHolidayStyle(formData: FormData) {
//   const { data } = await api.post('/admin/holiday-styles', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   });
//   return data;
// },
// async updateHolidayStyle(id: string, formData: FormData) {
//   const { data } = await api.put(`/admin/holiday-styles/${id}`, formData);
//   return data;
// },
// async deleteHolidayStyle(id: string) {
//   const { data } = await api.delete(`/admin/holiday-styles/${id}`);
//   return data;
// },
// Offer Types
async getAllOfferTypes() {
  const { data } = await api.get('/admin/offer-types');
  return data;
},
async createOfferType(data: any) {
  const { data: res } = await api.post('/admin/offer-types', data);
  return res;
},
async updateOfferType(id: string, data: any) {
  const { data: res } = await api.put(`/admin/offer-types/${id}`, data);
  return res;
},
async deleteOfferType(id: string) {
  const { data: res } = await api.delete(`/admin/offer-types/${id}`);
  return res;
},

// Holiday Styles
async getAllHolidayStyles() {
  const { data } = await api.get('/admin/holiday-styles');
  return data;
},
async createHolidayStyle(data: any) {
  const { data: res } = await api.post('/admin/holiday-styles', data);
  return res;
},
async updateHolidayStyle(id: string, data: any) {
  const { data: res } = await api.put(`/admin/holiday-styles/${id}`, data);
  return res;
},
async deleteHolidayStyle(id: string) {
  const { data: res } = await api.delete(`/admin/holiday-styles/${id}`);
  return res;
},
};
