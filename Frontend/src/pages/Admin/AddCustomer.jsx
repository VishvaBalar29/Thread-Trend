import "../../assets/css/AddCustomer.css";
import { Navigate, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { toast } from "react-toastify";

export const AddCustomer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`http://localhost:5000/customer/add`, {
            method : 'POST',
            headers : {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${token}`
            },
            body : JSON.stringify(formData)
        });

        const res_data = await response.json();
        if(response.ok){
            toast.success(res_data.msg, {theme: "dark"});
            setFormData({
              name : "",
              email : "",
              mobile_number : ""
            });
            navigate("/customers");
        }
        else{
            console.log(res_data);
            toast.error(res_data.msg , {theme: "dark"});           
        }        
    } catch (error) {
        console.log("Add Customer : " , error);
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Add New Customer</h2>
      <form className="customer-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
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



