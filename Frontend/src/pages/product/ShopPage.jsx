import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FaSearch, FaFilter, FaSort } from "react-icons/fa";

const ShopPage = () => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState({});

  // States for filter, sorting, and search
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [filterOption, setFilterOption] = useState("all");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log('Fetching products from:', API.defaults.baseURL + "/products");
      const res = await API.get("/products", {
        params: {
          search: searchQuery,
          sort: sortOption,
          filter: filterOption,
        },
      });
      console.log('Products response:', res.data);
      setProducts(res.data.products);
    } catch (error) {
      console.error('Product fetch error:', error);
      showError("Failed to load products. Please try again.");
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

  const handleAddToCart = (product) => {
    // Check if user is logged in
    if (!user) {
      showError("Please login to add items to your cart");
      navigate('/');
      return;
    }

    if (product.countInStock === 0) {
      showError("Sorry, this product is out of stock");
      return;
    }

    addToCart(product);
    showSuccess(`${product.name} added to your cart!`);

    // Show visual feedback
    setAddedToCart({ ...addedToCart, [product._id]: true });

    // Reset the visual feedback after 2 seconds
    setTimeout(() => {
      setAddedToCart({ ...addedToCart, [product._id]: false });
    }, 2000);
  };

  // Get theme context
  const { isDarkMode } = useTheme();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Shop Our Products</h1>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md mb-6 transition-colors duration-200`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Bar */}
          <div>
            <label htmlFor="search" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 flex items-center`}>
              <FaSearch className="mr-1" /> Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                placeholder="Search Products"
                className={`block w-full pl-10 pr-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Sorting Dropdown */}
          <div>
            <label htmlFor="sort" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 flex items-center`}>
              <FaSort className="mr-1" /> Sort By
            </label>
            <select
              id="sort"
              className={`block w-full py-2 px-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="newest">Newest</option>
              <option value="popular">Popular</option>
              <option value="newCollection">New Collection</option>
              <option value="discounted">Discounted</option>
            </select>
          </div>

          {/* Filter Dropdown */}
          <div>
            <label htmlFor="filter" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 flex items-center`}>
              <FaFilter className="mr-1" /> Filter
            </label>
            <select
              id="filter"
              className={`block w-full py-2 px-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
              value={filterOption}
              onChange={handleFilterChange}
            >
              <option value="all">All Products</option>
              <option value="available">Available</option>
              <option value="discounted">Discounted</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <LoadingSpinner size="large" color="blue" />
            <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading products...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>No products found</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterOption('all');
              setSortOption('newest');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className={`border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200`}>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={`${API.defaults.baseURL}/products/${product._id}/image`}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
                {product.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </div>
                )}
              </div>

              <div className="p-4">
                <Link to={`/product/${product._id}`} className="block">
                  <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'} transition-colors`}>{product.name}</h3>
                </Link>

                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2 line-clamp-2 transition-colors duration-200`}>{product.description}</p>

                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${product.price.toFixed(2)}</span>
                    {product.discount > 0 && (
                      <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} text-sm line-through ml-2`}>
                        ${(product.price * (1 + product.discount / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
                  </span>
                </div>

                {user ? (
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.countInStock === 0 || addedToCart[product._id]}
                    className={`w-full py-2 px-4 rounded-md transition-colors ${product.countInStock === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : addedToCart[product._id]
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    {product.countInStock === 0
                      ? 'Out of Stock'
                      : addedToCart[product._id]
                        ? 'Added to Cart ✓'
                        : 'Add to Cart'}
                  </button>
                ) : (
                  <Link
                    to="/"
                    className="w-full py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-center block"
                  >
                    Login to Buy
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
