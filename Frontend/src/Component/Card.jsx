import React, { useState, useEffect } from "react";
import img from "../assets/empty.jpg";
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
  const [imageSrc, setImageSrc] = useState(thumbnail);
  const navigate = useNavigate();

  useEffect(() => {
    if (!thumbnail || !thumbnail.startsWith("http")) {
      setImageSrc(img);
    } else {
      setImageSrc(thumbnail);
    }
  }, [thumbnail]);

  const getCategoryColor = (category) => {
    const colors = {
      "Web development": "bg-blue-50 text-blue-700 border-blue-200",
      "App development": "bg-emerald-50 text-emerald-700 border-emerald-200",
      "Data Science": "bg-purple-50 text-purple-700 border-purple-200",
      "AI/ML": "bg-orange-50 text-orange-700 border-orange-200",
      General: "bg-slate-50 text-slate-700 border-slate-200",
    };
    return colors[category] || colors["General"];
  };

  const getLevelBadge = (level) => {
    const badges = {
      Beginner: {
        color: "bg-green-100 text-green-700 border-green-300",
        icon: "📚",
      },
      Intermediate: {
        color: "bg-amber-100 text-amber-700 border-amber-300",
        icon: "📖",
      },
      Advanced: { color: "bg-red-100 text-red-700 border-red-300", icon: "🎓" },
    };
    return (
      badges[level] || {
        color: "bg-gray-100 text-gray-700 border-gray-300",
        icon: "📕",
      }
    );
  };

  const levelBadge = getLevelBadge(level);

  return (
    <div
      className="
        group relative max-w-sm w-full bg-white rounded-xl
        shadow-sm hover:shadow-2xl 
        transition-all duration-500 overflow-hidden 
        border border-gray-100 hover:border-blue-300
        cursor-pointer transform hover:-translate-y-2
      "
      onClick={() => navigate(`/course/${id}`)}
    >
      {/* Thumbnail with Overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={() => setImageSrc(img)}
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category Badge - Top Left */}
        <div className="absolute top-3 left-3">
          <span
            className={`
              inline-flex items-center px-3 py-1.5 text-xs font-semibold 
              rounded-lg border backdrop-blur-sm bg-white/90
              ${getCategoryColor(category)}
              shadow-sm
            `}
          >
            {category || "General"}
          </span>
        </div>

        {/* Level Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <span
            className={`
              inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold 
              rounded-lg border backdrop-blur-sm bg-white/90
              ${levelBadge.color}
              shadow-sm
            `}
          >
            <span>{levelBadge.icon}</span>
            <span>{level || "All Levels"}</span>
          </span>
        </div>

        {/* Price Badge - Bottom Right */}
        <div className="absolute bottom-3 right-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="bg-white rounded-lg px-3 py-2 shadow-lg">
            <p className="text-lg font-bold text-blue-600">
              {price === 0 || !price ? "Free" : `₹${price}`}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {description ||
            "Discover amazing content and enhance your learning journey with this course."}
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
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
            </div>
            <span className="text-gray-700 font-semibold">4.8</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1.5 text-gray-500">
            <svg
              className="w-4 h-4"
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
            <span className="font-medium">8-12 hrs</span>
          </div>
        </div>

        {/* Enrolled Students */}
        {enrolledStudents && enrolledStudents.length > 0 && (
          <div className="flex items-center gap-2 text-sm pt-2">
            <div className="flex -space-x-2">
              {[...Array(Math.min(3, enrolledStudents.length))].map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="text-gray-600 font-medium">
              {enrolledStudents.length}+ students enrolled
            </span>
          </div>
        )}

        {/* CTA Button - Appears on Hover */}
        <div className="pt-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg">
            View Course Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
