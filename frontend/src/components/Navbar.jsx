import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ token, setToken }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null); // 👈 state reset
    navigate("/login");
  };

  let isAdmin = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      isAdmin = payload.role === "admin";
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      setToken(null);
      navigate("/login");
    }
  }

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo + Title */}
          <div className="flex items-center">
            <img
              src="/images/jiet-logo.png"
              alt="JIET Logo"
              className="h-10 w-10 mr-2 rounded-full shadow-md"
            />
            <h1 className="text-lg md:text-xl font-bold tracking-wide">
            Student Council Election
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="hover:bg-indigo-700 px-3 py-2 rounded-md transition"
            >
              Home
            </Link>

            {token && (
              <Link
                to={isAdmin ? "/admin-dashboard" : "/dashboard"}
                className="hover:bg-indigo-700 px-3 py-2 rounded-md transition"
              >
                {isAdmin ? "Admin Dashboard" : "Student Dashboard"}
              </Link>
            )}

            {token ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md transition font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:bg-indigo-700 px-3 py-2 rounded-md transition"
                >
                Login
                </Link>
                <Link
                  to="/signup"
                  className="hover:bg-green-700 px-3 py-2 rounded-md transition"
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-indigo-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block hover:bg-indigo-600 px-3 py-2 rounded-md"
            >
              Home
            </Link>

            {token && (
              <Link
                to={isAdmin ? "/admin-dashboard" : "/dashboard"}
                className="block hover:bg-indigo-600 px-3 py-2 rounded-md"
              >
                {isAdmin ? "Admin Dashboard" : "Student Dashboard"}
              </Link>
            )}

            {token ? (
              <button
                onClick={handleLogout}
                className="w-full text-left bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block hover:bg-indigo-600 px-3 py-2 rounded-md"
                >
                  Admin / Student Login
                </Link>
                <Link
                  to="/signup"
                  className="block hover:bg-green-600 px-3 py-2 rounded-md"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
