import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useEducatorCourses from "../customHooks/useEducatorCourses";
import Card from "../Component/Card";

const CardPage = () => {
  const { loading } = useEducatorCourses();

  const educatorPublishedCourses = useSelector(
    (state) => state.course.educatorPublishedCourses
  );

  useEffect(() => {
    console.log("Published courses in CardPage:", educatorPublishedCourses);
  }, [educatorPublishedCourses]);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-start">
      <h1 className="md:text-4xl text-2xl font-bold text-center mt-10">
        My Published Courses
      </h1>
      <p className="lg:w-1/2 md:w-4/5 text-lg text-gray-600 text-center mt-4">
        View your published courses that are available to students.
      </p>

      <div className="w-full flex flex-wrap justify-center items-start gap-8 px-4 lg:px-12 py-10">
        {loading ? (
          <div className="text-center text-gray-500 text-lg">
            Loading courses...
          </div>
        ) : educatorPublishedCourses && educatorPublishedCourses.length > 0 ? (
          educatorPublishedCourses.map((course) => (
            <Card
              key={course._id}
              id={course._id}
              title={course.title}
              description={course.description}
              thumbnail={course.thumbnail}
              category={course.category}
              level={course.level}
              price={course.price}
              enrolledStudents={course.enrolledStudents || []}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 text-lg flex flex-col items-center gap-4">
            <svg
              className="w-24 h-24 text-gray-300"
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
            <p className="text-xl">No published courses yet</p>
            <p className="text-sm text-gray-400">
              Publish your courses to make them visible to students
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardPage;
