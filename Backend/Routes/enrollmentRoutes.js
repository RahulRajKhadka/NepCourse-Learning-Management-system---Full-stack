import express from "express";
import {
  enrollFreeCourse,
  getEnrolledCourses,
  checkEnrollment,
  updateProgress,
} from "../Controller/EnrollmentController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();
router.use(isAuth);

router.post("/free", enrollFreeCourse);
router.get("/my-courses", getEnrolledCourses);
router.get("/check/:courseId", checkEnrollment);
router.put("/progress/:courseId", updateProgress);

export default router;