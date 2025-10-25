import React from "react";
import { FaGraduationCap } from "react-icons/fa";
import logo from "../../public/logoo.png";

const Footer = () => {
  return (
    <footer className="bg-black w-full text-white py-8 sm:py-12 px-4 sm:px-6 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row flex-wrap justify-between items-start gap-6 sm:gap-8">
        <div className="flex flex-col gap-3 w-full sm:w-2/5 lg:w-1/4">
          <div className="flex items-center gap-3">
            <div className="bg-white text-black p-2 rounded-md">
              <img src={logo} alt="NepCourses Logo" className="w-12 h-12 sm:w-14 sm:h-14" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold">NepCourses</h2>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            AI-powered learning platform to help you grow smarter. Learn anything, anytime, anywhere.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-1/2 sm:w-1/4">
          <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Quick Links</h3>
          <ul className="text-gray-300 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm">
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">
                All Courses
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Login
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">
                My Profile
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 w-1/2 sm:w-1/4">
          <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Categories</h3>
          <ul className="text-gray-300 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm">
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Web Development
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">
                App Development
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">
                AI / ML
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">
                UI / UX Designing
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 sm:mt-10 pt-4 sm:pt-5 text-center text-gray-500 text-xs sm:text-sm">
        © {new Date().getFullYear()} NepCourses. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;