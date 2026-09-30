import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Orders() {
  const { user, token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = user?.id || user?._id;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!userId) {
        setError("User information not found");
        return;
      }

      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/orders/user/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

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
  }, [userId, token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="orders-page">
        <h1>My Orders</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {error && (
        <div>
          <p style={{ color: "red" }}>{error}</p>

          <button onClick={fetchOrders}>
            TRY AGAIN
          </button>
        </div>
      )}

      {!error && orders.length === 0 && (
        <div className="empty-orders">
          <h2>No Orders Found</h2>

          <p>You have not placed any orders yet.</p>

          <Link to="/products">
            CONTINUE SHOPPING
          </Link>
        </div>
      )}

      {!error && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => (
            <div
              className="order-card"
              key={order._id}
            >
              <h2>
                Order ID: {order._id}
              </h2>

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
                        Number(item.quantity || 0),
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
                to={`/orders/${order._id}`}
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

export default Orders;