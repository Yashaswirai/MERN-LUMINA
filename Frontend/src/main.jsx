import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx';
import { CheckoutProvider } from './context/CheckoutContext.jsx';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <CartProvider>
      <CheckoutProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CheckoutProvider>
    </CartProvider>
  </AuthProvider>
)
