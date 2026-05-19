import axios from 'axios';
// import api from './api';

// ✅ FIXED: Use gateway URL directly (safe + stable)
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:9000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // ✅ IMPORTANT
});

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

// Direct auth service instance - bypasses gateway timeout issues
const authApi = axios.create({
    baseURL: 'http://localhost:8001/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
});

// ✅ Add token to every request (MAIN FIX)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Add token to direct auth calls
authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add token to every request
api.interceptors.request.use((config) => {
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

export default api;



// import axios from 'axios';
// // import api from './api';

// export const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   headers: { 'Content-Type': 'application/json' },
// });

// export interface User {
//     _id: string;
//     name: string;
//     email: string;
//     avatar?: string;
//     role: 'user' | 'admin' | null;
// }

// export interface LoginResponse {
//     message: string;
//     token: string;
//     user: User;
// }

// export interface AddRoleResponse {
//     user: User;
//     token: string;
// }

// // Direct auth service instance - bypasses gateway timeout issues
// const authApi = axios.create({
//     baseURL: 'http://localhost:8001/api',
//     headers: { 'Content-Type': 'application/json' },
//     timeout: 30000,
// });
// // ✅ Add token to every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });



// // Add token to direct auth calls
// authApi.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export const authService = {
//     async googleLogin(code: string): Promise<LoginResponse> {
//         const response = await authApi.post('/auth/login', { code });
//         return response.data;
//     },

//     async addRole(role: string, adminSecret?: string): Promise<AddRoleResponse> {
//         const response = await authApi.put('/auth/add/role', { role, adminSecret });
//         return response.data;
//     },

//     async getMe(): Promise<{ success: boolean; user: User }> {
//         const response = await authApi.get('/auth/me');
//         return response.data;
//     },

//     logout(): void {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//     }
// };

// export default api;



