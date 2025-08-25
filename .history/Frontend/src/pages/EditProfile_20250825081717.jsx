// EditProfile.jsx
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { serverUrl } from "../App.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { setUserData } from "../redux/userSlice.jsx";
import { ClipLoader } from "react-spinners";

export function EditProfile() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(userData?.name || "");
  const [description, setDescription] = useState(userData?.description || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!userData) {
    navigate("/login");
    return null;
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById("image");
    if (fileInput) fileInput.value = "";
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      if (selectedImage) formData.append("photoUrl", selectedImage); // matches backend

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      const response = await axios.put(
        `${serverUrl}/api/user/profile`, // ✅ Changed from /update to /profile
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUserData = response.data.user;
      dispatch(setUserData(updatedUserData));
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Profile update error:", error);
      if (error.code === "ECONNABORTED") {
        toast.error("Request timeout. Try a smaller image.");
      } else if (error.response?.status === 401) {
        toast.error("Please login again");
        navigate("/login");
      } else if (error.response?.status === 413) {
        toast.error("Image too large. Choose a smaller image.");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update profile"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full relative">
        <FaArrowLeftLong
          className="absolute top-[5%] left-[5%] w-[22px] h-[22px] cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => navigate("/profile")}
        />

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Profile
        </h2>

        <form className="space-y-5" onSubmit={handleEditProfile}>
          {/* Profile Picture */}
          <div className="flex flex-col items-center text-center">
            <div className="relative group">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                  alt="New Profile Preview"
                />
              ) : userData.photoUrl ? (
                <img
                  src={userData.photoUrl}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
                  alt="Current Profile"
                />
              ) : (
                <div className="w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-gray-600 border-gray-300">
                  {(name || userData.name || "U")[0].toUpperCase()}
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <ClipLoader size={20} color="white" />
                </div>
              )}
            </div>

            {imagePreview && (
              <div className="mt-2 flex items-center gap-2">
                <p className="text-xs text-blue-600">New photo selected</p>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs text-red-600 hover:text-red-800 underline"
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* File Input */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select New Avatar (optional)
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
              onChange={handleImageSelect}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Max size: 5MB • Supported: JPG, PNG, GIF, WebP
            </p>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              disabled={loading}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
              rows="4"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              disabled={loading}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/500 characters
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-md py-3 px-4"
            disabled={loading}
          >
            {loading ? (
              <>
                <ClipLoader size={20} color="white" className="mr-2" />
                {selectedImage ? "Uploading & Saving..." : "Saving Changes..."}
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
