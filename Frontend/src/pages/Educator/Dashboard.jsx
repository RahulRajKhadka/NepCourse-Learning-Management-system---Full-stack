import { useSelector } from "react-redux";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
export const Dashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <FaArrowLeftLong className="w-[22px] absolute top-[10%] left-[10%]  h-[22px] cursor-pointer text-gray-500" onClick={() => navigate("/")} />
        <div className="w-full px-6 py-10 bg-gray-50 space-y-10">
          {/* main-section */}

          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
            {/* Left Side - Profile Image */}
            <img
              src={
                userData?.photoUrl || "https://via.placeholder.com/150" // fallback image
              }
              alt="educator"
              className="w-24 h-24 rounded-full object-cover"
            />

       
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
      
              <h2 className="text-xl font-semibold">
                Welcome, {userData?.name || "User"}
              </h2>

           
              <div className="flex flex-col md:flex-row gap-4 text-gray-600">
                <p>
                  Total Earnings:{" "}
                  <span className="font-bold text-green-600">$1,200</span>
                </p>
                <p>|</p>
                <p>Full Stack Developer</p>
              </div>

            
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition" onClick={() => navigate("/courses")}>
                Create Course
              </button>
            </div>
          </div>

          {/* Graph-section */}
          <div>


          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
