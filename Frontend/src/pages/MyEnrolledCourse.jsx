import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBookOpen,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaPlay,
} from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../config.js";

const MyEnrolledCourse = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${serverUrl}/api/enrollment/my-courses`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setEnrollments(response.data.enrollments);
        }
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load courses. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (userData) {
      fetchEnrolledCourses();
    } else {
      setLoading(false);
    }
  }, [userData]);

  // Enhanced Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-white rounded-full shadow-sm animate-pulse"></div>
            <div>
              <div className="h-8 w-64 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft className="w-4 h-4 text-gray-600" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">
                My Enrolled Courses
              </h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Unable to Load Courses
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completedCourses = enrollments.filter(
    (e) => e.status === "completed"
  ).length;
  const inProgressCourses = enrollments.filter(
    (e) => e.status === "active" && e.progress > 0
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 sm:px-6 py-8">
       
        <div className="flex items-center gap-4 mb-8">
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200 group"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              My Learning Journey
            </h1>
            <p className="text-gray-600 text-base">
              {enrollments.length}{" "}
              {enrollments.length === 1 ? "course" : "courses"} enrolled
              {completedCourses > 0 && ` • ${completedCourses} completed`}
            </p>
          </div>
        </div>


        {enrollments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FaBookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {enrollments.length}
                  </p>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Enrolled
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <FaCheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedCourses}
                  </p>
                  <p className="text-gray-600 text-sm font-medium">Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <FaChartLine className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {inProgressCourses}
                  </p>
                  <p className="text-gray-600 text-sm font-medium">
                    In Progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center">
              <FaBookOpen className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Start Your Learning Journey
            </h3>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md mx-auto">
              You haven't enrolled in any courses yet. Explore our catalog and
              find the perfect course to begin your adventure.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Explore Courses
            </button>
          </div>
        ) : (
          <>
     
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => {
                const course = enrollment.course;
                const completedLectures =
                  enrollment.completedLectures?.length || 0;
                const totalLectures = course.lectures?.length || 0;
                const isCompleted = enrollment.status === "completed";

                return (
                  <div
                    key={enrollment._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                    onClick={() => navigate(`/course/${course._id}`)}
                  >
                    {/* Thumbnail with Status Badge */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <img
                        src={course.thumbnail || "/placeholder-course.jpg"}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "/placeholder-course.jpg";
                        }}
                      />

                  
                      <div className="absolute top-3 right-3">
                        {isCompleted ? (
                          <div className="bg-green-500 text-white rounded-full px-3 py-1.5 shadow-lg backdrop-blur-sm">
                            <span className="text-xs font-semibold flex items-center gap-1">
                              <FaCheckCircle className="w-3 h-3" />
                              Completed
                            </span>
                          </div>
                        ) : (
                          <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border border-gray-100">
                            <span className="text-xs font-semibold text-blue-600">
                              {enrollment.progress}% Done
                            </span>
                          </div>
                        )}
                      </div>

                     
                      <div className="absolute top-3 left-3">
                        <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {course.category}
                        </span>
                      </div>

                  
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl">
                            <FaPlay className="w-5 h-5 text-blue-600 ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>

                 
                    <div className="p-5">
                    
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>

                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                  
                      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <FaClock className="w-3 h-3" />
                          <span>{totalLectures} lessons</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                          <span>{course.level}</span>
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">
                            Your Progress
                          </span>
                          <span className="font-bold text-gray-900">
                            {enrollment.progress}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ease-out ${
                              isCompleted
                                ? "bg-gradient-to-r from-green-400 to-green-600"
                                : "bg-gradient-to-r from-blue-500 to-blue-600"
                            }`}
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                          {completedLectures} of {totalLectures} lessons
                          completed
                        </p>
                      </div>

                    
                      <button
                        className={`w-full mt-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                          isCompleted
                            ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/course/${course._id}`);
                        }}
                      >
                        {isCompleted ? "Review Course" : "Continue Learning"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyEnrolledCourse;
