import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/api";

const AddEditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(productId);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    countInStock: '',
    iisNewCollection: false,
    discount: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch product if in edit mode
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${productId}`);
        setFormData({
          name: data.name,
          price: data.price,
          description: data.description,
          countInStock: data.countInStock,
          iisNewCollection: data.iisNewCollection,
          discount: data.discount,
        });
      } catch (err) {
        setMessage('Failed to load product');
      }
    };

    if (isEdit) {
      fetchProduct();
    }
  }, [isEdit, productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadData = new FormData();
    Object.entries(formData).forEach(([key, val]) =>
      uploadData.append(key, val)
    );
    if (imageFile) uploadData.append('image', imageFile);

    try {
      if (isEdit) {
        await API.put(`/products/${productId}`, uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage('Product updated successfully!');
      } else {
        await API.post('/products/add', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage('Product added successfully!');
      }

      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error saving product');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">
        {isEdit ? 'Edit Product' : 'Add Product'}
      </h2>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          type="number"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="countInStock"
          value={formData.countInStock}
          onChange={handleChange}
          placeholder="Count In Stock"
          type="number"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          placeholder="Discount (%)"
          type="number"
          className="w-full border p-2 rounded"
        />
        <label className="block">
          <input
            type="checkbox"
            name="iisNewCollection"
            checked={formData.iisNewCollection}
            onChange={handleChange}
            className="mr-2"
          />
          New Collection
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded w-full"
        >
          {isEdit ? 'Update Product' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddEditProductPage;
