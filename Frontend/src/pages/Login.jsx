import React, { useState, useEffect } from "react";
import { IoEyeOutline, IoEyeOffSharp } from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import logo from "/public/logoo.png";
import { serverUrl } from "../config.js";
import { auth, provider } from "../../utils/firebase.js";
import { signInWithPopup } from "firebase/auth";

export const Login = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      navigate("/");
    }
  }, [userData, navigate]);

  const handleLogin = async (e, demoEmail = null, demoPassword = null) => {
    if (e) e.preventDefault();

    // Use demo credentials if provided, otherwise use form state
    const loginEmail = demoEmail || email;
    const loginPassword = demoPassword || password;

    // Validation
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error("Please enter both email and password");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const loginData = {
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword.trim(),
      };

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

      if (result.data.user) {
        dispatch(setUserData(result.data.user));
        toast.success(result.data.message || "Login successful!");
        navigate("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data;

        switch (status) {
          case 400:
            toast.error(message || "Invalid email or password");
            break;
          case 404:
            toast.error("User not found. Please sign up first.");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            toast.error(message || "Login failed. Please try again.");
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
      setDemoLoading(false);
    }
  };

  const googleSignIn = async () => {
    if (googleLoading) return;

    try {
      setGoogleLoading(true);
      const response = await signInWithPopup(auth, provider);
      const user = response.user;

      const requestData = {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        role: "student",
      };

      const result = await axios.post(
        serverUrl + "/api/auth/googleauth",
        requestData,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      if (result.data.success && result.data.user) {
        dispatch(setUserData(result.data.user));
        toast.success(result.data.message || "Google Sign-In Successful");
        navigate("/");
      } else {
        throw new Error(result.data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);

      if (error.response) {
        toast.error(error.response.data.message || "Google Sign-In failed");
      } else if (error.code === "auth/popup-closed-by-user") {
        toast.info("Sign-in was cancelled");
      } else if (error.code === "auth/popup-blocked") {
        toast.error("Popup was blocked. Please allow popups for this site.");
      } else {
        toast.error(error.message || "Google Sign-In failed");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // ✅ FIXED DEMO LOGIN FUNCTION
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

    const credentials = demoCredentials[demoType];
    
    setDemoLoading(true);
    toast.info(
      `Logging in as Demo ${demoType === "student" ? "Student" : "Educator"}...`
    );

    // Directly call handleLogin with demo credentials
    await handleLogin(null, credentials.email, credentials.password);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleLogin(e);
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
              disabled={loading || googleLoading || demoLoading}
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
              disabled={loading || googleLoading || demoLoading}
            />
            <button
              type="button"
              className="absolute right-3 bottom-2 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setShow(!show)}
              disabled={loading || googleLoading || demoLoading}
            >
              {show ? <IoEyeOffSharp size={20} /> : <IoEyeOutline size={20} />}
            </button>
          </div>

          {/* ✅ IMPROVED DEMO LOGIN BUTTONS */}
          <div className="w-full max-w-md">
            <p className="text-xs text-gray-500 text-center mb-2">
              Try demo accounts:
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin("student")}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                disabled={loading || googleLoading || demoLoading}
              >
                {demoLoading ? (
                  <div className="flex items-center justify-center">
                    <ClipLoader color="#ffffff" size={16} className="mr-2" />
                    Loading...
                  </div>
                ) : (
                  <>
                    <span className="mr-1">🎓</span>
                    Demo Student
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("educator")}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                disabled={loading || googleLoading || demoLoading}
              >
                {demoLoading ? (
                  <div className="flex items-center justify-center">
                    <ClipLoader color="#ffffff" size={16} className="mr-2" />
                    Loading...
                  </div>
                ) : (
                  <>
                    <span className="mr-1">👨‍🏫</span>
                    Demo Educator
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full max-w-md bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            disabled={loading || googleLoading || demoLoading}
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

          {/* Google Sign-In Button */}
          <button
            type="button"
            className="flex items-center justify-center w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer"
            disabled={loading || googleLoading || demoLoading}
            onClick={googleSignIn}
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