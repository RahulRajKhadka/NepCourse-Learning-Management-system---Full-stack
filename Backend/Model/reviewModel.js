
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
  },
  reviewedAt: {
    type: Date,
    default: Date.now,
  },
});

reviewSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
