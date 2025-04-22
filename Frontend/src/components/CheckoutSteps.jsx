import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center">
        {/* Step 1: Sign In */}
        <div className={`flex items-center ${step1 ? 'text-blue-600' : 'text-gray-400'}`}>
          {step1 ? (
            <Link to="/" className="font-medium">Sign In</Link>
          ) : (
            <span className="font-medium">Sign In</span>
          )}
        </div>

        {/* Divider */}
        <div className="mx-3 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Step 2: Shipping */}
        <div className={`flex items-center ${step2 ? 'text-blue-600' : 'text-gray-400'}`}>
          {step2 ? (
            <Link to="/shipping" className="font-medium">Shipping</Link>
          ) : (
            <span className="font-medium">Shipping</span>
          )}
        </div>

        {/* Divider */}
        <div className="mx-3 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Step 3: Payment */}
        <div className={`flex items-center ${step3 ? 'text-blue-600' : 'text-gray-400'}`}>
          {step3 ? (
            <Link to="/payment" className="font-medium">Payment</Link>
          ) : (
            <span className="font-medium">Payment</span>
          )}
        </div>

        {/* Divider */}
        <div className="mx-3 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Step 4: Place Order */}
        <div className={`flex items-center ${step4 ? 'text-blue-600' : 'text-gray-400'}`}>
          {step4 ? (
            <Link to="/placeorder" className="font-medium">Place Order</Link>
          ) : (
            <span className="font-medium">Place Order</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;
