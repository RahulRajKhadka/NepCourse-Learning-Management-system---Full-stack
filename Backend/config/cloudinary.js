import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";


dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("File path is required");
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    console.log(`Uploading file: ${filePath}`);

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "courses",
      resource_type: "auto",
      use_filename: true,
      unique_filename: false,
    });

    console.log("Upload successful:", result.secure_url);


    fs.unlinkSync(filePath);

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
 
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (unlinkError) {
      console.error("Error deleting temporary file:", unlinkError);
    }
    
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Test connection function
export const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary connection successful:", result);
    return true;
  } catch (error) {
    console.error("Cloudinary connection failed:", error);
    return false;
  }
};


