import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import "../../assets/css/AddItem.css";


export const AddItem = () => {

    const navigate = useNavigate();

    const { orderId } = useParams();
    const token = localStorage.getItem("token");

    const [itemName, setItemName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [isItemCreated, setIsItemCreated] = useState(false);
    const [itemId, setItemId] = useState('');

    const [categories, setCategories] = useState([]);
    const [dMeasurementShown, setDMeasurementShown] = useState(false);
    const [defaultMeasurements, setDefaultMeasurements] = useState([]);
    const [extraFields, setExtraFields] = useState([]);
    const [customFields, setCustomFields] = useState([]);
    const [allKeys, setAllKeys] = useState([]);

    const [silaicharge, setSilaicharge] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [image, setImage] = useState(null);

    const [lastPart, setLastPart] = useState(false);


    useEffect(() => {
        fetchCategories();
        fetchMeasurementKeys();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:5000/category/get", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const res_data = await response.json();
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

    const fetchMeasurementKeys = async () => {
        try {
            const response = await fetch(`http://localhost:5000/measurement/non-default`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const res_data = await response.json();
            if (response.ok) {
                setAllKeys(res_data.data.measurements);
            }
        } catch (e) {
            console.error("Error fetching measurement keys", e);
        }
    };

    const createItem = async () => {
        try {
            const response = await fetch(`http://localhost:5000/item/add`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    "order_id": orderId,
                    "category_id": categoryId,
                    "item_name": itemName
                })
            });
            const res_data = await response.json();
            if (response.ok) {
                setItemId(res_data.data.item._id);
                setDMeasurementShown(true);
                setIsItemCreated(true);
                fetchDefaultMeasurement();
                toast.success("Item created successfully", { theme: "dark" });
            } else {
                toast.error(res_data.msg, { theme: "dark" });
            }
        } catch (e) {
            console.error("Error creating item", e);
        }
    };

    const fetchDefaultMeasurement = async () => {
        try {
            const response = await fetch(`http://localhost:5000/default-measurement/get/${categoryId}`, {
                method: 'GET',
                headers: { "Authorization": `Bearer ${token}` }
            });
            const res_data = await response.json();
            if (response.ok) {
                setDefaultMeasurements(res_data.data.measurements);
            }
        } catch (e) {
            console.error("Error fetching default measurements", e);
        }
    };

    const handleAddMore = () => {
        setExtraFields([...extraFields, { dropdown: '', input: '' }]);
    };

    const handleRemoveField = (indexToRemove) => {
        const updatedFields = extraFields.filter((_, index) => index !== indexToRemove);
        setExtraFields(updatedFields);
    };

    const handleAddCustom = () => {
        setCustomFields([...customFields, { key: '', value: '' }]);
    };

    const handleRemoveCustom = (indexToRemove) => {
        const updated = customFields.filter((_, index) => index !== indexToRemove);
        setCustomFields(updated);
    };

    const handleSaveMeasurements = async () => {
        try {

            for (let field of customFields) {
                if (field.key.trim() && field.value.trim()) {
                    const keyResponse = await fetch("http://localhost:5000/measurement/add", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({ key_name: field.key.trim() }),
                    });
                    const keyResData = await keyResponse.json();
                    if (!keyResponse.ok) {
                        throw new Error(keyResData.msg || "Failed to create new key");
                    }

                    const key_id = keyResData.data.measurement._id;
                    await saveMeasurement(key_id, field.value.trim());
                }
            }

            const defaultInputs = document.querySelectorAll("input[data-default-key-id]");
            for (let input of defaultInputs) {
                const key_id = input.getAttribute("data-default-key-id");
                const value = input.value.trim();
                if (value) {
                    await saveMeasurement(key_id, value);
                }
            }

            for (let field of extraFields) {
                if (field.dropdown && field.input.trim()) {
                    await saveMeasurement(field.dropdown, field.input.trim());
                }
            }



            setDMeasurementShown(false);
            setLastPart(true);
            toast.success("All measurements saved successfully!", { theme: "dark" });
        } catch (e) {
            console.error("Error saving measurements:", e);
            toast.error(e.message || "Something went wrong while saving measurements", { theme: "dark" });
        }
    };

    const saveMeasurement = async (key_id, value) => {
        const response = await fetch("http://localhost:5000/item-measurement/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                item_id: itemId,
                key_id,
                value
            }),
        });

        const res_data = await response.json();

        if (!response.ok) {
            throw new Error(res_data.msg || "Failed to save measurement");
        }
    };

    const saveItem = async (value) => {
        try {
            const formData = new FormData();
            formData.append("silaiCharges", silaicharge);
            formData.append("sample_image", image); // 👈 real file object

            const response = await fetch(`http://localhost:5000/item/update/${itemId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            const res_data = await response.json();
            console.log(res_data);

            if (!response.ok) {
                toast.success("hello" + res_data.msg, { theme: "dark" });
            }

            // Update delivery date
            const orderResponse = await fetch(`http://localhost:5000/order/update/${orderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    "delivery_date": deliveryDate,
                }),
            });

            const orderData = await orderResponse.json();
            console.log(orderData);

            if (orderResponse.ok) {
                if (value === "save") {
                    navigate(`/order/${orderId}`);
                } else {
                    setItemName("");
                    setCategoryId("");
                    setIsItemCreated(false);
                    setLastPart(false);
                    setDMeasurementShown(false);
                    setCategories([]);
                    setCustomFields([]);
                    setExtraFields([]);
                    setDefaultMeasurements([]);
                    setAllKeys([]);
                    setSilaicharge('');
                    setDeliveryDate('');
                    setImage(null);
                }
                toast.success("Item Added Successfully.", { theme: "dark" });
            } else {
                toast.error(orderData.msg, { theme: "dark" });
            }

        } catch (e) {
            console.log(`saveItem error: ${e}`);
        }
    };

    return (
        <div className="form-container">
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Item</h2>

            <div className="form-groupp">
                <label>Item Name:</label>
                <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} disabled={isItemCreated} />
            </div>

            <div className="form-groupp">
                <label>Category:</label>
                <select id="add-item-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} disabled={isItemCreated}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <button className="btn primary-btn" onClick={createItem}>Create Item</button>

            {
        dMeasurementShown && (
            <div className="section">
                {defaultMeasurements.length > 0 && (
                    <div className="measurement-section">
                        <h3>Default Measurements</h3>
                        {defaultMeasurements.map((mes) => (
                            <div key={mes._id} className="form-groupp">
                                <label>{mes.key_id.key_name}:</label>
                                <input type="text" data-default-key-id={mes.key_id._id} />
                            </div>
                        ))}
                    </div>
                )}

                <h3>Extra Fields</h3>
                {extraFields.map((field, index) => (
                    <div key={index} className="field-row">
                        <select
                            value={field.dropdown}
                            onChange={(e) => {
                                const updated = [...extraFields];
                                updated[index].dropdown = e.target.value;
                                setExtraFields(updated);
                            }}
                        >
                            <option value="">Select Key</option>
                            {allKeys.map(key => (
                                <option key={key._id} value={key._id}>{key.key_name}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Enter value"
                            value={field.input}
                            onChange={(e) => {
                                const updated = [...extraFields];
                                updated[index].input = e.target.value;
                                setExtraFields(updated);
                            }}
                        />

                        <button className="remove-btn" onClick={() => handleRemoveField(index)}>❌</button>
                    </div>
                ))}
                <span className="add-link" onClick={handleAddMore}>+ Add more</span>

                <h3>Custom Fields</h3>
                {customFields.map((field, index) => (
                    <div key={index} className="field-row">
                        <input
                            type="text"
                            placeholder="Enter key name"
                            value={field.key}
                            onChange={(e) => {
                                const updated = [...customFields];
                                updated[index].key = e.target.value;
                                setCustomFields(updated);
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Enter value"
                            value={field.value}
                            onChange={(e) => {
                                const updated = [...customFields];
                                updated[index].value = e.target.value;
                                setCustomFields(updated);
                            }}
                        />
                        <button className="remove-btn" onClick={() => handleRemoveCustom(index)}>❌</button>
                    </div>
                ))}
                <span className="add-link" onClick={handleAddCustom}>+ Add custom</span>

                <button className="btn primary-btn" onClick={handleSaveMeasurements}>Save Measurements</button>
            </div>
        )
    }

    {
        lastPart && (
            <div className="section">
                <div className="form-groupp">
                    <label>Silaicharge:</label>
                    <input type="number" value={silaicharge} onChange={(e) => setSilaicharge(e.target.value)} />
                </div>

                <div className="form-groupp">
                    <label>Delivery Date:</label>
                    <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                </div>

                <div className="form-groupp">
                    <label>Upload Image:</label>
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                </div>

                <div className="btn-group">
                    <button className="btn secondary-btn" onClick={() => saveItem("save")}>Save Item</button>
                    <button className="btn secondary-btn" onClick={() => saveItem("add")}>+ Add more item</button>
                </div>
            </div>
        )
    }
        </div >
    );
};
