import about from "../assets/about.jpg";
import video from "../assets/Aboutvideo.mp4";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { FaChalkboardTeacher, FaInfinity, FaBrain, FaUserGraduate } from "react-icons/fa";

function About() {
  return (
    <div className="w-[100vw] lg:h-[80vh] flex flex-wrap items-center justify-center px-4 lg:px-16 gap-8 mb-[40px]">
      
      {/* Left Side - Image and Video */}
      <div className="lg:w-[40%] md:w-[80%] w-[100%] flex flex-col items-center justify-center relative">
        <img
          src={about}
          alt="About"
          className="w-[100%] rounded-2xl object-cover"
        />
        <video
          src={video}
          controls
          autoPlay
          loop
          muted
          className="absolute bottom-[-30px] left-[50%] transform -translate-x-1/2 w-[70%] rounded-xl shadow-lg border-2 border-white"
        />
      </div>

      {/* Right Side - About Info */}
      <div className="lg:w-[45%] md:w-[80%] w-[100%] flex flex-col items-start justify-center gap-5">
        <div className="flex items-center gap-3 text-lg font-medium">
          <span>About Us</span>
          <TfiLayoutLineSolid className="w-[25px] h-[25px] text-blue-600" />
        </div>

        <h2 className="md:text-[42px] text-[32px] font-bold leading-tight">
          We Are Maximize Your <br /> Learning Growth
        </h2>

        <p className="text-[17px] text-gray-600 leading-relaxed text-justify">
          We provide a modern Learning Management System to simplify online education, 
          track progress, and enhance student-instructor collaboration efficiently.
        </p>

        {/* Features with Icons */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 mt-2 text-[17px] font-medium">
          <div className="flex items-center gap-2">
            <FaBrain className="text-blue-600" /> Simplified Learning
          </div>
          <div className="flex items-center gap-2">
            <FaChalkboardTeacher className="text-blue-600" /> Expert Trainers
          </div>
          <div className="flex items-center gap-2">
            <FaUserGraduate className="text-blue-600" /> Big Experience
          </div>
          <div className="flex items-center gap-2">
            <FaInfinity className="text-blue-600" /> Lifetime Access
          </div>
        </div>

        <button className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default About;
