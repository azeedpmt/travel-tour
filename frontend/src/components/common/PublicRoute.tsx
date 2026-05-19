// components/common/PublicRoute.tsx
import { useAppData } from "../../contexts/AppContext";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    const { isAuth, loading, user } = useAppData();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuth) return <Outlet />;

    if (!user?.role) return <Navigate to="/select-role" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/home" replace />;
};

export default PublicRoute;
