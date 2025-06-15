import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import '../../assets/css/Measurements.css';

export const Measurements = () => {
    const [allMeasurements, setAllMeasurements] = useState([]);
    const [filteredMeasurements, setFilteredMeasurements] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);

    const [categories, setCategories] = useState([]);
    const [keys, setKeys] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedKey, setSelectedKey] = useState('');


    const token = localStorage.getItem("token");

    const getData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/default-measurement/get`, {
                method: 'GET',
                headers: { "Authorization": `Bearer ${token}` },
            });
            const res_data = await response.json();
            console.log(res_data);
            if (response.ok) {
                setAllMeasurements(res_data.data.result);
                setFilteredMeasurements(res_data.data.result);
            }
        } catch (e) {
            console.log("View Category error : ", e);
        }
    };

    const getCategories = async () => {
        try {
            const response = await fetch(`http://localhost:5000/category/get`, {
                method: 'GET',
                headers: { "Authorization": `Bearer ${token}` },
            });
            const res_data = await response.json();
            if (response.ok) setCategories(res_data.data.categories);
            else {
                toast.error(res_data.msg, { theme: "dark" });
            }
        } catch (e) {
            console.log("View Category error : ", e);
        }
    };

    const fetchKeys = async () => {
        try {
            const response = await fetch("http://localhost:5000/measurement/get", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const res_data = await response.json();
            if (response.ok) {
                setKeys(res_data.data.measurements);
            } else {
                toast.error("Failed to fetch keys", { theme: "dark" });
            }
        } catch (e) {
            console.error("Error fetching keys", e);
        }
    };

    const handleSave = async () => {
        if (!selectedCategory || !selectedKey) {
            return toast.error("Please select both category and measurement key", { theme: "dark" });
        }

        try {
            const response = await fetch("http://localhost:5000/default-measurement/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    category_id: selectedCategory,
                    key_id: selectedKey,
                }),
            });

            const res_data = await response.json();

            if (response.ok) {
                toast.success(res_data.msg || "Added successfully", { theme: "dark" });
                setShowModal(false);
                setSelectedCategory('');
                setSelectedKey('');
                getData();
            } else {
                toast.error(res_data.msg || "Failed to add", { theme: "dark" });
            }
        } catch (e) {
            console.error("Error saving measurement", e);
            toast.error("Something went wrong", { theme: "dark" });
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/default-measurement/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const res_data = await response.json();

            if (response.ok) {
                toast.success(res_data.msg || "Deleted successfully", { theme: "dark" });
                getData(); 
            } else {
                toast.error(res_data.msg || "Failed to delete", { theme: "dark" });
            }
        } catch (e) {
            console.error("Error deleting measurement", e);
            toast.error("Something went wrong", { theme: "dark" });
        }
    };


    useEffect(() => {
        getData();
        getCategories();
        fetchKeys();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        const filtered = allMeasurements.filter(item =>
            item.categoryName.toLowerCase().includes(value)
        );
        setFilteredMeasurements(filtered);
    };

    return (
        <div className="m-container">
            <div className="header-bar">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search by category..."
                    className="search-input"
                />
                <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Default Measurement</button>
            </div>

            {filteredMeasurements.length === 0 ? (
                <p className="no-data">No categories found</p>
            ) : (
                filteredMeasurements.map((category, index) => (
                    <div key={index} className="category-card">
                        <h2>{category.categoryName}</h2>
                        <ul>
                            {category.measurements.map((m, i) => (
                                <li key={i} className="measurement-item">
                                    {m.key_name}
                                    <span
                                        className="delete-icon"
                                        onClick={() => handleDelete(m._id)}
                                        title="Delete"
                                    >
                                        ❌
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3 style={{ marginTop: "0px" }}>Add Default Measurement</h3>

                        <label>Category:</label>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="">Select Category</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>

                        <label>Measurement Key:</label>
                        <select value={selectedKey} onChange={(e) => setSelectedKey(e.target.value)}>
                            <option value="">Select Key</option>
                            {keys.map((key, index) => (
                                <option key={index} value={key._id}>{key.key_name}</option>
                            ))}
                        </select>


                        <div className="modal-actions">
                            <button className="save-btn" onClick={handleSave}>Save</button>
                            <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
