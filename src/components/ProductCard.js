import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />

      <div className="product-information">
        <h2>{product.name}</h2>

        <p className="category">
          {product.category?.name || product.category}
        </p>

        <p className="price">
          {product.price.toLocaleString("en-IN")}
        </p>

        {product.name === "Sony Headphones" ? (
          <button disabled>
            Sold Out
          </button>
        ) : (
          <button
            className="add-button"
            onClick={() => addToCart(product, 1)}
          >
            Add to Cart
          </button>
        )}

        <Link
          to={`/products/${product._id}`}
          className="view-details-button"
        >
          BUY NOW
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;