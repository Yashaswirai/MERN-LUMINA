import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../services/api";
import { FaSave, FaArrowLeft, FaUpload, FaTag, FaBoxOpen, FaPercentage, FaInfoCircle } from "react-icons/fa";

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
    discount: '0',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error'); // 'error' or 'success'
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Fetch product if in edit mode
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${productId}`);
        setFormData({
          name: data.name,
          price: data.price,
          description: data.description,
          countInStock: data.countInStock,
          iisNewCollection: data.iisNewCollection || false,
          discount: data.discount || '0',
        });

        // If product has an image, set the preview
        if (data.image) {
          const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mern-lumina.onrender.com/api';
          setImagePreview(`${API_BASE_URL}/products/${productId}/image`);
        }

        setLoading(false);
      } catch (err) {
        setMessage('Failed to load product');
        setMessageType('error');
        setLoading(false);
      }
    };

    if (isEdit) {
      fetchProduct();
    }
  }, [isEdit, productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.countInStock || formData.countInStock < 0) {
      newErrors.countInStock = 'Count in stock must be 0 or greater';
    }

    if (formData.discount && (formData.discount < 0 || formData.discount > 100)) {
      newErrors.discount = 'Discount must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const uploadData = new FormData();

    // Append all form data
    Object.entries(formData).forEach(([key, val]) => {
      uploadData.append(key, val);
    });

    // Append image if selected
    if (imageFile) {
      uploadData.append('image', imageFile);
    }

    try {
      if (isEdit) {
        await API.put(`/products/${productId}`, uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage('Product updated successfully!');
        setMessageType('success');
      } else {
        await API.post('/products/add', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage('Product added successfully!');
        setMessageType('success');
      }

      // Redirect after a delay
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error saving product');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <Link
            to="/admin/dashboard"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
        </div>

        {/* Message */}
        {message && (
          <div className={`px-6 py-3 ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Product Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaTag className="inline mr-2" /> Product Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaInfoCircle className="inline mr-2" /> Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows="4"
                  className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                ></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    className={`w-full border ${errors.price ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaBoxOpen className="inline mr-2" /> Stock
                  </label>
                  <input
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleChange}
                    placeholder="0"
                    type="number"
                    min="0"
                    className={`w-full border ${errors.countInStock ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.countInStock && <p className="mt-1 text-sm text-red-600">{errors.countInStock}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaPercentage className="inline mr-2" /> Discount (%)
                  </label>
                  <input
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="0"
                    type="number"
                    min="0"
                    max="100"
                    className={`w-full border ${errors.discount ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.discount && <p className="mt-1 text-sm text-red-600">{errors.discount}</p>}
                </div>

                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer mt-6">
                    <input
                      type="checkbox"
                      name="iisNewCollection"
                      checked={formData.iisNewCollection}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">New Collection</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaUpload className="inline mr-2" /> Product Image
                </label>

                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="mb-3">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto h-32 w-32 object-cover rounded-md"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                          }}
                        />
                      </div>
                    ) : (
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}

                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span onClick={triggerFileInput}>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-900 mb-2">Product Preview</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-gray-500">Name:</span>
                  <span className="text-sm font-medium">{formData.name || 'Product Name'}</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-gray-500">Price:</span>
                  <span className="text-sm font-medium">${Number(formData.price || 0).toFixed(2)}</span>
                  {formData.discount > 0 && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {formData.discount}% OFF
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Stock:</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${Number(formData.countInStock) > 10 ? 'bg-green-100 text-green-800' : Number(formData.countInStock) > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {Number(formData.countInStock) > 0 ? formData.countInStock : 'Out of stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 border-t pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <FaSave className="mr-2" />
              {isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditProductPage;
