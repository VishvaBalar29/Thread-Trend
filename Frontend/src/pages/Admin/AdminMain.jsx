import React, { useEffect, useState } from "react";
import "../../assets/css/AdminMain.css";
import { toast } from "react-toastify";

export const AdminMain = () => {
    const [counts, setCounts] = useState({
        categories: 0,
        customers: 0,
        designs: 0,
        items: 0,
        orders: 0,
        measurements: 0,
    });

    const token = localStorage.getItem("token");

    const fetchAllCounts = async () => {
        const response = await fetch("http://localhost:5000/admin/getAllCounts", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        const res_data = await response.json();
        if(response.ok){
            setCounts(res_data.data);
        }
        else{
            toast.error("fetchAllCounts setcount error");
        }
    }

    useEffect(() => {
        fetchAllCounts();
    }, []);

    const cards = [
        { title: "Total Customers", count: counts.customers, color: "bg-cyan", link: "/admin/view-customers", icon: "👤" },
        { title: "Total Orders", count: counts.orders, color: "bg-red", link: "/admin/view-customers", icon: "🛒" },
        { title: "Total Ordered Items", count: counts.items, color: "bg-green", link: "/admin/view-customers", icon: "🧵" },
        { title: "Total Categories", count: counts.categories, color: "bg-primary", link: "/admin/view-categories", icon: "📦" },
        { title: "Total Designs", count: counts.designs, color: "bg-yellow", link: "/admin/view-designs", icon: "🎨" },
        { title: "Total Measurements", count: counts.measurements, color: "bg-purple", link: "/admin/view-keys", icon: "📏" },
    ];

    return (
        <div className="admin-dashboard">
            <div className="dashboard-grid">
                {cards.map((card, index) => (
                    <a key={index} href={card.link} className={`dashboard-card ${card.color}`}>
                        <div className="card-icon">{card.icon}</div>
                        <div className="card-count">{card.count}</div>
                        <div className="card-title">{card.title}</div>
                    </a>
                ))}
            </div>
        </div>
    );
};
