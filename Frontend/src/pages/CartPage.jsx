import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = async () => {
    try {
      const orderItems = cartItems.map(item => ({
        product: item._id,
        quantity: item.qty
      }));

      await API.post('/orders', { orderItems });
      clearCart();
      navigate('/profile');
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item._id} className="flex items-center justify-between border-b py-2">
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p>Qty: {item.qty}</p>
              </div>
              <button onClick={() => removeFromCart(item._id)} className="text-red-500">Remove</button>
            </div>
          ))}
          <div className="mt-4 font-bold">Total: ${total.toFixed(2)}</div>
          <button onClick={handleCheckout} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Place Order</button>
        </>
      )}
    </div>
  );
};

export default CartPage;
