import { FaArrowLeftLong, FaRegMoneyBill1 } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import img from "../../assets/empty.jpg";
import { FaEdit } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../../config.js";
import { setCreatorCourses } from "../../redux/courseSlice.jsx";

const Courses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);
  const creatorCourses = useSelector((state) => state.course.creatorCourses);
  const safeCourseData = creatorCourses || [];

  useEffect(() => {
    const CreateCourses = async () => {
      try {
        const result = await axios.get(
          serverUrl + "/api/courses/getCreatorCourse",
          {
            withCredentials: true,
          }
        );

        const courses = result.data.courses || [];
        dispatch(setCreatorCourses(courses));
      } catch (error) {
        dispatch(setCreatorCourses([]));
      }
    };
    CreateCourses();
  }, [userData, dispatch]);

  useEffect(() => {
    if (Array.isArray(safeCourseData) && safeCourseData.length > 0) {
      console.log("Checkpoint 6 → All creator courses:", safeCourseData);
      safeCourseData.forEach((course, index) => {
        console.log(`Checkpoint 6.${index + 1} →`, {
          id: course._id,
          title: course.title,
          idType: typeof course._id,
          idLength: course._id?.length,
        });
      });
    }
  }, [safeCourseData]);

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full min-h-screen p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 group"
                onClick={() => navigate("/Dashboard")}
              >
                <FaArrowLeftLong className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                  My Courses
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage and track your created courses
                </p>
              </div>
            </div>
            <button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
              onClick={() => navigate("/create")}
            >
              <span className="text-lg">+</span>
              Create Course
            </button>
          </div>

          <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-lg uppercase tracking-wide">
                      Course Details
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-lg uppercase tracking-wide">
                      Price
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-lg uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-lg uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {safeCourseData.map((course, index) => (
                    <tr
                      key={course._id || index}
                      className="hover:bg-gray-50 transition-colors duration-200 group"
                    >
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-5">
                          <div className="relative group/thumbnail">
                            <img
                              src={course.thumbnail || img}
                              className="w-full h-30 object-cover rounded-xl shadow-md border-2 border-gray-200 group-hover/thumbnail:border-blue-300 transition-all duration-300 group-hover/thumbnail:shadow-lg group-hover/thumbnail:scale-105"
                              alt="Course thumbnail"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full shadow-sm opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-300">
                              <div className="w-full h-full bg-blue-500 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 text-xl mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors capitalize">
                              {course.title}
                            </h3>
                            <div className="flex flex-col gap-2">
                              <p className="text-lg text-gray-600 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                Created:{" "}
                                {new Date(course.createdAt).toLocaleDateString(
                                  "en-GB"
                                )}
                              </p>
                              {course.updatedAt !== course.createdAt && (
                                <p className="text-lg text-green-600 flex items-center gap-2 font-medium">
                                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                  Updated:{" "}
                                  {new Date(
                                    course.updatedAt
                                  ).toLocaleDateString("en-GB")}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-6 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <FaRegMoneyBill1 className="text-green-600 w-5 h-5" />
                          </div>
                          <span className="font-semibold text-gray-800 text-lg">
                            {course?.price ? `₹${course.price}` : "Free"}
                          </span>
                        </div>
                      </td>

                      <td className="py-6 px-6">
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                            course?.isPublished
                              ? "bg-green-100 text-green-800 border-2 border-green-200"
                              : "bg-amber-100 text-amber-800 border-2 border-amber-200"
                          }`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full mr-3 ${
                              course?.isPublished
                                ? "bg-green-500 animate-pulse"
                                : "bg-amber-500 animate-pulse"
                            }`}
                          ></div>
                          {course.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>

                      <td className="py-6 px-6">
                        <button
                          className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-200 group/edit shadow-md hover:shadow-lg"
                          onClick={() => navigate(`/editcourse/${course?._id}`)}
                        >
                          <FaEdit className="w-5 h-5 group-hover/edit:scale-110 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {safeCourseData.length === 0 && (
              <div className="py-16 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <FaRegMoneyBill1 className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  No courses yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Start creating your first course to see it here and begin your
                  teaching journey
                </p>
                <button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  onClick={() => navigate("/create")}
                >
                  Create Your First Course
                </button>
              </div>
            )}

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-t border-gray-200">
              <p className="text-center text-sm font-medium text-gray-600">
                Total Courses:{" "}
                <span className="text-blue-600 font-semibold">
                  {safeCourseData.length || 0}
                </span>
              </p>
            </div>
          </div>

          <div className="md:hidden space-y-6">
            {safeCourseData.map((course, index) => (
              <div
                key={course._id || index}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-200"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={course.thumbnail || img}
                    alt="Course thumbnail"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 drop-shadow-lg">
                      {course.title}
                    </h3>
                  </div>
                  <button
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-600 hover:bg-white hover:text-blue-700 transition-all duration-200 shadow-lg"
                    onClick={() => navigate(`/editcourse/${course?._id}`)}
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FaRegMoneyBill1 className="text-green-600 w-5 h-5" />
                      </div>
                      <span className="text-lg font-semibold text-gray-800">
                        {course.price ? `₹${course.price}` : "Free"}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                        course?.isPublished
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          course?.isPublished ? "bg-green-500" : "bg-amber-500"
                        } animate-pulse`}
                      ></div>
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Created:{" "}
                      {new Date(course.createdAt).toLocaleDateString("en-GB")}
                    </p>
                    {course.updatedAt !== course.createdAt && (
                      <p className="text-sm text-green-600 flex items-center gap-2 font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Updated:{" "}
                        {new Date(course.updatedAt).toLocaleDateString("en-GB")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {safeCourseData.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <FaRegMoneyBill1 className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  No courses yet
                </h3>
                <p className="text-gray-500 mb-6 text-sm max-w-sm mx-auto">
                  Start creating your first course to see it here and begin your
                  teaching journey
                </p>
                <button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  onClick={() => navigate("/create")}
                >
                  Create Your First Course
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-5 mt-6">
              <p className="text-center text-sm font-medium text-gray-600">
                Total Courses:{" "}
                <span className="text-blue-600 font-semibold">
                  {safeCourseData.length || 0}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;
