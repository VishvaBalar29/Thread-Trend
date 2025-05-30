import "../../assets/css/AddCustomer.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AddCategory = () => {
  const [name, setName] = useState();

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/category/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({"name" : name}),
      });

      const res_data = await response.json();
      if (response.ok) {
        console.log(res_data);
        
        toast.success(res_data.msg, { theme: "dark" });
        setName("");
        navigate("/admin/view-categories");
      } else {
        toast.error(res_data.msg, { theme: "dark" });
      }
    } catch (e) {
      toast.error(`add category Error: ${e}`, { theme: "dark" });
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Add New Category</h2>
      <p style={{ fontSize: "14px", color: "#555", textAlign: "center", marginBottom: "20px" }}>
        Please enter the category name to add a new record.
      </p>
      <form className="customer-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={name}
          onChange={handleChange}
        />
        
        <button type="submit">Add Category</button>
      </form>
    </div>
  );
};
