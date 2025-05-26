import "../assets/css/form.css";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { Link } from "react-router-dom"; // Optional, only if you're using React Router
import { toast } from "react-toastify";

export const Login = () => {
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

  const navigate = useNavigate();
  const { storeTokenInLs } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/customer/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const res_data = await response.json();
      console.log(res_data);
      
      if (response.ok) {
        toast.success(res_data.msg, { theme: "dark" });
        storeTokenInLs(res_data.data.token);
        setFormData({
          email: "",
          password: ""
        });
        navigate("/");
      }
      else {
        toast.error(res_data.msg, { theme: dark });
      }
    } catch (error) {
      console.log("Login : ", error);
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

        {/* Forgot Password Link below the button */}
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};
