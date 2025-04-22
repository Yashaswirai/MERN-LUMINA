import { useNavigate } from 'react-router-dom';
import ShippingAddressForm from '../../components/ShippingAddressForm';
import CheckoutSteps from '../../components/CheckoutSteps';
import { useCheckout } from '../../context/CheckoutContext';

const ShippingPage = () => {
  const navigate = useNavigate();
  const { shippingAddress, saveShippingAddress } = useCheckout();

  const submitHandler = (formData) => {
    // Save shipping address using context
    saveShippingAddress(formData);

    // Navigate to payment method selection
    navigate('/payment');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps step1 step2 />
      <div className="max-w-md mx-auto">
        <ShippingAddressForm onSubmit={submitHandler} initialData={shippingAddress} />
      </div>
    </div>
  );
};

export default ShippingPage;
