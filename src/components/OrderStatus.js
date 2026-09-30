import React from "react";

function OrderStatus({ status }) {
  const statusText = {
    pending: "Pending",
    confirmed: "Confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled"
  };

  return (
    <span className={`order-status ${status}`}>
      {statusText[status] || status}
    </span>
  );
}

export default OrderStatus;