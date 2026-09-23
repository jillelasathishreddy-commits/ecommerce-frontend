import { Link } from "react-router-dom";

function ProductCard({ product, onAddToCart }) {
  console.log("PRODUCT:", product);
console.log("ID:", product._id);
  return (
    <div className="product-card">
      <img
           src={product.image}
        alt={product.name}
          className="product-image" />

      <div className="product-information">
        <h2>{product.product}</h2>
        <p className="category">{product.category}</p>
        <p className="price">
          {product.price.toLocaleString("en-IN")}
        </p>

        {product.product === "Sony Headphones" ? (
          <button disabled >
            Sold Out
          </button>
                 ) : (
          <button
      className="add-button"
     onClick={() => onAddToCart(product)}>
     Add to Cart
     </button>
        )}
       <Link
           to={`/products/${product._id}`}
            className="view-details-button">
               BUY NOW
        </Link>
     </div>
    </div>
  );
}

export default ProductCard;