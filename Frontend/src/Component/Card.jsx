import React, { useState } from "react";
import img from "../assets/empty.jpg"; // fallback image

function Card({ 
  thumbnail, 
  category, 
  price, 
  title, 
  id, 
  description, 
  level, 
  enrolledStudents 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Category color mapping
  const getCategoryColor = (category) => {
    const colors = {
      "Web development": "bg-blue-100 text-blue-800 border-blue-200",
      "App development": "bg-green-100 text-green-800 border-green-200",
      "Data Science": "bg-purple-100 text-purple-800 border-purple-200",
      "AI/ML": "bg-orange-100 text-orange-800 border-orange-200",
      "General": "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[category] || colors["General"];
  };

  // Level indicator color
  const getLevelColor = (level) => {
    const colors = {
      "Beginner": "text-green-600",
      "Intermediate": "text-yellow-600", 
      "Advanced": "text-red-600"
    };
    return colors[level] || "text-gray-600";
  };

  return (
    <div 
      className={`
        group max-w-sm w-full bg-white rounded-2xl shadow-lg overflow-hidden 
        hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 
        border border-gray-100 hover:border-blue-200 relative
        ${isHovered ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Container */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {/* Main Image */}
        <img
          src={imageError ? img : (thumbnail || img)}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`
            inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold 
            backdrop-blur-md border ${getCategoryColor(category)} shadow-lg
          `}>
            <div className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></div>
            {category || "General"}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
            <span className="font-bold text-gray-800 text-sm">
              {price === 0 || !price ? "Free" : `₹${price}`}
            </span>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white drop-shadow-lg line-clamp-2 leading-tight">
            {title}
          </h3>
        </div>

        {/* Hover Effect Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                        transition-transform duration-1000 ease-out"></div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Description */}
        <div className="space-y-3">
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {description || "Discover amazing content and enhance your learning journey with this comprehensive course."}
          </p>
          
          {/* Course Details */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className={`font-medium ${getLevelColor(level)}`}>
                  {level || "All Levels"}
                </span>
              </div>
              
              {enrolledStudents && (
                <div className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{enrolledStudents} enrolled</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        {/* Stats Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Rating Stars (Mock) */}
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-gray-500 text-sm ml-1">4.8</span>
            </div>
            
            {/* Duration (Mock) */}
            <div className="flex items-center text-gray-500 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>8-12 hrs</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="
          group/btn relative w-full overflow-hidden rounded-xl
          bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700
          hover:from-blue-700 hover:via-purple-700 hover:to-blue-800
          text-white font-semibold py-3.5 px-6 shadow-lg hover:shadow-xl
          transform hover:scale-[1.02] active:scale-[0.98]
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
        ">
          {/* Button Background Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                          transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full 
                          transition-transform duration-700"></div>
          
          {/* Button Content */}
          <span className="relative flex items-center justify-center space-x-2">
            <span>View Details</span>
            <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-200" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>
      </div>

      {/* Card Border Glow Effect */}
      <div className={`
        absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none
        ${isHovered ? 'opacity-100' : 'opacity-0'}
        bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 blur-xl
      `}></div>
    </div>
  );
}

export default Card;