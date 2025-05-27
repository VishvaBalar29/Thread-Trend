import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../assets/css/AdminPanel.css';

export const AdminPanel = () => {
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li><NavLink to="/admin" end><i className="fas fa-user-shield"></i> Admin</NavLink></li>
        <li><NavLink to="/admin/add-customer"><i className="fas fa-user-plus"></i> Add Customer</NavLink></li>
        <li><NavLink to="/admin/view-customers"><i className="fas fa-users"></i> View Customers</NavLink></li>
        <li><NavLink to="/admin/add-design"><i className="fas fa-palette"></i> Add Design</NavLink></li>
        <li><NavLink to="/admin/add-category"><i className="fas fa-folder-plus"></i> Add Category</NavLink></li>
        <li><NavLink to="/admin/view-category"><i className="fas fa-folder-open"></i> View Category</NavLink></li>
      </ul>
    </aside>
  );
};
