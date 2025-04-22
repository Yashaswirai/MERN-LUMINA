import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Navigate to shipping page
    navigate('/shipping');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="mb-4">Your cart is empty</p>
          <Link to="/shop" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {cartItems.map(item => (
              <div key={item._id} className="flex flex-col md:flex-row items-start md:items-center justify-between border-b py-4">
                <div className="flex items-center mb-2 md:mb-0">
                  <div className="w-16 h-16 flex-shrink-0 mr-4 bg-gray-200 rounded">
                    {item.image && (
                      <img
                        src={`/api/products/${item._id}/image`}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div>
                    <Link to={`/product/${item._id}`} className="font-semibold hover:text-blue-600">
                      {item.name}
                    </Link>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center mr-4">
                    <button
                      onClick={() => updateQuantity(item._id, item.qty - 1)}
                      className="px-2 py-1 border rounded-l"
                      disabled={item.qty <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-t border-b">{item.qty}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.qty + 1)}
                      className="px-2 py-1 border rounded-r"
                      disabled={item.qty >= item.countInStock}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border rounded-lg p-4 h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <div>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</div>
                <div>${totalPrice.toFixed(2)}</div>
              </div>

              <div className="flex justify-between font-bold border-t pt-2">
                <div>Total:</div>
                <div>${totalPrice.toFixed(2)}</div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
