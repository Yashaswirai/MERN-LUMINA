import { useState } from 'react';
import { FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import { SiRazorpay } from 'react-icons/si';

const PaymentMethodSelector = ({ onSubmit, initialMethod = 'Razorpay' }) => {
  const [paymentMethod, setPaymentMethod] = useState(initialMethod);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(paymentMethod);
  };

  return (
    <div className="payment-method-selector">
      <h2 className="text-xl font-bold mb-4">Payment Method</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className={`border rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer
                        ${paymentMethod === 'Razorpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <div className="flex items-center">
              <input
                id="razorpay"
                name="paymentMethod"
                type="radio"
                value="Razorpay"
                checked={paymentMethod === 'Razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="razorpay" className="ml-2 flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                <SiRazorpay className="text-blue-600 text-xl mr-2" /> Razorpay
              </label>
            </div>
            <p className="mt-2 ml-6 text-xs text-gray-500">Pay securely using Razorpay. Supports credit/debit cards, UPI, and more.</p>
          </div>

          <div className={`border rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer
                        ${paymentMethod === 'Cash On Delivery' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <div className="flex items-center">
              <input
                id="cash-on-delivery"
                name="paymentMethod"
                type="radio"
                value="Cash On Delivery"
                checked={paymentMethod === 'Cash On Delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-blue-600 border-gray-300"
              />
              <label htmlFor="cash-on-delivery" className="ml-2 flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                <FaMoneyBillWave className="text-green-600 text-xl mr-2" /> Cash On Delivery
              </label>
            </div>
            <p className="mt-2 ml-6 text-xs text-gray-500">Pay with cash when your order is delivered.</p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium flex items-center justify-center"
        >
          <FaCreditCard className="mr-2" /> Continue to Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentMethodSelector;
