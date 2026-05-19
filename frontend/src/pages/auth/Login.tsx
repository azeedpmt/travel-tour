// import axios from 'axios';
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useGoogleLogin } from "@react-oauth/google";
// import toast from "react-hot-toast";
// import { useAppData } from "../../contexts/AppContext";
// import { authService } from "../../services/authService";
// import { FcGoogle } from "react-icons/fc";

// const Login = () => {
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     const { setUser, setIsAuth, isAuth, user } = useAppData();

//     // Redirect if already logged in
//     useEffect(() => {
//         if (!isAuth || !user) return;

//         if (user.role === 'admin') {
//             navigate('/admin', { replace: true });
//         } else if (user.role === 'user') {
//             navigate('/home', { replace: true });
//         } else {
//             navigate('/select-role', { replace: true });
//         }
//     }, [isAuth, user, navigate]);

   
    
//     const handleGoogleLogin = useGoogleLogin({
//     flow: "auth-code",
//     onSuccess: async (tokenResponse) => {
//         setLoading(true);
//         try {
//             console.log('Got code, calling auth service...');
            
//             // Call auth-service DIRECTLY, not through gateway
//             const response = await axios.post(
//                 'http://localhost:8001/api/auth/login',
//                 { code: tokenResponse.code },
//                 { timeout: 30000 }
//             );
            
//             console.log('Auth response:', response.data);
            
//             if (response.data.token && response.data.user) {
//                 localStorage.setItem('token', response.data.token);
//                 localStorage.setItem('user', JSON.stringify(response.data.user));
//                 setUser(response.data.user);
//                 setIsAuth(true);
//                 toast.success(`Welcome ${response.data.user.name}!`);

//                 if (response.data.user.role === 'admin') {
//                     navigate('/admin', { replace: true });
//                 } else if (response.data.user.role === 'user') {
//                     navigate('/home', { replace: true });
//                 } else {
//                     navigate('/select-role', { replace: true });
//                 }
//             }
//         } catch (error: any) {
//             console.error('Login error:', error.response?.data || error.message);
//             toast.error(error.response?.data?.message || 'Login failed');
//         } finally {
//             setLoading(false);
//         }
//     },
//     onError: (error) => {
//         console.error('Google OAuth error:', error);
//         toast.error("Google login failed");
//         setLoading(false);
//     },
// });
//     // Show redirecting screen if already authed
//     if (isAuth && user) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//                     <p className="text-gray-600">Redirecting...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//             <div className="max-w-md w-full mx-4">
//                 <div className="bg-white rounded-2xl shadow-xl p-8">
//                     <div className="text-center mb-8">
//                         <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                     d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//                             </svg>
//                         </div>
//                         <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
//                         <p className="text-gray-500">Sign in to continue your travel journey</p>
//                     </div>

//                     <button
//                         onClick={() => handleGoogleLogin()}
//                         disabled={loading}
//                         className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         <FcGoogle size={24} />
//                         {loading ? "Signing in..." : "Continue with Google"}
//                     </button>

//                     <div className="mt-6 text-center">
//                         <p className="text-xs text-gray-400">
//                             By continuing, you agree to our Terms of Service and Privacy Policy
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;

import axios from 'axios';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useAppData } from "../../contexts/AppContext";
import { authService } from "../../services/authService";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser, setIsAuth, isAuth, user } = useAppData();

    const isTestMode = import.meta.env.VITE_TEST_MODE === 'true';
    const isDev = import.meta.env.DEV;  // true in dev, false in production

    useEffect(() => {
        if (!isAuth || !user) return;
        if (user.role === 'admin') {
            navigate('/admin', { replace: true });
        } else if (user.role === 'user') {
            navigate('/home', { replace: true });
        } else {
            navigate('/select-role', { replace: true });
        }
    }, [isAuth, user, navigate]);

    // Test login function – calls a backend test endpoint
    const testLogin = async (email: string, role: string, secretKey?: string) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8001/api/auth/test-login', {
                email,
                role,
                secretKey, // only for admin
            });
            if (response.data.token && response.data.user) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                setIsAuth(true);
                toast.success(`Welcome ${response.data.user.name}!`);
                if (role === 'admin') navigate('/admin');
                else navigate('/home');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Test login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                const response = await axios.post('http://localhost:8001/api/auth/login', {
                    code: tokenResponse.code,
                }, { timeout: 30000 });
                if (response.data.token && response.data.user) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    setUser(response.data.user);
                    setIsAuth(true);
                    toast.success(`Welcome ${response.data.user.name}!`);
                    if (response.data.user.role === 'admin') navigate('/admin');
                    else navigate('/home');
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Login failed');
            } finally {
                setLoading(false);
            }
        },
        onError: () => toast.error("Google login failed"),
    });

    if (isAuth && user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                        <p className="text-gray-500">Sign in to continue your travel journey</p>
                    </div>

                    {/* Normal Google button */}
                    <button
                        onClick={() => handleGoogleLogin()}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FcGoogle size={24} />
                        {loading ? "Signing in..." : "Continue with Google"}
                    </button>

                    {/* 🧪 TEST MODE BUTTONS (only shown when VITE_TEST_MODE=true) */}
                    {isDev && isTestMode && (
                        <div className="mt-6 space-y-3 border-t pt-6">
                            <p className="text-sm text-gray-500 text-center">🔧 Test Mode – Skip Google</p>
                            <button
                                onClick={() => testLogin('traveller@example.com', 'user')}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700"
                            >
                                Test Login as Traveller
                            </button>
                            <button
                                onClick={() => testLogin('admin@example.com', 'admin', 'admin123')}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                            >
                                Test Login as Admin
                            </button>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
                            By continuing, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;


