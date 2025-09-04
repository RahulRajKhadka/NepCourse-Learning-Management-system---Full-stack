import { FaArrowLeftLong, FaE, FaRegMoneyBill1 } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import img from "../../assets/empty.jpg";
import { FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { serverUrl } from "../../App";
import { setCreateCourseData } from "../../redux/courseSlice.jsx";

const Courses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { createCourseData } = useSelector((state) => state.course);
  console.log(createCourseData);

  useEffect(() => {
    const CreateCourses = async () => {
      try {
        const result = await axios.get(
          serverUrl + "/api/course/getCreatorCourse",
          {
            withCredentials: true,
          }
        );
        console.log("Fetched creator courses:", result.data);
        dispatch(setCreateCourseData(result.data.courses));
      } catch (error) {
        console.error("Error fetching creator courses:", error);
      }
    };
    CreateCourses();
  }, [userData]);

  
useEffect(() => {
  if (createCourseData && createCourseData.length > 0) {
    console.log("All courses:", createCourseData);
    createCourseData.forEach((course, index) => {
      console.log(`Course ${index}:`, {
        id: course._id,
        title: course.title,
        idType: typeof course._id,
        idLength: course._id?.length
      });
    });
  }
}, [createCourseData]);
  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full min-h-screen p-4 sm:p-8">
          {/* Header Section */}
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
                <p className="text-gray-600 text-sm">
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

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                      Course Details
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                      Price
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {createCourseData?.map((course, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-200 group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={course.thumbnail || img}
                              className="w-16 h-12 object-cover rounded-lg shadow-sm border border-gray-200"
                              alt="Course thumbnail"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-200"></div>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800 text-base mb-1 line-clamp-2">
                              {course.title}
                            </h3>
                            <div className="flex flex-col gap-1">
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                Created:{" "}
                                {new Date(course.createdAt).toLocaleDateString(
                                  "en-GB"
                                )}
                              </p>
                              {course.updatedAt !== course.createdAt && (
                                <p className="text-xs text-green-600 flex items-center gap-1 font-medium">
                                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
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

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <FaRegMoneyBill1 className="text-green-600 w-4 h-4" />
                          <span className="font-medium text-gray-800">
                            {course?.price ? `₹${course.price}` : "Free"}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                            course?.isPublished
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              course?.isPublished
                                ? "bg-green-400"
                                : "bg-amber-400"
                            }`}
                          ></div>
                          {course.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <button
                          className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-all duration-200 group/edit"
                          onClick={() => navigate(`/editcourse/${course?._id}`)} // Make sure this matches your route
                        >
                          <FaEdit className="w-4 h-4 group-hover/edit:scale-110 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {createCourseData?.length === 0 && (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaRegMoneyBill1 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No courses yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start creating your first course to see it here
                </p>
                <button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                  onClick={() => navigate("/create")}
                >
                  Create Your First Course
                </button>
              </div>
            )}

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                Total Courses: {createCourseData?.length || 0}
              </p>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {createCourseData?.map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="p-4">
                  <div className="flex gap-3 items-start mb-3">
                    <img
                      src={course.thumbnail || img}
                      alt="Course thumbnail"
                      className="w-20 h-16 rounded-lg object-cover shadow-sm border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-base mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <FaRegMoneyBill1 className="text-green-600 w-4 h-4" />
                        <span className="text-sm font-medium text-gray-700">
                          {course.price ? `₹${course.price}` : "Free"}
                        </span>
                      </div>
                    </div>
                    <button
                      className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-all duration-200"
                      onClick={() => navigate(`/editcourse/${course?._id}`)} // Changed from /edit-course/ to /editcourse/
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                        course?.isPublished
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          course?.isPublished ? "bg-green-400" : "bg-amber-400"
                        }`}
                      ></div>
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                        Created:{" "}
                        {new Date(course.createdAt).toLocaleDateString("en-GB")}
                      </p>
                      {course.updatedAt !== course.createdAt && (
                        <p className="text-xs text-green-600 flex items-center gap-1 font-medium">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                          Updated:{" "}
                          {new Date(course.updatedAt).toLocaleDateString(
                            "en-GB"
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {createCourseData?.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaRegMoneyBill1 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No courses yet
                </h3>
                <p className="text-gray-500 mb-4 text-sm">
                  Start creating your first course to see it here
                </p>
                <button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                  onClick={() => navigate("/create")}
                >
                  Create Your First Course
                </button>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-md p-4 mt-4">
              <p className="text-center text-sm text-gray-500">
                Total Courses: {createCourseData?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;
