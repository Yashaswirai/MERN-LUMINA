import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import API from '../utils/api';

const EditProductPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setMessage('Error fetching product details');
      }
    };

    fetchProduct();
  }, [id]);

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/products/${id}`, product);
      setMessage('Product updated successfully!');
      history.push('/admin');
    } catch (err) {
      setMessage('Error updating product');
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <form onSubmit={handleEditProduct} className="space-y-4">
        <div>
          <label className="block font-semibold">Product Name</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Price</label>
          <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Image URL</label>
          <input
            type="text"
            value={product.image}
            onChange={(e) => setProduct({ ...product, image: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Count in Stock</label>
          <input
            type="number"
            value={product.countInStock}
            onChange={(e) => setProduct({ ...product, countInStock: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
