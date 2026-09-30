import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const navigate = useNavigate();

  const { user, isLoggedIn, logout } = useAuth();
  const { cartCount } = useCart();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const isAdmin = isLoggedIn && user?.role === "admin";

  return (
    <nav className="navbar">
      <h2 className="logo">
        {isAdmin ? "Admin Panel" : "MyStore"}
      </h2>

      <div className="nav-links">

        <h2>monsoon sale is live now</h2>

        {!isAdmin && (
          <>
            <Link to="/">Home</Link>

            <Link to="/products">
              Products
            </Link>

            <Link to="/orders">
              My Orders
            </Link>

            <Link
              to="/cart"
              className="cart-button"
            >
              Cart ({cartCount})
            </Link>
          </>
        )}

        {isAdmin && (
          <>
            <Link to="/admin">
              Admin Dashboard
            </Link>

            <Link to="/admin/products">
              Admin Products
            </Link>

            <Link to="/admin/categories">
              Admin Categories
            </Link>

            <Link to="/admin/orders">
              Admin Orders
            </Link>
          </>
        )}

        {!isLoggedIn ? (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        ) : (
          <>
            <span>
              Welcome, {user?.name || user?.email}
            </span>

            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;