import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/images/logo.png";
import { useAuth } from "../store/auth";

export const Navbar = () => {

    const { isAdmin, isLoggedIn } = useAuth();
    

    return (
        <nav className="navbar">
            <div className="brand">
                <img src={logo} alt="Logo" className="nav-logo" />
                <h2 className="logo">THREAD & TREND</h2>
            </div>

            <ul className="nav-links">
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/design">Designs</NavLink></li>
                <li><NavLink to="/design">Blog</NavLink></li>
                <li><NavLink to="/about">About Us</NavLink></li>
                <li><NavLink to="/about">Contact</NavLink></li>

                {
                    isAdmin 
                    ?
                    (<li><NavLink to="/admin">Admin</NavLink></li>)
                    :
                    null
                }

                {
                    isLoggedIn
                    ?
                    (<>
                     <li><NavLink to="/profile">Profile</NavLink></li></>
                    )
                    :
                    (<li><NavLink to="/login">Login</NavLink></li>)
                }
            </ul>
        </nav>
    );
}
