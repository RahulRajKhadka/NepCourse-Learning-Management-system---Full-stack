// pages/MyCourses.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../config.js";
import {
  FaPlay,
  FaGraduationCap,
  FaClock,
  FaTrophy,
  FaSpinner,
} from "react-icons/fa";
import Card from "../Component/Card.jsx";

export default function MyCourses() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${serverUrl}/api/enrollment/my-courses`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setEnrollments(response.data.enrollments);
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      if (error.response?.status === 401) {
        setError("Please login to view your courses");
        navigate("/login");
      } else {
        setError("Failed to load courses. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 0) return "bg-gray-200";
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      dropped: "bg-red-100 text-red-800",
    };
    return badges[status] || badges.active;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => fetchEnrolledCourses()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Enrolled Courses
          </h1>
          <p className="text-gray-600">
            Continue learning and track your progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Courses
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {enrollments.length}
                </p>
              </div>
              <FaGraduationCap className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {enrollments.filter((e) => e.status === "completed").length}
                </p>
              </div>
              <FaTrophy className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {
                    enrollments.filter(
                      (e) => e.status === "active" && e.progress > 0
                    ).length
                  }
                </p>
              </div>
              <FaClock className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {enrollments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <FaGraduationCap className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Enrolled Courses Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start your learning journey by enrolling in a course
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/course/${enrollment.course._id}`)}
              >
               
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={enrollment.course.thumbnail}
                    alt={enrollment.course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                        enrollment.status
                      )}`}
                    >
                      {enrollment.status.charAt(0).toUpperCase() +
                        enrollment.status.slice(1)}
                    </span>
                  </div>

                
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <FaPlay className="w-6 h-6 text-blue-600 ml-1" />
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {enrollment.course.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {enrollment.course.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Progress
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {enrollment.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(
                          enrollment.progress
                        )} transition-all duration-300`}
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaGraduationCap className="w-4 h-4" />
                      <span>
                        {enrollment.completedLectures.length} /{" "}
                        {enrollment.course.lectures?.length || 0} lectures
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          enrollment.enrollmentType === "free"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                      ></span>
                      <span className="capitalize">
                        {enrollment.enrollmentType}
                      </span>
                    </div>
                  </div>

                
                  <button
                    className="w-full mt-4 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/course/${enrollment.course._id}`);
                    }}
                  >
                    <FaPlay className="w-4 h-4" />
                    {enrollment.progress === 0
                      ? "Start Course"
                      : enrollment.progress === 100
                      ? "Review Course"
                      : "Continue Learning"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
