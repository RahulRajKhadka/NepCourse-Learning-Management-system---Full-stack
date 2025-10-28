import React, { useState, useEffect } from "react";
import { IoEyeOutline, IoEyeOffSharp } from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import logo from "/public/logoo.png";
import { serverUrl } from "../App";
import { auth, provider } from "../../utils/firebase.js";
import { signInWithPopup } from "firebase/auth";

export const Login = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const dispatch = useDispatch();

  // Add this to debug Redux state
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    console.log("Login component - Current userData:", userData);
    // If already logged in, redirect to home
    if (userData && Object.keys(userData).length > 0) {
      navigate("/");
    }
  }, [userData, navigate]);
  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    console.log("=== LOGIN ATTEMPT STARTED ===");
    console.log("Email:", email);
    console.log("Password length:", password.length);

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
      const loginData = {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      };

      console.log("Sending login request to:", `${serverUrl}/api/auth/login`);
      console.log("With data:", {
        email: loginData.email,
        passwordLength: loginData.password.length,
      });

      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        loginData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("=== LOGIN SUCCESS ===");
      console.log("Full response:", result);
      console.log("Response data:", result.data);
      console.log("User data:", result.data.user);

      if (result.data.user) {
        console.log("Dispatching user data to Redux:", result.data.user);
        dispatch(setUserData(result.data.user));

        toast.success(result.data.message || "Login successful!");
        console.log("Navigating to home...");
        navigate("/");
      } else {
        console.error("No user data in response!");
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("=== LOGIN FAILED ===");
      console.error("Error object:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      console.error("Error status:", error.response?.status);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data;

        console.error(`Error ${status}:`, message);

        switch (status) {
          case 400:
            toast.error(message || "Invalid email or password");
            break;
          case 404:
            toast.error("User not found. Please sign up first.");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            console.error("Server error details:", error.response.data);
            break;
          default:
            toast.error(message || "Login failed. Please try again.");
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Network error. Please check your connection.");
      } else {
        console.error("Request setup error:", error.message);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
      console.log("=== LOGIN ATTEMPT ENDED ===");
    }
  };

  // ✅ ADD THIS NEW GOOGLE SIGN-IN FUNCTION
  const googleSignIn = async () => {
    console.log("🔵 Google Sign-In button CLICKED!");

    if (googleLoading) {
      console.log("⚠️ Already loading, exiting...");
      return;
    }

    try {
      setGoogleLoading(true);
      console.log("✅ Set googleLoading to true");
      console.log("🔵 Starting Google Sign-In...");

      console.log("🔵 Opening Firebase popup...");
      const response = await signInWithPopup(auth, provider);
      console.log("✅ Firebase popup completed!");

      const user = response.user;
      console.log("✅ Firebase user received:", {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      });

      const requestData = {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        role: "student", // Default role for login
      };
      console.log("🔵 Sending to backend:", requestData);

      const result = await axios.post(
        serverUrl + "/api/auth/googleauth",
        requestData,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      console.log("✅ Backend response received:", result.data);

      if (result.data.success && result.data.user) {
        console.log("✅ Authentication successful!");

        dispatch(setUserData(result.data.user));
        toast.success(result.data.message || "Google Sign-In Successful");

        console.log("✅ Navigating to home...");
        navigate("/");
      } else {
        console.error("❌ Backend returned success:false");
        throw new Error(result.data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("❌ Google Sign-In Error:", error);

      if (error.response) {
        console.error("❌ Backend error response:", error.response.data);
        toast.error(error.response.data.message || "Google Sign-In failed");
      } else if (error.code === "auth/cancelled-popup-request") {
        console.log("⚠️ Popup request cancelled");
      } else if (error.code === "auth/popup-closed-by-user") {
        console.log("⚠️ User closed the popup");
        toast.info("Sign-in was cancelled");
      } else if (error.code === "auth/popup-blocked") {
        console.error("❌ Popup was blocked");
        toast.error("Popup was blocked. Please allow popups for this site.");
      } else if (error.code === "auth/unauthorized-domain") {
        console.error("❌ Domain not authorized");
        toast.error("This domain is not authorized. Please contact support.");
      } else {
        console.error("❌ Unknown error");
        toast.error(error.message || "Google Sign-In failed");
      }
    } finally {
      console.log("🔵 Setting googleLoading to false");
      setGoogleLoading(false);
    }
  };

  const handleDemoLogin = async (demoType) => {
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

    setTimeout(() => {
      handleLogin();
    }, 500);
  };

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
              disabled={loading || googleLoading}
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
              disabled={loading || googleLoading}
            />
            <button
              type="button"
              className="absolute right-3 bottom-2 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setShow(!show)}
              disabled={loading || googleLoading}
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
              disabled={loading || googleLoading}
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("educator")}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
              disabled={loading || googleLoading}
            >
              Demo Educator
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full max-w-md bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            disabled={loading || googleLoading}
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

          <Link
            to="/forgot-password"
            className="text-blue-600 hover:text-blue-800 text-sm underline mt-2"
          >
            Forgot Password?
          </Link>

          <div className="w-full max-w-md flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <p className="px-4 text-sm text-gray-500">Or continue with</p>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* ✅ FIXED GOOGLE SIGN-IN BUTTON WITH onClick HANDLER */}
          <button
            type="button"
            className="flex items-center justify-center w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer"
            disabled={loading || googleLoading}
            onClick={googleSignIn}
            style={{
              cursor: loading || googleLoading ? "not-allowed" : "pointer",
            }}
          >
            {googleLoading ? (
              <>
                <ClipLoader color="#4285f4" size={18} className="mr-3" />
                <span className="text-gray-700 font-medium">Signing in...</span>
              </>
            ) : (
              <>
                <img
                  className="w-5 h-5 mr-3"
                  src="https://www.google.com/favicon.ico"
                  alt="Google logo"
                />
                <span className="text-gray-700 font-medium">
                  Sign in with Google
                </span>
              </>
            )}
          </button>

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

        {/* Right side - Branding */}
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
