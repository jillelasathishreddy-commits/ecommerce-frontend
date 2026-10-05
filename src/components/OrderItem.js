import React from "react";

function OrderItem({ item }) {
  return (
    <div className="order-item">

      <div>
        <h3>{item.name}</h3>

        <p>
          Quantity: {item.quantity}
        </p>

        <p>
          Price: 
          {Number(item.price || 0).toLocaleString("en-IN")}
        </p>
      </div>

      <div>
        <strong>
          
          {Number(item.total || 0).toLocaleString("en-IN")}
        </strong>
      </div>

    </div>
  );
}

export default OrderItem;