import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';
import CheckoutSteps from '../components/CheckoutSteps';
import OrderSummary from '../components/OrderSummary';
import API from '../utils/api';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(CartContext);
  const { shippingAddress, paymentMethod, clearCheckoutData } = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if cart is empty
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    // If no shipping address, redirect to shipping page
    if (!shippingAddress || Object.keys(shippingAddress).length === 0) {
      navigate('/shipping');
      return;
    }

    // If no payment method, redirect to payment page
    if (!paymentMethod) {
      navigate('/payment');
      return;
    }
  }, [navigate, cartItems, shippingAddress, paymentMethod]);

  const placeOrderHandler = async (orderData, createdOrder = null) => {
    try {
      setLoading(true);
      setError('');

      // If we already have a created order (from Razorpay flow), use that
      // Otherwise, create a new order
      let orderResponse = createdOrder;
      if (!orderResponse) {
        const { data } = await API.post('/orders', orderData);
        orderResponse = data;
      }

      // Clear cart and checkout data after successful order
      clearCart();
      clearCheckoutData();

      // Redirect to order details page
      navigate(`/order/${orderResponse._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while placing your order.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps step1 step2 step3 step4 />

      <div className="max-w-3xl mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <OrderSummary
            shippingAddress={shippingAddress}
            paymentMethod={paymentMethod}
            onPlaceOrder={placeOrderHandler}
          />
        )}
      </div>
    </div>
  );
};

export default PlaceOrderPage;
