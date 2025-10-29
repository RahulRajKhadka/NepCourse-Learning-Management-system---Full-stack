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

const port = process.env.PORT || 8000;
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL
];

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

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
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err.message
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDb();
});
