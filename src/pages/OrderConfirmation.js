import React from "react";
import { Link, useLocation } from "react-router-dom";

function OrderConfirmation() {
  const location = useLocation();

  const order = location.state?.order;

  if (!order) {
    return (
      <div className="order-confirmation-page">
        <h1>Order Confirmation</h1>

        <p>
          Order information is not available.
        </p>

        <Link to="/orders">
          GO TO MY ORDERS
        </Link>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <h1>Order Placed Successfully</h1>

      <p>
        Thank you for your order!
      </p>

      <div className="confirmation-box">
        <h2>Order Confirmed</h2>

        <p>
          Order ID: {order._id}
        </p>

        <p>
          Status: {order.status}
        </p>

        <p>
          Total Amount: ₹
          {Number(order.totalAmount).toLocaleString("en-IN")}
        </p>

        <p>
          Shipping Address: {order.shippingAddress}
        </p>
      </div>

      <div className="confirmation-buttons">
        <Link to={`/orders/${order._id}`}>
          VIEW ORDER DETAILS
        </Link>

        <Link to="/orders">
          MY ORDERS
        </Link>

        <Link to="/products">
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;