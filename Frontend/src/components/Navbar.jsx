import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div className="space-x-4">
      <Link to="/shop" className="hover:underline">
        Shop
      </Link>
      {user ? (
        <>
          <Link to="/profile" className="hover:underline">
            My Account
          </Link>
          <Link to="/cart" className="hover:underline">
            Cart
          </Link>
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        </>
      ) : (
        <Link to="/" className="hover:underline">
          Login
        </Link>
      )}
    </div>
  );
};

export default Navbar;
