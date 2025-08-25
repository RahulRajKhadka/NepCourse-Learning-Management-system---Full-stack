import React, { useState, useEffect } from "react";
import logo from "/public/logoo.png";
import { HiMenu, HiX } from "react-icons/hi";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { clearUserData } from "../redux/userSlice.jsx";

function Nav() {
  const userData = useSelector((state) => state.user.userData);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Enhanced debugging
  useEffect(() => {
    console.log("=== NAV COMPONENT DEBUG ===");
    console.log("userData:", userData);
    console.log("userData type:", typeof userData);
    console.log("userData is null:", userData === null);
    console.log("userData is undefined:", userData === undefined);
    console.log("userData keys:", userData ? Object.keys(userData) : 'No keys');
    console.log("userData length:", userData && typeof userData === 'object' ? Object.keys(userData).length : 'Not an object');
    console.log("Is user logged in?", !!(userData && Object.keys(userData).length > 0));
    console.log("==========================");
  }, [userData]);


const handleLogout = async () => {
  try {
    const result = await axios.get(`${serverUrl}/api/auth/logout`, {
      withCredentials: true,
    });

    dispatch(clearUserData()); // ✅ clears Redux + localStorage

    toast.success(result.data.message || "Logout successful");
    navigate("/");
  } catch (err) {
    console.error("Logout error:", err);
    toast.error(err.response?.data?.message || "Logout failed");
  }
};

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  // More robust user check
  const isUserLoggedIn = userData && 
                        userData !== null && 
                        typeof userData === 'object' && 
                        Object.keys(userData).length > 0;

  console.log("Final isUserLoggedIn:", isUserLoggedIn);

  return (
    <nav className="w-full fixed top-0 left-0 bg-gradient-to-r from-black via-blue-800 to-blue-500 z-10 px-5 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="rounded-[5px] border-2 border-white w-[50px] md:w-[60px] cursor-pointer"
            onClick={() => handleNavigation("/")}
          />
        </div>

        {/* Debug Info - Remove in production */}
        <div className="hidden lg:block bg-white/20 text-white text-xs p-2 rounded">
          User: {isUserLoggedIn ? "Logged In" : "Not Logged In"}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {isUserLoggedIn ? (
            <>
              {/* User Menu */}
              <div
                className="relative group"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="w-[45px] h-[45px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer">
                  {userData?.name?.charAt(0)?.toUpperCase() ||
                    userData?.email?.charAt(0)?.toUpperCase() ||
                    userData?.username?.charAt(0)?.toUpperCase() ||
                    "U"}
                </div>

                {/* Dropdown */}
                <div
                  className={`absolute top-full mt-1 right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 transform transition-all duration-300 z-50 ${
                    dropdownOpen
                      ? "opacity-100 translate-y-0 visible"
                      : "opacity-0 translate-y-2 invisible"
                  }`}
                >
                  <button
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => handleNavigation("/profile")}
                  >
                    My Profile
                  </button>

                  <button 
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => handleNavigation("/courses")}
                  >
                    My Courses
                  </button>
                  
                  {(userData?.role === "educator" || userData?.role === "teacher") && (
                    <button 
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => handleNavigation("/dashboard")}
                    >
                      Dashboard
                    </button>
                  )}
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  
                  <button
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Login Button */}
              <button
                className="px-4 py-2 border-2 border-white text-white 
                bg-gradient-to-r from-black via-blue-800 to-blue-500 
                hover:from-blue-500 hover:to-black transition-all duration-300 
                rounded-[10px] text-[16px] font-light"
                onClick={() => handleNavigation("/login")}
              >
                Login
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden flex items-center">
          {menuOpen ? (
            <HiX
              className="w-[30px] h-[30px] text-white cursor-pointer"
              onClick={() => setMenuOpen(false)}
            />
          ) : (
            <HiMenu
              className="w-[30px] h-[30px] text-white cursor-pointer"
              onClick={() => setMenuOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 bg-black/80 p-4 rounded-lg">
          {isUserLoggedIn ? (
            <>
              {/* User Info */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-[45px] h-[45px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white">
                  {userData?.name?.charAt(0)?.toUpperCase() ||
                    userData?.email?.charAt(0)?.toUpperCase() ||
                    userData?.username?.charAt(0)?.toUpperCase() ||
                    "U"}
                </div>
                <div className="text-white">
                  <p className="text-sm font-medium">
                    {userData?.name || userData?.username || "User"}
                  </p>
                  <p className="text-xs text-gray-300">
                    {userData?.email}
                  </p>
                </div>
              </div>

              <button
                className="px-4 py-2 border-2 border-white text-white rounded-[10px] text-[16px] font-light hover:bg-white hover:text-black transition-all duration-200"
                onClick={() => handleNavigation("/profile")}
              >
                My Profile
              </button>

              <button 
                className="px-4 py-2 border-2 border-white text-white rounded-[10px] text-[16px] font-light hover:bg-white hover:text-black transition-all duration-200"
                onClick={() => handleNavigation("/courses")}
              >
                My Courses
              </button>
              
              {(userData?.role === "educator" || userData?.role === "teacher") && (
                <button 
                  className="px-4 py-2 border-2 border-white text-white rounded-[10px] text-[16px] font-light hover:bg-white hover:text-black transition-all duration-200"
                  onClick={() => handleNavigation("/dashboard")}
                >
                  Dashboard
                </button>
              )}

              <button
                className="px-4 py-2 border-2 border-red-400 text-red-400 rounded-[10px] text-[16px] font-light hover:bg-red-400 hover:text-white transition-all duration-200"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="px-4 py-2 border-2 border-white text-white rounded-[10px] text-[16px] font-light hover:bg-white hover:text-black transition-all duration-200"
              onClick={() => handleNavigation("/login")}
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Nav;