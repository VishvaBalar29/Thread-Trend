import React, { useEffect, useState } from "react";
import "../assets/css/DesignDetails.css";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";


export const DesignDetails = () => {

    const [design, setDesign] = useState({});
    const { id } = useParams();


    const getDesigns = async () => {
        try {
            const response = await fetch(`http://localhost:5000/design/get/${id}`, {
                method: "GET"
            })
            const res_data = await response.json();
            if (response.ok) {
                setDesign(res_data.data.design);
            }
            else {
                toast.error(res_data.msg);
            }
        } catch (e) {
            toast.error(`Design Details Error : ${e}`);
        }
    }

    useEffect(() => {
        getDesigns();
    }, []);

    return (
        <div className="page-wrapper">
            <div className="design-detail-container">
                <div className="design-image">
                    <a
                        href={`http://localhost:5000/uploads/designs/${design.image}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={`http://localhost:5000/uploads/designs/${design.image}`}
                            alt={design.title}
                        />
                    </a>
                </div>
                <div className="design-info">
                    <span className="design-category">{design.category}</span>
                    <h2 className="design-title">{design.title}</h2>
                    <p className="design-description">{design.description}</p>
                </div>
            </div>
        </div>
    );
};
