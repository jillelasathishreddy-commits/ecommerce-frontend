import React, { useEffect, useState } from "react";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [editingCategory, setEditingCategory] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = "http://localhost:8000/api";

 
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

  
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

   
    if (!status) {
      setError("Category status is required");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      let url;
      let method;

      
      if (editingCategory) {
        url = `${API_URL}/categories/${editingCategory._id}`;
        method = "PUT";
      }

      
      else {
        url = `${API_URL}/categories/create`;
        method = "POST";
      }

      const response = await fetch(url, {
        method: method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name: name,
          status: status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Category operation failed"
        );
      }

      
      if (editingCategory) {
        setSuccess("Category updated successfully");
      } else {
        setSuccess("Category created successfully");
      }

      setName("");
      setStatus("active");
      setEditingCategory(null);

      
      fetchCategories();

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (category) => {
    setEditingCategory(category);

    setName(category.name || "");

    setStatus(category.status || "active");

    setError("");
    setSuccess("");
  };

  
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/categories/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete category"
        );
      }

      setSuccess("Category deleted successfully");

      fetchCategories();

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  
  const handleCancel = () => {
    setEditingCategory(null);

    setName("");

    setStatus("active");

    setError("");
    setSuccess("");
  };

  return (
    <div>
      <h1>Admin Categories</h1>

      

      <h2>
        {editingCategory
          ? "Edit Category"
          : "Create Category"}
      </h2>

      <form onSubmit={handleSubmit}>

       

        <div>
          <label>Category Name</label>

          <input
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <br />

       

        <div>
          <label>Status</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>

        <br />

    

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : editingCategory
            ? "Update Category"
            : "Create Category"}
        </button>

       

        {editingCategory && (
          <button
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}

      </form>

      

      {error && (
        <p>
          {error}
        </p>
      )}

     

      {success && (
        <p>
          {success}
        </p>
      )}

      <hr />

      

      <h2>Categories</h2>

      

      {loading && categories.length === 0 && (
        <p>
          Loading categories...
        </p>
      )}

    

      {!loading && categories.length === 0 && (
        <p>
          No categories found.
        </p>
      )}

     

      {categories.length > 0 && (
        <ul>

          {categories.map((category) => (

            <li key={category._id}>

              {category.name}

              {" - "}

              {category.status}

              {" "}

             

              <button
                onClick={() =>
                  handleEdit(category)
                }
              >
                Edit
              </button>

              {" "}

             

              <button
                onClick={() =>
                  handleDelete(category._id)
                }
              >
                Delete
              </button>

            </li>

          ))}

        </ul>
      )}

    </div>
  );
}

export default AdminCategories;