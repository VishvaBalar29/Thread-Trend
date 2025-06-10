import { useEffect, useState } from "react";
import "../../assets/css/ViewKeys.css";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faKey, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

export const ViewKeys = () => {
    const [keys, setKeys] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");

    const token = localStorage.getItem("token");

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

    useEffect(() => {
        fetchKeys();
    }, []);

    const handleDelete = async (keyId) => {
        try {
            const response = await fetch(`http://localhost:5000/measurement/delete/${keyId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const res_data = await response.json();
            if (response.ok) {
                toast.success(res_data.msg, { theme: "dark" });
                fetchKeys();
            } else {
                toast.error(res_data.msg || "Failed to delete key", { theme: "dark" });
            }
        } catch (e) {
            console.error("Error deleting key", e);
            toast.error("Something went wrong", { theme: "dark" });
        }
    };

    const handleAddKey = async () => {
        if (!newKeyName.trim()) {
            toast.error("Key name is required", { theme: "dark" });
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/measurement/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ key_name: newKeyName.trim().toLowerCase() }),
            });

            const res_data = await response.json();
            if (response.ok) {
                toast.success(res_data.msg, { theme: "dark" });
                setNewKeyName("");
                setShowModal(false);
                fetchKeys();
            } else {
                toast.error(res_data.msg || "Failed to add key", { theme: "dark" });
            }
        } catch (e) {
            console.error("Error adding key", e);
            toast.error("Something went wrong", { theme: "dark" });
        }
    };

    const filteredKeys = keys.filter(key =>
        key.key_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="view-keys-container">
            <div className="header">
                <h2><FontAwesomeIcon icon={faKey} /> All Keys</h2>
            </div>

            <div className="top-bar">
                <input
                    type="text"
                    placeholder="Search key..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="add-btn" onClick={() => setShowModal(true)}>
                    <FontAwesomeIcon icon={faPlus} /> Add Key
                </button>
            </div>

            <div className="keys-list">
                {filteredKeys.length > 0 ? (
                    filteredKeys.map((key) => (
                        <div key={key._id} className="key-card">
                            <span className="key-name">{key.key_name}</span>
                            <div className="key-actions">
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="icon delete-icon"
                                    onClick={() => handleDelete(key._id)}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No keys found</p>
                )}
            </div>

            {/* Add Key Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Add New Key</h3>
                        <input style={{ marginTop: "20px" }}
                            type="text"
                            placeholder="Enter key name"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                        />
                        <div className="modal-buttons" style={{ marginTop: "20px" }}>
                            <button className="btn confirm" onClick={handleAddKey}>Add</button>
                            <button className="btn cancel" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
