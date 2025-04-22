import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import API from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaArrowLeft, FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar, FaCheck, FaTimes, FaShippingFast, FaBox, FaHeart, FaShare } from 'react-icons/fa';

const ProductDetailPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart, cartItems } = useContext(CartContext);
  const { showSuccess, showError, showInfo } = useToast();

  // Check if product is already in cart
  const isInCart = () => {
    return cartItems.some(item => item._id === productId);
  };

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${productId}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!user) {
      showError('Please login to add items to your cart');
      navigate('/');
      return;
    }

    if (product && quantity > 0) {
      if (isInCart()) {
        showInfo('This product is already in your cart. You can adjust the quantity there.');
        return;
      }

      addToCart({
        ...product,
        qty: quantity
      });
      setAddedToCart(true);
      showSuccess(`${product.name} added to your cart!`);

      // Reset after 3 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      showError('Please login to purchase items');
      navigate('/');
      return;
    }

    if (product && quantity > 0) {
      addToCart({
        ...product,
        qty: quantity
      });
      navigate('/cart');
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <LoadingSpinner size="large" color="blue" />
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Product not found
        </div>
        <button
          onClick={() => navigate('/shop')}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-blue-600">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-96 bg-gray-100 flex items-center justify-center">
              {product.image ? (
                <img
                  src={`/api/products/${product._id}/image`}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                />
              ) : (
                <div className="text-gray-400">No image available</div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              {product.iisNewCollection && (
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                  New Collection
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex mr-2">
                  {renderRatingStars(4.5)} {/* Placeholder rating */}
                </div>
                <span className="text-gray-500 text-sm">(24 reviews)</span>
              </div>
            </div>

            <div className="flex items-center">
              <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-lg text-gray-500 line-through ml-2">
                    ${(product.price * (1 + product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="ml-2 bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-700">{product.description}</p>

            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.countInStock > 0 ? (
                  <>
                    <FaCheck className="mr-1" /> In Stock
                  </>
                ) : (
                  <>
                    <FaTimes className="mr-1" /> Out of Stock
                  </>
                )}
              </div>

              {product.countInStock > 0 && (
                <div className="text-gray-600">
                  <FaBox className="inline mr-1" /> {product.countInStock} units available
                </div>
              )}
            </div>

            {product.countInStock > 0 && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 border-r"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                    className="px-3 py-1 border-l"
                    disabled={quantity >= product.countInStock}
                  >
                    +
                  </button>
                </div>

                <div className="flex space-x-3">
                  {user ? (
                    <>
                      <button
                        onClick={handleAddToCart}
                        disabled={addedToCart}
                        className={`flex items-center px-4 py-2 rounded-md ${
                          addedToCart
                            ? 'bg-green-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        } transition-colors duration-200`}
                      >
                        <FaShoppingCart className="mr-2" />
                        {addedToCart ? 'Added!' : 'Add to Cart'}
                      </button>

                      <button
                        onClick={handleBuyNow}
                        className="flex items-center px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200"
                      >
                        Buy Now
                      </button>

                      <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200">
                        <FaHeart className="text-red-400" />
                      </button>

                      <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200">
                        <FaShare className="text-blue-400" />
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/"
                      className="flex items-center px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                    >
                      <FaShoppingCart className="mr-2" /> Login to Buy
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center text-gray-600">
                <FaShippingFast className="mr-2" /> Free shipping on orders over $100
              </div>
              <div className="flex items-center text-gray-600">
                <FaBox className="mr-2" /> 30-day return policy
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="border-b">
            <div className="px-6 py-3 border-b-2 border-blue-600 inline-block font-medium text-blue-600">
              Product Details
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-gray-700 mb-6">{product.description}</p>

            <h3 className="text-lg font-semibold mb-3">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-b pb-2">
                <span className="text-gray-500">Category:</span> <span className="font-medium">Clothing</span>
              </div>
              <div className="border-b pb-2">
                <span className="text-gray-500">Brand:</span> <span className="font-medium">LUMINA</span>
              </div>
              <div className="border-b pb-2">
                <span className="text-gray-500">Material:</span> <span className="font-medium">Premium</span>
              </div>
              <div className="border-b pb-2">
                <span className="text-gray-500">Style:</span> <span className="font-medium">Modern</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Placeholder */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* This would be populated with actual related products */}
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center text-gray-400">
              Related Product 1
            </div>
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center text-gray-400">
              Related Product 2
            </div>
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center text-gray-400">
              Related Product 3
            </div>
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center text-gray-400">
              Related Product 4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
