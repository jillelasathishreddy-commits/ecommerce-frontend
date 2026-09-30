import React, { useEffect, useState } from "react";

function ProductForm({
  editingProduct,
  onSuccess,
  onCancel
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("active");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = "http://localhost:8000/api";

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || "");
      setPrice(editingProduct.price || "");
      setCategory(
        editingProduct.category?._id ||
        editingProduct.category ||
        ""
      );
      setImage(editingProduct.image || "");
      setQuantity(editingProduct.quantity || "");
      setStatus(editingProduct.status || "active");
    } else {
      setName("");
      setPrice("");
      setCategory("");
      setImage("");
      setQuantity("");
      setStatus("active");
    }
  }, [editingProduct]);
     
  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/categories/list`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch categories"
        );
      }

      setCategories(data.categories || data);

    } catch (error) {
      console.log("Category error:", error.message);
    }
  };

  fetchCategories();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !price || !category || !image) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const productData = {
        name,
        price: Number(price),
        category,
        image,
        quantity: Number(quantity),
        status
      };

      let url;
      let method;

      if (editingProduct) {
        url = `${API_URL}/products/update/${editingProduct._id}`;
        method = "PUT";
      } else {
        url = `${API_URL}/products/create`;
        method = "POST";
      }

      const response = await fetch(url, {
        method: method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong"
        );
      }

      setSuccess(
        editingProduct
          ? "Product updated successfully"
          : "Product created successfully"
      );

      setTimeout(() => {
        onSuccess();
      }, 1000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>
        {editingProduct
          ? "Edit Product"
          : "Create Product"}
      </h2>

      {error && <p>{error}</p>}

      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>

        <div>
          <label>Product Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Price</label>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

       <div>
  <label>Category</label>

  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  >
    <option value="">
      Select Category
    </option>

    {categories.map((cat) => (
      <option
        key={cat._id}
        value={cat._id}
      >
        {cat.name}
      </option>
    ))}
  </select>
</div>

        <div>
          <label>Image URL</label>

          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <div>
          <label>Quantity</label>

          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div>
          <label>Status</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : editingProduct
            ? "Update Product"
            : "Create Product"}
        </button>

        <button
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>

      </form>
    </div>
  );
}

export default ProductForm;