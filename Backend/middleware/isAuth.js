import jwt from "jsonwebtoken";
import User from "../Model/userModel.js";

const isAuth = async (req, res, next) => {
  try {

    console.log("=== AUTH MIDDLEWARE DEBUG ===");
    console.log("All cookies:", req.cookies);
    console.log("Token cookie:", req.cookies.token);
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    

    const token = req.cookies.token;

    if (!token) {
      console.log("❌ No token found in cookies");
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    console.log("✅ Token found, attempting to verify...");
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified, decoded:", decoded);
    
    // Get user from database
    const user = await User.findById(decoded.id).select("-password");
    console.log("✅ User found:", user ? "Yes" : "No");
    
    if (!user) {
      console.log("❌ User not found in database");
      return res.status(401).json({
        success: false,
        message: "Token is valid but user not found"
      });
    }

    
    req.user = user;
    console.log("✅ Auth successful, proceeding...");
    next();

  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Token is not valid"
    });
  }
};

export default isAuth;