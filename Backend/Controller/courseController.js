import Course from "../Model/courseModel.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import mongoose from "mongoose";

export const createCourse = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const newCourse = new Course({
      title,
      category,
      creator: req.user._id,
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate("creator", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get published courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve courses",
      error: error.message,
    });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.user._id;
    const courses = await Course.find({ creator: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get creator courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve courses",
      error: error.message,
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, subTitle, description, category, level, isPublished } =
      req.body;

    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user is the creator
    if (course.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this course",
      });
    }

    let thumbnail;
    if (req.file) {
      thumbnail = await uploadOnCloudinary(req.file.path);
    }

    const updateData = {
      title,
      subTitle,
      description,
      category,
      level,
      isPublished,
    };

    if (thumbnail) {
      updateData.thumbnail = thumbnail;
    }

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Edit course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};


export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    console.log("Received courseId:", courseId);
    console.log("CourseId type:", typeof courseId);
    console.log("CourseId length:", courseId.length);
    
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }
    
    const course = await Course.findById(courseId)
      .populate("creator", "name email")
  

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Get course by ID error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve course",
      error: error.message,
    });
  }
};

export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user is the creator
    if (course.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this course",
      });
    }

    await Course.findByIdAndDelete(courseId);

    res.status(200).json({
      success: true,
      message: "Course removed successfully",
    });
  } catch (error) {
    console.error("Remove course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove course",
      error: error.message,
    });
  }
};
