import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../config.js";
import {
  Play,
  Clock,
  User,
  ArrowLeft,
  BookOpen,
  AlertCircle,
  Loader2,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const ViewLecture = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { creatorCourses, educatorPublishedCourses, publishedCourses } =
    useSelector((state) => state.course);

  const selectedCourse =
    creatorCourses.find((course) => course._id === courseId) ||
    educatorPublishedCourses.find((course) => course._id === courseId) ||
    publishedCourses.find((course) => course._id === courseId) ||
    null;

  useEffect(() => {
    if (selectedCourse) {
      setIsLoading(false);
      if (selectedCourse.lectures?.length > 0) {
        setSelectedLecture(selectedCourse.lectures[0]);
      }
    }
  }, [selectedCourse]);

  useEffect(() => {
    const fetchCreator = async () => {
      if (!selectedCourse?.creator) return;

      try {
        setIsLoading(true);
        const result = await axios.post(
          `${serverUrl}/api/courses/creator`,
          { userId: selectedCourse.creator },
          { withCredentials: true }
        );

        if (result.data.success) {
          setCreatorData(result.data.creator);
        }
      } catch (error) {
        console.error("Error fetching creator:", error);
        setError("Failed to load creator information");
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedCourse) {
      fetchCreator();
    }
  }, [selectedCourse]);

  const handleLectureSelect = (lecture) => {
    setSelectedLecture(lecture);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getCurrentLectureIndex = () => {
    if (!selectedCourse?.lectures || !selectedLecture) return 0;
    return selectedCourse.lectures.findIndex(
      (lecture) => lecture._id === selectedLecture._id
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The course you're looking for doesn't exist or you don't have access
            to it.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium hidden sm:inline">
                Back
              </span>
            </button>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden flex items-center text-gray-700 font-medium text-sm"
            >
              <Menu className="w-5 h-5 mr-1" />
              Course Content
            </button>
          </div>
        </div>
      </div>

      {/* Course Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {selectedCourse.title}
            </h1>

            {selectedCourse.description && (
              <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                {selectedCourse.description}
              </p>
            )}

            {creatorData && (
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-3">
                  {creatorData.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Instructor</p>
                  <p className="text-base font-semibold text-gray-900">
                    {creatorData.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden shadow-lg aspect-video">
              {selectedLecture?.videoUrl ? (
                <video
                  key={selectedLecture.videoUrl}
                  src={selectedLecture.videoUrl}
                  controls
                  className="w-full h-full"
                  poster={selectedLecture.thumbnail}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Play className="w-16 h-16 mx-auto mb-3 opacity-50" />
                    <p className="text-lg">No video available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Current Lecture Info */}
            {selectedLecture && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {selectedLecture.title}
                    </h2>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>
                        Lecture {getCurrentLectureIndex() + 1} of{" "}
                        {selectedCourse.lectures?.length || 0}
                      </span>
                      {selectedLecture.duration && (
                        <>
                          <span className="mx-2">•</span>
                          <Clock className="w-4 h-4 mr-1" />
                          <span>
                            {formatDuration(selectedLecture.duration)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {selectedLecture.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                      Overview
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedLecture.description}
                    </p>
                  </div>
                )}

                {selectedLecture.resources?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                      Resources
                    </h3>
                    <div className="space-y-2">
                      {selectedLecture.resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-700 py-2 group"
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          <span className="underline">
                            {resource.name || `Resource ${index + 1}`}
                          </span>
                          <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lectures Sidebar - Desktop */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-20">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">
                  Course Content
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedCourse.lectures?.length || 0} lectures
                </p>
              </div>

              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {selectedCourse.lectures?.length > 0 ? (
                  <ul>
                    {selectedCourse.lectures.map((lecture, index) => (
                      <li key={lecture._id}>
                        <button
                          onClick={() => handleLectureSelect(lecture)}
                          className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            selectedLecture?._id === lecture._id
                              ? "bg-blue-50 border-l-4 border-l-blue-600"
                              : "border-l-4 border-l-transparent"
                          }`}
                        >
                          <div className="flex items-start">
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold mr-3 ${
                                selectedLecture?._id === lecture._id
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {selectedLecture?._id === lecture._id ? (
                                <Play className="w-4 h-4 fill-white" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4
                                className={`text-sm font-medium mb-1 ${
                                  selectedLecture?._id === lecture._id
                                    ? "text-blue-900"
                                    : "text-gray-900"
                                }`}
                              >
                                {lecture.title}
                              </h4>
                              {lecture.duration && (
                                <p className="text-xs text-gray-500">
                                  {formatDuration(lecture.duration)}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No lectures available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Course Content
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedCourse.lectures?.length || 0} lectures
                </p>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {selectedCourse.lectures?.length > 0 ? (
                <ul>
                  {selectedCourse.lectures.map((lecture, index) => (
                    <li key={lecture._id}>
                      <button
                        onClick={() => handleLectureSelect(lecture)}
                        className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          selectedLecture?._id === lecture._id
                            ? "bg-blue-50 border-l-4 border-l-blue-600"
                            : "border-l-4 border-l-transparent"
                        }`}
                      >
                        <div className="flex items-start">
                          <div
                            className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold mr-3 ${
                              selectedLecture?._id === lecture._id
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {selectedLecture?._id === lecture._id ? (
                              <Play className="w-4 h-4 fill-white" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`text-sm font-medium mb-1 ${
                                selectedLecture?._id === lecture._id
                                  ? "text-blue-900"
                                  : "text-gray-900"
                              }`}
                            >
                              {lecture.title}
                            </h4>
                            {lecture.duration && (
                              <p className="text-xs text-gray-500">
                                {formatDuration(lecture.duration)}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No lectures available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewLecture;
