import React, { useState, useEffect } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../../config.js";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import the updated actions
import { setAllLectures, addLecture } from "../../redux/LectureSlice";

function CreateLecture() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingLectures, setFetchingLectures] = useState(false);
  const dispatch = useDispatch();
  const { lectures } = useSelector((state) => state.lecture);

  const handleCreateLecture = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Lecture title cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${serverUrl}/api/courses/createlecture/${courseId}`,
        { title: lectureTitle },
        { withCredentials: true }
      );

      console.log(response.data);

      // Add the new lecture to existing lectures
      dispatch(addLecture(response.data.lecture));

      toast.success("Lecture created successfully");
      setLectureTitle("");
    } catch (error) {
      toast.error(
        "Something went wrong: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getCourseLectures = async () => {
      if (!courseId) return;

      setFetchingLectures(true);
      try {
        console.log("Fetching lectures for courseId:", courseId);
        console.log(
          "Full URL:",
          `${serverUrl}/api/courses/getCourseLectures/${courseId}`
        );

        const response = await axios.get(
          `${serverUrl}/api/courses/getCourseLectures/${courseId}`,
          { withCredentials: true }
        );

        console.log("Fetched lectures:", response.data);

        // Set all lectures (replace the entire array)
        dispatch(setAllLectures(response.data.lectures || []));
      } catch (error) {
        console.error("Error fetching lectures:", error);
        console.error("Error details:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        toast.error(
          `Failed to fetch lectures: ${
            error.response?.status || "Network Error"
          }`
        );
      } finally {
        setFetchingLectures(false);
      }
    };

    getCourseLectures();
  }, [courseId, dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            Let's Add Lecture
          </h1>
          <p className="text-sm text-gray-500">
            Enter the title and add your video lectures to enhance your course
            content.
          </p>
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="E.g Introduction to the MERN Stack"
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
            onChange={(e) => setLectureTitle(e.target.value)}
            value={lectureTitle}
          />

          <div className="flex gap-4 mb-6">
            <button
              className="flex items-center gap-2 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition-colors"
              onClick={() => navigate(`/editcourse/${courseId}`)}
            >
              <FaArrowLeftLong /> Back to Courses
            </button>

            <button
              className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              onClick={handleCreateLecture}
            >
              {loading ? (
                <ClipLoader size={20} color="#000" />
              ) : (
                "Create Lecture"
              )}
            </button>
          </div>

          <div className="space-y-4">
            {fetchingLectures ? (
              <div className="flex justify-center items-center py-8">
                <ClipLoader size={30} color="#3B82F6" />
                <span className="ml-2 text-gray-600">Loading lectures...</span>
              </div>
            ) : lectures.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No lectures created yet.</p>
                <p className="text-sm">Create your first lecture above!</p>
              </div>
            ) : (
              lectures.map((lecture, index) => (
                <div
                  key={lecture._id}
                  className="flex justify-between items-center border-b py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                >
                  <h3 className="font-semibold text-gray-800">
                    {index + 1}. {lecture.title}
                  </h3>

                  <button
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                    onClick={() =>
                      navigate(`/editlecture/${courseId}/${lecture._id}`)
                    }
                  >
                    Edit
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateLecture;
