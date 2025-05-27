import { AdminPanel } from "./AdminPanel";
import '../../assets/css/Admin.css'; 
import { Outlet } from 'react-router-dom'; // For nested routes

export const Admin = () => {
    return (
        <div className="admin-container">
            <AdminPanel />
            <main className="main-content">
                <Outlet /> {/* Dynamic content injected here */}
            </main>
        </div>
    );
};
