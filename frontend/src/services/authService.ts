import axios from 'axios';

export interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'user' | 'admin' | null;
}

export interface LoginResponse {
    message: string;
    token: string;
    user: User;
}

export interface AddRoleResponse {
    user: User;
    token: string;
}

// Calls auth-service DIRECTLY - bypasses gateway
const authApi = axios.create({
    baseURL: 'http://localhost:8001/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
});

// Attach token automatically
authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    async googleLogin(code: string): Promise<LoginResponse> {
        const response = await authApi.post('/auth/login', { code });
        return response.data;
    },

    async addRole(role: string, adminSecret?: string): Promise<AddRoleResponse> {
        const response = await authApi.put('/auth/add/role', { role, adminSecret });
        return response.data;
    },

    async getMe(): Promise<{ success: boolean; user: User }> {
        const response = await authApi.get('/auth/me');
        return response.data;
    },

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};


