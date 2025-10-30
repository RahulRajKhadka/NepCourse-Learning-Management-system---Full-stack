import React, { useState, useEffect } from "react";
import { FaArrowLeftLong, FaVideo, FaTrash, FaPen } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../../config.js";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAllLectures, removeLecture } from "../../redux/LectureSlice";

function EditLecture() {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const { lectures } = useSelector((state) => state.lecture);
  const dispatch = useDispatch();

  const selectedLecture = lectures.find((lec) => lec._id === lectureId);

  const [lectureTitle, setLectureTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [duration, setDuration] = useState(0);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (selectedLecture) {
      setLectureTitle(selectedLecture.title || "");
      setDescription(selectedLecture.description || "");
      setIsFree(selectedLecture.isPreviewFree || false);
      setDuration(selectedLecture.duration || 0);
      setHasUnsavedChanges(false);
    }
  }, [selectedLecture]);

  useEffect(() => {
    if (selectedLecture) {
      const hasChanges =
        lectureTitle !== (selectedLecture.title || "") ||
        description !== (selectedLecture.description || "") ||
        isFree !== (selectedLecture.isPreviewFree || false) ||
        duration !== (selectedLecture.duration || 0) ||
        videoFile !== null;

      setHasUnsavedChanges(hasChanges);
    }
  }, [lectureTitle, description, isFree, duration, videoFile, selectedLecture]);

  useEffect(() => {
    const fetchLectures = async () => {
      if (!lectures.length && courseId) {
        try {
          const response = await axios.get(
            `${serverUrl}/api/courses/getCourseLectures/${courseId}`,
            { withCredentials: true }
          );
          dispatch(setAllLectures(response.data.lectures || []));
        } catch (error) {
          toast.error("Failed to fetch lecture data", error);
        }
      }
    };

    fetchLectures();
  }, [courseId, lectures.length, dispatch]);

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Video file size should be less than 50MB");
        return;
      }
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a valid video file");
        return;
      }
      setVideoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  const handleEditLecture = async (e) => {
    e.preventDefault();

    if (!lectureTitle.trim()) {
      toast.error("Lecture title is required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", lectureTitle.trim());
      formData.append("description", description.trim());
      formData.append("isPreviewFree", isFree);
      formData.append("duration", duration);

      if (videoFile) {
        formData.append("video", videoFile);
      }

      const url = `${serverUrl}/api/courses/editlecture/${courseId}/${lectureId}`;

      await axios.post(url, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const lecturesResponse = await axios.get(
        `${serverUrl}/api/courses/getCourseLectures/${courseId}`,
        { withCredentials: true }
      );
      dispatch(setAllLectures(lecturesResponse.data.lectures || []));

      toast.success("Lecture updated successfully");
      navigate("/createlecture/" + courseId);
    } catch (error) {
      toast.error(
        "Error updating lecture: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLecture = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this lecture? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleteLoading(true);

    try {
      await axios.delete(
        `${serverUrl}/api/courses/deleteLecture/${courseId}/${lectureId}`,
        { withCredentials: true }
      );

      dispatch(removeLecture(lectureId));
      toast.success("Lecture deleted successfully");
      navigate(`/createlecture/${courseId}`);
    } catch (error) {
      toast.error(
        "Error deleting lecture: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (!selectedLecture && lectures.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <ClipLoader size={40} color="#3B82F6" />
          <p className="mt-2 text-gray-600">Loading lecture data...</p>
        </div>
      </div>
    );
  }

  if (lectures.length > 0 && !selectedLecture) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 text-lg">Lecture not found</p>
          <button
            onClick={() => navigate(`/createlecture/${courseId}`)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Lectures
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FaArrowLeftLong
              className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors"
              onClick={() => {
                if (
                  hasUnsavedChanges &&
                  !window.confirm(
                    "You have unsaved changes. Are you sure you want to leave?"
                  )
                ) {
                  return;
                }
                navigate(`/createlecture/${courseId}`);
              }}
            />
            <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <FaPen className="text-blue-600" />
              Update Course Lecture
            </h1>
          </div>

          {hasUnsavedChanges && (
            <span className="text-orange-600 text-sm font-medium">
              Unsaved changes
            </span>
          )}
        </div>

        <button
          className="mb-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          onClick={handleDeleteLecture}
          disabled={deleteLoading}
        >
          <FaTrash />
          {deleteLoading ? (
            <ClipLoader size={16} color="white" />
          ) : (
            "Delete Lecture"
          )}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleEditLecture} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lecture Title *
                </label>
                <input
                  type="text"
                  value={lectureTitle}
                  className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none p-3 rounded-md w-full"
                  onChange={(e) => setLectureTitle(e.target.value)}
                  required
                  placeholder="Enter lecture title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none p-3 rounded-md w-full h-24 resize-vertical"
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter lecture description (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={duration}
                  min="0"
                  className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none p-3 rounded-md w-full"
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  placeholder="Enter duration in minutes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaVideo className="inline mr-2" />
                  Update Video (Optional)
                </label>
                <input
                  type="file"
                  className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none p-3 rounded-md w-full"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty to keep current video. Max size: 50MB
                </p>

                {videoPreview && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      New Video Preview:
                    </p>
                    <video
                      src={videoPreview}
                      controls
                      className="w-full max-w-md h-40 rounded-md border"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFree"
                  className="h-4 w-4 border-gray-300 rounded focus:ring-blue-500"
                  checked={isFree}
                  onChange={() => setIsFree((prev) => !prev)}
                />
                <label
                  htmlFor="isFree"
                  className="text-sm font-medium text-gray-700"
                >
                  Is this video free to preview?
                </label>
              </div>

              {loading && (
                <div className="text-center py-4">
                  <p className="text-blue-600 font-medium">
                    {videoFile
                      ? "Uploading video... please wait."
                      : "Updating lecture..."}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                disabled={loading || !hasUnsavedChanges}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <ClipLoader size={20} color="white" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Lecture"
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            {selectedLecture && (
              <div className="bg-gray-50 rounded-md p-4 sticky top-4">
                <h3 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <FaVideo className="text-blue-600" />
                  Current Lecture Info
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Title
                    </p>
                    <p className="text-sm text-gray-800">
                      {selectedLecture.title}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Description
                    </p>
                    <p className="text-sm text-gray-800">
                      {selectedLecture.description || "No description"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Duration
                    </p>
                    <p className="text-sm text-gray-800">
                      {selectedLecture.duration
                        ? `${selectedLecture.duration} minutes`
                        : "Not set"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Free Preview
                    </p>
                    <span
                      className={`text-sm px-2 py-1 rounded-full text-xs font-medium ${
                        selectedLecture.isPreviewFree
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedLecture.isPreviewFree ? "Yes" : "No"}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Video Status
                    </p>
                    <span
                      className={`text-sm px-2 py-1 rounded-full text-xs font-medium ${
                        selectedLecture.videoUrl
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedLecture.videoUrl ? "Uploaded" : "No Video"}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Created
                    </p>
                    <p className="text-sm text-gray-800">
                      {new Date(selectedLecture.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditLecture;
