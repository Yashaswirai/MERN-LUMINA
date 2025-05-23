import { useState, useEffect } from 'react';
import { loadRazorpayScript, getRazorpayKey, createRazorpayOrder, verifyRazorpayPayment } from '../services/razorpay';
import { SiRazorpay } from 'react-icons/si';

const RazorpayPayment = ({ order, onSuccess, onError }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initializeRazorpay = async () => {
      try {
        setLoading(true);
        const isLoaded = await loadRazorpayScript();

        if (!isLoaded) {
          setError('Razorpay SDK failed to load. Please check your internet connection.');
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (error) {
        setError('Failed to load Razorpay SDK');
        setLoading(false);
      }
    };

    initializeRazorpay();
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);
      // Get Razorpay key
      const { key: razorpayKey } = await getRazorpayKey();

      // Create Razorpay order
      const razorpayOrder = await createRazorpayOrder(
        order.totalPrice,
        `receipt_order_${order._id}`,
        { orderId: order._id }
      );

      // Configure Razorpay options
      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'LUMINA Store',
        description: `Payment for Order #${order._id}`,
        image: 'https://via.placeholder.com/150?text=LUMINA',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // Verify payment
            const data = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, order._id);

            // Call success callback
            if (onSuccess) {
              onSuccess(data);
            }
          } catch (error) {
            setError('Payment verification failed: ' + (error.message || 'Unknown error'));
            if (onError) {
              onError(error);
            }
          }
        },
        prefill: {
          name: order.user?.name || '',
          email: order.user?.email || '',
          contact: '',  // Add phone number if available
        },
        notes: {
          address: order.shippingAddress?.address || '',
          orderId: order._id
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      // Check if window.Razorpay exists
      if (!window.Razorpay) {
        setError('Razorpay SDK not loaded properly. Please refresh the page and try again.');
        setLoading(false);
        return;
      }

      // Create Razorpay instance and open checkout
      const razorpay = new window.Razorpay(options);

      // Handle payment failures
      razorpay.on('payment.failed', function (response){
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
        if (onError) {
          onError(response.error);
        }
      });

      // Open Razorpay checkout
      razorpay.open();
      setLoading(false);
    } catch (error) {
      setError('Payment initialization failed: ' + (error.message || 'Unknown error'));
      setLoading(false);
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <div className="razorpay-payment">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? (
          'Processing...'
        ) : (
          <>
            <SiRazorpay className="mr-2 text-xl" />
            Pay with Razorpay
          </>
        )}
      </button>
    </div>
  );
};

export default RazorpayPayment;
