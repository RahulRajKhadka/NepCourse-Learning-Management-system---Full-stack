import express from "express";
import isAuth from "../middleware/isAuth.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import {
  createCourse,
  getCourseById,
  removeCourse,
  getPublishedCourses,
  getCreatorCourses,
  editCourse,
  createLecture,
  removeLecture,
  getCourseLectures,
  editLecture,
  getCreatorById,
} from "../Controller/courseController.js";
import upload from "../middleware/Multer.js";

const courseRouter = express.Router();

// for the coureses

courseRouter.post("/create", isAuth, createCourse);
courseRouter.get("/getPublishedCourses", getPublishedCourses);
courseRouter.get("/getCreatorCourse", isAuth, getCreatorCourses);
courseRouter.post(
  "/editcourse/:courseId",
  isAuth,
  upload.single("thumbnail"),
  editCourse,
);
courseRouter.get("/getCourseById/:courseId", getCourseById); // Removed isAuth if you want public access
courseRouter.delete("/deleteCourse/:courseId", isAuth, removeCourse);

courseRouter.post(
  "/createlecture/:courseId",
  isAuth,
  upload.single("video"),
  createLecture,
);
courseRouter.get("/getCourseLectures/:courseId", isAuth, getCourseLectures);
courseRouter.post(
  "/editlecture/:courseId/:lectureId",
  isAuth,
  upload.single("video"),
  editLecture,
);
courseRouter.delete(
  "/deleteLecture/:courseId/:lectureId",
  isAuth,
  removeLecture,
);
courseRouter.post("/creator", getCreatorById);

export default courseRouter;
