import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners"; // Add this import
import { serverUrl } from "../config.js";
import axios from "axios";

function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [Newpassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Step 1: Send OTP
  const sendOTP = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/sendotp",
        { email },
        { withCredentials: true }
      );
      
      toast.success(result.data.message);
      setStep(2); // Move to next step
      setLoading(false);
      console.log(result.data);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Error sending OTP");
      setLoading(false);
    }
  };


  const verifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/verifyotp",
        { email, otp },
        { withCredentials: true }
      );
      
      toast.success(result.data.message);
      setStep(3); // Move to next step
      setLoading(false);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "Error verifying OTP");
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!Newpassword.trim() || !confirmPassword.trim()) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (Newpassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (Newpassword.length < 6) {
      toast.error("Password should be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/reset-password",
        { email, password: Newpassword },
        { withCredentials: true }
      );

      toast.success(result.data.message);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error.response?.data?.message || "Error resetting password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Step 1: Enter Email */}
      {step === 1 && (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">Forgot Your Password?</h2>
          <p className="text-gray-600 mb-4">Enter your email address</p>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={sendOTP}
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded mb-2 disabled:opacity-50"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
          </button>
          <button
            className="text-sm text-gray-600"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </div>
      )}

      {/* Step 2: Enter OTP */}
      {step === 2 && (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
          <p className="text-gray-600 mb-4">
            Please enter the 6-digit code sent to{" "}
            <span className="font-medium">{email}</span>
          </p>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            className="w-full p-2 border rounded mb-4 text-center"
          />
          <button
            onClick={verifyOtp}
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded mb-2 disabled:opacity-50"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Verify OTP"}
          </button>
          <div className="flex justify-between text-sm text-gray-600">
            <button onClick={() => setStep(1)}>Back</button>
            <button onClick={sendOTP} disabled={loading}>
              Resend OTP
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Reset Password */}
      {step === 3 && (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>
          <p className="text-gray-600 mb-4">
            Enter a new password below to regain access to your account.
          </p>
          <input
            type="password"
            placeholder="Enter new password"
            value={Newpassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={resetPassword}
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded mb-2 disabled:opacity-50"
          >
            {loading ? (
              <ClipLoader size={20} color="white" />
            ) : (
              "Reset Password"
            )}
          </button>
          <button
            className="text-sm text-gray-600"
            onClick={() => setStep(2)}
          >
            Back to OTP
          </button>
        </div>
      )}
    </div>
  );
}

export default ForgetPassword;