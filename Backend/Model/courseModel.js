import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
    },
    description: {
      type: String,
    },
    instructor: {
      type: String,
    },
    duration: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    thumbnail: {
      type: String,
    },
    enrolledStudents: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    lectures: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture"
    }],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    reviews: {
      type: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true
        },
        comment: {
          type: String,
          required: true
        }
      }],
      default: []
    }
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;