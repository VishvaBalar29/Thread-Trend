import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/css/ViewItem.css";

export const ViewItem = () => {
    const { itemId } = useParams();

    const [item, setItem] = useState(null);
    const [measurements, setMeasurements] = useState([]);

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
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const res_data = await response.json();
            if(response.ok){
                setMeasurements(res_data.data.measurements);
            }
            else{
                navigate("/unauthorized");        
            }
        } catch (e) {
            console.error("Error fetching measurements", e);
        }
    };

    useEffect(() => {
        fetchItem();
        fetchMeasurement();
    }, []);

    return (
        <div className="view-item-container">
            {item ? (
                <div className="item-details">
                    <h2>{item.item_name}</h2>
                    <p><strong>Category:</strong> {item.category_id.name}</p>
                    <p><strong>Silai Charges:</strong> ₹{item.silaiCharges}</p>
                    <p><strong>Order Status:</strong> {item.order_id.status}</p>
                    <p><strong>Order Date:</strong> {new Date(item.order_id.order_date).toLocaleDateString()}</p>
                    <p><strong>Delivery Date:</strong> {new Date(item.order_id.delivery_date).toLocaleDateString()}</p>
                    {item.sample_image && <img src={item.sample_image} alt="Sample" className="sample-image" />}
                </div>
            ) : (
                <p>Loading item details...</p>
            )}

            <div className="measurement-section">
                <h3>Measurements</h3>
                {measurements.length > 0 ? (
                    <ul className="measurement-list">
                        {measurements.map((m) => (
                            <li key={m._id} className="measurement-item">
                                <span className="measurement-key">{m.key_id.key_name}</span>
                                <span className="measurement-value">{m.value}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No measurements available.</p>
                )}
            </div>
        </div>
    );
};