// EditProfile.jsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiUser, FiUpload } from "react-icons/fi";
import { setUserData } from "../redux/userSlice.jsx";
import { serverUrl } from "../App.jsx";

const EditProfile = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    photo: null,
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        description: userData.description || "",
        photo: null,
      });
      setPreviewUrl(userData.photoUrl || "");
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      setFormData((prev) => ({ ...prev, photo: file }));
      setError("");
      setSuccess("");

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Create FormData for multipart/form-data request
      const submitFormData = new FormData();
      
      // Add text fields
      submitFormData.append('name', formData.name.trim());
      submitFormData.append('description', formData.description.trim());
      
      // Add photo if selected
      if (formData.photo) {
        submitFormData.append('photoUrl', formData.photo); // Note: using 'photoUrl' to match your route
      }

      console.log('Submitting form data...');
      
      const response = await fetch(`${serverUrl}/api/user/profile`, {
        method: "PUT",
        credentials: 'include', // This ensures cookies are sent with the request
        body: submitFormData,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Success response:', responseData);

      setSuccess("Profile updated successfully!");

      // Update Redux store with the response data or construct it
      const updatedUserData = {
        ...userData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        photoUrl: responseData.photoUrl || userData.photoUrl, // Use server response or keep existing
      };

      dispatch(setUserData(updatedUserData));

      // Navigate back to profile page after a short delay
      setTimeout(() => {
        navigate("/profile");
      }, 1500);

    } catch (error) {
      console.error("Profile update error:", error);
      setError(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate("/profile")}
          className="absolute top-4 left-4 text-gray-600 hover:text-indigo-600 text-2xl"
          disabled={isLoading}
        >
          <IoMdArrowRoundBack />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Profile
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-32 h-32 object-cover rounded-full border-4 border-indigo-500 shadow-md"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-4xl font-bold">
                  <FiUser />
                </div>
              )}

              <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-indigo-700 transition">
                <FiUpload className="text-lg" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Click the icon to upload a new photo
            </p>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
              placeholder="Enter your name"
              disabled={isLoading}
              required
            />
          </div>

          {/* Description/Bio Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
              placeholder="Tell us about yourself..."
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;