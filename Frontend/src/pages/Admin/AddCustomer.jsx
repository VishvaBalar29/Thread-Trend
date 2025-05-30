import "../../assets/css/AddCustomer.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AddCustomer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/customer/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const res_data = await response.json();
      if (response.ok) {
        console.log(res_data);
        
        toast.success(res_data.msg, { theme: "dark" });
        setFormData({ name: "", email: "", mobile_number: "" });
        navigate("/admin/view-customers");
      } else {
        toast.error(res_data.msg, { theme: "dark" });
      }
    } catch (error) {
      console.log("Add Customer Error:", error);
      toast.error("Something went wrong", { theme: "dark" });
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Add New Customer</h2>
      <p style={{ fontSize: "14px", color: "#555", textAlign: "center", marginBottom: "20px" }}>
        Please enter the customer details to add a new record.
      </p>
      <form className="customer-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="mobile_number"
          placeholder="Mobile Number"
          value={formData.mobile_number}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
};
