import React from "react";
import { Link } from "react-router-dom";
import OrderStatus from "./OrderStatus";

function OrderCard({ order }) {

  const itemCount = order.items
    ? order.items.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      )
    : 0;

  return (
    <div className="order-card">

      <h3>
        Order ID:
      </h3>

      <p className="order-id">
        {order._id}
      </p>

      <p>
        Date:{" "}
        {new Date(
          order.createdAt
        ).toLocaleDateString("en-IN")}
      </p>

      <p>
        Items: {itemCount}
      </p>

      <p>
        Total: ₹
        {Number(
          order.totalAmount || 0
        ).toLocaleString("en-IN")}
      </p>

      <p>
        Status:{" "}
        <OrderStatus
          status={order.status}
        />
      </p>

      <Link
        to={`/orders/${order._id}`}
        className="view-order-button"
      >
        VIEW DETAILS
      </Link>

    </div>
  );
}

export default OrderCard;