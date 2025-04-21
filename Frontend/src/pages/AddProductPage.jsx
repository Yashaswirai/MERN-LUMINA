import { useState } from 'react';
import API from '../utils/api';
import { useHistory } from 'react-router-dom';

const AddProductPage = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [message, setMessage] = useState('');
  const history = useHistory();

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name,
        price,
        description,
        image,
        countInStock,
      };
      await API.post('/products', productData);
      setMessage('Product added successfully!');
      history.push('/admin');
    } catch (err) {
      setMessage('Error adding product');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <form onSubmit={handleAddProduct} className="space-y-4">
        <div>
          <label className="block font-semibold">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Count in Stock</label>
          <input
            type="number"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
