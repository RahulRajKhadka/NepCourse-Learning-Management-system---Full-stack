import jwt from "jsonwebtoken";
import User from "../Model/userModel.js";

const isAuth = async (req, res, next) => {
  try {
    console.log("=== AUTH MIDDLEWARE DEBUG ===");
    console.log("All cookies:", req.cookies);
    console.log("Token cookie:", req.cookies.token);
    console.log("Authorization header:", req.headers.authorization);
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    
    let token;

    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
      console.log("✅ Token found in Authorization header");
    } 
   
    else if (req.cookies.token) {
      token = req.cookies.token;
      console.log("✅ Token found in cookies");
    }

    if (!token) {
      console.log(" No token found in cookies or Authorization header");
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    console.log("✅ Token found, attempting to verify...");
    
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified, decoded:", decoded);
    
  
    const user = await User.findById(decoded.id).select("-password");
    console.log("✅ User found:", user ? "Yes" : "No");
    
    if (!user) {
      console.log(" User not found in database");
      return res.status(401).json({
        success: false,
        message: "Token is valid but user not found"
      });
    }
    
    req.user = user;
    console.log(" Auth successful, proceeding...");
    next();

  } catch (error) {
    console.error(" Auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Token is not valid"
    });
  }
};

export default isAuth;