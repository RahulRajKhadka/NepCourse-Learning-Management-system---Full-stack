
import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { 
    createCourse, 
    getCourseById, 
    removeCourse, 
    getPublishedCourses,
    getCreatorCourses,
    editCourse 
} from '../Controller/courseController.js';
import upload from "../middleware/Multer.js";

const courseRouter = express.Router();

courseRouter.post("/create", isAuth, createCourse);
courseRouter.get("/getPublishedCourses", getPublishedCourses);
courseRouter.get("/getCreatorCourse", isAuth, getCreatorCourses);
courseRouter.post("/editcourse/:courseId", isAuth, upload.single("thumbnail"), editCourse);
courseRouter.get("/getCourseById/:courseId", getCourseById); // Removed isAuth if you want public access
courseRouter.delete("/deleteCourse/:courseId", isAuth, removeCourse);

export default courseRouter;
