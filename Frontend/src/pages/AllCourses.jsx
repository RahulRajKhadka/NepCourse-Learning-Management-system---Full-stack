import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Nav from "../component/Nav";
import ai from "../assets/SearchAi.png";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Card from "../Component/Card";
import useAllPublishedCourses from "../customHooks/useAllPublishedCourses"; // ✅ Correct hook name

function AllCourses() {
  const navigate = useNavigate();
  useAllPublishedCourses(); // ✅ Fetch all published courses from all educators

  // ✅ FIXED: Use the correct Redux path
  const publishedCourses = useSelector(
    (state) => state.course.allPublishedCourses
  );

  const [category, setCategory] = useState([]);
  const [filterCourses, setFilterCourses] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((c) => c !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const clearAllFilters = () => {
    setCategory([]);
  };

  useEffect(() => {
    setFilterCourses(publishedCourses || []);
  }, [publishedCourses]);

  useEffect(() => {
    applyFilters();
  }, [category, publishedCourses]);

  const applyFilters = () => {
    const courseCopy = publishedCourses?.slice() || [];
    if (category.length > 0) {
      const filtered = courseCopy.filter((course) =>
        category.includes(course.category)
      );
      setFilterCourses(filtered);
    } else {
      setFilterCourses(courseCopy);
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Nav />

      <div className="flex flex-1 relative ">
        {!isSidebarOpen && (
          <button
            className="md:hidden fixed right-5 top-25 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50 hover:bg-gray-800 transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            Show Filters
          </button>
        )}

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity"
            onClick={closeSidebar}
          />
        )}

        <aside
          className={`
            fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white border-r shadow-xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:static md:w-72 md:shadow-lg md:max-w-none
          `}
        >
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaArrowLeft
                className="cursor-pointer text-gray-600 hover:text-black transition-colors md:block hidden"
                onClick={() => navigate("/")}
              />
              <h2 className="font-semibold text-lg text-gray-800">
                Filter Courses
              </h2>
            </div>
            <button
              className="md:hidden text-gray-600 hover:text-black transition-colors p-1"
              onClick={closeSidebar}
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {category.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Active Filters ({category.length})
                  </span>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white text-xs rounded-full"
                    >
                      {cat}
                      <button
                        onClick={() =>
                          toggleCategory({ target: { value: cat } })
                        }
                        className="ml-1 hover:bg-gray-700 rounded-full p-0.5"
                      >
                        <FaTimes className="w-2 h-2" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <h3 className="font-medium text-gray-800 text-sm uppercase tracking-wide">
                Categories
              </h3>
              <div className="space-y-3 bg-gray-50 border rounded-xl p-4  ">
                {[
                  "App Development",
                  "Web Development",
                  "UI/UX",
                  "AI / ML",
                  "Data Science",
                  "Cybersecurity",
                  "Cloud Computing",
                ].map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-black rounded"
                      onChange={toggleCategory}
                      value={cat}
                      checked={category.includes(cat)}
                    />
                    <span className="text-sm text-gray-700 select-none">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
              >
                Search with AI
                <img
                  src={ai}
                  alt="AI Search"
                  className="w-6 h-6 rounded-full"
                />
              </button>
            </form>

            <div className="md:hidden pt-4 border-t">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Home</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 md:py-8 overflow-hidden">
          <div className="md:hidden h-16"></div>
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              All Courses
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              {filterCourses.length > 0
                ? `Showing ${filterCourses.length} course${
                    filterCourses.length !== 1 ? "s" : ""
                  }${category.length > 0 ? ` in selected categories` : ""}`
                : "No courses found"}
            </p>
          </div>

          {filterCourses?.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {filterCourses.map((course, index) => (
                <Card
                  key={course._id || index}
                  course={course}
                  thumbnail={course.thumbnail}
                  price={course.price}
                  id={course._id}
                  title={course.title}
                  description={course.description}
                  category={course.category}
                  level={course.level}
                  enrolledStudents={course.enrolledStudents}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center"></div>
              <div className="text-center">
                <p className="text-gray-500 text-lg font-medium">
                  {publishedCourses?.length === 0
                    ? "No courses available"
                    : category.length > 0
                    ? "No courses match your filters"
                    : "Loading courses..."}
                </p>
                {category.length > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-2 text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    Clear filters and show all courses
                  </button>
                )}
              </div>
            </div>
          )}
        </main>+
      </div>
    </div>
  );
}

export default AllCourses;
