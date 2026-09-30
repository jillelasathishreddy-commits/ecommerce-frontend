import React from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your e-commerce application</p>
      </div>

      <div className="admin-dashboard-cards">
        <div className="admin-dashboard-card">
          <h2>Orders</h2>
          <p>View and manage customer orders</p>

          <Link to="/admin/orders">
            VIEW ORDERS
          </Link>
        </div>

        <div className="admin-dashboard-card">
          <h2>Products</h2>
          <p>Manage your products</p>

          <Link to="/admin/products">
            MANAGE PRODUCTS
          </Link>
        </div>

        <div className="admin-dashboard-card">
          <h2>Categories</h2>
          <p>Manage product categories</p>

          <Link to="/admin/categories">
            MANAGE CATEGORIES
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;