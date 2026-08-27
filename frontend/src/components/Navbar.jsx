import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { resetAllCodeNest } from "../redux/Slice";
import { Sun, Moon, LogOut, LogIn, User } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    dispatch(logoutUser());
    dispatch(resetAllCodeNest());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <nav
      className={`w-full border-b transition-colors duration-300 ${
        isDarkMode
          ? "border-gray-800 bg-black text-white"
          : "border-gray-200 bg-white text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between w-full relative">
        {/* Brand Logo */}
        <div className="font-bold text-xl sm:text-2xl md:text-3xl flex items-center shrink-0">
          <Link
            to={isAuthenticated ? "/" : "/login"}
            className="hover:opacity-90 transition tracking-tight"
          >
            CodeNest
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-5">
          {/* Nav Links: Only visible when Logged In */}
          {isAuthenticated && (
            <div className="flex gap-2.5 sm:gap-5 font-semibold items-center text-xs sm:text-base mr-0.5 sm:mr-2">
              <Link to="/" className="hover:opacity-80 transition font-bold">
                Home
              </Link>
              <Link
                to="/codenest"
                className="hover:opacity-80 transition font-bold"
              >
                Snippets
              </Link>
            </div>
          )}

          {/* User Auth Section */}
          {isAuthenticated && user ? (
            /* Avatar Button & Dropdown Menu */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-linear-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md hover:ring-2 hover:ring-emerald-400 transition cursor-pointer select-none`}
                title={user.name}
              >
                {getInitials(user.name)}
              </button>

              {/* Avatar Dropdown Popover */}
              {isDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2.5 w-64 border-2 rounded-2xl p-4 shadow-2xl z-50 transition-colors duration-200 ${
                    isDarkMode
                      ? "border-gray-800 bg-gray-950 text-white shadow-black/80"
                      : "border-gray-200 bg-white text-gray-900 shadow-gray-400/30"
                  }`}
                >
                  {/* User Profile Info */}
                  <div
                    className={`flex items-center gap-3 pb-3 border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {getInitials(user.name)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm truncate">
                        {user.name}
                      </span>
                      <span
                        className={`text-xs truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {user.email}
                      </span>
                    </div>
                  </div>

                  {/* Actions / Logout */}
                  <div className="pt-2">
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-xl transition cursor-pointer ${
                        isDarkMode
                          ? "text-red-400 hover:bg-red-500/10"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out Actions: Login & Sign Up Buttons */
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <Link
                to="/login"
                className={`px-3 sm:px-4 py-1.5 sm:py-2 border rounded-xl transition shadow-sm flex items-center gap-1.5 ${
                  isDarkMode
                    ? "border-gray-800 bg-black text-gray-200 hover:bg-white hover:text-black"
                    : "border-gray-300 bg-white text-gray-800 hover:bg-black hover:text-white"
                }`}
              >
                <LogIn size={15} />
                <span>Login</span>
              </Link>
              <Link
                to="/signup"
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition shadow-sm font-bold ${
                  isDarkMode
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 sm:p-2.5 border rounded-xl flex items-center justify-center transition shadow-sm cursor-pointer ${
              isDarkMode
                ? "border-gray-800 bg-gray-900 text-yellow-400 hover:bg-gray-800"
                : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
