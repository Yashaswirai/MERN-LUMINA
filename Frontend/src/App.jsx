import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderPage from "./pages/OrderPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AdminProfilePage from "./components/AdminProfilePage";
import AdminOrderManagementPage from "./components/AdminOrderDashboard";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboardPage from "./components/AdminDashboardPage";
import AddEditProductPage from "./components/AddEditProductPage";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<HomePage />} />
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
              <AdminDashboardPage />
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
