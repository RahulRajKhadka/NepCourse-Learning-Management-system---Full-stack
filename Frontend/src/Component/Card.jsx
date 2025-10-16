import React, { useState } from "react";
import img from "../assets/empty.jpg"; // fallback image
import { useNavigate } from "react-router-dom";

function Card({
  thumbnail,
  category,
  price,
  title,
  id,
  description,
  level,
  enrolledStudents,
}) {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  // Category color mapping
  const getCategoryColor = (category) => {
    const colors = {
      "Web development": "bg-blue-100 text-blue-800 border-blue-200",
      "App development": "bg-green-100 text-green-800 border-green-200",
      "Data Science": "bg-purple-100 text-purple-800 border-purple-200",
      "AI/ML": "bg-orange-100 text-orange-800 border-orange-200",
      General: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[category] || colors["General"];
  };

  // Level indicator color
  const getLevelColor = (level) => {
    const colors = {
      Beginner: "text-green-600",
      Intermediate: "text-yellow-600",
      Advanced: "text-red-600",
    };
    return colors[level] || "text-gray-600";
  };

  return (
    <div
      className="
        max-w-sm w-full bg-white rounded-2xl shadow-md hover:shadow-xl 
        transition-all duration-300 overflow-hidden border border-gray-100
        hover:border-blue-200 cursor-pointer 
      "
      onClick={() => navigate(`/course/${id}`)}
    >
      {/* Thumbnail */}
      <div className="h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={imageError ? img : thumbnail || img}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Category Badge */}
        <span
          className={`
            inline-block px-3 py-1 text-xs font-semibold rounded-full border 
            ${getCategoryColor(category)}
          `}
        >
          {category || "General"}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
          {title}
        </h3>

        {/* Price */}
        <p className="text-blue-600 font-semibold text-sm">
          {price === 0 || !price ? "Free" : `₹${price}`}
        </p>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">
          {description ||
            "Discover amazing content and enhance your learning journey with this course."}
        </p>

        {/* Course Details */}
        <div className="flex items-center justify-between text-xs mt-2">
          <span className={`font-medium ${getLevelColor(level)}`}>
            {level || "All Levels"}
          </span>
          {enrolledStudents && (
            <span className="text-gray-500">{enrolledStudents} enrolled</span>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200"></div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-gray-500 text-sm ml-1">4.8</span>
          </div>

          {/* Duration */}
          <div className="flex items-center text-gray-500 text-sm">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>8-12 hrs</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
