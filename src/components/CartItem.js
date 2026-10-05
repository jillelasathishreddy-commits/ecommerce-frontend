import React from "react";

function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}) {
  const product = item.product || item;
const productId = product._id;
const price = Number(product.price || 0);
const quantity = Number(item.cartQuantity || 1);
const itemTotal = price * quantity;
return (
    <div className="cart-item">

      <img
        src={product.image}
        alt={product.name}
        className="cart-image"
      />

<div className="cart-details">
<h2>{product.name}</h2>
<p>
          ₹{price.toLocaleString("en-IN")}
        </p>

        <div className="quantity-controls">

<button
            onClick={() =>
              onUpdateQuantity(productId, -1)
            }
            disabled={quantity <= 1}
          >
            -
          </button>

<span>{quantity}</span>

          <button
            onClick={() =>
              onUpdateQuantity(productId, 1)
            }
          >
            +
          </button>

   </div>

        <p>
          Item Total: 
          {itemTotal.toLocaleString("en-IN")}
        </p>

        <button
          className="remove-button"
          onClick={() =>
            onRemove(productId)
          }
        >
          REMOVE
        </button>

 </div>

    </div>
  );
}

export default CartItem;