import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiCamera, FiSave, FiUser, FiMail, FiFileText } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { setUserData } from "../redux/userSlice"; // Adjust path as needed
import { serverUrl } from "../App"; // Adjust path as needed

const EditProfile = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form state
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    description: userData?.description || "",
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(userData?.photoUrl || "");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Prepare form data for multipart upload
      const uploadData = new FormData();
      uploadData.append('name', formData.name.trim());
      uploadData.append('email', formData.email.trim());
      uploadData.append('description', formData.description.trim());
      
      if (profileImage) {
        uploadData.append('profileImage', profileImage);
      }

      const response = await axios.put(
        `${serverUrl}/api/user/profile`, // Adjust endpoint as needed
        uploadData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update Redux store with new user data
        dispatch(setUserData(response.data.user));
        toast.success("Profile updated successfully!");
        navigate("/profile");
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl relative">
        
        {/* Back Arrow */}
        <button
          onClick={() => navigate("/profile")}
          className="absolute top-4 left-4 text-gray-600 hover:text-indigo-600 text-2xl transition-colors"
          disabled={loading}
        >
          <IoMdArrowRoundBack />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your profile information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Profile Image Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-32 h-32 object-cover rounded-full border-4 border-indigo-500 shadow-md"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-4xl font-bold">
                  {formData.name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
              
              {/* Camera Icon Overlay */}
              <label className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                <FiCamera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">Click the camera to change photo</p>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FiUser className="inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your full name"
              disabled={loading}
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FiMail className="inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your email"
              disabled={loading}
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FiFileText className="inline mr-2" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Tell us about yourself..."
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <ClipLoader color="#ffffff" size={20} className="mr-2" />
                  Updating...
                </div>
              ) : (
                <div className="flex items-center">
                  <FiSave className="mr-2" />
                  Save Changes
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;