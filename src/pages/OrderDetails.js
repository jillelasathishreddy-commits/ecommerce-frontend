import React, {
  useCallback,
  useEffect,
  useState
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelLoading, setCancelLoading] =
    useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError(
          "Authentication token not found"
        );
        return;
      }

      if (!id) {
        setError("Order ID is missing");
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/orders/${id}`,
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
          data.message || "Failed to fetch order"
        );
      }

      setOrder(data.order);
    } catch (error) {
      setError(error.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const cancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:8000/api/orders/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel order"
        );
      }

      setOrder(data.order);
    } catch (error) {
      setError(error.message);
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="order-details-page">
        <h1>Order Details</h1>
        <p>Loading order...</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="order-details-page">
        <h1>Order Details</h1>

        <p style={{ color: "red" }}>
          {error}
        </p>

        <button onClick={fetchOrder}>
          TRY AGAIN
        </button>

        <br />
        <br />

        <Link to="/orders">
          BACK TO ORDERS
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-page">
        <h1>Order Not Found</h1>

        <p>
          The requested order could not be found.
        </p>

        <Link to="/orders">
          BACK TO ORDERS
        </Link>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <Link to="/orders">
        BACK TO ORDERS
      </Link>

      <h1>Order Details</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <div className="order-information">
        <h2>Order Information</h2>

        <p>
          <strong>Order ID:</strong>{" "}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {order.createdAt
            ? new Date(
                order.createdAt
              ).toLocaleString("en-IN")
            : "N/A"}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {order.status}
        </p>

        <p>
          <strong>Shipping Address:</strong>{" "}
          {order.shippingAddress}
        </p>
      </div>

      <div className="order-items">
        <h2>ORDER ITEMS</h2>

        {order.items &&
          order.items.map((item, index) => (
            <div
              className="order-item"
              key={
                item.productId || index
              }
            >
              <h3>
                {item.name || "Product"}
              </h3>

              <p>
                Quantity:{" "}
                {Number(item.quantity || 0)}
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

      <div className="order-summary">
        <h2>ORDER SUMMARY</h2>

        <p>
          Total Amount: ₹
          {Number(
            order.totalAmount || 0
          ).toLocaleString("en-IN")}
        </p>
      </div>

      {(order.status === "pending" ||
        order.status === "confirmed") && (
        <button
          onClick={cancelOrder}
          disabled={cancelLoading}
        >
          {cancelLoading
            ? "CANCELLING..."
            : "CANCEL ORDER"}
        </button>
      )}

      <br />
      <br />

      <button
        onClick={() =>
          navigate("/products")
        }
      >
        CONTINUE SHOPPING
      </button>
    </div>
  );
}

export default OrderDetails;