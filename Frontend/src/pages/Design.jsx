import React, { useEffect, useState } from "react";
import "../assets/css/Design.css";
import { Link } from "react-router-dom";



export const Design = () => {
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("token");

  const pageSize = 12;

  useEffect(() => {
    fetchDesigns();
    fetchCategories();
  }, []);

  async function fetchDesigns() {
    try {
      const res = await fetch("http://localhost:5000/design/get",{
          method: "GET"
        });
      const json = await res.json();
      console.log(json);
      
      setDesigns(json.data.designs || []);
    } catch (err) {
      console.error("Failed to fetch designs", err);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch("http://localhost:5000/category/get",{
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      const json = await res.json();
      console.log(json);
      
      setCategories(json.data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  }

  
  const filteredDesigns = designs.filter(({ title, category_id }) => {
    const lowerSearch = searchTerm.toLowerCase();
    const titleMatch = title.toLowerCase().includes(lowerSearch);
    const categoryMatch = category_id?.name.toLowerCase().includes(lowerSearch);
    const searchMatch = titleMatch || categoryMatch;

    const categoryFilterMatch = filterCategory
      ? category_id?._id === filterCategory
      : true;

    return searchMatch && categoryFilterMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDesigns.length / pageSize);
  const paginatedDesigns = filteredDesigns.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function handlePageChange(page) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <div className="container" role="main">
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#1e293b" }}>
          Designs Gallery
        </h1>

        <div className="filters" aria-label="Search and filter designs">
          <input
            type="search"
            aria-label="Search by title or category"
            placeholder="Search by title or category"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            aria-label="Filter by category"
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="cards" aria-live="polite">
          {paginatedDesigns.length > 0 ? (          
            paginatedDesigns.map(({ _id, image, title, category_id, description }) => (
              <Link to={`/design/${_id}`} key={_id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article key={_id} className="card" tabIndex={0} aria-label={`${title} design card`}>
                <img
                  src={`http://localhost:5000/uploads/designs/${image}`}
                  alt={title}
                  loading="lazy"
                  width="300"
                  height="225"
                />
                <div className="card-content">
                  <h2 className="card-title">{title}</h2>
                  <div className="card-category">{category_id?.name || "No Category"}</div>
                </div>
              </article>
              </Link>
            ))
          ) : (
            <p>No designs found matching your criteria.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="pagination" aria-label="Pagination navigation">
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              &laquo;
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  className={`page-btn ${page === currentPage ? "active" : ""}`}
                  onClick={() => handlePageChange(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  aria-label={`Go to page ${page}`}
                >
                  {page}
                </button>
              );
            })}

            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              &raquo;
            </button>
          </nav>
        )}
      </div>
    </>
  );
}
