import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { totalItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const adminMenuRef = useRef(null);

  // Close admin menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setAdminMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    clearCart(); // Clear the cart when logging out
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-white">
          LUMINA
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/shop" className="hover:text-gray-300">
            Shop
          </Link>

          {user ? (
            <>
              {user.isAdmin ? (
                <div className="relative" ref={adminMenuRef}>
                  <button
                    className="hover:text-gray-300 flex items-center"
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  >
                    Admin
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {adminMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/orders"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      <Link
                        to="/admin/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setAdminMenuOpen(false)}
                      >
                        Profile
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/profile" className="hover:text-gray-300">
                  My Account
                </Link>
              )}

              <button onClick={handleLogout} className="hover:text-gray-300">
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="hover:text-gray-300">
              Login / Register
            </Link>
          )}

          {/* Only show cart icon when user is logged in */}
          {user && (
            <Link to="/cart" className="relative hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
