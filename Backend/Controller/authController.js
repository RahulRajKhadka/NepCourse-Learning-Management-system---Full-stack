// ===========================================================
// TABLE OF CONTENTS
// 1. ======== USER REGISTRATION ========
// 2. ======== PASSWORD & OTP MANAGEMENT ========
// 3. ======== LOGIN & LOGOUT ========
// 4. ======= OTP VERIFICATION ========
// 5. GOOGLE AUTHENTICATION
// ===========================================================

import User from "../Model/userModel.js";
import genToken from "../config/token.js";
import validator from "validator";
import sendMail from "../config/sendMail.js";
import bcrypt from "bcryptjs";

// Cookie configuration helper
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

// ===========================================================
// 1. ======== USER REGISTRATION ========
// ===========================================================
export const signUP = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const validRoles = ["student", "educator", "teacher", "admin"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
    });

    const token = genToken(user._id);

    // Set cookie with production-ready settings
    res.cookie("token", token, getCookieOptions());

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoUrl: user.photoUrl || null,
      description: user.description || null,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: userData,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    res
      .status(500)
      .json({ success: false, message: "Server error during registration" });
  }
};

// ===========================================================
// 2. ======== PASSWORD & OTP MANAGEMENT ========
// ===========================================================
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "OTP verification is required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters long" });
    }

    user.password = password;
    user.isOtpVerified = false;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error resetting password: ${error.message}` });
  }
};

// ===========================================================
// 3. ======== LOGIN & LOGOUT ========
// ===========================================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = genToken(user._id);

    // Set cookie with production-ready settings
    res.cookie("token", token, getCookieOptions());

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", getCookieOptions());
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Logout error" });
  }
};

// ===========================================================
// 4. ======== OTP VERIFICATION ========
// ===========================================================
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.otpExpiresIn = Date.now() + 10 * 60 * 1000;
    user.isOtpVerified = false;

    await user.save();
    await sendMail(email, otp);

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error sending OTP: ${error.message}` });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiresIn < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpiresIn = undefined;

    await user.save();
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error verifying OTP: ${error.message}` });
  }
};

// ===========================================================
// 5. ======== GOOGLE AUTHENTICATION ========
// ===========================================================

export const googleAuth = async (req, res) => {
  try {
    const { name, email, photoUrl, role = "student" } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Name and email are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    let user = await User.findOne({ email: email.toLowerCase().trim() });
    let isNewUser = false;

    if (!user) {
      user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: role.trim(),
        authProvider: "google",
        photoUrl: photoUrl || "",
        description: "",
        isEmailVerified: true,
      });
      isNewUser = true;
    } else {
      if (user.authProvider === "local") {
        return res.status(400).json({
          success: false,
          message:
            "Email already exists with email/password login. Please use your password to sign in.",
        });
      }

      let updateFields = {};
      if (user.name !== name.trim()) updateFields.name = name.trim();
      if (photoUrl && user.photoUrl !== photoUrl)
        updateFields.photoUrl = photoUrl;

      if (Object.keys(updateFields).length > 0) {
        updateFields.updatedAt = new Date();
        user = await User.findByIdAndUpdate(user._id, updateFields, {
          new: true,
        });
      }
    }

    const token = genToken(user._id);

    res.cookie("token", token, getCookieOptions());

    const userData = {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoUrl: user.photoUrl,
      description: user.description || "",
      authProvider: user.authProvider,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: isNewUser
        ? "Account created successfully with Google"
        : "Google sign-in successful",
      user: userData,
      isNewUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication",
    });
  }
};
