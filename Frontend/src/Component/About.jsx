import about from "../assets/about.jpg";
import video from "../assets/Aboutvideo.mp4";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import {
  FaChalkboardTeacher,
  FaInfinity,
  FaBrain,
  FaUserGraduate,
} from "react-icons/fa";

function About() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-16 py-8 lg:py-0">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        <div className="w-full lg:w-2/5 flex flex-col items-center justify-center relative">
          <img
            src={about}
            alt="About"
            className="w-full rounded-2xl object-cover shadow-lg"
          />
          <video
            src={video}
            controls
            autoPlay
            loop
            muted
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 sm:w-3/4 md:w-2/3 rounded-xl shadow-2xl border-4 border-white"
          />
        </div>

        <div className="w-full lg:w-3/5 flex flex-col items-start justify-center gap-4 sm:gap-6 mt-16 sm:mt-20 lg:mt-0">
          <div className="flex items-center gap-3 text-base sm:text-lg font-medium">
            <span>About Us</span>
            <TfiLayoutLineSolid className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl  text-white font-bold leading-tight sm:leading-tight">
            We Are Maximize Your Learning Growth
          </h2>

          <p className="text-sm  sm:text-base md:text-lg text-white leading-relaxed text-justify">
            We provide a modern Learning Management System to simplify online
            education, track progress, and enhance student-instructor
            collaboration efficiently.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2 w-full text-sm sm:text-base font-medium">
            <div className="flex items-center gap-2 ">
              <FaBrain className="text-blue-600" /> <span className="text-white">Simplified Learning</span>
            
            </div>
            <div className="flex items-center gap-2">
              <FaChalkboardTeacher className="text-blue-600" /> <span className="text-white">Expert Trainers</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUserGraduate className="text-blue-600" /> <span className="text-white">Big Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <FaInfinity className="text-blue-600" /> <span className="text-white">Lifetime Access</span>
            </div>
          </div>

          <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all text-sm sm:text-base font-medium">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default About;
