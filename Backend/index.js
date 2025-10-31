import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./config/connectDB.js";
import cors from "cors";
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

try {
  const authModule = await import("./Routes/authRoute.js");
  app.use("/api/auth", authModule.default);
} catch (error) {
  process.exit(1);
}

try {
  const userModule = await import("./Routes/userRoute.js");
  app.use("/api/user", userModule.default);
} catch (error) {
  process.exit(1);
}

try {
  const courseModule = await import("./Routes/courseRoute.js");
  app.use("/api/courses", courseModule.default);
} catch (error) {
  process.exit(1);
}

try {
  const paymentModule = await import("./Routes/paymentRoutes.js");
  app.use("/api/payment", paymentModule.default);
} catch (error) {
  process.exit(1);
}

try {
  const enrollmentModule = await import("./Routes/enrollmentRoutes.js");
  app.use("/api/enrollment", enrollmentModule.default);
} catch (error) {
  process.exit(1);
}

try {
  const reviewModule = await import("./Routes/reviewRoute.js");
  app.use("/api/review", reviewModule.default);
} catch (error) {
  process.exit(1);
}

try {
  const dashboardModule = await import("./Routes/dashboardRoutes.js");
  app.use("/api/dashboard", dashboardModule.default);
} catch (error) {
  process.exit(1);
}

app.get("/", (req, res) => {
  res.json({
    message: "NepCourse Backend API is running",
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err.message,
  });
});

app.listen(port, async () => {
  await connectDb();
  try {
    await seedDemoAccounts();
  } catch (error) {}
});
