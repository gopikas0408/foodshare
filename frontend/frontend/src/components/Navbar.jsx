import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container">
        {/* LOGO */}
        <Link className="navbar-brand fw-bold text-success" to="/">
          💚 FoodShare
        </Link>

        {/* HAMBURGER */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENU */}
        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3 mt-3 mt-lg-0">

            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-clean" to="/dashboard" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link nav-clean" to="/browse" onClick={() => setOpen(false)}>
                    Browse
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link nav-clean" to="/incoming-requests" onClick={() => setOpen(false)}>
                    Requests
                  </Link>
                </li>

                <li className="nav-item mt-2 mt-lg-0">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link
                  className="btn btn-success btn-sm px-4"
                  to="/login"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;