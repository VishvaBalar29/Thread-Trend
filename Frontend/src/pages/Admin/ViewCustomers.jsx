import React, { useEffect, useState } from 'react';
import '../../assets/css/ViewCustomers.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export const ViewCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const recordsPerPage = 6;
    const token = localStorage.getItem("token");

    const getCustomers = async () => {
        try {
            const response = await fetch(`http://localhost:5000/customer/get`, {
                method: 'GET',
                headers: { "Authorization": `Bearer ${token}` },
            });
            const res_data = await response.json();
            if (response.ok) setCustomers(res_data.data.customers);
            else console.log("error : ", res_data);
        } catch (e) {
            console.log("View Customer error : ", e);
        }
    };

    useEffect(() => { getCustomers(); }, []);

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobile_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredCustomers.length / recordsPerPage);

    const handleUpdateCustomer = (customer) => {
        setSelectedCustomer({ ...customer });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCustomer(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/customer/update?id=${selectedCustomer._id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(selectedCustomer),
            });

            const res_data = await response.json();
            if (response.ok) {
                toast.success(res_data.msg, { theme: "dark" });
                await getCustomers();
                handleCloseModal();
            }
            else {
                toast.error(res_data.msg, { theme: "dark" });
            }
        } catch (e) {
            console.log("View Customer - update customer error : ", e);
        }
    };

    const handleDeleteCustomer = async (customer) => {
        try {
            const response = await fetch(`http://localhost:5000/customer/delete?id=${customer._id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const res_data = await response.json();
            if (response.ok) {
                toast.success(res_data.msg, { theme: "dark" });
                await getCustomers();
            }
            else {
                toast.error(res_data.msg, { theme: "dark" });
            }
        } catch (error) {
            console.log("View Customer - delete customer error : ", error);
        }
    }

    return (
        <div className="container">
            <div className="table-header">
                <input
                    type="text"
                    placeholder="Search by name, email or mobile..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile Number</th>
                        <th>Joined Date</th>
                        <th>History</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCustomers.length > 0 ? (
                        currentCustomers.map((curEle, index) => {
                            const { _id, name, email, mobile_number, joined_date } = curEle;
                            return (
                                <tr key={index}>
                                    <td>{name}</td>
                                    <td>{email}</td>
                                    <td>{mobile_number}</td>
                                    <td>{joined_date.split('T')[0]}</td>
                                    <td>
                                        <Link to={`/admin/order/${_id}`} key={_id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <button
                                            className="icon-btn history-btn"
                                        >
                                            <FontAwesomeIcon icon={faClockRotateLeft} />
                                        </button>
                                        </Link>
                                    </td>
                                    <td>
                                        <button className="icon-btn update-btn" onClick={() => handleUpdateCustomer(curEle)}>
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                    </td>
                                    <td>
                                        <button className="icon-btn delete-btn" onClick={() => handleDeleteCustomer(curEle)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center' }}>No customers found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="pagination">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                </div>
            )}

            {/* Modal */}
            {showModal && selectedCustomer && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Update Customer</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" name="name" value={selectedCustomer.name} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" value={selectedCustomer.email} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Mobile Number</label>
                                <input type="text" name="mobile_number" value={selectedCustomer.mobile_number} onChange={handleInputChange} required />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="modal-save">Save</button>
                                <button type="button" onClick={handleCloseModal} className="modal-cancel">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
