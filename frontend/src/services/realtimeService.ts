import api from './api';

export const realtimeService = {
  async getBookingStats() {
    const response = await api.get('/realtime/booking-stats');
    return response.data;
  }
};