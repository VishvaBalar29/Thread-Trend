import React, { useEffect, useState } from 'react';
import '../../assets/css/ViewDesigns.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";

export const ViewDesigns = () => {
    const [designs, setDesigns] = useState([]);
    const [categories, setCategories] = useState([]);  // <-- add categories state
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedDesign, setSelectedDesign] = useState(null);

    const recordsPerPage = 6;
    const token = localStorage.getItem("token");

    // Fetch all designs
    const getDesigns = async () => {
        try {
            const response = await fetch(`http://localhost:5000/design/get`, {
                method: 'GET'
            });
            const res_data = await response.json();
            if (response.ok) setDesigns(res_data.data.designs);
            else console.log("error : ", res_data);
        } catch (e) {
            console.log("View Designs error : ", e);
        }
    };

    // Fetch categories once on mount
    const getCategories = async () => {
        try {
            const response = await fetch(`http://localhost:5000/category/get`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const res_data = await response.json();
            if (response.ok) setCategories(res_data.data.categories);
            else console.log("Error fetching categories:", res_data);
        } catch (e) {
            console.log("Error fetching categories:", e);
        }
    };

    useEffect(() => {
        getDesigns();
        getCategories();
    }, []);

    const filteredDesigns = designs.filter(design =>
        design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        design.category_id.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentDesigns = filteredDesigns.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredDesigns.length / recordsPerPage);

    const handleUpdateDesign = (design) => {
        setSelectedDesign({ ...design });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDesign(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Special case for category selection (store _id)
        if (name === "category_id") {
            // Find the full category object if needed, but we only need _id for submission
            setSelectedDesign(prev => ({ ...prev, category_id: value }));
        } else {
            setSelectedDesign(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("title", selectedDesign.title);
            formData.append("description", selectedDesign.description);
            formData.append("category_id", selectedDesign.category_id);  // <-- pass category_id as id

            if (selectedDesign.newImageFile) {
                formData.append("image", selectedDesign.newImageFile);
            }

            const response = await fetch(`http://localhost:5000/design/update?id=${selectedDesign._id}`, {
                method: 'PATCH',
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            const res_data = await response.json();

            if (response.ok) {
                toast.success(res_data.msg, { theme: "dark" });
                await getDesigns();
                handleCloseModal();
            } else {
                toast.error(res_data.msg, { theme: "dark" });
            }
        } catch (e) {
            console.log("Update error:", e);
        }
    };

    const handleDeleteDesign = async (design) => {
        try {
            const response = await fetch(`http://localhost:5000/design/delete?id=${design._id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const res_data = await response.json();
            if (response.ok) {
                toast.success(res_data.msg, { theme: "dark" });
                await getDesigns();
            }
            else {
                toast.error(res_data.msg, { theme: "dark" });
            }
        } catch (error) {
            console.log("View Designs - delete error : ", error);
        }
    }

    return (
        <div className="container">
            <div className="table-header">
                <input
                    type="text"
                    placeholder="Search by title or category..."
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
                        <th>Title</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {currentDesigns.length > 0 ? (
                        currentDesigns.map((design, index) => {
                            const { title, description, image } = design;
                            return (
                                <tr key={index}>
                                    <td>{title}</td>
                                    <td>{design.category_id.name}</td>
                                    <td>{description}</td>
                                    <td>
                                        <img src={`http://localhost:5000/uploads/designs/${image}`} alt={title} style={{ width: '80px', borderRadius: '6px' }} />
                                    </td>
                                    <td>
                                        <button className="icon-btn update-btn" onClick={() => handleUpdateDesign(design)}>
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                    </td>
                                    <td>
                                        <button className="icon-btn delete-btn" onClick={() => handleDeleteDesign(design)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>No designs found</td>
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

            {showModal && selectedDesign && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Update Design</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                  type="text"
                                  name="title"
                                  value={selectedDesign.title}
                                  onChange={handleInputChange}
                                  required
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                {/* Dropdown to select category */}
                                <select
                                    name="category_id"
                                    value={selectedDesign.category_id?._id || selectedDesign.category_id || ""}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                  name="description"
                                  value={selectedDesign.description}
                                  onChange={handleInputChange}
                                  rows={3}
                                  cols={53}
                                />
                            </div>
                            <div className="form-group">
                                <label>Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={(e) => setSelectedDesign(prev => ({ ...prev, newImageFile: e.target.files[0] }))}
                                />
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
