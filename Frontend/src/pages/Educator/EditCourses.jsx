import { NavLink, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import img from "../../assets/empty.jpg";
import axios from "axios";
import { serverUrl } from "../../App.jsx";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCreatorCourses, updateCreatorCourse, removeCreatorCourse} from "../../redux/courseSlice.jsx";

function EditCourse() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { creatorCourses } = useSelector((state) => state.course);
  const thumb = useRef(null);
  const [isPublished, setIsPublished] = useState(true);
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
        serverUrl + `/api/course/getCourseById/${courseId}`,
        { withCredentials: true }
      );

      console.log("Full response:", response.data);

      const { success, course } = response.data;

      if (success && course) {
        setSelectCourse(course);
        setTitle(course.title || "");
        setSubtitle(course.subtitle || "");
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
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("level", level);
      formData.append("price", price);
      formData.append("isPublished", isPublished);
      if (backendImage) {
        formData.append("thumbnail", backendImage);
      }

      const response = await axios.post(
        serverUrl + `/api/course/editcourse/${courseId}`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Course updated successfully");
        dispatch(updateCreatorCourse(response.data.course));
        navigate("/courses");
      } else {
        toast.error("Error updating course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Error updating course");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCourse = async () => {
  setLoading(true);
  try {
    const response = await axios.delete(
      serverUrl + `/api/course/deleteCourse/${courseId}`,
      {
        withCredentials: true,
      }
    );
    
    // Remove the course from Redux store using the new action
    dispatch(removeCreatorCourse(courseId));
    
    setLoading(false);
    toast.success("Course removed successfully");
    navigate("/courses");
    console.log("Course removed successfully:", response.data);
  } catch (error) {
    setLoading(false);
    toast.error("Error removing course. Please try again.");
    console.error("Error removing course:", error);
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
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
        {/* topbar */}
        <div className="flex items-center justify-center gap-[20px] md:justify-between flex-col md:flex-row mb-6 relative">
          <FaArrowLeftLong
            className="top-[-20%] md:top-[20%] absolute left-[0] md:left-[2%] w-[22px] h-[22px] cursor-pointer text-gray-500"
            onClick={() => navigate("/courses")}
          />

          <h2 className="text-lg font-medium md:pl-[60px]">
            Edit Course Information
          </h2>
        </div>

        <div className="space-x-2 space-y-2">
          <button className="bg-black text-white px-4 py-2 rounded">
            Go to Lecture pages
          </button>
        </div>

        {/* form-details */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Basic Course Information
          </h2>

          <div className="flex gap-4 mt-3 mb-6">
            {isPublished ? (
              <button
                className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg 
                 hover:bg-gray-800 hover:shadow-xl 
                 focus:ring-2 focus:ring-gray-500/50 
                 active:scale-95 transition-all duration-200"
                onClick={() => setIsPublished((prev) => !prev)}
              >
                Click to Unpublish
              </button>
            ) : (
              <button
                className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg 
                 hover:bg-green-500 hover:shadow-xl 
                 focus:ring-2 focus:ring-green-400/50 
                 active:scale-95 transition-all duration-200"
                onClick={() => setIsPublished((prev) => !prev)}
              >
                Click to Publish
              </button>
            )}

            <button
              className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg 
               hover:bg-red-500 hover:shadow-xl 
               focus:ring-2 focus:ring-red-400/50 
               active:scale-95 transition-all duration-200"
              onClick={handleRemoveCourse}
            >
              Remove Course
            </button>
          </div>

          <form className="space-y-6">
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
                className="border border-gray-300 p-2 rounded-lg w-full"
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
                className="border border-gray-300 p-2 rounded-lg w-full"
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
                className="border border-gray-300 p-2 rounded-lg w-full h-24"
                placeholder="Enter course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Category
                </label>
                <select
                  name="category"
                  id="category"
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  <option value="App development">App development</option>
                  <option value="Web development">Web development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="AI/ML">AI/ML</option>
                </select>
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
                  className="border border-gray-300 p-2 rounded-lg w-full"
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
                  className="border border-gray-300 p-2 rounded-lg w-full"
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
                      {/* Hover overlay - only show when hovering */}
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
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={handleSaveChanges}
              >
                {loading ? (
                  <ClipLoader color="#ffffff" size={24} />
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                onClick={handleRemoveCourse}
              >
                Discard Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditCourse;