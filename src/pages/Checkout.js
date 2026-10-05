import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    cartTotal,
    clearCart
  } = useCart();

  const { user, token } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (!phone.trim()) {
      setError("Phone number is required");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Phone number must contain 10 digits");
      return;
    }

    if (!address.trim()) {
      setError("Address is required");
      return;
    }

    if (!city.trim()) {
      setError("City is required");
      return;
    }

    if (!state.trim()) {
      setError("State is required");
      return;
    }

    if (!pincode.trim()) {
      setError("Pincode is required");
      return;
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
      setError("Pincode must contain 6 digits");
      return;
    }

    if (!user || !user.id) {
      setError("User information not found");
      return;
    }

    if (!token) {
      setError("Authentication token not found");
      return;
    }

    const shippingAddress = `${fullName.trim()}, ${phone.trim()}, ${address.trim()}, ${city.trim()}, ${state.trim()} - ${pincode.trim()}`;

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8000/api/orders/create",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            userId: user.id,

            shippingAddress: shippingAddress,

            cartItems: cartItems.map((item) => ({
              productId: item._id,
              cartQuantity: Number(
                item.cartQuantity || 0
              )
            }))
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to create order"
        );
      }

      clearCart();

      navigate("/order-confirmation", {
        state: {
          order: data.order
        }
      });

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">

        <h1>Checkout</h1>

        <p style={{ color: "red" }}>
          Cart is empty
        </p>

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

  return (
    <div className="checkout-page">

      <h1>Checkout</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <div className="checkout-container">

        <div className="checkout-items">

          <h2>ORDER ITEMS</h2>

          {cartItems.map((item) => (

            <div
              className="checkout-item"
              key={item._id}
            >

              <img
                src={item.image}
                alt={
                  item.name ||
                  item.product ||
                  "Product"
                }
                width="100"
              />

              <h3>
                {item.name ||
                  item.product ||
                  "Product"}
              </h3>

              <p>
                Price: ₹
                {Number(
                  item.price || 0
                ).toLocaleString("en-IN")}
              </p>

              <p>
                Quantity:{" "}
                {Number(
                  item.cartQuantity || 0
                )}
              </p>

              <p>
                Item Total: ₹
                {(
                  Number(item.price || 0) *
                  Number(
                    item.cartQuantity || 0
                  )
                ).toLocaleString("en-IN")}
              </p>

            </div>

          ))}

        </div>

        <div className="checkout-address">

          <h2>Delivery Information</h2>

          <input
            type="text"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            placeholder="Full Name"
          />

          <input
            type="text"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            placeholder="Phone Number"
            maxLength="10"
          />

          <textarea
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
            placeholder="Enter your address"
            rows="4"
          />

          <input
            type="text"
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
            placeholder="City"
          />

          <input
            type="text"
            value={state}
            onChange={(e) =>
              setState(e.target.value)
            }
            placeholder="State"
          />

          <input
            type="text"
            value={pincode}
            onChange={(e) =>
              setPincode(e.target.value)
            }
            placeholder="Pincode"
            maxLength="6"
          />

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
          >

            {loading
              ? "PLACING ORDER..."
              : "PLACE ORDER"}

     </button>

  </div>

    <div className="checkout-summary">

          <h2>ORDER SUMMARY</h2>

          <p>
            Items: {cartCount}
          </p>

          <p>
            Total: ₹
            {cartTotal.toLocaleString(
              "en-IN"
    )}
 </p>

  </div>

   </div>

    </div>
  );
}

export default Checkout;