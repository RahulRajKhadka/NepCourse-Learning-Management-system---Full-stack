import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import courseRouter from "./Routes/courseRoute.js";
import connectDb from "./config/connectDB.js";
import authRouter from "./Routes/authRoute.js";
import cors from "cors";
import userRouter from "./Routes/userRoute.js";

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);

app.get("/", (req, res) => {
  res.send("Hello from the server");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDb();
});
