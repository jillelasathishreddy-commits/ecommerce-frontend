import { Link } from "react-router-dom";


function Navbar({ cartCount }) {
  return(
    <nav className="navbar">
      <h2 className="logo">MyStore</h2>
      
      <div className="nav-links">
       <h2>monsoon sale is live now</h2>
       <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
        <Link to="/cart" className="cart-button">
        Cart ({cartCount})
        </Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
      </nav>
   );
}

export default Navbar;