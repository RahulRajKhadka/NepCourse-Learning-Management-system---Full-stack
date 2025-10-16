import React from "react";
import { FaGraduationCap } from "react-icons/fa";
import logo from "../../public/logoo.png";

const Footer = () => {
  return (
    <footer className="bg-black w-full  text-white py-12 px-6 md:px-16">
      <div className=" mx-auto flex flex-wrap justify-between items-start gap-10">
        <div className="flex flex-col gap-3 w-full sm:w-[40%] md:w-[30%]">
          <div className="flex items-center gap-3">
            <div className="bg-white text-black p-2 rounded-md">
              <img src={logo} alt="NepCourses Logo" className="w-15 h-15" />
            </div>
            <h2 className="text-[20px] font-semibold">NepCourses</h2>
          </div>
          <p className="text-gray-400 text-[15px] leading-relaxed">
            AI-powered learning platform to help you grow smarter. Learn
            anything, anytime, anywhere.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-[40%] sm:w-[25%]">
          <h3 className="text-[18px] font-semibold mb-2">Quick Links</h3>
          <ul className="text-gray-300 flex flex-col gap-2">
            <li>
              <a href="#" className="hover:text-blue-400">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                All Courses
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                Login
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                My Profile
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 w-[40%] sm:w-[25%]">
          <h3 className="text-[18px] font-semibold mb-2">Categories</h3>
          <ul className="text-gray-300 flex flex-col gap-2">
            <li>
              <a href="#" className="hover:text-blue-400">
                Web Development
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                App Development
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                AI / ML
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                UI / UX Designing
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-5 text-center text-gray-500 text-[14px]">
        © {new Date().getFullYear()} NepCourses. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
