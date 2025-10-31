import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import courseRouter from "./Routes/courseRoute.js";
import connectDb from "./config/connectDB.js";
import authRouter from "./Routes/authRoute.js";
import cors from "cors";
import userRouter from "./Routes/userRoute.js";
import paymentRouter from "./Routes/paymentRoutes.js";
import enrollmentRoutes from "./Routes/enrollmentRoutes.js";
import reviewRouter from "./Routes/reviewRoute.js";
import dashboardRouter from "./Routes/dashboardRoutes.js";
import { seedDemoAccounts } from "./config/seedDemoAccounts.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const port = process.env.PORT || 8000;
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://nepcourse-learning-management-system-7135.onrender.com",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

console.log("Allowed origins:", allowedOrigins);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked origin:", origin);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.options("*", cors());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/review", reviewRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("/", (req, res) => {
  res.json({
    message: "NepCourse Backend API is running",
    status: "success",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err.message,
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  await connectDb();

  try {
    await seedDemoAccounts();
    console.log("Demo accounts seeded successfully");
  } catch (error) {
    console.error("Failed to seed demo accounts:", error.message);
  }
});
