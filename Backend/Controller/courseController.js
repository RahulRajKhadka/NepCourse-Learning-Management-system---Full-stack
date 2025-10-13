import Course from "../Model/courseModel.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import mongoose from "mongoose";
import Lecture from "../Model/lectureModel.js";
import User from "../Model/userModel.js"

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
    console.log("Fetching published courses with lectures...");
    
    const courses = await Course.find({ isPublished: true })
      .populate("lectures");
    
    console.log("Found courses:", courses.length);
    courses.forEach((course, index) => {
      console.log(`Course ${index + 1}: ${course.title}`);
      console.log(`Lectures count: ${course.lectures?.length || 0}`);
      console.log(`Lectures:`, course.lectures);
    });
      
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
    const courses = await Course.find({ creator: userId })
      .populate('lectures')  // Add this line
      .sort({ createdAt: -1 });

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
    const { title, subtitle, description, category, level, price, isPublished } = req.body;

    const updateFields = {
      title,
      subtitle,
      description,
      category,
      level,
      price,
      isPublished: isPublished === 'true'
    };

    if (req.file) {
      const cloudinaryResult = await uploadOnCloudinary(req.file.path);
      updateFields.thumbnail = cloudinaryResult.url;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateFields,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse
    });

  } catch (error) {
    console.error("Edit course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message
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
  .populate("lectures");  // Add this line
  

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





// Fixed getCourseLectures function
export const getCourseLectures = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id; // From isAuth middleware

    console.log("Fetching lectures for courseId:", courseId);
    console.log("User ID:", userId);

    // Check if course exists and belongs to the user
    const course = await Course.findOne({ _id: courseId, creator: userId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission to access it",
      });
    }

    // Get all lectures for this course
    const lectures = await Lecture.find({ course: courseId }).sort({ createdAt: 1 });

    console.log("Found lectures:", lectures);

    res.status(200).json({
      success: true,
      lectures: lectures,
      count: lectures.length
    });
  } catch (error) {
    console.error("Get course lectures error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve course lectures",
      error: error.message,
    });
  }
};




export const createLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, duration, isPreviewFree } = req.body;
    const userId = req.user.id;

    console.log("Creating lecture for courseId:", courseId);
    console.log("Request body:", req.body);

    if (!title || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (title is required)",
      });
    }

    // Verify course exists and belongs to user
    const course = await Course.findOne({ _id: courseId, creator: userId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission to add lectures to it",
      });
    }

    console.log("Course found:", course.title);
    console.log("Course lectures before:", course.lectures);

    const lectureData = {
      title,
      description: description || "",
      duration: duration || 0,
      isPreviewFree: isPreviewFree || false,
      course: courseId,
    };

    // Handle video upload if present
    if (req.file) {
      const cloudinaryResult = await uploadOnCloudinary(req.file.path);
      lectureData.videoUrl = cloudinaryResult.url;
    }

    const lecture = await Lecture.create(lectureData);
    console.log("Lecture created:", lecture);

    // Add lecture ID to course's lectures array
    course.lectures.push(lecture._id);
    const savedCourse = await course.save();
    
    console.log("Course lectures after:", savedCourse.lectures);
    console.log("Lecture added to course successfully");

    res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      lecture,
    });

  } catch (error) {
    console.error("Create lecture error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create lecture",
      error: error.message,
    });
  }
};

export const editLecture = async (req, res) => {
  try {
    console.log("=== EDIT LECTURE DEBUG ===");
    console.log("Params:", req.params);
    console.log("Body:", req.body);
    console.log("File:", req.file);
    console.log("User:", req.user);
    
    const { lectureId, courseId } = req.params;
    const { title, description, duration, isPreviewFree } = req.body;
    const userId = req.user.id;

    console.log("Extracted values:", {
      lectureId,
      courseId, 
      userId,
      title,
      isPreviewFree,
      hasFile: !!req.file
    });

    // Verify course belongs to user
    console.log("Checking course ownership...");
    const course = await Course.findOne({ _id: courseId, creator: userId });
    console.log("Course found:", course ? "YES" : "NO");
    
    if (!course) {
      console.log("Course not found or user doesn't own it");
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission to edit it",
      });
    }

    console.log("Finding lecture...");
    const lecture = await Lecture.findOne({ _id: lectureId, course: courseId });
    console.log("Lecture found:", lecture ? "YES" : "NO");
    console.log("Original lecture:", lecture);
    
    if (!lecture) {
      console.log("Lecture not found in this course");
      return res.status(404).json({
        success: false,
        message: "Lecture not found in this course",
      });
    }

    console.log("Updating lecture fields...");
    
    // Handle video upload if present
    if (req.file) {
      console.log("Processing video file...", req.file.filename);
      try {
        const cloudinaryResult = await uploadOnCloudinary(req.file.path);
        console.log("Cloudinary result:", cloudinaryResult);
        lecture.videoUrl = cloudinaryResult.url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload video",
          error: uploadError.message,
        });
      }
    }

    // Update other fields
    if (title) {
      console.log(`Updating title from "${lecture.title}" to "${title}"`);
      lecture.title = title;
    }
    if (description !== undefined) {
      console.log(`Updating description to: "${description}"`);
      lecture.description = description;
    }
    if (duration !== undefined) {
      console.log(`Updating duration to: ${duration}`);
      lecture.duration = duration;
    }
    if (isPreviewFree !== undefined) {
      console.log(`Updating isPreviewFree from ${lecture.isPreviewFree} to ${isPreviewFree}`);
      lecture.isPreviewFree = isPreviewFree;
    }

    console.log("Saving lecture...");
    const savedLecture = await lecture.save();
    console.log("Lecture saved successfully:", savedLecture);

    res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      lecture: savedLecture,
    });

  } catch (error) {
    console.error("=== EDIT LECTURE ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Error details:", error);
    
    res.status(500).json({
      success: false,
      message: "Failed to edit lecture",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Fixed removeLecture function
export const removeLecture = async (req, res) => {
  try {
    const { lectureId, courseId } = req.params;
    const userId = req.user.id;

    // Verify course belongs to user
    const course = await Course.findOne({ _id: courseId, creator: userId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission to delete lectures from it",
      });
    }

    const lecture = await Lecture.findOne({ _id: lectureId, course: courseId });
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found in this course",
      });
    }

    // Remove lecture from course's lectures array
    course.lectures = course.lectures.filter(id => id.toString() !== lectureId);
    await course.save();

    // Delete the lecture
    await lecture.deleteOne();

    res.status(200).json({
      success: true,
      message: "Lecture removed successfully",
    });
  } catch (error) {
    console.error("Remove lecture error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove lecture",
      error: error.message,
    });
  }
};

export const getCreatorById = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findById(userId).select("-password"); 
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Creator found successfully",
      creator: user
    });
    
  } catch (error) {
    console.error("Get creator error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to get creator: ${error.message}`
    });
  }
};