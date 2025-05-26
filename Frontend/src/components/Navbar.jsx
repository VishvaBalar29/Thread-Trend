import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/images/logo1.png";

export const Navbar = () => {
    return (
        <>
        <nav className="navbar">
            <img src={logo} alt="Logo" className="logo" height="38px" width="160px"/>
            <ul className="nav-links">
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/addCustomer">Add</NavLink></li>
                <li><NavLink to="/login">Login</NavLink></li>
                <li><NavLink to="/customers">Customers</NavLink></li>
            </ul>
        </nav>
        </>
    );
}
