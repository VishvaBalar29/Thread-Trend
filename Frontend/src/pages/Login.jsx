import "../assets/css/Login.css";
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export const Login = () => {
  const { storeTokenInLs, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      toast.error("You're already Logged In", { theme: "dark" });
    }
  }, [token]);

  if (token) {
    return <Navigate to="/" replace />;
  }

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/customer/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const res_data = await response.json();

      if (response.ok) {
        toast.success(res_data.msg, { theme: "dark" });
        storeTokenInLs(res_data.data.token);
        setFormData({ email: "", password: "" });
        navigate("/");
      } else {
        toast.error(res_data.msg, { theme: "dark" });
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Login</h2>
      <form className="customer-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        <div className="forgot-password">
          <Link to="/request-forgot-password">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};
