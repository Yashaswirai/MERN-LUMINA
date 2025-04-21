import { useState, useEffect } from 'react';
import API from '../utils/api';
import { useHistory } from 'react-router-dom';

const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products');
        setProducts(res.data);
      } catch (err) {
        setMessage('Error fetching products');
      }
    };
    
    fetchProducts();
  }, [message]);

  // Add new product
  const handleAddProduct = () => {
    history.push('/admin/add-product');
  };

  // Delete a product
  const handleDeleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setMessage('Product deleted successfully');
    } catch (err) {
      setMessage('Error deleting product');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <button 
        onClick={handleAddProduct} 
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Add Product
      </button>

      {message && <p className="text-red-600 mb-4">{message}</p>}

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product._id} className="flex justify-between items-center border-b pb-4">
            <div>
              <p className="font-semibold">{product.name}</p>
              <p>{product.price}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => history.push(`/admin/edit-product/${product._id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(product._id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
