import { Routes, Route, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

// Layout Components
import Navbar from "./components/layout/Navbar";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Auth Pages
import LoginRegisterPage from "./pages/auth/LoginRegisterPage";

// Product Pages
import ShopPage from "./pages/product/ShopPage";
import ProductDetailPage from "./pages/product/ProductDetailPage";

// User Pages
import ProfilePage from "./pages/user/ProfilePage";

// Cart & Checkout Pages
import CartPage from "./pages/cart/CartPage";
import ShippingPage from "./pages/cart/ShippingPage";
import PaymentPage from "./pages/cart/PaymentPage";
import PlaceOrderPage from "./pages/order/PlaceOrderPage";
import OrderPage from "./pages/order/OrderPage";

// Admin Pages
import AdminProfilePage from "./components/AdminProfilePage";
import AdminOrderManagementPage from "./components/AdminOrderDashboard";
import DashboardPage from "./pages/admin/DashboardPage";
import AddEditProductPage from "./components/AddEditProductPage";

// Route Guards
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

const App = () => {
  const { loading } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [appReady, setAppReady] = useState(false);
  const location = useLocation();

  // Effect to handle initial app loading
  useEffect(() => {
    // Set a timeout to ensure app is ready after initial auth check
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 300); // Slightly longer delay to ensure everything is loaded

    return () => clearTimeout(timer);
  }, []);

  // Effect to track route changes
  useEffect(() => {
    // Reset scroll position on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Show loading spinner during initial load
  if (loading || !appReady) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginRegisterPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />

        {/* Protected User Routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/shipping"
          element={
            <PrivateRoute>
              <ShippingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <PaymentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/placeorder"
          element={
            <PrivateRoute>
              <PlaceOrderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <PrivateRoute>
              <OrderPage />
            </PrivateRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminProfilePage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrderManagementPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <DashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <AddEditProductPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit-product/:productId"
          element={
            <AdminRoute>
              <AddEditProductPage />
            </AdminRoute>
          }
        />

        {/* 404 fallback route */}
        <Route
          path="*"
          element={
            <div className="p-6 text-center text-red-500 font-bold">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </>
  );
};

export default App;
