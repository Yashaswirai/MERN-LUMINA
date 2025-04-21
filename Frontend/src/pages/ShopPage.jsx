import { useState, useEffect } from "react";
import API from "../utils/api";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for filter, sorting, and search
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [filterOption, setFilterOption] = useState("all");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/products", {
        params: {
          search: searchQuery,
          sort: sortOption,
          filter: filterOption,
        },
      });
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, sortOption, filterOption]); // Refetch when any of these change

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Products"
          className="border p-2"
          value={searchQuery}
          onChange={handleSearchChange}
        />

        {/* Sorting Dropdown */}
        <select
          className="border p-2"
          value={sortOption}
          onChange={handleSortChange}
        >
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
          <option value="newCollection">New Collection</option>
          <option value="discounted">Discounted</option>
        </select>

        {/* Filter Dropdown */}
        <select
          className="border p-2"
          value={filterOption}
          onChange={handleFilterChange}
        >
          <option value="all">All Products</option>
          <option value="available">Available</option>
          <option value="discounted">Discounted</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {products.map((product) => (
            <div key={product._id} className="w-full border p-4">
              <img
                src={`/api/products/${product._id}/image`}
                alt={product.name}
                className="w-full h-40 object-cover object-center"
              />
              <h3 className="text-xl">{product.name}</h3>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <p>Stock: {product.countInStock}</p>
              {/* Add to Cart Button */}
              <button className="bg-blue-500 text-white px-4 py-2 mt-2">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
