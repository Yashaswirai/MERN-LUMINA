import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
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
