import "../../assets/css/AddCustomer.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AddDesign = () => {
  const [formData, setFormData] = useState({
    category_name: "",
    category_id: "",
    title: "",
    description: "",
    image: null,
  });

  const [loadingCategoryId, setLoadingCategoryId] = useState(false);
  const [categories, setCategories] = useState([]); // 🆕 For dropdown
  const token = localStorage.getItem("token");

  //  Fetch all categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/category/get", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const res_data = await response.json();
        console.log(res_data.data.categories);
        
        if (response.ok && res_data.data.categories) {
          setCategories(res_data.data.categories);
        } else {
          toast.error("Failed to fetch categories", { theme: "dark" });
        }
      } catch (error) {
        console.error("Fetch categories error:", error);
        toast.error("Something went wrong", { theme: "dark" });
      }
    };
    fetchCategories();
  }, []);



  const fetchCategoryIdByName = async (categoryName) => {
    setLoadingCategoryId(true);
    try {
      const response = await fetch(
        `http://localhost:5000/category/getByName?name=${encodeURIComponent(categoryName)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res_data = await response.json();
      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          category_id: res_data.data.category._id,
        }));
      } else {
        toast.error("Failed to fetch category ID", { theme: "dark" });
      }
    } catch (error) {
      console.error("Fetch Category ID Error:", error);
      toast.error("Failed to fetch category ID", { theme: "dark" });
    } finally {
      setLoadingCategoryId(false);
    }
  };



  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else if (name === "category_name") {
      setFormData({ ...formData, category_name: value });
      await fetchCategoryIdByName(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loadingCategoryId) {
      toast.info("Please wait for category to load", { theme: "dark" });
      return;
    }

    if (!formData.category_id || !formData.title || !formData.image) {
      toast.error("Please fill all required fields", { theme: "dark" });
      return;
    }

    const form = new FormData();
    form.append("category_id", formData.category_id);
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("image", formData.image);

    try {
      const response = await fetch("http://localhost:5000/design/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Design Added Successfully!", { theme: "dark" });
        setFormData({
          category_name: "",
          category_id: "",
          title: "",
          description: "",
          image: null,
        });
      } else {
        toast.error(data.msg || "Failed to add design", { theme: "dark" });
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Something went wrong", { theme: "dark" });
    }
  };



  return (
    <div className="form-wrapper">
      <h2>Add New Design</h2>
      <p className="form-description">
        Please fill the design details to add a new record.
      </p>
      <form className="customer-form" onSubmit={handleSubmit}>
        <select
          name="category_name"
          value={formData.category_name}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="title"
          placeholder="Design Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Design Description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        ></textarea>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loadingCategoryId}>
          {loadingCategoryId ? "Please wait..." : "Add Design"}
        </button>
      </form>
    </div>
  );
};
