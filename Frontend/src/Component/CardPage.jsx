import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import useAllPublishedCourses from "../customHooks/useAllPublishedCourses";
import Card from "../Component/Card";

const CardPage = () => {
  const { loading } = useAllPublishedCourses();

  const publishedCourses = useSelector(
    (state) => state.course.publishedCourses || []
  );

  useEffect(() => {
    console.log("Published courses in CardPage:", publishedCourses);
  }, [publishedCourses]);

  const sortedCourses = useMemo(() => {
    if (!publishedCourses || publishedCourses.length === 0) return [];

    return [...publishedCourses].sort((a, b) => {
      const avgRatingA =
        a.reviews && a.reviews.length > 0
          ? a.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
            a.reviews.length
          : 0;

      const avgRatingB =
        b.reviews && b.reviews.length > 0
          ? b.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
            b.reviews.length
          : 0;

      if (avgRatingB !== avgRatingA) {
        return avgRatingB - avgRatingA;
      }

      const reviewCountA = a.reviews ? a.reviews.length : 0;
      const reviewCountB = b.reviews ? b.reviews.length : 0;

      if (reviewCountB !== reviewCountA) {
        return reviewCountB - reviewCountA;
      }

      const enrolledA = a.enrolledStudents ? a.enrolledStudents.length : 0;
      const enrolledB = b.enrolledStudents ? b.enrolledStudents.length : 0;

      return enrolledB - enrolledA;
    });
  }, [publishedCourses]);

  const displayCourses = sortedCourses.slice(0, 12);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl text-white sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mt-6 sm:mt-8 md:mt-10">
          Popular Courses
        </h1>
        <p className="text-sm  text-white sm:text-base md:text-lg text-gray-600 text-center mt-3 sm:mt-4 max-w-4xl mx-auto px-4">
          Explore our highest-rated and most popular courses
        </p>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
          {loading ? (
            <div className="col-span-full text-center text-gray-500 text-lg py-12">
              Loading courses...
            </div>
          ) : displayCourses && displayCourses.length > 0 ? (
            displayCourses.map((course) => (
              <div key={course._id} className="flex justify-center">
                <Card
                  id={course._id}
                  title={course.title}
                  description={course.description}
                  thumbnail={course.thumbnail}
                  category={course.category}
                  level={course.level}
                  price={course.price}
                  enrolledStudents={course.enrolledStudents || []}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 flex flex-col items-center gap-3 py-12">
              <svg
                className="w-20 h-20 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <p className="text-xl">No courses available yet</p>
              <p className="text-sm text-gray-400 max-w-md">
                Check back soon for new courses
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardPage;
