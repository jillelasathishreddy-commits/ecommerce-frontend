import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/orders/admin",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Server returned an invalid response"
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="admin-orders-page">
        <h1>Admin Orders</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-header">
        <div>
          <h1>Admin Orders</h1>
          <p>Manage customer orders</p>
        </div>

        <Link to="/admin">
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="admin-error">
          <p>{error}</p>

          <button onClick={fetchOrders}>
            TRY AGAIN
          </button>
        </div>
      )}

      {!error && orders.length === 0 && (
        <div className="admin-empty">
          <h2>No Orders Found</h2>
          <p>There are no customer orders yet.</p>
        </div>
      )}

      {!error && orders.length > 0 && (
        <div className="admin-orders-list">
          {orders.map((order) => (
            <div
              className="admin-order-card"
              key={order._id}
            >
              <h2>
                Order ID: {order._id}
              </h2>

              <p>
                Customer:{" "}
                {order.user?.name ||
                  order.user?.email ||
                  order.userId ||
                  "N/A"}
              </p>

              <p>
                Date:{" "}
                {order.createdAt
                  ? new Date(
                      order.createdAt
                    ).toLocaleDateString("en-IN")
                  : "N/A"}
              </p>

              <p>
                Items:{" "}
                {order.items
                  ? order.items.reduce(
                      (total, item) =>
                        total +
                        Number(
                          item.quantity || 0
                        ),
                      0
                    )
                  : 0}
              </p>

              <p>
                Total: ₹
                {Number(
                  order.totalAmount || 0
                ).toLocaleString("en-IN")}
              </p>

              <p>
                Status:{" "}
                {order.status || "pending"}
              </p>

              <Link
                to={`/admin/orders/${order._id}`}
              >
                VIEW DETAILS
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;