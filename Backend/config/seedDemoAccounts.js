import User from "../Model/userModel.js";
import mongoose from "mongoose";

const demoAccounts = [
  {
    name: "Demo Student",
    email: "student@demo.com",
    password: "password123",
    role: "student",
    authProvider: "local",
    isEmailVerified: true,
    description: "This is a demo student account for testing purposes",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=DemoStudent",
  },
  {
    name: "Demo Educator",
    email: "educator@demo.com",
    password: "password123",
    role: "educator",
    authProvider: "local",
    isEmailVerified: true,
    description: "This is a demo educator account for testing purposes",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=DemoEducator",
  },
];

export const seedDemoAccounts = async () => {
  try {
    console.log("Starting demo accounts seeding...");

    for (const accountData of demoAccounts) {
      const existingUser = await User.findOne({ email: accountData.email });

      if (existingUser) {
        console.log(`Demo account already exists: ${accountData.email}`);
        continue;
      }

      await User.create(accountData);
    }
  } catch (error) {
    console.error("Error seeding demo accounts:", error.message);
    throw error;
  }
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  import("dotenv/config");
  import("./config/connectDB.js").then(({ default: connectDb }) => {
    connectDb().then(async () => {
      await seedDemoAccounts();
      process.exit(0);
    });
  });
}
