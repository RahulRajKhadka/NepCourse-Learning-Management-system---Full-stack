import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeftLong,
  FaPlay,
  FaLock,
  FaClock,
  FaUsers,
  FaGraduationCap,
  FaTag,
} from "react-icons/fa6";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedCourse } from "../redux/courseSlice";
import { useEffect, useState, useCallback } from "react";
import img from "../assets/empty.jpg";
import { serverUrl } from "../config.js";
import axios from "axios";
import Card from "../Component/Card.jsx";
import useScrollToTop from "../Component/UseScrollTop.jsx";
import ReviewsSection from "./ReviewsSection..jsx";

function ViewCourses() {
  const navigate = useNavigate();
  const { selectedCourse } = useSelector((state) => state.course);
  const creatorCourses = useSelector((state) => state.course.creatorCourses);
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [creatorCourse, setCreatorCourse] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);

  useScrollToTop(courseId);

  const checkEnrollmentStatus = useCallback(async () => {
    try {
      setCheckingEnrollment(true);
      const response = await axios.get(
        `${serverUrl}/api/enrollment/check/${courseId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsEnrolled(response.data.isEnrolled);
        setEnrollmentData(response.data.enrollment);
      }
    } catch {
      setIsEnrolled(false);
    } finally {
      setCheckingEnrollment(false);
    }
  }, [courseId]);

  useEffect(() => {
    checkEnrollmentStatus();
  }, [checkEnrollmentStatus]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromPayment = urlParams.get("from_payment");
    if (fromPayment === "success") {
      setTimeout(() => {
        checkEnrollmentStatus();
      }, 500);
      window.history.replaceState({}, "", `/view-course/${courseId}`);
    }
  }, [courseId, checkEnrollmentStatus]);

  const fetchCourseData = useCallback(() => {
    const foundCourse = creatorCourses.find(
      (course) => course._id === courseId
    );
    if (foundCourse) {
      dispatch(setSelectedCourse(foundCourse));
    }
  }, [creatorCourses, courseId, dispatch]);

  useEffect(() => {
    if (creatorData?._id && creatorCourses.length > 0) {
      const otherCourses = creatorCourses.filter(
        (course) =>
          course.creator === creatorData._id && course._id !== courseId
      );
      setCreatorCourse(otherCourses);
    }
  }, [creatorData, creatorCourses, courseId]);

  useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const result = await axios.post(
            serverUrl + "/api/courses/creator",
            { userId: selectedCourse?.creator },
            { withCredentials: true }
          );
          if (result.data.success) {
            setCreatorData(result.data.creator);
          }
        } catch {}
      }
    };
    handleCreator();
  }, [selectedCourse]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400 w-4 h-4" />);
    }
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className="text-yellow-400 w-4 h-4" />
      );
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FaRegStar key={`empty-${i}`} className="text-gray-300 w-4 h-4" />
      );
    }
    return stars;
  };

  const getBadgeColor = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleEnrollOrWatch = async () => {
    if (isEnrolled) {
      navigate(`/viewlecture/${courseId}`);
      return;
    }
    if (selectedCourse?.price === 0 || selectedCourse?.price === null) {
      try {
        const response = await axios.post(
          `${serverUrl}/api/enrollment/free`,
          { courseId },
          { withCredentials: true }
        );
        if (response.data.success) {
          setIsEnrolled(true);
          setEnrollmentData(response.data.enrollment);
          setTimeout(() => navigate(`/viewlecture/${courseId}`), 800);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    } else {
      navigate(`/payment/${courseId}`, {
        state: {
          course: {
            _id: courseId,
            title: selectedCourse?.title,
            price: selectedCourse?.price,
          },
          amount: selectedCourse?.price,
        },
      });
    }
  };

  const getButtonConfig = () => {
    if (checkingEnrollment) {
      return {
        text: "Checking...",
        icon: <FaClock />,
        disabled: true,
        className: "bg-gray-400 cursor-not-allowed",
      };
    }
    if (isEnrolled) {
      return {
        text: "Watch Course",
        icon: <FaPlay />,
        disabled: false,
        className: "bg-green-600 hover:bg-green-700",
      };
    }
    if (selectedCourse?.price === 0 || selectedCourse?.price === null) {
      return {
        text: "Enroll Free",
        icon: <FaLock />,
        disabled: false,
        className: "bg-blue-600 hover:bg-blue-700",
      };
    }
    return {
      text: `Enroll Now - Rs ${selectedCourse?.price}`,
      icon: <FaLock />,
      disabled: false,
      className: "bg-blue-600 hover:bg-blue-700",
    };
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4 group"
          >
            <FaArrowLeftLong className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back to Courses</span>
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <img
                  src={selectedCourse?.thumbnail || img}
                  alt={selectedCourse?.title || "Course Thumbnail"}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {isEnrolled && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                    Enrolled
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getBadgeColor(
                      selectedCourse?.level
                    )}`}
                  >
                    {capitalizeWords(selectedCourse?.level) || "All Levels"}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {capitalizeWords(selectedCourse?.category) || "General"}
                  </span>
                  {isEnrolled && enrollmentData && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                      Progress: {enrollmentData.progress}%
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {capitalizeWords(selectedCourse?.title) || "Course Title"}
                </h1>

                <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                  {selectedCourse?.description ||
                    "No description available for this course."}
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">{renderStars()}</div>
                  <span className="text-sm font-medium text-gray-700">
                    4.5 (1,234 reviews)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaClock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      {selectedCourse?.duration || "Self-paced"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaGraduationCap className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">
                      {selectedCourse?.lectures?.length || 0} Lectures
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUsers className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">2,456 Students</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaTag className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">
                      {selectedCourse?.price
                        ? `$${selectedCourse.price}`
                        : "Free"}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleEnrollOrWatch}
                    disabled={buttonConfig.disabled}
                    className={`w-full sm:w-auto px-8 py-4 text-lg ${buttonConfig.className} text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    {buttonConfig.icon}
                    {buttonConfig.text}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Course Curriculum
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedCourse?.lectures?.length || 0} lectures •{" "}
                  {selectedCourse?.duration || "Self-paced"}
                </p>
              </div>

              <div className="max-h-96 lg:max-h-[600px] overflow-y-auto">
                <div className="p-4 space-y-2">
                  {selectedCourse?.lectures?.length > 0 ? (
                    selectedCourse.lectures.map((lecture, index) => (
                      <button
                        key={index}
                        disabled={!lecture.isPreviewFree && !isEnrolled}
                        onClick={() => {
                          if (lecture.isPreviewFree || isEnrolled)
                            setSelectedLecture(lecture);
                        }}
                        className={`w-full flex items-center gap-3 text-left p-3 rounded-lg transition-all duration-200 ${
                          lecture.isPreviewFree || isEnrolled
                            ? "bg-gray-50 hover:bg-blue-50 hover:border-blue-200 cursor-pointer border-2 border-transparent"
                            : "bg-gray-25 opacity-60 cursor-not-allowed border-2 border-gray-100"
                        } ${
                          selectedLecture?.title === lecture.title
                            ? "bg-blue-50 border-blue-200"
                            : ""
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {lecture.isPreviewFree || isEnrolled ? (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <FaPlay className="text-green-600 w-3 h-3 ml-0.5" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <FaLock className="text-gray-400 w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {index + 1}. {capitalizeWords(lecture.title)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {isEnrolled
                              ? "Available"
                              : lecture.isPreviewFree
                              ? "Free Preview"
                              : "Premium Content"}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No lectures available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-video w-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                {selectedLecture?.videoUrl ? (
                  <video
                    className="w-full h-full object-cover"
                    src={selectedLecture.videoUrl}
                    controls
                    poster={selectedCourse?.thumbnail}
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaPlay className="text-white w-6 h-6 ml-1" />
                    </div>
                    <h3 className="text-white text-lg font-medium mb-2">
                      Ready to start learning?
                    </h3>
                    <p className="text-gray-300 text-sm max-w-md mx-auto">
                      {isEnrolled
                        ? "Select a lecture from the curriculum to start watching."
                        : "Select a preview lecture from the curriculum to watch a free sample of this course."}
                    </p>
                  </div>
                )}
              </div>

              {selectedLecture && (
                <div className="p-6 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {capitalizeWords(selectedLecture.title)}
                  </h3>
                  <p className="text-gray-600">
                    {isEnrolled
                      ? "You have full access to this lecture."
                      : "This is a free preview lecture. Enroll to access all course content."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <ReviewsSection courseId={courseId} isEnrolled={isEnrolled} />

        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Meet Your Instructor
            </h2>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={creatorData?.photoUrl || img}
                  alt="Instructor"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-gray-200 shadow-lg"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {creatorData?.name?.toUpperCase() || "UNKNOWN INSTRUCTOR"}
                  </h3>
                  <p className="text-blue-600 font-medium">Course Instructor</p>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg max-w-4xl">
                  {creatorData?.description ||
                    "An experienced instructor dedicated to helping students achieve their learning goals through comprehensive and engaging course content."}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>⭐ 4.8 Instructor Rating</span>
                  <span>👥 12,345 Students</span>
                  <span>📚 {creatorCourse?.length + 1 || 1} Courses</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {creatorCourse?.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  More Courses by {creatorData?.name || "This Instructor"}
                </h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                  View All →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {creatorCourse.map((course, index) => (
                  <div
                    key={index}
                    className="transform hover:-translate-y-1 transition-transform duration-200"
                  >
                    <Card
                      thumbnail={course.thumbnail}
                      id={course._id}
                      price={course.price}
                      title={course.title}
                      category={course.category}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewCourses;
