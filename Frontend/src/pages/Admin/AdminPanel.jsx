import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../assets/css/AdminPanel.css';

export const AdminPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/admin" end onClick={closeSidebar}>
              <i className="fas fa-user-shield"></i> Admin
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/add-customer" onClick={closeSidebar}>
              <i className="fas fa-user-plus"></i> Add Customer
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/view-customers" onClick={closeSidebar}>
              <i className="fas fa-users"></i> View Customers
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/add-design" onClick={closeSidebar}>
              <i className="fas fa-palette"></i> Add Design
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/view-designs" onClick={closeSidebar}>
              <i className="fas fa-images"></i> View Designs
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/add-category" onClick={closeSidebar}>
              <i className="fas fa-folder-plus"></i> Add Category
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/view-categories" onClick={closeSidebar}>
              <i className="fas fa-folder-open"></i> View Category
            </NavLink>
           
          </li>
        </ul>
      </aside>
    </>
  );
};
