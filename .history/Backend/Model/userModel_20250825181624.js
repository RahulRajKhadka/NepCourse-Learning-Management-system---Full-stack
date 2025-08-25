import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    
    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.githubId; // Only required for local auth
      },
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ["student", "educator", "admin"],
      default: "student",
    },
    googleId: String,
    githubId: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);



export default mongoose.model("User", userSchema);
