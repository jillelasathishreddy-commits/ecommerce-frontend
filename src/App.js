import { useState } from "react";
import "./App.css";

import { Routes, Route } from "react-router-dom";

import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [cartCount, setCartCount] = useState(0);

  function handleAddToCart(product, quantity = 1) {
    setCartCount((e) => e + quantity);

    console.log(`${product.name} added to cart`);
  }

  return (
    <div className="app">

      <Navbar cartCount={cartCount} />

      <Routes>

        <Route
          path="/"
          element={<Products onAddToCart={handleAddToCart} />}
        />

        <Route
          path="/products"
          element={<Products onAddToCart={handleAddToCart} />}
        />

        <Route
          path="/products/:id"
          element={
            <ProductDetails
              onAddToCart={handleAddToCart}
            />
          } />

        <Route
          path="/cart"
          element={
            <main className="main-content">
              <h1>Shopping Cart</h1>
            </main>
          } />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />} />

      </Routes>

    </div>
  );
}

export default App;