import React, { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const API_URL = "http://localhost:8000/api";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/products`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }

      setProducts(data.products || data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };
  const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/products/delete/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to delete product"
      );
    }

    alert("Product deleted successfully");

    fetchProducts();

  } catch (error) {
    setError(error.message);
  }
}; 

  return (
    <div>
      <h1>Admin Products</h1>

      <button onClick={handleCreate}>
        Add Product
      </button>

      {showForm && (
        <ProductForm
          editingProduct={editingProduct}
          onSuccess={() => {
            setShowForm(false);
            setEditingProduct(null);
            fetchProducts();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {loading && <p>Loading products...</p>}

      {error && <p>{error}</p>}

      {!loading && products.length === 0 && (
        <p>No products found.</p>
      )}

      {!loading && products.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>

                <td>₹{product.price}</td>

                <td>
                  {product.category?.name || product.category}
                </td>

                <td>{product.quantity}</td>

                <td>
                  <button onClick={() => handleEdit(product)}>
                    Edit
                  </button>

                  <button  onClick={() => handleDelete(product._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminProducts;