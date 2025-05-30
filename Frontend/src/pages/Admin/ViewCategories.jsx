import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";

export const ViewCategories = () => {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const recordsPerPage = 6;
    const token = localStorage.getItem("token");

    const getCategories = async () => {
        try {
            const response = await fetch(`http://localhost:5000/category/get`, {
                method: 'GET',
                headers: { "Authorization": `Bearer ${token}` },
            });
            const res_data = await response.json();
            if (response.ok) setCategories(res_data.data.categories);
            else{
                toast.error(res_data.msg, { theme: "dark" });
            }
        } catch (e) {
            console.log("View Category error : ", e);
        }
    };

    useEffect(() => { getCategories(); }, []);

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredCategories.length / recordsPerPage);

    const handleUpdateCategory = (category) => {
        setSelectedCategory({ ...category });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCategory(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedCategory(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/category/update?id=${selectedCategory._id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(selectedCategory),
            });

            const res_data = await response.json();
            if (response.ok) {
                toast.success(res_data.msg, { theme: "dark" });
                await getCategories();
                handleCloseModal();
            }
            else {
                toast.error(res_data.msg, { theme: "dark" });
            }
        } catch (e) {
            console.log("View Category - update category error : ", e);
        }
    };

    const handleDeleteCategory = async (category) => {
        try {
            const response = await fetch(`http://localhost:5000/category/delete?id=${category._id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const res_data = await response.json();
            if (response.ok) {
                toast.success(res_data.msg, { theme: "dark" });
                await getCategories();
            }
            else {
                toast.error(res_data.msg, { theme: "dark" });
            }
        } catch (error) {
            console.log("View Category - delete category error : ", error);
        }
    }

    return (
        <div className="container">
            <div className="table-header">
                <input
                    type="text"
                    placeholder="Search by Category name"
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
                        <th>Category</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCategories.length > 0 ? (
                        currentCategories.map((curEle, index) => {
                            const { name } = curEle;
                            return (
                                <tr key={curEle._id}>
                                    <td>{name}</td>
                                    
                                    <td>
                                        <button className="icon-btn update-btn" onClick={() => handleUpdateCategory(curEle)}>
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                    </td>
                                    <td>
                                        <button className="icon-btn delete-btn" onClick={() => handleDeleteCategory(curEle)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center' }}>No categories found</td>
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
            {showModal && selectedCategory && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Update Category</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="form-group">
                                <label>Category Name</label>
                                <input type="text" name="name" value={selectedCategory.name} onChange={handleInputChange} required />
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
