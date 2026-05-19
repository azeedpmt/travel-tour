import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'user' | 'admin' | null;
}

interface AppContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuth: boolean;
    setIsAuth: (auth: boolean) => void;
    loading: boolean;
    logout: () => void;
    isAdmin: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppData = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppData must be used within AppProvider');
    return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUserState] = useState<User | null>(null);
    const [isAuth, setIsAuthState] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUserState(parsedUser);
                setIsAuthState(true);
            } catch (e) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        // Always set loading false after checking localStorage
        setLoading(false);
    }, []);

    const setUser = (u: User | null) => {
        setUserState(u);
    };

    const setIsAuth = (auth: boolean) => {
        setIsAuthState(auth);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUserState(null);
        setIsAuthState(false);
    };

    const isAdmin = user?.role === 'admin';

    return (
        <AppContext.Provider value={{
            user, setUser,
            isAuth, setIsAuth,
            loading,
            logout,
            isAdmin
        }}>
            {children}
        </AppContext.Provider>
    );
};