import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../../App.jsx";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import { useSelector } from "react-redux";

function CreateCourse() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const { userData } = useSelector((state) => state.user);

  const handleCreateCourse = async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Please enter a course title");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!userData) {
      toast.error("Please log in first");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending data:", { title, category });
      console.log("Server URL:", serverUrl);
      console.log("User data:", userData);

      const result = await axios.post(
        serverUrl + "/api/course/create",
        { title, category },
        { withCredentials: true }
      );

      console.log("Success response:", result.data);
      toast.success("Course created successfully!");

      // Clear form
      setTitle("");
      setCategory("");

      // Navigate to courses page
      navigate("/courses");
    } catch (error) {
      console.error("Full error object:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error status:", error.response.status);

        if (error.response.status === 401) {
          toast.error("Please log in again");
          navigate("/login");
        } else {
          toast.error(error.response.data.message || "Error creating course");
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from server. Please check your connection.");
      } else {
        console.error("Error message:", error.message);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
        <div className="w-[600px] mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 relative max-w-xl">
          {/* Back Button */}
          <FaArrowLeftLong
            className="w-[22px] h-[22px] absolute top-6 left-6 cursor-pointer text-gray-500 hover:text-gray-700 transition"
            onClick={() => navigate("/courses")}
          />

          {/* Title */}
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Create Course
          </h2>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="course-title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Title
              </label>
              <input
                type="text"
                id="course-title"
                value={title}
                className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none p-2 rounded-md w-full"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter course title"
              />
            </div>

            <div>
              <label
                htmlFor="course-category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Category
              </label>
              <select
                id="course-category"
                value={category}
                className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none p-2 rounded-md w-full"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Data Science">Data Science</option>
                <option value="AI/ML">AI/ML</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition flex justify-center items-center min-w-[150px] disabled:opacity-50"
                onClick={handleCreateCourse}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader size={20} color="white" />
                ) : (
                  "Create Course"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateCourse;
