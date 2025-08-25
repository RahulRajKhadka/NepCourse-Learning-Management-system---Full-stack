import User from "../Model/userModel.js";
import { uploadBufferToCloudinary } from "../config/cloudinary.js"



export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id; // Assuming you have auth middleware that sets req.user
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        description: user.description,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile"
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id; // From auth middleware
    const { name, email, description } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required"
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase().trim(),
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another account"
        });
      }
    }

    // Handle file upload
    let photoUrl = user.photoUrl;
    if (req.file) {
      // Delete old profile image if exists
      if (user.photoUrl && user.photoUrl.startsWith('/uploads/')) {
        const oldImagePath = path.join(process.cwd(), user.photoUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Set new image URL
      photoUrl = `/uploads/profiles/${req.file.filename}`;
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        description: description?.trim() || "",
        photoUrl: photoUrl,
        updatedAt: new Date(),
      },
      { 
        new: true,
        runValidators: true,
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Failed to update user profile"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        photoUrl: updatedUser.photoUrl,
        description: updatedUser.description,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      }
    });

  } catch (error) {
    console.error("Update profile error:", error);
    
    // Delete uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(process.cwd(), 'uploads/profiles', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + error.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating profile"
    });
  }
};

// Delete user profile image
export const deleteProfileImage = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Delete image file if exists
    if (user.photoUrl && user.photoUrl.startsWith('/uploads/')) {
      const imagePath = path.join(process.cwd(), user.photoUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Update user to remove photo URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $unset: { photoUrl: 1 },
        updatedAt: new Date(),
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: "Profile image deleted successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        photoUrl: updatedUser.photoUrl,
        description: updatedUser.description,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      }
    });

  } catch (error) {
    console.error("Delete profile image error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting profile image"
    });
  }
};