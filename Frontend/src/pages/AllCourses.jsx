import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Nav from "../component/Nav";
import ai from "../assets/SearchAi.png";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Card from "../Component/Card";
import usePublishedCourses from "../customHooks/getPublishedCourse"; // Import the hook

function AllCourses() {
  const navigate = useNavigate();
  
  // ✅ FIXED: Fetch published courses data
  usePublishedCourses();
  
  // ✅ FIXED: Use publishedCourses instead of courseData
  const publishedCourses = useSelector((state) => state.course.publishedCourses);
  console.log("All published courses data from redux:", publishedCourses);
  
  const [category, setCategory] = useState([]);
  const [filterCourses, setFilterCourses] = useState([]);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((c) => c !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  // ✅ FIXED: Updated to work with publishedCourses array directly
  useEffect(() => {
    console.log("publishedCourses from Redux:", publishedCourses);
    console.log("Number of published courses:", publishedCourses?.length);
    setFilterCourses(publishedCourses || []);
  }, [publishedCourses]);

  useEffect(() => {
    console.log("Selected categories:", category);
    console.log("Before filtering - courses count:", publishedCourses?.length);
    applyFilters();
  }, [category]);

  // ✅ FIXED: Updated filtering logic for direct array
  const applyFilters = () => {
    const courseCopy = publishedCourses?.slice() || [];
    console.log("courseCopy length:", courseCopy.length);
    
    if (category.length > 0) {
      const filtered = courseCopy.filter((course) =>
        category.includes(course.category)
      );
      console.log("Filtered courses:", filtered.length);
      setFilterCourses(filtered);
    } else {
      console.log("No filters applied, showing all published courses");
      setFilterCourses(courseCopy);
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-100 text-gray-900">
        {/* Top Navbar */}
        <Nav />

        {/* Sidebar */}
        <aside className="w-72 bg-white border-r h-screen shadow-md p-6 flex flex-col">
          {/* Header with back button */}
          <h2 className="flex items-center gap-3 mb-6 font-semibold text-lg text-gray-700">
            <FaArrowLeft
              className="cursor-pointer text-gray-600 hover:text-black transition"
              onClick={() => navigate("/")}
            />
            Filter by Categories
          </h2>

          {/* Filter Section */}
          <form
            action=""
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4 text-sm bg-gray-50 border rounded-xl p-5 shadow-sm"
          >
            {/* App Development */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black"
                onChange={toggleCategory}
                value="App Development"
              />
              <span>App Development</span>
            </label>

            {/* Web Development */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black"
                onChange={toggleCategory}
                value="Web Development"
              />
              <span>Web Development</span>
            </label>

            {/* UI/UX */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black"
                onChange={toggleCategory}
                value="UI/UX"
              />
              <span>UI/UX</span>
            </label>

            {/* AI & ML */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black"
                onChange={toggleCategory}
                value="AI / ML"
              />
              <span>AI / ML</span>
            </label>

            {/* Data Science */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black"
                onChange={toggleCategory}
                value="Data Science"
              />
              <span>Data Science</span>
            </label>

            {/* Cybersecurity */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black"
                onChange={toggleCategory}
                value="Cybersecurity"
              />
              <span>Cybersecurity</span>
            </label>

            {/* Cloud Computing */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black"
                onChange={toggleCategory}
                value="Cloud Computing"
              />
              <span>Cloud Computing</span>
            </label>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition font-medium"
            >
              Search with AI
              <img
                src={ai}
                alt="AI Search"
                className="w-[35px] h-[35px] rounded-full"
              />
            </button>
          </form>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          {filterCourses?.length > 0 ? (
            filterCourses.map((course, index) => (
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
            ))
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 text-lg">Loading courses...</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default AllCourses;