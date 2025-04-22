import { createContext, useState, useContext } from 'react';

export const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const [shippingAddress, setShippingAddress] = useState(
    localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {}
  );

  const [paymentMethod, setPaymentMethod] = useState(
    localStorage.getItem('paymentMethod')
      ? JSON.parse(localStorage.getItem('paymentMethod'))
      : 'Razorpay'
  );

  // Save shipping address
  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  // Save payment method
  const savePaymentMethod = (method) => {
    setPaymentMethod(method);
    localStorage.setItem('paymentMethod', JSON.stringify(method));
  };

  // Clear checkout data
  const clearCheckoutData = () => {
    setShippingAddress({});
    setPaymentMethod('Razorpay');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  };

  return (
    <CheckoutContext.Provider
      value={{
        shippingAddress,
        paymentMethod,
        saveShippingAddress,
        savePaymentMethod,
        clearCheckoutData,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

// Custom hook to use the checkout context
export const useCheckout = () => useContext(CheckoutContext);
