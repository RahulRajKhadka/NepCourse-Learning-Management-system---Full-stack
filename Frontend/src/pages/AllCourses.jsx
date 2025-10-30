import {
  FaArrowLeft,
  FaTimes,
  FaFilter,
  FaFire,
  FaStar,
  FaRocket,
  FaBars,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Nav from "../Component/Nav.jsx";
import ai from "../assets/SearchAi.png";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Card from "../Component/Card";
import useAllPublishedCourses from "../customHooks/useAllPublishedCourses";
import { Navigate } from "react-router-dom";

function AllCourses() {
  const navigate = useNavigate();
  const { publishedCourses, loading } = useAllPublishedCourses();

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

  const categories = [
    {
      name: "App Development",
      icon: "📱",
      color: "from-purple-500 to-pink-500",
    },
    { name: "Web Development", icon: "🌐", color: "from-blue-500 to-cyan-500" },
    { name: "UI/UX", icon: "🎨", color: "from-green-500 to-emerald-500" },
    { name: "AI / ML", icon: "🤖", color: "from-orange-500 to-red-500" },
    {
      name: "Data Science",
      icon: "📊",
      color: "from-indigo-500 to-purple-500",
    },
    { name: "Cybersecurity", icon: "🔒", color: "from-gray-700 to-gray-900" },
    { name: "Cloud Computing", icon: "☁️", color: "from-sky-500 to-blue-600" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 text-gray-900">
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-2xl shadow-blue-500/10 sticky top-0 z-30">
        <div className=" px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <button
                onClick={() => navigate("/")}
                className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-300 p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-white/50 hover:shadow-lg flex-shrink-0"
              >
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform">
                  <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-semibold hidden lg:block">
                  Back
                </span>
              </button>

              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <div className="h-6 sm:h-8 w-0.5 bg-gradient-to-b from-transparent via-gray-300 to-transparent hidden sm:block"></div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent truncate">
                    All Courses
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">
                    Discover your next learning journey
                  </p>
                </div>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* AI Search Button */}
              <button
                onClick={() => navigate("/search")}
                className="group relative flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-xs sm:text-sm shadow-lg"
              >
                <div className="absolute inset-0 bg-white/20 rounded-xl sm:rounded-2xl transform group-hover:scale-110 transition-transform duration-300"></div>
                <span className="relative z-10 hidden sm:inline">AI</span>
                <img
                  src={ai}
                  alt="AI Search"
                  className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full relative z-10 transform group-hover:rotate-12 transition-transform"
                />
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-ping"></div>
              </button>

              {/* Mobile Filter Button (Hamburger) */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="sm:hidden group relative flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-xs sm:text-sm shadow-lg"
              >
                <FaBars className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                {category.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs flex items-center justify-center font-bold shadow-lg">
                    {category.length}
                  </span>
                )}
              </button>

              {/* Desktop Filter Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="hidden lg:flex group relative items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-sm shadow-lg"
              >
                <FaFilter className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Filters</span>
                {category.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold shadow-lg">
                    {category.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Filters Bar */}
          {category.length > 0 && (
            <div className="pb-3 sm:pb-4 lg:pb-6">
              <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <FaFire className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-orange-500" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">
                    Active ({category.length})
                  </span>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-3">
                {category.map((cat) => {
                  const categoryInfo = categories.find((c) => c.name === cat);
                  return (
                    <span
                      key={cat}
                      className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gradient-to-r ${
                        categoryInfo?.color || "from-gray-600 to-gray-700"
                      } text-white text-xs sm:text-sm rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                    >
                      <span className="text-sm sm:text-base">
                        {categoryInfo?.icon}
                      </span>
                      <span className="hidden sm:inline">{cat}</span>
                      <span className="sm:hidden">{cat.split(" ")[0]}</span>
                      <button
                        onClick={() =>
                          toggleCategory({ target: { value: cat } })
                        }
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 sm:p-1 transition-colors"
                      >
                        <FaTimes className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <Nav />

      <div className="flex flex-1 relative ">
        {/* Mobile Filter Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={closeSidebar}
          />
        )}

        {/* Enhanced Filter Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 h-full w-[85vw] sm:w-80 bg-gradient-to-b from-white via-blue-50/50 to-purple-50/50 backdrop-blur-xl border-r border-white/20 shadow-2xl shadow-blue-500/20 transform transition-transform duration-500 ease-out z-50 overflow-y-auto
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static lg:w-72 xl:w-80 lg:shadow-2xl lg:rounded-3xl lg:my-8 lg:ml-4 lg:border lg:border-white/20
          `}
        >
          <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-white/20 px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl shadow-lg">
                <FaFilter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg  sm:text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Filters
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                  Refine your search
                </p>
              </div>
            </div>
            <button
              className="lg:hidden p-2 sm:p-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl sm:rounded-2xl hover:shadow-lg transition-all duration-300"
              onClick={closeSidebar}
            >
              <FaTimes className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Categories Section */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg">
                  <FaRocket className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-base sm:text-lg">
                  Categories
                </h3>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {categories.map((cat) => (
                  <label
                    key={cat.name}
                    className={`flex items-center gap-3 sm:gap-4 cursor-pointer p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      category.includes(cat.name)
                        ? `bg-gradient-to-r ${cat.color} text-white shadow-lg transform scale-105`
                        : "bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 sm:w-5 sm:h-5 accent-white rounded-lg flex-shrink-0"
                      onChange={toggleCategory}
                      value={cat.name}
                      checked={category.includes(cat.name)}
                    />
                    <span className="text-xl sm:text-2xl">{cat.icon}</span>
                    <span
                      className={`text-xs sm:text-sm font-medium flex-1 ${
                        category.includes(cat.name)
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {cat.name}
                    </span>
                    {category.includes(cat.name) && (
                      <FaStar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 animate-pulse flex-shrink-0" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Enhanced AI Search Button in Sidebar */}
            <button
              onClick={() => {
                navigate("/search");
                closeSidebar();
              }}
              className="group relative w-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-xs sm:text-sm shadow-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-sm sm:text-lg">Discover with AI</span>
                <img
                  src={ai}
                  alt="AI Search"
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full transform group-hover:rotate-12 transition-transform"
                />
              </div>
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-yellow-400 rounded-full animate-ping"></div>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 overflow-hidden">
          {/* Enhanced Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-end justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 lg:p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
                    <FaStar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Explore Courses
                    </h1>
                    <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-gray-600 mt-1 sm:mt-2">
                      {loading
                        ? "Loading..."
                        : filterCourses.length === 0
                        ? "No courses found"
                        : `${filterCourses.length} course${
                            filterCourses.length !== 1 ? "s" : ""
                          } available`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 sm:h-96 space-y-4 sm:space-y-6">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-gray-200 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin animation-delay-500"></div>
              </div>
              <div className="text-center">
                <p className="text-base sm:text-lg lg:text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Loading Courses
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                  Preparing your journey...
                </p>
              </div>
            </div>
          ) : filterCourses?.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {filterCourses.map((course, index) => (
                <div
                  key={course._id || index}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <Card
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
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 sm:h-96 space-y-4 sm:space-y-6 lg:space-y-8 px-4">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl">
                  <svg
                    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white"
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
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full animate-bounce"></div>
              </div>
              <div className="text-center space-y-2 sm:space-y-3 lg:space-y-4 max-w-md">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent px-4">
                  {publishedCourses?.length === 0
                    ? "No Courses Yet"
                    : category.length > 0
                    ? "No Matches"
                    : "No Courses Found"}
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 px-4">
                  {publishedCourses?.length === 0
                    ? "Amazing courses coming soon!"
                    : category.length > 0
                    ? "Try adjusting your filters."
                    : "Check back later for new courses."}
                </p>
                {category.length > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 mt-2 sm:mt-4"
                  >
                    Show All Courses
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AllCourses;
