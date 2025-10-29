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

dotenv.config();

const port = process.env.PORT || 10000;
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  "https://your-frontend-app-name.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

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
    environment: process.env.NODE_ENV
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err.message
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  connectDb();
});
