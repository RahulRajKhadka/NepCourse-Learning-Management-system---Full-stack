import User from "../Model/userModel.js";
import { uploadBufferToCloudinary } from "../config/cloudinary.js"




export const getCurrentUser = async (req, res) => {
  try {
    // Make sure to match your JWT payload
    const userId = req.user.id; // or req.user.userId depending on genToken
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: `GetCurrentUser error: ${error.message}` });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { name, description } = req.body;
    let photoUrl = req.user.photoUrl;

   if (req.file) {
  photoUrl = await uploadOnCloudinary(req.file.path);
}


    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, description, photoUrl },
      { new: true }
    );

    res.json({ user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
