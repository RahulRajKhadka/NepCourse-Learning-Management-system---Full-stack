import Course from "../Model/courseModel.js";
import Enrollment from "../Model/Enrollment.js";
import Payment from "../Model/paymentModel.js";
import mongoose from "mongoose";

export const getInstructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user._id;

    const instructorCourses = await Course.find({ creator: instructorId })
      .select("_id title price thumbnail isPublished createdAt")
      .lean();

    const courseIds = instructorCourses.map((c) => c._id);

    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
      enrollmentType: "paid",
    })
      .populate("course", "title price")
      .populate("user", "name email photoUrl")
      .sort({ createdAt: -1 })
      .lean();

    const totalRevenue = enrollments.reduce((sum, enrollment) => {
      return sum + (enrollment.course?.price || 0);
    }, 0);

    const payments = await Payment.find({
      course: { $in: courseIds },
      status: "success",
    })
      .select("amount paidAt course")
      .sort({ paidAt: 1 })
      .lean();

    const courseStats = instructorCourses.map((course) => {
      const courseEnrollments = enrollments.filter(
        (e) => e.course?._id.toString() === course._id.toString(),
      );

      return {
        _id: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        price: course.price,
        isPublished: course.isPublished,
        enrollmentCount: courseEnrollments.length,
        revenue: courseEnrollments.length * (course.price || 0),
        createdAt: course.createdAt,
      };
    });

    courseStats.sort((a, b) => b.enrollmentCount - a.enrollmentCount);

    // Get recent enrollments (last 10)
    const recentEnrollments = enrollments.slice(0, 10).map((e) => ({
      _id: e._id,
      studentName: e.user?.name || "Unknown",
      studentEmail: e.user?.email || "",
      studentPhoto: e.user?.photoUrl || "",
      courseName: e.course?.title || "Unknown Course",
      amount: e.course?.price || 0,
      enrolledAt: e.createdAt,
      progress: e.progress || 0,
    }));

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueByMonth = {};
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      revenueByMonth[key] = 0;
    }

    payments.forEach((payment) => {
      if (payment.paidAt && payment.paidAt >= sixMonthsAgo) {
        const date = new Date(payment.paidAt);
        const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        revenueByMonth[key] = (revenueByMonth[key] || 0) + payment.amount;
      }
    });

    const revenueChartData = Object.entries(revenueByMonth).map(
      ([month, revenue]) => ({
        month,
        revenue,
      }),
    );

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newEnrollmentsLast7Days = enrollments.filter(
      (e) => new Date(e.createdAt) >= sevenDaysAgo,
    ).length;

    const newEnrollmentsLast30Days = enrollments.filter(
      (e) => new Date(e.createdAt) >= thirtyDaysAgo,
    ).length;

    return res.status(200).json({
      success: true,
      data: {
        overview: {
          totalCourses: instructorCourses.length,
          publishedCourses: instructorCourses.filter((c) => c.isPublished)
            .length,
          totalStudents: enrollments.length,
          totalRevenue: totalRevenue,
          newStudentsLast7Days: newEnrollmentsLast7Days,
          newStudentsLast30Days: newEnrollmentsLast30Days,
        },
        courseStats,
        recentEnrollments,
        revenueChartData,
      },
    });
  } catch (error) {
    console.error("Get instructor dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};

export const getCourseDetailedStats = async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructorId = req.user._id;

    // Verify course ownership
    const course = await Course.findOne({
      _id: courseId,
      creator: instructorId,
    })
      .populate("lectures")
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission",
      });
    }

    const enrollments = await Enrollment.find({ course: courseId })
      .populate("user", "name email photoUrl")
      .sort({ createdAt: -1 })
      .lean();

    const avgProgress =
      enrollments.length > 0
        ? enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) /
          enrollments.length
        : 0;

    const completedCount = enrollments.filter(
      (e) => e.status === "completed",
    ).length;
    const completionRate =
      enrollments.length > 0 ? (completedCount / enrollments.length) * 100 : 0;

    const totalRevenue =
      enrollments.filter((e) => e.enrollmentType === "paid").length *
      (course.price || 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const enrollmentsByDay = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      enrollmentsByDay[key] = 0;
    }

    enrollments.forEach((enrollment) => {
      const date = new Date(enrollment.createdAt);
      if (date >= thirtyDaysAgo) {
        const key = date.toISOString().split("T")[0];
        enrollmentsByDay[key] = (enrollmentsByDay[key] || 0) + 1;
      }
    });

    const enrollmentTrend = Object.entries(enrollmentsByDay)
      .map(([date, count]) => ({ date, enrollments: count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return res.status(200).json({
      success: true,
      data: {
        course: {
          _id: course._id,
          title: course.title,
          thumbnail: course.thumbnail,
          price: course.price,
          category: course.category,
          level: course.level,
          lectureCount: course.lectures?.length || 0,
        },
        stats: {
          totalEnrollments: enrollments.length,
          completedStudents: completedCount,
          averageProgress: Math.round(avgProgress),
          completionRate: Math.round(completionRate),
          totalRevenue,
        },
        enrollmentTrend,
        students: enrollments.map((e) => ({
          _id: e._id,
          name: e.user?.name || "Unknown",
          email: e.user?.email || "",
          photo: e.user?.photoUrl || "",
          progress: e.progress || 0,
          status: e.status,
          enrolledAt: e.createdAt,
          completedAt: e.completedAt,
        })),
      },
    });
  } catch (error) {
    console.error("Get course detailed stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course statistics",
      error: error.message,
    });
  }
};
