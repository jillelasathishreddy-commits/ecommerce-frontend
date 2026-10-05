import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [cartCount, setCartCount] = useState(0);

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) * Number(item.cartQuantity || 0),
    0
  );

  useEffect(() => {

    const count = cartItems.reduce(
      (total, item) =>
        total + Number(item.cartQuantity || 0),
      0
    );

    setCartCount(count);

    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems)
    );

  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {

    const existingProduct = cartItems.find(
      (item) => item._id === product._id
    );

    let updatedCart;

    if (existingProduct) {

      updatedCart = cartItems.map((item) =>
        item._id === product._id
          ? {
              ...item,
              cartQuantity:
                Number(item.cartQuantity || 0) +
                Number(quantity)
            }
          : item
      );

    } else {

      updatedCart = [
        ...cartItems,
        {
          ...product,
          cartQuantity: Number(quantity)
        }
      ];

    }

    setCartItems(updatedCart);
  };

  const updateQuantity = (id, change) => {

    const updatedCart = cartItems.map((item) => {

      if (item._id === id) {

        const currentQuantity =
          Number(item.cartQuantity || 1);

        const newQuantity =
          currentQuantity + change;

        return {
          ...item,
          cartQuantity:
            newQuantity < 1
              ? 1
              : newQuantity
        };
      }

      return item;
    });

    setCartItems(updatedCart);
  };

  const removeFromCart = (id) => {

    const updatedCart = cartItems.filter(
      (item) => item._id !== id
    );

    setCartItems(updatedCart);
  };

  const clearCart = () => {

    setCartItems([]);

    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}