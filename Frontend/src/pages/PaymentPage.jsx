import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import CheckoutSteps from '../components/CheckoutSteps';
import { useCheckout } from '../context/CheckoutContext';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { shippingAddress, paymentMethod, savePaymentMethod } = useCheckout();

  useEffect(() => {
    // If no shipping address, redirect to shipping page
    if (!shippingAddress || Object.keys(shippingAddress).length === 0) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (method) => {
    // Save payment method using context
    savePaymentMethod(method);

    // Navigate to place order page
    navigate('/placeorder');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps step1 step2 step3 />
      <div className="max-w-md mx-auto">
        <PaymentMethodSelector onSubmit={submitHandler} initialMethod={paymentMethod} />
      </div>
    </div>
  );
};

export default PaymentPage;
