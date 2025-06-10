import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../assets/css/ViewOrder.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";

export const ViewOrder = () => {
    const { custId } = useParams();
    const token = localStorage.getItem("token");

    const [orders, setOrders] = useState([]);
    const [itemsMap, setItemsMap] = useState({});
    const [loading, setLoading] = useState(true);

    const [currCustName, setCurrCustName] = useState('');
    const [currCustMobileNo, setCurrCustMobileNo] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updateStatus, setUpdateStatus] = useState("Pending");
    const [updateDeliveryDate, setUpdateDeliveryDate] = useState("");

    const getCustomerDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/customer/get/${custId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            const res_data = await response.json();
            setCurrCustName(res_data.msg.name);
            setCurrCustMobileNo(res_data.msg.mobile_number);
        } catch (e) {
            console.error("Error fetching getCustomerDetails", e);
        }
    }

    const getOrdersAndItems = async () => {
        try {
            const response = await fetch(`http://localhost:5000/order/getByCustId/${custId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const res_data = await response.json();
            const fetchedOrders = res_data.data.orders || [];
            setOrders(fetchedOrders);

            const itemsMapTemp = {};
            for (let order of fetchedOrders) {
                const itemRes = await fetch(`http://localhost:5000/item/get/order/${order._id}`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const itemData = await itemRes.json();
                if (itemRes.ok && itemData.data?.items) {
                    itemsMapTemp[order._id] = itemData.data.items;
                }
            }

            setItemsMap(itemsMapTemp);
        } catch (e) {
            console.error("Error fetching orders or items:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrdersAndItems();
        getCustomerDetails();
    }, [custId]);

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;

        try {
            const response = await fetch(`http://localhost:5000/order/delete/${orderId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const res_data = await response.json();
            if (response.ok) {
                getOrdersAndItems();
                toast.success("Order deleted successfully", { theme: "dark" });
            } else {
                console.log(res_data.msg);
            }
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    const handleDeleteItem = async (itemId, orderId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            const response = await fetch(`http://localhost:5000/item/delete/${itemId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                getOrdersAndItems();
                toast.success("Deleted Successfully", { theme: "dark" });
            } else {
                const res_data = await response.json();
                console.log(res_data.msg);
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const openUpdateModal = (order) => {
        setSelectedOrder(order);
        setUpdateStatus(order.status);
        setUpdateDeliveryDate(order.delivery_date.slice(0, 10)); // for input[type=date]
        setShowModal(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        console.log(selectedOrder);
        
        try {
            const response = await fetch(`http://localhost:5000/order/update/${selectedOrder._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: updateStatus,
                    delivery_date: updateDeliveryDate
                })
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.msg, { theme: "dark" });
                setShowModal(false);
                getOrdersAndItems();
            } else {
                 toast.error(data.msg, { theme: "dark" });
            }
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    return (
        <div className="order-container">
            <div className="order-header">
                <h2>Customer Name: {currCustName} (+91 {currCustMobileNo})</h2>
                <div className="order-meta">
                    <button className="add-order-btn">+ Add Order</button>
                    <span className="order-count">Total Orders: {orders.length}</span>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order, index) => {
                    const items = itemsMap[order._id] || [];
                    const totalPrice = items.reduce((sum, item) => sum + (item.silaiCharges || 0), 0);

                    return (
                        <div key={order._id} className="order-card">
                            <div className="order-top">
                                <div className="order-title-with-icons">
                                    <h3>Order No: {index + 1}</h3>
                                    <div className="order-icons">
                                        <button className="icon-btn update-btn" onClick={() => openUpdateModal(order)} title="Edit Order">
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                        <button className="icon-btn delete-btn" onClick={() => handleDeleteOrder(order._id)} title="Delete Order">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                                <p><strong>Status:</strong> {order.status}</p>
                                <div className="order-dates">
                                    <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
                                    <p><strong>Delivery Date:</strong> {new Date(order.delivery_date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {items.length > 0 ? (
                                <ul className="item-list">
                                    {items.map((item) => (
                                        <li key={item._id} className="item">
                                            <Link to={`/item/${item._id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                                                <span className="item-name">{item.item_name}</span>
                                                <span className="item-price">₹{item.silaiCharges}</span>
                                            </Link>
                                            <button
                                                className="icon-btn delete-btn"
                                                title="Delete Item"
                                                onClick={() => handleDeleteItem(item._id, order._id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No items found for this order.</p>
                            )}

                            <div className="order-total">Total : ₹{totalPrice}</div>
                        </div>
                    );
                })
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Update Order</h3>
                        <form onSubmit={handleUpdateSubmit}>
                            <label>Status:</label>
                            <select value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)} required>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                            </select>

                            <label>Delivery Date:</label>
                            <input
                                type="date"
                                value={updateDeliveryDate}
                                onChange={(e) => setUpdateDeliveryDate(e.target.value)}
                                required
                            />

                            <div className="modal-actions">
                                <button type="submit" className="save-btn">Save</button>
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
