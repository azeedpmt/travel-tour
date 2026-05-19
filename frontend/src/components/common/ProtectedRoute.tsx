// components/common/ProtectedRoute.tsx
import { useAppData } from "../../contexts/AppContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
    const { isAuth, user, loading } = useAppData();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // No role yet — send to select-role (but don't redirect if already there)
    if (!user?.role && location.pathname !== "/select-role") {
        return <Navigate to="/select-role" replace />;
    }

    // Has role but landed on select-role — redirect away
    if (user?.role && location.pathname === "/select-role") {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/home'} replace />;
    }

    // Non-admin trying to reach admin routes
    if (location.pathname.startsWith("/admin") && user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
