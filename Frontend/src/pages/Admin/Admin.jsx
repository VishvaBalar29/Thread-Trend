import { AdminPanel } from "./AdminPanel";
import '../../assets/css/Admin.css';
import { Outlet, useNavigate } from 'react-router-dom'; // For nested routes
import { useAuth } from "../../store/auth";
import { Navigate } from "react-router-dom";

export const Admin = () => {

    const { isAdmin, isLoading } = useAuth();

    if(isLoading){
        return <h1>Loading...</h1>;
    }

    if (!isAdmin) {
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
