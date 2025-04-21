// src/components/AdminDashboardPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";

const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products); // if you're paginating, adjust accordingly
    } catch (err) {
      setMessage("Failed to fetch products");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`/products/${id}`);
        setMessage("Product deleted");
        fetchProducts(); // refresh list
      } catch (err) {
        setMessage("Failed to delete product");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {message && <p className="text-red-500 mb-4">{message}</p>}

      <div className="mb-4">
        <Link
          to="/admin/add-product"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </Link>
      </div>

      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="p-2 border">{product.name}</td>
              <td className="p-2 border">₹{product.price}</td>
              <td className="p-2 border">{product.category}</td>
              <td className="p-2 border space-x-2">
                <Link
                  to={`/admin/edit-product/${product._id}`}
                  className="text-blue-600 underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-red-600 underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboardPage;
