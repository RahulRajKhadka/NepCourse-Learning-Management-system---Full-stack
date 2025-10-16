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
    const courses = await Course.find({ isPublished: true })
      .populate("lectures");
      
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
      .populate('lectures')
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
    const { title, subTitle, description, category, level, price, isPublished } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format"
      });
    }

    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    if (course.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this course",
      });
    }

    const updateFields = {};
    
    if (title) updateFields.title = title;
    if (subTitle) updateFields.subTitle = subTitle;
    if (description) updateFields.description = description;
    if (category) updateFields.category = category;
    if (level) updateFields.level = level;
    if (price) updateFields.price = price;
    if (isPublished !== undefined) {
      updateFields.isPublished = isPublished === 'true' || isPublished === true;
    }

    if (req.file) {
      try {
        const cloudinaryResult = await uploadOnCloudinary(req.file.path);
        updateFields.thumbnail = cloudinaryResult.url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload thumbnail",
          error: uploadError.message
        });
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateFields,
      { new: true, runValidators: true }
    ).populate("lectures");

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found after update"
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse
    });

  } catch (error) {
    console.error("Edit course error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message
    });
  }
};

export const publishToggle = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { isPublished } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to publish/unpublish this course",
      });
    }

    course.isPublished = isPublished;
    await course.save();

    await course.populate("lectures");

    return res.status(200).json({
      success: true,
      message: isPublished
        ? "Course published successfully"
        : "Course unpublished successfully",
      course,
    });
  } catch (error) {
    console.error("Error toggling publish status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update publish status",
      error: error.message,
    });
  }
};

export const getEducatorPublishedCourses = async (req, res) => {
  try {
    const { educatorId } = req.params;
    
    const courses = await Course.find({ 
      creator: educatorId,
      isPublished: true 
    })
      .populate("lectures")
      .populate("creator", "name email photoUrl description");
    
    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get educator published courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve courses",
      error: error.message,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const trimmedCourseId = courseId.trim();

    if (!mongoose.Types.ObjectId.isValid(trimmedCourseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    const course = await Course.findById(trimmedCourseId)
      .populate("creator", "name email")
      .populate("lectures");

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

export const getCourseLectures = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findOne({ _id: courseId, creator: userId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission to access it",
      });
    }

    const lectures = await Lecture.find({ course: courseId }).sort({ createdAt: 1 });

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

    if (!title || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (title is required)",
      });
    }

    const course = await Course.findOne({ _id: courseId, creator: userId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission to add lectures to it",
      });
    }

    const lectureData = {
      title,
      description: description || "",
      duration: duration || 0,
      isPreviewFree: isPreviewFree || false,
      course: courseId,
    };

    if (req.file) {
      const cloudinaryResult = await uploadOnCloudinary(req.file.path);
      lectureData.videoUrl = cloudinaryResult.url;
    }

    const lecture = await Lecture.create(lectureData);

    course.lectures.push(lecture._id);
    await course.save();
    
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
    const { lectureId, courseId } = req.params;
    const { title, description, duration, isPreviewFree } = req.body;
    const userId = req.user.id;

    const course = await Course.findOne({ _id: courseId, creator: userId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission to edit it",
      });
    }

    const lecture = await Lecture.findOne({ _id: lectureId, course: courseId });
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found in this course",
      });
    }

    if (req.file) {
      try {
        const cloudinaryResult = await uploadOnCloudinary(req.file.path);
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

    if (title) lecture.title = title;
    if (description !== undefined) lecture.description = description;
    if (duration !== undefined) lecture.duration = duration;
    if (isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree;

    const savedLecture = await lecture.save();

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

export const removeLecture = async (req, res) => {
  try {
    const { lectureId, courseId } = req.params;
    const userId = req.user.id;

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

    course.lectures = course.lectures.filter(id => id.toString() !== lectureId);
    await course.save();

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
