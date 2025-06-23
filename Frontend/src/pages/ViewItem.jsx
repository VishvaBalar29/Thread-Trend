import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/css/ViewItem.css";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";

export const ViewItem = () => {
    const { itemId } = useParams();

    const { isAdmin } = useAuth();
    const [item, setItem] = useState(null);
    const [measurements, setMeasurements] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedMeasurement, setSelectedMeasurement] = useState(null);
    const [newValue, setNewValue] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [newKeyId, setNewKeyId] = useState("");
    const [newMeasurementValue, setNewMeasurementValue] = useState("");
    const [allKeys, setAllKeys] = useState([]);


    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    const fetchItem = async () => {
        try {
            const response = await fetch(`http://localhost:5000/item/get/${itemId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const res_data = await response.json();
            setItem(res_data.data.item);
        } catch (e) {
            console.error("Error fetching item details", e);
        }
    };

    const fetchMeasurement = async () => {
        try {
            const response = await fetch(`http://localhost:5000/item-measurement/get/${itemId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const res_data = await response.json();
            if (response.ok) {
                setMeasurements(res_data.data.measurements);
            } else {
                navigate("/unauthorized");
            }
        } catch (e) {
            console.error("Error fetching measurements", e);
        }
    };

    const fetchMeasurementKeys = async () => {
        try {
            const response = await fetch(`http://localhost:5000/measurement/get`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const res_data = await response.json();
            console.log(res_data);

            if (response.ok) {
                setAllKeys(res_data.data.measurements);
            }
        } catch (e) {
            console.error("Error fetching measurement keys", e);
        }
    };


    useEffect(() => {
        fetchItem();
        fetchMeasurement();
        fetchMeasurementKeys();
    }, []);

    const handleDeleteMeasurement = async (measurementId) => {
        try {
            const response = await fetch(`http://localhost:5000/item-measurement/delete/${measurementId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const res_data = await response.json();
            if (response.ok) {
                setMeasurements(measurements.filter(m => m._id !== measurementId));
                toast.success(res_data.msg, { theme: "dark" });
            } else {
                toast.error(res_data.msg || "Failed to delete measurement", { theme: "dark" });
            }
        } catch (e) {
            console.error("Error deleting measurement", e);
        }
    };

    const openUpdateModal = (measurement) => {
        setSelectedMeasurement(measurement);
        setNewValue(measurement.value);
        setShowModal(true);
    };

    const handleUpdateSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:5000/item-measurement/update/${selectedMeasurement._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ value: newValue })
            });
            const res_data = await response.json();

            if (response.ok) {
                toast.success(res_data.msg, { theme: "dark" });
                setShowModal(false);
                fetchMeasurement();
            } else {
                toast.error(res_data.msg || "Failed to update measurement", { theme: "dark" });
            }
        } catch (e) {
            console.error("Update error", e);
            toast.error("Something went wrong", { theme: "dark" });
        }
    };

    const handleAddMeasurement = async () => {
        if (!newKeyId || !newMeasurementValue) {
            toast.error("All fields are required", { theme: "dark" });
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/item-measurement/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    item_id: itemId,
                    key_id: newKeyId,
                    value: newMeasurementValue
                })
            });

            const res_data = await response.json();
            if (response.ok) {
                toast.success(res_data.msg || "Measurement added", { theme: "dark" });
                setShowAddModal(false);
                setNewKeyId("");
                setNewMeasurementValue("");
                fetchMeasurement(); // Refresh
            } else {
                toast.error(res_data.msg || "Failed to add measurement", { theme: "dark" });
            }
        } catch (e) {
            console.error("Add measurement error", e);
            toast.error("Error adding measurement", { theme: "dark" });
        }
    };


    return (
        <div className="view-item-container">
            {item ? (
                <div className="item-details-row">
                    <div className="item-details">
                        <h2>{item.item_name}</h2>
                        <p><strong>Category &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </strong> {item.category_id.name}</p>
                        <p><strong>Silai Charges &nbsp;&nbsp;: </strong> ₹ {item.silaiCharges}</p>
                        <p><strong>Order Status &nbsp; &nbsp;: </strong> {item.order_id.status}</p>
                        <p><strong>Order Date &nbsp; &nbsp;  &nbsp; &nbsp;: </strong> {new Date(item.order_id.order_date).toLocaleDateString()}</p>
                        <p><strong>Delivery Date &nbsp; : </strong> {new Date(item.order_id.delivery_date).toLocaleDateString()}</p>
                    </div>

                    {item.sample_image && (
                        <div className="image-box">
                            <a
                                href={`http://localhost:5000/uploads/items/${item.sample_image}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={`http://localhost:5000/uploads/items/${item.sample_image}`}
                                    alt="Sample"
                                    className="sample-image"
                                />
                            </a>
                        </div>
                    )}
                </div>


            ) : <p>Loading item details...</p>}

            <div className="measurement-section">
                <div className="measurement-header">
                    <h3>Measurements</h3>

                    {
                        isAdmin ? (
                            <button className="add-order-btn" onClick={() => setShowAddModal(true)}>
                                + Add Measurement
                            </button>
                        )
                            :
                            <></>
                    }

                </div>

                {measurements.length > 0 ? (
                    <ul className="measurement-list">
                        {measurements.map((m) => (
                            <li key={m._id} className="measurement-item">
                                <span className="measurement-key">{m.key_id.key_name}</span>

                                <div className="measurement-right">
                                    <span className="measurement-value">{m.value} cm</span>

                                    {
                                        isAdmin ?
                                            (
                                                <>
                                                    <button className="update-filled-btn" onClick={() => openUpdateModal(m)}>Update</button>
                                                    <button className="delete-filled-btn" onClick={() => handleDeleteMeasurement(m._id)}>Delete</button></>
                                            )
                                            :
                                            <></>
                                    }

                                </div>
                            </li>
                        ))}
                    </ul>
                ) : <p>No measurements available.</p>}
            </div>

            {/* Update Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Update Measurement</h3>
                        <p><strong>{selectedMeasurement.key_id.key_name}</strong></p>
                        <input
                            type="number"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button onClick={handleUpdateSubmit} className="update-filled-btn">Save</button>
                            <button onClick={() => setShowModal(false)} className="delete-filled-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}



            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Measurement</h3>

                        <select
                            value={newKeyId}
                            onChange={(e) => setNewKeyId(e.target.value)}
                        >
                            <option value="">Select Key</option>
                            {allKeys && allKeys.length > 0 ? (
                                allKeys.map(key => (
                                    <option key={key._id} value={key._id}>
                                        {key.key_name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No keys available</option>
                            )}

                        </select>

                        <input
                            type="number"
                            placeholder="Enter value in cm"
                            value={newMeasurementValue}
                            onChange={(e) => setNewMeasurementValue(e.target.value)}
                        />

                        <div className="modal-actions">
                            <button className="update-filled-btn" onClick={handleAddMeasurement}>
                                Add
                            </button>
                            <button className="delete-filled-btn" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
