import User from "../Model/userModel.js";
import genToken from "../config/token.js";
import validator from "validator";
import sendMail from "../config/sendMail.js";

import bcrypt from "bcryptjs";



// Updated signUP function - Remove manual hashing
export const signUP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create user - let the model middleware handle password hashing
    const user = await User.create({
      name,
      email,
      password // Don't hash here - the model will do it
    });

    // Generate token
    const token = genToken(user._id);

    // Return user data without password
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
      description: user.description,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// Updated resetPassword function - Remove manual hashing
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

    // Just assign the password - let the model middleware handle hashing
    user.password = password;
    user.isOtpVerified = false;

    await user.save(); // This will trigger the pre('save') middleware

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(`Error resetting password: ${error.message}`);
    return res
      .status(500)
      .json({ message: `Error resetting password: ${error.message}` });
  }
};

// Login function remains the same - it's correct
export const login = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Fetch user with password explicitly
    let user = await User.findOne({ email }).select("+password");
    console.log("User from DB:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords - this should work correctly now
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log("Password match result:", isMatch);
    console.log("Raw password:", password.trim());
    console.log("Hashed password from DB:", user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const token = genToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
    console.error("Login error:", error);
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};



export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      message: "logout sucessfully",
    });
  } catch (error) {}
};

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
    user.otpExpiresIn = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.isOtpVerified = false;

    await user.save();
    await sendMail(email, otp);

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(`Error sending OTP: ${error.message}`);
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
    console.error(`Error verifying OTP: ${error.message}`);
    return res
      .status(500)
      .json({ message: `Error verifying OTP: ${error.message}` });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { name, email, photoUrl, role = "student" } = req.body;
    
    // Basic validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }
    
    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase().trim() });
    let isNewUser = false;
    
    if (!user) {
      // Create new user with complete profile
      user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: role.trim(),
        authProvider: "google",
        photoUrl: photoUrl || "", // Store Google profile photo
        description: "", // Default empty description
        isEmailVerified: true, // Google emails are verified
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      isNewUser = true;
      console.log("New user created:", user._id);
    } else {
      // Update existing user info if needed
      let updateFields = {};
      
      if (user.name !== name.trim()) {
        updateFields.name = name.trim();
      }
      
      if (photoUrl && user.photoUrl !== photoUrl) {
        updateFields.photoUrl = photoUrl;
      }
      
      if (Object.keys(updateFields).length > 0) {
        updateFields.updatedAt = new Date();
        user = await User.findByIdAndUpdate(
          user._id,
          updateFields,
          { new: true }
        );
        console.log("User updated:", user._id);
      }
    }
    
    // Generate token and set cookie
    const token = genToken(user._id);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    // Prepare user data for frontend (exclude sensitive info)
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
      token, // Include token in response if needed for frontend
    });
    
  } catch (error) {
    console.error("Google Auth Error:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists with different provider",
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication",
    });
  }
};