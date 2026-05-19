import api from './api';

export const destinationService = {
  async getAllDestinations() {
    const response = await api.get('/admin/destinations');
    return response.data;
  },
  // NEW: Public endpoint for all authenticated users
  async getPublicDestinations() {
    const response = await api.get('/admin/public/destinations');
    return response.data;
  },
  async getDestinationBySlug(slug: string) {
    const response = await api.get(`/admin/destinations/slug/${slug}`);
    return response.data;
  },
  async createDestination(data: any) {
    const response = await api.post('/admin/destinations', data);
    return response.data;
  },
  async updateDestination(id: string, data: any) {
    const response = await api.put(`/admin/destinations/${id}`, data);
    return response.data;
  },
  async deleteDestination(id: string) {
    const response = await api.delete(`/admin/destinations/${id}`);
    return response.data;
  }
};