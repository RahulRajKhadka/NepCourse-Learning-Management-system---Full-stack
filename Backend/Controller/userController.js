// In userController.js
import User from "../Model/userModel.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";


export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    
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


export const updateProfile = async (req, res) => {
  try {
    console.log("Update profile request received");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    
    const userId = req.user.id;
    const { name, description } = req.body;
    let photoUrl = null;

    // Handle file upload if exists
    if (req.file) {
      console.log("Processing file upload");
      try {
        photoUrl = await uploadBufferToCloudinary(req.file.buffer);
        console.log("File uploaded to Cloudinary:", photoUrl);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Error uploading image"
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (photoUrl) updateData.photoUrl = photoUrl;

    console.log("Updating user with data:", updateData);

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    console.log("User updated successfully:", updatedUser);

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
    res.status(500).json({
      success: false,
      message: "Server error while updating profile"
    });
  }
};