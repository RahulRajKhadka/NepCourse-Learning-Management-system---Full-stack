import Enrollment from "../Model/Enrollment.js"
import User from "../Model/userModel.js";
import Course from "../Model/courseModel.js";

export const enrollFreeCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.price && course.price > 0) {
      return res.status(400).json({
        success: false,
        message: "This is a paid course. Please proceed with payment.",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(200).json({
        success: true,
        message: "Already enrolled in this course",
        enrollment: existingEnrollment,
        alreadyEnrolled: true,
      });
    }

    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      enrollmentType: "free",
      status: "active",
    });

    const user = await User.findById(userId);
    await user.addEnrolledCourse(courseId);

    await enrollment.populate("course");

    return res.status(201).json({
      success: true,
      message: "Successfully enrolled in the course",
      enrollment,
    });

  } catch (error) {
    console.error("Free enrollment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to enroll in course",
      error: error.message,
    });
  }
};

export const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const enrollments = await Enrollment.find({ 
      user: userId,
      status: "active"
    })
      .populate({
        path: "course",
        select: "title description thumbnail price category level duration lectures",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });

  } catch (error) {
    console.error("Get enrolled courses error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled courses",
      error: error.message,
    });
  }
};

export const checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      status: "active",
    });

    return res.status(200).json({
      success: true,
      isEnrolled: !!enrollment,
      enrollment: enrollment || null,
    });

  } catch (error) {
    console.error("Check enrollment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check enrollment",
      error: error.message,
    });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lectureId, progress } = req.body;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      status: "active",
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    if (lectureId && !enrollment.completedLectures.includes(lectureId)) {
      enrollment.completedLectures.push(lectureId);
    }

    if (progress !== undefined) {
      enrollment.progress = Math.min(100, Math.max(0, progress));
    }

    if (enrollment.progress === 100 && !enrollment.completedAt) {
      enrollment.status = "completed";
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    return res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      enrollment,
    });

  } catch (error) {
    console.error("Update progress error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update progress",
      error: error.message,
    });
  }
};
