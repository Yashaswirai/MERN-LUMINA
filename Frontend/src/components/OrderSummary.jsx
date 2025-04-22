import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { FaMoneyBillWave, FaShoppingBag } from 'react-icons/fa';
import { SiRazorpay } from 'react-icons/si';
import { loadRazorpayScript, getRazorpayKey, createRazorpayOrder, verifyRazorpayPayment } from '../utils/razorpay';
import API from '../utils/api';

const OrderSummary = ({ shippingAddress, paymentMethod, onPlaceOrder }) => {
  const { cartItems } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate prices
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping for orders over $100
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2)); // 15% tax
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError('');

      // Prepare order data
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          // Don't send the actual image data, just a placeholder
          image: 'image',
          price: item.price,
          product: item._id,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      if (paymentMethod === 'Razorpay') {
        // For Razorpay, we need to create the order first, then open the payment gateway
        await handleRazorpayPayment(orderData);
      } else {
        // For other payment methods (like Cash on Delivery), just place the order
        onPlaceOrder(orderData);
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message || 'An error occurred while placing your order');
      setLoading(false);
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async (orderData) => {
    try {
      // 1. Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // 2. Create order in our backend
      console.log('Creating order in backend...');
      const { data: createdOrder } = await API.post('/orders', orderData);
      console.log('Order created:', createdOrder);

      // 3. Get Razorpay key
      console.log('Getting Razorpay key...');
      const { key: razorpayKey } = await getRazorpayKey();

      // 4. Create Razorpay order
      console.log('Creating Razorpay order...');
      const razorpayOrder = await createRazorpayOrder(
        totalPrice,
        `receipt_order_${createdOrder._id}`,
        { orderId: createdOrder._id }
      );

      // 5. Configure Razorpay options
      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'LUMINA Store',
        description: `Payment for Order #${createdOrder._id}`,
        image: 'https://via.placeholder.com/150?text=LUMINA',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // Verify payment
            console.log('Verifying payment...', response);
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, createdOrder._id);

            // Call success callback with the created order
            onPlaceOrder(null, createdOrder);
          } catch (error) {
            console.error('Payment verification failed:', error);
            setError('Payment verification failed: ' + (error.message || 'Unknown error'));
            setLoading(false);
          }
        },
        prefill: {
          name: shippingAddress.name || '',
          email: '',
          contact: '',
        },
        notes: {
          address: shippingAddress.address || '',
          orderId: createdOrder._id
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            console.log('Razorpay checkout closed by user');
            setLoading(false);
          }
        }
      };

      // 6. Open Razorpay checkout
      const razorpay = new window.Razorpay(options);

      // Handle payment failures
      razorpay.on('payment.failed', function (response){
        console.error('Razorpay payment failed:', response.error);
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error('Razorpay payment error:', error);
      setError(error.message || 'Failed to initialize payment');
      setLoading(false);
      throw error;
    }
  };

  return (
    <div className="order-summary">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Shipping</h3>
        <p>
          {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Payment Method</h3>
        <div className="flex items-center">
          {paymentMethod === 'Razorpay' ? (
            <>
              <SiRazorpay className="text-blue-600 text-xl mr-2" />
              <span>Razorpay (Credit/Debit Card, UPI, Netbanking)</span>
            </>
          ) : paymentMethod === 'Cash On Delivery' ? (
            <>
              <FaMoneyBillWave className="text-green-600 text-xl mr-2" />
              <span>Cash On Delivery</span>
            </>
          ) : (
            <span>{paymentMethod}</span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Order Items</h3>
        <div className="space-y-2">
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between">
              <div>
                <span className="font-medium">{item.name}</span> x {item.qty}
              </div>
              <div>${(item.price * item.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <div>Items:</div>
          <div>${itemsPrice.toFixed(2)}</div>
        </div>
        <div className="flex justify-between mb-2">
          <div>Shipping:</div>
          <div>${shippingPrice.toFixed(2)}</div>
        </div>
        <div className="flex justify-between mb-2">
          <div>Tax:</div>
          <div>${taxPrice.toFixed(2)}</div>
        </div>
        <div className="flex justify-between font-bold">
          <div>Total:</div>
          <div>${totalPrice}</div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-md mt-6 flex items-center justify-center font-medium ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
      >
        {loading ? (
          'Processing...'
        ) : (
          <>
            {paymentMethod === 'Razorpay' ? (
              <>
                <SiRazorpay className="mr-2 text-xl" />
                Place Order & Pay with Razorpay
              </>
            ) : (
              <>
                <FaShoppingBag className="mr-2" />
                Place Order
              </>
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default OrderSummary;
