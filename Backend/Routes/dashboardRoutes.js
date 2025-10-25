import express from "express";
import { 
  getInstructorDashboard, 
  getCourseDetailedStats 
} from "../Controller/DashboardController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.use(isAuth);
router.get("/instructor", getInstructorDashboard);
router.get("/course/:courseId", getCourseDetailedStats);

export default router;