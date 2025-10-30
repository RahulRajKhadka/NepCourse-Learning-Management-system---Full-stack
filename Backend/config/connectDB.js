import mongoose from "mongoose";

const connectDb = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      console.error("MONGODB_URL is not defined in environment variables!");
      console.error("Available env vars:", Object.keys(process.env).join(", "));
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    console.log("MongoDB URL exists:", !!process.env.MONGODB_URL);
    
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDb;