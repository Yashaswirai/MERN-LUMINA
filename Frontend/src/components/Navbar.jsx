import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="space-x-4 p-4 bg-gray-100 shadow-md">
      <Link to="/shop" className="font-bold text-xl text-indigo-600">
        LUMINA
      </Link>

      {user ? (
        <>
          {user.isAdmin ? (
            <>
              <Link to="/admin/profile" className="hover:underline">
                Admin Profile
              </Link>
              <Link to="/admin/orders" className="hover:underline">
                Orders
              </Link>
              <Link to="/admin/dashboard" className="hover:underline">
                Admin Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="hover:underline">
                My Account
              </Link>
              <Link to="/cart" className="hover:underline">
                Cart
              </Link>
            </>
          )}
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        </>
      ) : (
        <>
        </>
      )}
    </div>
  );
};

export default Navbar;
