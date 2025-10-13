// models/Enrollment.js
import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    enrollmentType: {
      type: String,
      enum: ["free", "paid"],
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      // Only required for paid courses
      required: function() {
        return this.enrollmentType === "paid";
      },
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedLectures: [{
      type: mongoose.Schema.Types.ObjectId,
    }],
    status: {
      type: String,
      enum: ["active", "completed", "dropped"],
      default: "active",
    },
    completedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      // For courses with expiration (optional)
    },
  },
  { 
    timestamps: true,
    // Ensure a user can't enroll in the same course twice
    indexes: [
      { user: 1, course: 1, unique: true }
    ]
  }
);

// Static method to check if user is enrolled
enrollmentSchema.statics.isEnrolled = async function(userId, courseId) {
  const enrollment = await this.findOne({ 
    user: userId, 
    course: courseId,
    status: "active"
  });
  return !!enrollment;
};

// Instance method to update progress
enrollmentSchema.methods.updateProgress = function(lectureId) {
  if (!this.completedLectures.includes(lectureId)) {
    this.completedLectures.push(lectureId);
  }
  // You can calculate progress based on total lectures in the course
  // For now, just incrementing
  return this.save();
};

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;