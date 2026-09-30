import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import ProductFilters from "../components/ProductFilters";
import Pagination from "../components/Pagination";
import { useEffect, useMemo, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [sortBy, setSortBy] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }

        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/api/categories/list", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load categories");
        }

        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else if (Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          setCategories([]);
        }
      })
      .catch(() => {
        setCategories([]);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim() !== "") {
      const searchText = search.trim().toLowerCase();

     result = result.filter((product) => {
        const productName = (
          product.name ||
      product.product ||
          ""
        ).toLowerCase();

        return productName.includes(searchText);
      });
    }

    if (selectedCategory !== "") {
      result = result.filter((product) => {
        if (!product.category) {
          return false;
        }

        if (typeof product.category === "object") {
          return product.category._id === selectedCategory;
        }

        return product.category === selectedCategory;
      });
    }

    if (minPrice !== "") {
      result = result.filter(
        (product) =>
          Number(product.price) >= Number(minPrice)
      );
    }

    if (maxPrice !== "") {
      result = result.filter(
        (product) =>
          Number(product.price) <= Number(maxPrice)
      );
    }

    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price) - Number(b.price)
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price) - Number(a.price)
      );
    }

    if (sortBy === "name-a-z") {
      result.sort((a, b) =>
        (a.name || a.product || "").localeCompare(
          b.name || b.product || ""
        )
      );
    }

    if (sortBy === "name-z-a") {
      result.sort((a, b) =>
        (b.name || b.product || "").localeCompare(
          a.name || a.product || ""
        )
      );
    }

    return result;
  }, [
    products,
    search,
    selectedCategory,
    minPrice,
    maxPrice,
    sortBy
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    selectedCategory,
    minPrice,
    maxPrice,
    sortBy
  ]);

  const totalProducts = filteredProducts.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalProducts / productsPerPage)
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    setCurrentPage(1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="products-page">

      <h1>Products</h1>

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onClear={handleClearFilters}
      />

      <div className="product-result-info">
        <p>
          Showing{" "}
          <strong>{totalProducts}</strong>{" "}
          products
        </p>
      </div>

      {currentProducts.length === 0 ? (
        <div className="empty-products">

          <h2>No products found</h2>

          <p>
            Try changing your search or filters.
          </p>

          <button onClick={handleClearFilters}>
            Clear Search & Filters
          </button>

        </div>
      ) : (
        <div className="products-container">

          {currentProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}

        </div>
      )}

      {totalProducts > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

    </div>
  );
}

export default Products;