import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import img from "../../assets/empty.jpg";
import axios from "axios";
import { serverUrl } from "../../App.jsx";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCreatorCourse,
  removeCreatorCourse,
  updateEducatorPublishedCourse,
  removeEducatorPublishedCourse,
} from "../../redux/courseSlice.jsx";

function EditCourse() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { creatorCourses } = useSelector((state) => state.course);
  const thumb = useRef(null);
  const [isPublished, setIsPublished] = useState(false);
  const [title, setTitle] = useState("");
  const [selectCourse, setSelectCourse] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [frontendImage, setFrontendImage] = useState(img);
  const [backendImage, setBackendImage] = useState(null);
  const [subtitle, setSubtitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const [categories, setCategories] = useState([
    "App development",
    "Web development",
    "Data Science",
    "AI/ML",
    "DevOps",
    "Cloud Computing",
    "UI/UX Design",
    "Cyber Security",
    "Digital Marketing",
    "Game Development",
    "Blockchain",
    "Internet of Things",
    "Software Testing",
    "Mobile Development",
    "Database Management",
  ]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setShowCustomInput(true);
      setCategory("");
    } else {
      setCategory(value);
      setShowCustomInput(false);
    }
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim() && !categories.includes(customCategory.trim())) {
      setCategories((prev) => [...prev, customCategory.trim()]);
      setCategory(customCategory.trim());
      setCustomCategory("");
      setShowCustomInput(false);
    }
  };

  const handleCancelCustom = () => {
    setShowCustomInput(false);
    setCustomCategory("");
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file);

      const validImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validImageTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, GIF, WebP)");
        return;
      }

      setBackendImage(file);
      const imageUrl = URL.createObjectURL(file);
      console.log("Created object URL:", imageUrl);
      setFrontendImage(imageUrl);
    } else {
      console.log("No file selected");
    }
  };

  const getCourseById = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        serverUrl + `/api/courses/getCourseById/${courseId}`,
        { withCredentials: true }
      );

      console.log("Full response:", response.data);

      const { success, course } = response.data;

      if (success && course) {
        setSelectCourse(course);
        setTitle(course.title || "");
        setSubtitle(course.subTitle || "");
        setDescription(course.description || "");
        setCategory(course.category || "");
        setLevel(course.level || "");
        setPrice(course.price || "");
        setIsPublished(course.isPublished || false);

        if (course.thumbnail) {
          setFrontendImage(course.thumbnail);
        }
      } else {
        console.error("Course fetch failed:", response.data);
        toast.error("Failed to load course");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Error loading course");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subTitle", subtitle);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("level", level);
      formData.append("price", price);
      formData.append("isPublished", isPublished);
      if (backendImage) {
        formData.append("thumbnail", backendImage);
      }

      const response = await axios.put(
        serverUrl + `/api/courses/editcourse/${courseId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const updatedCourse = response.data.course;

        dispatch(updateCreatorCourse(updatedCourse));

        if (updatedCourse.isPublished) {
          dispatch(updateEducatorPublishedCourse(updatedCourse));
        } else {
          dispatch(removeEducatorPublishedCourse(updatedCourse._id));
        }

        toast.success("Course updated successfully");
        navigate("/courses");
      } else {
        toast.error("Error updating course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error(error.response?.data?.message || "Error updating course");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async () => {
    const newStatus = !isPublished;

    try {
      setIsPublished(newStatus);

      const response = await axios.post(
        serverUrl + `/api/courses/publishToggle/${selectCourse._id}`,
        { isPublished: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        const updatedCourse = response.data.course;
        dispatch(updateCreatorCourse(updatedCourse));

        if (updatedCourse.isPublished) {
          dispatch(updateEducatorPublishedCourse(updatedCourse));
          toast.success("Course published successfully!");
        } else {
          dispatch(removeEducatorPublishedCourse(updatedCourse._id));
          toast.success("Course unpublished successfully!");
        }
      } else {
        setIsPublished(!newStatus);
        toast.error("Failed to update publish status");
      }
    } catch (err) {
      console.error("Error updating publish status:", err);
      setIsPublished(!newStatus);
      toast.error(
        err.response?.data?.message || "Error updating publish status"
      );
    }
  };

  const handleRemoveCourse = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(
        serverUrl + `/api/courses/deleteCourse/${courseId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(removeCreatorCourse(courseId));
        dispatch(removeEducatorPublishedCourse(courseId));

        toast.success("Course removed successfully");
        navigate("/courses");
        console.log("Course removed successfully:", response.data);
      } else {
        toast.error("Failed to remove course");
      }
    } catch (error) {
      console.error("Error removing course:", error);
      toast.error(error.response?.data?.message || "Error removing course");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      getCourseById();
    }
  }, [courseId]);

  useEffect(() => {
    return () => {
      if (frontendImage && frontendImage.startsWith("blob:")) {
        URL.revokeObjectURL(frontendImage);
      }
    };
  }, [frontendImage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#3b82f6" size={50} />
      </div>
    );
  }

  if (!selectCourse) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">Course not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-center gap-[20px] md:justify-between flex-col md:flex-row mb-6 relative">
        <FaArrowLeftLong
          className="top-[-20%] md:top-[20%] absolute left-[0] md:left-[2%] w-[22px] h-[22px] cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => navigate("/courses")}
        />

        <h2 className="text-lg font-medium md:pl-[60px]">
          Edit Course Information
        </h2>
      </div>

      <div className="space-x-2 space-y-2">
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          onClick={() => navigate(`/createlecture/${selectCourse?._id}`)}
        >
          Go to Lecture pages
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Basic Course Information</h2>

        <div className="flex gap-4 mt-3 mb-6">
          <button
            className={`${
              isPublished
                ? "bg-gray-900 hover:bg-gray-800"
                : "bg-green-600 hover:bg-green-500"
            } text-white px-6 py-2.5 rounded-lg font-medium shadow-lg focus:ring-2 active:scale-95 transition-all duration-200`}
            onClick={handlePublishToggle}
          >
            {isPublished ? "Click to Unpublish" : "Click to Publish"}
          </button>

          <button
            className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg hover:bg-red-500 hover:shadow-xl focus:ring-2 focus:ring-red-400/50 active:scale-95 transition-all duration-200"
            onClick={handleRemoveCourse}
          >
            Remove Course
          </button>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="subtitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subtitle
            </label>
            <input
              type="text"
              id="subtitle"
              className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              className="border border-gray-300 p-2 rounded-lg w-full h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Enhanced Category Section */}
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Category
              </label>

              {!showCustomInput ? (
                <select
                  name="category"
                  id="category"
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="custom">+ Add custom category</option>
                </select>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Enter your custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleAddCustomCategory}
                      disabled={!customCategory.trim()}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelCustom}
                      className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Level */}
            <div>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Level
              </label>
              <select
                name="level"
                id="level"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="">Select level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter course price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Thumbnail Section */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="thumbnail"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Thumbnail
              </label>
              <input
                type="file"
                id="thumbnail"
                className="border border-gray-400 p-2 rounded-lg w-full"
                ref={thumb}
                accept="image/*"
                onChange={handleThumbnailChange}
              />
            </div>

            <div className="flex justify-center">
              <div
                className="relative w-[300px] h-[170px] border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-gray-600 transition-colors bg-white"
                onClick={() => thumb.current?.click()}
              >
                {frontendImage ? (
                  <>
                    <img
                      src={frontendImage}
                      alt="Course Thumbnail Preview"
                      className="w-full h-full object-cover rounded-lg"
                      style={{
                        display: "block",
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                      onLoad={() => console.log("Image loaded successfully")}
                      onError={(e) => {
                        console.error("Image failed to load:", e);
                        console.log("Image src:", frontendImage);
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100">
                      <span className="text-white font-medium">
                        Click to change image
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📷</div>
                      <div>No image selected</div>
                      <div className="text-sm">Click to upload</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6 justify-end">
            <button
              type="button"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleSaveChanges}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ClipLoader color="#ffffff" size={20} />
                  <span>Saving...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              onClick={() => navigate("/courses")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCourse;
