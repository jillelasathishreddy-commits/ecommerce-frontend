import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";

function Products({ onAddToCart }) {
  const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

  useEffect(() => {
     fetch("http://localhost:8000/api/products")
    .then((response) => response.json())
   .then((data) => {
    setProducts(data);
     setLoading(false);
      })
      .catch(() => {
       setError("Failed to load products");
      setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
    }

  if (error) {
    return <p>{error}</p>;
  }

  if (products.length === 0) {
    return <p>No products available.</p>;
  }

  return (
    <div className="products-container">
      {products.map((product) => (
  <ProductCard key={product._id}
    product={product}
    onAddToCart={onAddToCart}
  />
))}
    </div>
  );
}

export default Products;