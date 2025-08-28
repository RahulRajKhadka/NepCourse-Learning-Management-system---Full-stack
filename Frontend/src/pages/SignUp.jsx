import React from "react";
import logo from "/public/logoo.png"; // Adjust the path as necessary
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
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
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Form validation
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

    // Validate form before submitting
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

      dispatch(setUserData(response.data));

      console.log("Signup successful:", response.data);
      toast.success("Signup successful! Welcome!");

      // Navigate to home after successful signup
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error);

      // Handle different types of errors
      if (error.code === "ECONNABORTED") {
        toast.error("Request timeout. Please try again.");
      } else if (error.response) {
        // Server responded with error status
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
        toast.error(errorMessage);
      } else if (error.request) {
        // Network error or server not responding
        toast.error(
          "Cannot connect to server. Please check your connection and try again."
        );
      } else {
        // Other errors
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
 

  const googleSignIn = async () => {
  try {
    console.log("Starting Google Sign-In...");
    
    const response = await signInWithPopup(auth, provider);
    const user = response.user;
    console.log("Firebase user:", user);
    
    const result = await axios.post(
      serverUrl + "/api/auth/googleauth",
      {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL, // Include Google profile photo
        role: "student",
      },
      { withCredentials: true }
    );
    
    console.log("Backend response:", result.data);
    
    // Handle the response
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
    } else if (error.code === 'auth/cancelled-popup-request' || 
               error.code === 'auth/popup-closed-by-user') {
      toast.error("Sign-in was cancelled");
    } else if (error.code === 'auth/popup-blocked') {
      toast.error("Popup was blocked. Please allow popups for this site.");
    } else {
      toast.error(error.message || "Google Sign-In failed");
    }
  }
};

  return (
    <div className="bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center">
      <form
        className="w-[90%] md:w-[800px] h-[600px] bg-[white] shadow-xl rounded-2xl flex"
        onSubmit={handleSignup}
      >
        {/* Left side */}
        <div className="md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3 p-4">
          <div className="text-center mb-4">
            <h1 className="font-semibold text-xl">Let's get started</h1>
            <h2 className="text-gray-600">Create your account</h2>
          </div>

          {/* Name Input */}
          <div className="flex flex-col gap-1 w-[80%] items-start justify-center">
            <label htmlFor="name" className="font-semibold">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              className={`border rounded-md p-2 w-full ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your name"
              onChange={(e) => handleInputChange("name", e.target.value)}
              value={formData.name}
              disabled={loading}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-1 w-[80%] items-start justify-center">
            <label htmlFor="email" className="font-semibold">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              className={`border rounded-md p-2 w-full ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
              onChange={(e) => handleInputChange("email", e.target.value)}
              value={formData.email}
              disabled={loading}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1 w-[80%] items-start justify-center relative">
            <label htmlFor="password" className="font-semibold">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type={show ? "text" : "password"}
              id="password"
              className={`border rounded-md p-2 w-full pr-10 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your password"
              onChange={(e) => handleInputChange("password", e.target.value)}
              value={formData.password}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-9"
              onClick={() => setShow(!show)}
              disabled={loading}
            >
              {show ? (
                <IoEyeOutline className="w-5 h-5 cursor-pointer text-gray-500" />
              ) : (
                <IoEyeOffSharp className="w-5 h-5 cursor-pointer text-gray-500" />
              )}
            </button>
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          {/* Role Selection */}
          <div className="flex md:w-[60%] w-[70%] items-center justify-between mt-2">
            <button
              type="button"
              className={`px-4 py-1 border rounded-xl cursor-pointer transition-all ${
                formData.role === "student"
                  ? "border-2 border-blue-500 bg-blue-50"
                  : "border border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => handleInputChange("role", "student")}
              disabled={loading}
            >
              Student
            </button>
            <button
              type="button"
              className={`px-4 py-1 border rounded-xl cursor-pointer transition-all ${
                formData.role === "educator"
                  ? "border-2 border-blue-500 bg-blue-50"
                  : "border border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => handleInputChange("role", "educator")}
              disabled={loading}
            >
              Educator
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-[60%] bg-blue-500 h-[40px] text-white rounded-md p-3 hover:bg-blue-600 disabled:bg-blue-300 cursor-pointer transition-colors flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <ClipLoader color="#ffffff" size={20} /> : "Sign Up"}
          </button>

          {/* Divider */}
          <div className="w-[80%] flex flex-col items-center gap-2">
            <div className="flex items-center my-4 w-full">
              <div className="flex-1 h-px bg-gray-300"></div>
              <p className="px-4 text-sm text-gray-500">Or continue with</p>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              className="flex items-center justify-center w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50"
              disabled={loading}
              onClick={googleSignIn}
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
          </div>

          {/* Login Link */}
          <div className="text-[#6f6f6f] text-sm">
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-500 cursor-pointer underline underline-offset-1 hover:text-blue-600"
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              Login
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="md:w-[50%] w-[100%] h-[100%] rounded-r-2xl bg-[black] md:flex flex-col gap-10 items-center justify-center hidden">
          <img src={logo} alt="logo" className="shadow-2xl w-3/4 rounded-2xl" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text text-center px-4">
            WELCOME TO NEPCOURSES
          </h1>
        </div>
      </form>
    </div>
  );
}
