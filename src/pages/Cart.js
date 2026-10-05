import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const handleClearCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear the cart?"
    );

    if (confirmed) {
      clearCart();
    }
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <h1>My Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>

          <p>
            Add products to your cart to see them here.
          </p>

          <button
            onClick={() => navigate("/products")}
          >
            CONTINUE SHOPPING
          </button>
        </div>
      ) : (
        <div className="cart-container">

          <div className="cart-products">

            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}

            <button
              className="clear-cart-button"
              onClick={handleClearCart}
            >
              CLEAR CART
            </button>

          </div>

          <div className="cart-summary">

            <h2>PRICE DETAILS</h2>

            <hr />

            <div className="price-row">
              <span>Items</span>
              <span>{cartCount}</span>
            </div>

            <div className="price-row">
              <span>Price</span>

              <span>
                ₹{cartTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="price-row">
              <span>Delivery</span>

              <span>FREE</span>
            </div>

            <hr />

            <div className="total-row">
              <strong>Total Amount</strong>

              <strong>
                ₹{cartTotal.toLocaleString("en-IN")}
              </strong>
            </div>

            <button
              className="place-order-button"
              onClick={handlePlaceOrder}
            >
              PLACE ORDER
            </button>

          </div>

        </div>
      )}
    </div>
  );
}

export default Cart;