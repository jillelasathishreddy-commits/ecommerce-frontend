import "./App.css";

import { Routes, Route, Navigate } from "react-router-dom";

import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Register from "./pages/Register";

import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";

import AdminRoute from "./components/AdminRoute";
import CustomerRoute from "./components/CustomerRoute";

import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";

import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import OrderConfirmation from "./pages/OrderConfirmation";

import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>

      <div className="app">

        <Navbar />

        <Routes>
          <Route
            path="/"
            element={<Navigate to="/products" replace />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />


          <Route element={<CustomerRoute />}>
            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/products/:id"
              element={<ProductDetails />}
            />
            <Route
              path="/cart"
              element={<Cart />}
            />
            <Route
              path="/checkout"
              element={<Checkout />}
            />
            <Route
              path="/orders"
              element={<Orders />}
            />
            <Route
              path="/orders/:id"
              element={<OrderDetails />}
            />
            <Route
              path="/order-confirmation"
              element={<OrderConfirmation />}
            />

          </Route>

          <Route element={<AdminRoute />}>
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />
            <Route
              path="/admin/products"
              element={<AdminProducts />}
            />
            <Route
              path="/admin/categories"
              element={<AdminCategories />}
            />
            <Route
              path="/admin/orders"
              element={<AdminOrders />}
            />
            <Route
              path="/admin/orders/:id"
              element={<AdminOrderDetails />}
            />

          </Route>

        </Routes>

      </div>

    </CartProvider>
  );
}

export default App;