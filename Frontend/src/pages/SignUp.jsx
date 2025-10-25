import React from "react";
import logo from "/public/logoo.png";
import { IoEyeOutline, IoEyeOffSharp } from "react-icons/io5";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { auth, provider } from "../../utils/firebase.js";
import { signInWithPopup } from "firebase/auth";

export function SignUp() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
        {
          withCredentials: true,
        }
      );

      console.log(formData.role);

      dispatch(setUserData(response.data.user));

      console.log("Signup successful:", response.data);
      toast.success("Signup successful! Welcome!");

      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error);

      if (error.code === "ECONNABORTED") {
        toast.error("Request timeout. Please try again.");
      } else if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error(
          "Cannot connect to server. Please check your connection and try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    if (googleLoading) return;

    try {
      setGoogleLoading(true);
      console.log("Starting Google Sign-In...");

      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      console.log("Firebase user:", user);

      const result = await axios.post(
        serverUrl + "/api/auth/googleauth",
        {
          name: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
          role: formData.role,
        },
        { withCredentials: true }
      );

      console.log("Backend response:", result.data);

      if (result.data.success && result.data.user) {
        dispatch(setUserData(result.data.user));
        toast.success(result.data.message || "Google Sign-In Successful");
        navigate("/");
      } else {
        throw new Error(result.data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);

      if (error.response?.data) {
        console.error("Backend error response:", error.response.data);
        toast.error(error.response.data.message || "Google Sign-In failed");
      } else if (error.code === "auth/cancelled-popup-request") {
        console.log("Popup request cancelled (likely duplicate click)");
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

  return (
    <div className="bg-[#dddbdb] min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <form
        className="w-full max-w-[900px] bg-white shadow-xl rounded-2xl flex flex-col md:flex-row overflow-hidden"
        onSubmit={handleSignup}
      >
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center gap-3 p-6 sm:p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-2 sm:mb-4">
            <h1 className="font-semibold text-xl sm:text-2xl">
              Let's get started
            </h1>
            <h2 className="text-gray-600 text-sm sm:text-base">
              Create your account
            </h2>
          </div>

          {/* Name Input */}
          <div className="flex flex-col gap-1 w-full max-w-[350px]">
            <label
              htmlFor="name"
              className="font-semibold text-sm sm:text-base"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              className={`border rounded-md p-2 sm:p-2.5 w-full text-sm sm:text-base ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your name"
              onChange={(e) => handleInputChange("name", e.target.value)}
              value={formData.name}
              disabled={loading || googleLoading}
            />
            {errors.name && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.name}
              </span>
            )}
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-1 w-full max-w-[350px]">
            <label
              htmlFor="email"
              className="font-semibold text-sm sm:text-base"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              className={`border rounded-md p-2 sm:p-2.5 w-full text-sm sm:text-base ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
              onChange={(e) => handleInputChange("email", e.target.value)}
              value={formData.email}
              disabled={loading || googleLoading}
            />
            {errors.email && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1 w-full max-w-[350px] relative">
            <label
              htmlFor="password"
              className="font-semibold text-sm sm:text-base"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type={show ? "text" : "password"}
              id="password"
              className={`border rounded-md p-2 sm:p-2.5 w-full pr-10 text-sm sm:text-base ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your password"
              onChange={(e) => handleInputChange("password", e.target.value)}
              value={formData.password}
              disabled={loading || googleLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-8 sm:top-9"
              onClick={() => setShow(!show)}
              disabled={loading || googleLoading}
            >
              {show ? (
                <IoEyeOutline className="w-5 h-5 cursor-pointer text-gray-500" />
              ) : (
                <IoEyeOffSharp className="w-5 h-5 cursor-pointer text-gray-500" />
              )}
            </button>
            {errors.password && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.password}
              </span>
            )}
          </div>

          {/* Role Selection */}
          <div className="flex w-full max-w-[350px] items-center justify-between gap-3 mt-2">
            <button
              type="button"
              className={`flex-1 px-3 sm:px-4 py-2 border rounded-xl cursor-pointer transition-all text-sm sm:text-base ${
                formData.role === "student"
                  ? "border-2 border-blue-500 bg-blue-50"
                  : "border border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => handleInputChange("role", "student")}
              disabled={loading || googleLoading}
            >
              Student
            </button>
            <button
              type="button"
              className={`flex-1 px-3 sm:px-4 py-2 border rounded-xl cursor-pointer transition-all text-sm sm:text-base ${
                formData.role === "educator"
                  ? "border-2 border-blue-500 bg-blue-50"
                  : "border border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => handleInputChange("role", "educator")}
              disabled={loading || googleLoading}
            >
              Educator
            </button>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full max-w-[350px] bg-blue-500 h-[44px] text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 cursor-pointer transition-colors flex items-center justify-center font-medium text-sm sm:text-base"
            disabled={loading || googleLoading}
          >
            {loading ? <ClipLoader color="#ffffff" size={20} /> : "Sign Up"}
          </button>

          {/* Divider */}
          <div className="w-full max-w-[350px] flex flex-col items-center gap-3 mt-2">
            <div className="flex items-center w-full">
              <div className="flex-1 h-px bg-gray-300"></div>
              <p className="px-3 sm:px-4 text-xs sm:text-sm text-gray-500">
                Or continue with
              </p>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              className="flex items-center justify-center w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              disabled={loading || googleLoading}
              onClick={googleSignIn}
            >
              {googleLoading ? (
                <>
                  <ClipLoader
                    color="#4285f4"
                    size={18}
                    className="mr-2 sm:mr-3"
                  />
                  <span className="text-gray-700 font-medium">
                    Signing in...
                  </span>
                </>
              ) : (
                <>
                  <img
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3"
                    src="https://www.google.com/favicon.ico"
                    alt="Google logo"
                  />
                  <span className="text-gray-700 font-medium">
                    Sign in with Google
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-[#6f6f6f] text-xs sm:text-sm mt-2">
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-500 cursor-pointer underline underline-offset-1 hover:text-blue-600 font-medium"
              onClick={() => navigate("/login")}
              disabled={loading || googleLoading}
            >
              Login
            </button>
          </div>
        </div>

        {/* Right side - Branding (Hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 rounded-r-2xl bg-black flex-col gap-8 lg:gap-10 items-center justify-center p-8">
          <img
            src={logo}
            alt="logo"
            className="shadow-2xl w-full max-w-[280px] lg:max-w-[320px] rounded-2xl object-contain"
          />
          <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text text-center px-4">
            WELCOME TO NEPCOURSES
          </h1>
        </div>
      </form>
    </div>
  );
}