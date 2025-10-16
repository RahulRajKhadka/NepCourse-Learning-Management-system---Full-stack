import express from 'express';
import { createReview, getReviewsByCourse, checkUserReview, updateReview, deleteReview } from '../Controller/ReviewController.js';
import isAuth from "../middleware/isAuth.js";

const reviewRouter = express.Router();

reviewRouter.post("/createreview/:courseId", isAuth, createReview);
reviewRouter.get("/getreviews/:courseId", getReviewsByCourse);
reviewRouter.get("/check/:courseId", isAuth, checkUserReview);
reviewRouter.put("/update/:reviewId", isAuth, updateReview);
reviewRouter.delete("/delete/:reviewId", isAuth, deleteReview);

export default reviewRouter;
