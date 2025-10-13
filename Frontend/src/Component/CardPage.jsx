import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import usePublishedCourses from "../customHooks/getPublishedCourse"; // adjust path
import Card from "../Component/Card"; // ✅ Import the Card component

const CardPage = () => {
  // ✅ FIXED: Call the custom hook to fetch data
  usePublishedCourses();

  const courseData = useSelector((state) => state.course.creatorCourses);
  console.log("Redux courseData:", courseData);

  const [PopularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
    if (Array.isArray(courseData)) {
      setPopularCourses(courseData.slice(0, 5)); // only first 5
    }
  }, [courseData]);

  return (
    <div className="relative flex items-center justify-center flex-col bg-gray-50">
      {/* Title */}
      <h1 className="md:text-4xl text-2xl font-bold text center mt-10 px-4">
        Our Popular Courses
      </h1>
      <p className="lg:w-1/2 md:w-4/5 text-lg text-gray-600 text-center mt-4 px-4">
        Explore top-rated courses designed to enhance your skills and boost your
        career.
      </p>

      {/* Course Cards */}
      <div className="w-full min-h-screen flex items-center justify-center flex-wrap gap-8 lg:p-12 md:p-8 p-4 mb-10">
        {PopularCourses.length > 0 ? (
          PopularCourses.map((course) => (
            <Card
              key={course._id}
              id={course._id}
              title={course.title}
              description={course.description}
              thumbnail={course.thumbnail}
              category={course.category}
              level={course.level}
              price={course.price}
              enrolledStudents={course.enrolledStudents}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 text-lg">
            Loading courses...
          </div>
        )}
      </div>
    </div>
  );
};

export default CardPage;
