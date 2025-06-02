import { AdminPanel } from "./AdminPanel";
import '../../assets/css/Admin.css';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from "../../store/auth";

export const Admin = () => {
    const { isAdmin, isLoading, user } = useAuth();

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    if (!isLoading && user && !user.is_admin) {
        return <Navigate to="/" replace />;
    }
    return (
        <div className="admin-container">
            <AdminPanel />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};
