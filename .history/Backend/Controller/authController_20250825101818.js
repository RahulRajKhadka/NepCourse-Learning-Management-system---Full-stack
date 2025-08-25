export const googleAuth = async (req, res) => {
  try {
    console.log("Request body received:", req.body); // Debug log
    
    const { name, email, role } = req.body;
    
    // Enhanced validation
    if (!email || !name) {
      console.log("Missing required fields:", { name, email });
      return res.status(400).json({ 
        success: false,
        message: "Name and email are required" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid email format" 
      });
    }

    // Check if user already exists in MongoDB Atlas
    let user = await User.findOne({ email: email.toLowerCase() }); // Case insensitive

    if (!user) {
      // Create new user in MongoDB Atlas
      user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: role || "student",
        authProvider: "google", // Add this field to track auth method
        createdAt: new Date()
      });
      console.log("New user created:", user);
    } else {
      console.log("Existing user found:", user);
      // Update last login time (optional)
      user.lastLogin = new Date();
      await user.save();
    }

    // Ensure genToken function exists and works
    if (!genToken) {
      throw new Error("Token generation function not found");
    }

    const token = genToken(user._id);
    
    if (!token) {
      throw new Error("Failed to generate token");
    }

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data
    return res.status(200).json({
      success: true,
      message: "Google authentication successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Google Auth Error Details:", {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }
    
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error during Google Sign-In",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};