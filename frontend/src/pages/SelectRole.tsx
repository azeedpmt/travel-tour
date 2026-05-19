import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppData } from "../contexts/AppContext";
import { authService } from "../services/authService";
import { FiUser, FiShield, FiCheck } from "react-icons/fi";

const SelectRole = () => {
    const [role, setRole] = useState<"user" | "admin" | null>(null);
    const [adminSecret, setAdminSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUser, setIsAuth, user, isAuth } = useAppData();
    const navigate = useNavigate();

    // If user already has a role, redirect immediately
    useEffect(() => {
        console.log("SelectRole useEffect - user:", user, "isAuth:", isAuth);
        
        if (!isAuth) {
            navigate('/login', { replace: true });
            return;
        }
        
        if (user?.role === "admin") {
            console.log("User is admin, redirecting to /admin");
            toast.success("You are already an admin!");
            navigate("/admin", { replace: true });
        } else if (user?.role === "user") {
            console.log("User is regular user, redirecting to /");
            toast.success("You are already a user!");
            navigate("/", { replace: true });
        }
    }, [user, isAuth, navigate]);

    const handleAddRole = async () => {
        if (!role) {
            toast.error("Please select a role");
            return;
        }

        if (role === 'admin' && !adminSecret) {
            toast.error("Admin secret key is required");
            return;
        }

        if (role === 'admin' && adminSecret !== 'admin123') {
            toast.error("Invalid admin secret key");
            return;
        }

        setLoading(true);
        try {
            console.log("Adding role:", role);
            const response = await authService.addRole(role, role === 'admin' ? adminSecret : undefined);
            console.log("Add role response:", response);

            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
            setUser(response.user);
            setIsAuth(true);
            toast.success(`Welcome! You are now registered as a ${role === 'admin' ? 'Admin' : 'Traveler'}`);

            if (role === "admin") {
                console.log("Navigating to admin dashboard");
                navigate("/admin", { replace: true });
            } else {
                console.log("Navigating to user home");
                navigate("/", { replace: true });
            }
        } catch (error: any) {
            console.error("Add role error:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Show loading while checking auth
    if (!isAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // If user has role, don't show selection
    if (user?.role === "admin" || user?.role === "user") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
                        <h1 className="text-2xl font-bold text-white">Welcome {user?.name?.split(' ')[0]}!</h1>
                        <p className="text-blue-100 mt-2">Choose how you want to use TourTravel</p>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* User Role Card */}
                        <button
                            onClick={() => {
                                setRole('user');
                                setAdminSecret('');
                            }}
                            className={`w-full rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                                role === 'user'
                                    ? 'border-blue-600 bg-blue-50 shadow-md'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        role === 'user' ? 'bg-blue-600' : 'bg-gray-100'
                                    }`}>
                                        <FiUser className={`w-6 h-6 ${role === 'user' ? 'text-white' : 'text-gray-500'}`} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">Traveler</p>
                                        <p className="text-sm text-gray-500">Browse deals, book hotels, manage trips</p>
                                    </div>
                                </div>
                                {role === 'user' && (
                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                        <FiCheck className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        </button>

                        {/* Admin Role Card */}
                        <button
                            onClick={() => setRole('admin')}
                            className={`w-full rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                                role === 'admin'
                                    ? 'border-purple-600 bg-purple-50 shadow-md'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        role === 'admin' ? 'bg-purple-600' : 'bg-gray-100'
                                    }`}>
                                        <FiShield className={`w-6 h-6 ${role === 'admin' ? 'text-white' : 'text-gray-500'}`} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">Admin</p>
                                        <p className="text-sm text-gray-500">Manage hotels, deals, food, and bookings</p>
                                    </div>
                                </div>
                                {role === 'admin' && (
                                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                        <FiCheck className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        </button>

                        {/* Admin Secret Key Input */}
                        {role === 'admin' && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Admin Secret Key
                                </label>
                                <input
                                    type="password"
                                    value={adminSecret}
                                    onChange={(e) => setAdminSecret(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter admin secret key"
                                    autoFocus
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    ℹ️ Default admin key: <code className="bg-gray-200 px-1 rounded">admin123</code>
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleAddRole}
                            disabled={!role || loading || (role === 'admin' && !adminSecret)}
                            className={`w-full rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 mt-4 ${
                                role && !loading && !(role === 'admin' && !adminSecret)
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </div>
                            ) : (
                                "Continue"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectRole;



