// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { authService } from '../services/authService';
// import type { User } from '../types';

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string, role?: string) => Promise<void>;
//   logout: () => void;
//   isAuthenticated: boolean;
//   isAdmin: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     const token = localStorage.getItem('token');
//     const savedUser = localStorage.getItem('user');
    
//     if (token && savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//         // Verify token
//         await authService.verifyToken();
//       } catch (error) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//       }
//     }
//     setIsLoading(false);
//   };

//   const login = async (email: string, password: string) => {
//     const response = await authService.login({ email, password });
//     localStorage.setItem('token', response.token);
//     localStorage.setItem('user', JSON.stringify(response.user));
//     setUser(response.user);
//   };

//   const register = async (name: string, email: string, password: string, role: string = 'user') => {
//     const response = await authService.register({ name, email, password, role });
//     localStorage.setItem('token', response.token);
//     localStorage.setItem('user', JSON.stringify(response.user));
//     setUser(response.user);
//   };

//   const logout = () => {
//     authService.logout();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoading,
//         login,
//         register,
//         logout,
//         isAuthenticated: !!user,
//         isAdmin: user?.role === 'admin',
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // import React, { createContext, useContext, useState, useEffect } from 'react';
// // import { authService } from '../services/authService';
// // import type{ User } from '../types';

// // interface AuthContextType {
// //   user: User | null;
// //   isLoading: boolean;
// //   login: (email: string, password: string) => Promise<void>;
// //   register: (name: string, email: string, password: string) => Promise<void>;
// //   logout: () => void;
// //   isAuthenticated: boolean;
// //   isAdmin: boolean;
// // }

// // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // export const useAuth = () => {
// //   const context = useContext(AuthContext);
// //   if (!context) {
// //     throw new Error('useAuth must be used within AuthProvider');
// //   }
// //   return context;
// // };

// // export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [isLoading, setIsLoading] = useState(true);

// //   useEffect(() => {
// //     checkAuth();
// //   }, []);

// //   const checkAuth = async () => {
// //     const token = localStorage.getItem('token');
// //     if (token) {
// //       try {
// //         const response = await authService.getMe();
// //         if (response.success) {
// //           setUser(response.user);
// //         } else {
// //           localStorage.removeItem('token');
// //         }
// //       } catch (error) {
// //         localStorage.removeItem('token');
// //       }
// //     }
// //     setIsLoading(false);
// //   };

// //   const login = async (email: string, password: string) => {
// //     const response = await authService.login({ email, password });
// //     localStorage.setItem('token', response.token);
// //     localStorage.setItem('user', JSON.stringify(response.user));
// //     setUser(response.user);
// //   };

// //   const register = async (name: string, email: string, password: string) => {
// //     const response = await authService.register({ name, email, password });
// //     localStorage.setItem('token', response.token);
// //     localStorage.setItem('user', JSON.stringify(response.user));
// //     setUser(response.user);
// //   };

// //   const logout = () => {
// //     authService.logout();
// //     setUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider
// //       value={{
// //         user,
// //         isLoading,
// //         login,
// //         register,
// //         logout,
// //         isAuthenticated: !!user,
// //         isAdmin: user?.role === 'admin',
// //       }}
// //     >
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };