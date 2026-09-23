
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
   const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/api/products/${id}`)
      .then((response) => {
     if (!response.ok) {
     throw new Error("Product not found");
     }
       return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Product not found");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
   return <div>Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div className="not-found">
      <h1>Product Not Found</h1>
     <p>The product you are looking for does not exist</p>
       <Link to="/products">Back to Products</Link>
       </div>
      );
    }

  return (
    <div className="product-details">
      <Link to="/products">Back to Products</Link>

      <img
        src={product.image || product.thumbnail}
      alt={product.title || product.name}/>

    <h1>{product.title || product.name}</h1>

    <p>Price: {product.price}</p>
    <p>Category: {product.category}</p>
      <p>Description: {product.description}</p>

      <div className="quantity">
        <p>Quantity</p>

        <button
       onClick={() =>
       setQuantity((previous) =>
          previous > 1 ? previous - 1 : 1
            )
          }
          disabled={quantity === 1}
        >
          -
        </button>

        <span>{quantity}</span>

        <button
          onClick={() =>
            setQuantity((previous) => previous + 1)
          }

           >
          +
           </button>
      </div>

      <button
        onClick={() => onAddToCart(product, quantity)}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductDetails;
