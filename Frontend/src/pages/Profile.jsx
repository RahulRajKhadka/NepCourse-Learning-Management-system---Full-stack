import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";  // ✅ should come from react-router-dom, not redux
import { IoMdArrowRoundBack } from "react-icons/io";

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg relative">

        {/* 🔙 Back Arrow */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-gray-600 hover:text-indigo-600 text-2xl"
        >
          <IoMdArrowRoundBack />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Profile Image */}
          {userData.photo ? (
            <img
              src={userData.photoUrl}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-4 border-indigo-500 shadow-md"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-4xl font-bold">
              {userData.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* User Name */}
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            {userData.name || "No Name"}
          </h2>
          <p className="text-sm text-gray-500">{userData.email || "No Email"}</p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <p className="text-gray-600">{userData.name || "N/A"}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <p className="text-gray-600">{userData.email || "N/A"}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <p className="text-gray-600">
              {userData.description || "No description added yet."}
            </p>
          </div>
        </div>

        {/* ✏️ Edit Profile Button */}
        <div className="mt-6 flex justify-center">
          <button
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
