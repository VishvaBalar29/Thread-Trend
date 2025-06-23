import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { Link } from "react-router-dom";
import "../assets/css/Profile.css";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const navigate = useNavigate();
    const { user, isLoading } = useAuth();

    const { isAdmin } = useAuth();
    const token = localStorage.getItem("token");

    const [currUser, setCurrUser] = useState({});
    const [orders, setOrders] = useState([]);
    const [itemsMap, setItemsMap] = useState({});
    const [loading, setLoading] = useState(true);

    const currentUserData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/customer/get/${user.customerId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const res_data = await response.json();

                setCurrUser(res_data.msg);
                console.log(res_data.msg);

            }
            else {
                console.log("Something wrong from profile page");
            }
        } catch (error) {
            console.log("Error fetching user data:", error);
        }
    };

    const getOrdersAndItems = async () => {
        try {
            const response = await fetch(`http://localhost:5000/order/getByCustId/${user.customerId}`, {
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
        if (!isLoading && user?.customerId) {
            currentUserData();
            getOrdersAndItems();
        }
    }, [isLoading, user]);


    return (
        <div className="profile-page">
            <section className="profile-header">
                <div className="profile-header-content">
                    <div>
                        <h2 className="profile-title">Welcome, {currUser.name}</h2>
                        <div className="profile-info">
                            <p><strong>Username &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </strong> {currUser.name}</p>
                            <p><strong>Email Id &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </strong> {currUser.email}</p>
                            <p><strong>Mobile Number &nbsp;: </strong> {currUser.mobile_number}</p>
                            <p><strong>Joined Date&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </strong> {currUser.joined_date?.slice(0, 10)}</p>
                            <button className="logout-btn" onClick={() => {
                                localStorage.removeItem("token");
                                window.location.href = "/login";
                            }}>Logout</button>
                        </div>
                    </div>

                    <div className="profile-avatar">
                        {currUser.name?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </section>

            {
                isAdmin ? <></>
                    :
                    <>
                        <section className="orders-section">
                            <h2 className="section-title">Your Orders</h2>

                            {loading ? (
                                <p className="status-text">Loading...</p>
                            ) : orders.length === 0 ? (
                                <p className="status-text">No orders found.</p>
                            ) : (
                                orders.map((order, index) => {
                                    const items = itemsMap[order._id] || [];
                                    const totalPrice = items.reduce((sum, item) => sum + (item.silaiCharges || 0), 0);

                                    return (
                                        <div key={order._id} className="order-card">
                                            <div className="order-header">
                                                <h3>Order No : {index + 1}</h3>
                                                <p><strong>Status:</strong> {order.status}</p>
                                                <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
                                                <p><strong>Delivery Date:</strong> {new Date(order.delivery_date).toLocaleDateString()}</p>
                                            </div>

                                            <div className="items-table">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Item Name</th>
                                                            <th style={{ textAlign: 'right' }}>Silai Charges</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.map(item => (
                                                            <tr
                                                                key={item._id}
                                                                onClick={() => navigate(`/item/${item._id}`)}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <td>{item.item_name}</td>
                                                                <td style={{ textAlign: 'right' }}>₹{item.silaiCharges}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="order-total">Total: ₹{totalPrice}</div>
                                        </div>
                                    );
                                })
                            )}
                        </section>
                    </>
            }


        </div>



    );
};
