import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { IoEyeOutline, IoEyeOffSharp } from "react-icons/io5";
import { setUserData } from "../redux/userSlice";
import { auth, provider } from "../../utils/firebase.js";
import { signInWithPopup } from "firebase/auth";



export function SignUp() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (field, value) => {
    console.log(`Input changed: ${field} = ${value}`);
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
    console.log("Validating form...");
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      console.log("Name validation failed");
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      console.log("Email validation failed: empty");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      console.log("Email validation failed: invalid format");
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      console.log("Password validation failed: empty");
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      console.log("Password validation failed: too short");
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log(`Form validation result: ${isValid ? "valid" : "invalid"}`);
    return isValid;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Signup form submitted");

    // Validate form before submitting
    if (!validateForm()) {
      console.log("Form validation failed, showing error");
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    setErrors({});
    console.log("Making API request to:", `${serverUrl}/api/auth/signup`);

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
          timeout: 10000, // 10 second timeout
        }
      );

      console.log("Signup API response:", response.data);
      dispatch(setUserData(response.data));
      toast.success("Signup successful! Welcome!");
      console.log("Navigating to home page");
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error);
      
      if (error.code === "ECONNABORTED") {
        console.error("Request timeout occurred");
        toast.error("Request timeout. Please try again.");
      } else if (error.response) {
        // Server responded with error status
        console.error("Server responded with error:", error.response.status);
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
        toast.error(errorMessage);
      } else if (error.request) {
        // Network error or server not responding
        console.error("No response received:", error.request);
        toast.error(
          "Cannot connect to server. Please check your connection and try again."
        );
      } else {
        // Other errors
        console.error("Unexpected error:", error.message);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      console.log("Signup process completed");
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    console.log("Attempting Google sign-in");
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      console.log("Google authentication successful:", user);
      
      console.log("Making API request to Google auth endpoint");
      const result = await axios.post(
        `${serverUrl}/api/auth/googleauth`,
        {
          name: user.displayName,
          email: user.email,
          role: "student",
        },
        { withCredentials: true, timeout: 10000 }
      );
      
      console.log("Google auth API response:", result.data);
      dispatch(setUserData(result.data.user));
      toast.success("Signup Successful");
      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      const errorMessage = 
        error.response?.data?.message ||
        error.message ||
        "Google Sign-In failed";
      toast.error(errorMessage);
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
              onClick={() => {
                console.log("Toggle password visibility");
                setShow(!show);
              }}
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
              onClick={() => {
                console.log("Role selected: student");
                handleInputChange("role", "student");
              }}
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
              onClick={() => {
                console.log("Role selected: educator");
                handleInputChange("role", "educator");
              }}
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
              onClick={() => {
                console.log("Navigating to login page");
                navigate("/login");
              }}
              disabled={loading}
            >
              Login
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="md:w-[50%] w-[100%] h-[100%] rounded-r-2xl bg-[black] md:flex flex-col gap-10 items-center justify-center hidden">
          {/* Using a placeholder logo since we don't have the actual one */}
          <div className="w-3/4 h-40 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            NEPCOURSES LOGO
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text text-center px-4">
            WELCOME TO NEPCOURSES
          </h1>
        </div>
      </form>
    </div>
  );
}