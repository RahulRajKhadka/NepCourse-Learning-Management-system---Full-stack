import React, { useState } from "react";
import { IoEyeOutline, IoEyeOffSharp } from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import logo from "/public/logoo.png";
import { serverUrl } from "../App";

export const Login = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    // Validation
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting login with:", {
        email: email.trim().toLowerCase(),
      });

      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email: email.trim().toLowerCase(),
          password: password.trim(),
        },
        {
          withCredentials: true,
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login response:", result.data);

      // FIXED: Store the user data correctly based on your backend response
      const userData = result.data.user || result.data;
      dispatch(setUserData(userData));

      toast.success("Login successful!");

      // FIXED: Navigate based on user role or to dashboard
      if (userData.role === "educator") {
        navigate("/profile");
      } else if (userData.role === "student") {
        navigate("/profile");
      } else {
        navigate(""); // fallback
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);

      // FIXED: Better error handling
      if (error.code === "ECONNABORTED") {
        toast.error("Request timeout. Please try again.");
      } else if (error.response?.status === 404) {
        toast.error("User not found. Please check your email or sign up.");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid email or password");
      } else if (error.response?.status === 401) {
        toast.error(
          "Invalid credentials. Please check your email and password."
        );
      } else if (error.response?.status === 500) {
        console.error("Server error details:", error.response.data);
        toast.error("Server error. Please try again later.");
      } else if (!error.response) {
        toast.error(
          "Network error. Please check your connection and ensure the server is running."
        );
      } else {
        toast.error(
          error.response?.data?.message || "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoType) => {
    // FIXED: Use realistic demo credentials that might actually exist
    const demoCredentials = {
      student: {
        email: "student@demo.com",
        password: "password123",
      },
      educator: {
        email: "educator@demo.com",
        password: "password123",
      },
    };

    setEmail(demoCredentials[demoType].email);
    setPassword(demoCredentials[demoType].password);

    // Small delay to show the filled values, then auto-login
    setTimeout(() => {
      handleLogin();
    }, 500);
  };

  // FIXED: Handle form submission properly
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="bg-[#dddbdb] w-[100vw] min-h-[100vh] flex items-center justify-center p-4">
      <form
        className="w-full max-w-6xl bg-white shadow-xl rounded-2xl flex flex-col md:flex-row"
        onSubmit={handleFormSubmit}
      >
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col items-center justify-center gap-4">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
            <h2 className="text-gray-600">Log in to your account</h2>
          </div>

          {/* Email Input */}
          <div className="w-full max-w-md">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="w-full max-w-md relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type={show ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="current-password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 bottom-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShow(!show)}
              disabled={loading}
            >
              {show ? <IoEyeOffSharp size={20} /> : <IoEyeOutline size={20} />}
            </button>
          </div>

          {/* Demo Login Buttons */}
          <div className="w-full max-w-md flex gap-4 mt-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("student")}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
              disabled={loading}
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("educator")}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
              disabled={loading}
            >
              Demo Educator
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full max-w-md bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <ClipLoader color="#ffffff" size={20} className="mr-2" />
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>

          {/* Forgot Password */}
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:text-blue-800 text-sm underline mt-2"
          >
            Forgot Password?
          </Link>

          {/* Divider */}
          <div className="w-full max-w-md flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <p className="px-4 text-sm text-gray-500">Or continue with</p>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            className="flex items-center justify-center w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50"
            disabled={loading}
          >
            <img
              className="w-5 h-5 mr-3"
              src="https://www.google.com/favicon.ico"
              alt="Google logo"
            />
            <span className="text-gray-700 font-medium">
              Sign in with Google
            </span>
          </button>

          {/* Sign Up Link */}
          <div className="text-gray-600 text-sm mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Right side - Banner */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 rounded-r-2xl flex-col items-center justify-center gap-6 p-8">
          <img
            src={logo}
            alt="NEP Courses Logo"
            className="w-4/5 max-w-xs rounded-2xl shadow-2xl"
          />
          <h1 className="text-2xl font-bold text-white text-center">
            WELCOME TO NEPCOURSES
          </h1>
          <p className="text-blue-100 text-center">
            Your gateway to quality education and learning opportunities
          </p>
        </div>
      </form>
    </div>
  );
};
