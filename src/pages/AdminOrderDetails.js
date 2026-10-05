import React, { useCallback, useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminOrderDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:8000/api/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Order not found"
        );
      }

      setOrder(data.order);
      setStatus(data.order.status);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `http://localhost:8000/api/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status"
        );
      }

      setOrder(data.order);
      setStatus(data.order.status);

      setSuccess(
        "Order status updated successfully"
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-order-details">
        <h1>Order Details</h1>
        <p>Loading order...</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="admin-order-details">
        <h1>Order Not Found</h1>

        <p>{error}</p>

        <Link to="/admin/orders">
          Back to Admin Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-order-details">
      <Link to="/admin/orders">
        Back to Admin Orders
      </Link>

      <h1>Admin Order Details</h1>

      {error && (
        <p className="admin-error-text">
          {error}
        </p>
      )}

      {success && (
        <p className="admin-success-text">
          {success}
        </p>
      )}

      <div className="admin-order-info">
        <h2>Order Information</h2>

        <p>
          <strong>Order ID:</strong>{" "}
          {order._id}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {order.createdAt ? new Date(
                order.createdAt
              ).toLocaleDateString("en-IN")
            : "N/A"}
        </p>

        <p>
          <strong>Shipping Address:</strong>{" "}
          {order.shippingAddress}
        </p>
      </div>

      <div className="admin-status-section">
        <h2>Order Status</h2>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          disabled={updating}
        >
          <option value="pending">
            Pending
          </option>

          <option value="confirmed">
            Confirmed
          </option>

          <option value="shipped">
            Shipped
          </option>

          <option value="delivered">
            Delivered
          </option>
        </select>

        <button
          onClick={handleStatusUpdate}
          disabled={updating}
        >
          {updating
            ? "UPDATING..."
            : "UPDATE STATUS"}
        </button>
      </div>

      <div className="admin-order-items">
        <h2>Ordered Products</h2>

        {order.items?.map((item, index) => (
          <div
            className="admin-order-item"
            key={item.productId || index}
          >
            <h3>{item.name}</h3>

            <p>
              Quantity: {item.quantity}
            </p>

            <p>
              Price: ₹
              {Number(
                item.price || 0
              ).toLocaleString("en-IN")}
            </p>

            <p>
              Item Total: ₹
              {Number(
                item.total || 0
              ).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <div className="admin-order-total">
        <h2>
          Total Amount: ₹
          {Number(
            order.totalAmount || 0
          ).toLocaleString("en-IN")}
        </h2>
      </div>
    </div>
  );
}

export default AdminOrderDetails;