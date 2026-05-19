// import axios from 'axios';

// const API_URL = 'http://localhost:9000/api';

// export const dealService = {
//   async getAllDeals(params?: any) {
//     const response = await axios.get(`${API_URL}/deals`, { params });
//     return response.data;
//   },
//   async getFeaturedDeals() {
//     const response = await axios.get(`${API_URL}/deals/featured`);
//     return response.data;
//   },
//   async getDealById(id: string) {
//     const response = await axios.get(`${API_URL}/deals/${id}`);
//     return response.data;
//   },
//   async searchDeals(query: string) {
//     const response = await axios.get(`${API_URL}/deals/search`, { params: { q: query } });
//     return response.data;
//   },
// };

import api from './api';

export const dealService = {
    async getAllDeals(params?: any) {
        const response = await api.get('/deals', { params },   
        );
        return response.data;
    },

    async getFeaturedDeals() {
        const response = await api.get('/deals/featured');
        return response.data;
    },

    async getDealById(id: string) {
        const response = await api.get(`/deals/${id}`);
        return response.data;
    },

    async searchDeals(query: string) {
        const response = await api.get('/deals/search', { params: { q: query } });
        return response.data;
    },

    async addReview(dealId: string, rating: number, comment: string) {
        const response = await api.post(`/deals/${dealId}/reviews`, { rating, comment });
        return response.data;
    },
};

//const dealsRes = await dealService.getAllDeals({ destinationId: destination._id });