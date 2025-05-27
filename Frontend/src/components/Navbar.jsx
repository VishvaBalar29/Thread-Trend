import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/images/logo.png";

export const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="brand">
                <img src={logo} alt="Logo" className="nav-logo" />
                <h2 className="logo">THREAD & TREND</h2>
            </div>

            <ul className="nav-links">
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/login">Login</NavLink></li>
                <li><NavLink to="/customers">Customers</NavLink></li>
                <li><NavLink to="/admin">Admin</NavLink></li>
            </ul>
        </nav>
    );
}
