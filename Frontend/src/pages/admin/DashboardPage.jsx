// src/pages/admin/DashboardPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useToast } from "../../context/ToastContext";

const DashboardPage = () => {
  const { showSuccess, showError } = useToast();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // "error" or "success"
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStock: 0,
    newProducts: 0,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      const productsData = res.data.products || [];
      setProducts(productsData);
      setFilteredProducts(productsData);

      // Calculate dashboard stats
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      setStats({
        totalProducts: productsData.length,
        totalStock: productsData.reduce((sum, product) => sum + product.countInStock, 0),
        lowStock: productsData.filter(product => product.countInStock < 5).length,
        newProducts: productsData.filter(product => {
          const createdAt = new Date(product.createdAt);
          return createdAt > oneWeekAgo;
        }).length,
      });

      setLoading(false);
    } catch (err) {
      setMessage("Failed to fetch products");
      setMessageType("error");
      showError("Failed to fetch products. Please try again.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`/products/${id}`);
        setMessage("Product deleted successfully");
        setMessageType("success");
        showSuccess("Product deleted successfully");
        fetchProducts(); // refresh list
      } catch (err) {
        setMessage("Failed to delete product");
        setMessageType("error");
        showError("Failed to delete product. Please try again.");
      }
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.description.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

  const handleSort = (field) => {
    // If clicking the same field, toggle direction
    const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);

    // Sort the filtered products
    const sorted = [...filteredProducts].sort((a, b) => {
      // Handle different field types
      if (field === "price" || field === "countInStock" || field === "discount") {
        return newDirection === "asc" ? a[field] - b[field] : b[field] - a[field];
      } else if (field === "createdAt") {
        return newDirection === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        // String comparison for name, description, etc.
        return newDirection === "asc"
          ? a[field]?.localeCompare(b[field] || '')
          : b[field]?.localeCompare(a[field] || '');
      }
    });

    setFilteredProducts(sorted);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {message && (
        <div className={`p-4 mb-6 rounded ${messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium">TOTAL PRODUCTS</h3>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium">TOTAL INVENTORY</h3>
          <p className="text-3xl font-bold">{stats.totalStock}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm font-medium">LOW STOCK ITEMS</h3>
          <p className="text-3xl font-bold">{stats.lowStock}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-medium">NEW THIS WEEK</h3>
          <p className="text-3xl font-bold">{stats.newProducts}</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <Link
          to="/admin/add-product"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Add New Product
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <LoadingSpinner size="large" color="blue" />
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            {searchTerm ? "No products match your search" : "No products found"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortField === 'name' ? (
                        sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                      ) : <FaSort className="ml-1" />}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Price
                      {sortField === 'price' ? (
                        sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                      ) : <FaSort className="ml-1" />}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('countInStock')}
                  >
                    <div className="flex items-center">
                      Stock
                      {sortField === 'countInStock' ? (
                        sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                      ) : <FaSort className="ml-1" />}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('discount')}
                  >
                    <div className="flex items-center">
                      Discount
                      {sortField === 'discount' ? (
                        sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                      ) : <FaSort className="ml-1" />}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Created
                      {sortField === 'createdAt' ? (
                        sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                      ) : <FaSort className="ml-1" />}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {product.image ? (
                            <img
                              src={`/api/products/${product._id}/image`}
                              alt={product.name}
                              className="h-10 w-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              No img
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          {product.iisNewCollection && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              New Collection
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">${product.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.countInStock > 10 ? 'bg-green-100 text-green-800' : product.countInStock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {product.countInStock > 0 ? product.countInStock : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.discount > 0 ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          {product.discount}% OFF
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          to={`/admin/edit-product/${product._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit className="text-lg" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
