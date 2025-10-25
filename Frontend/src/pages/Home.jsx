import React from "react";
import Nav from "../Component/Nav.jsx";
import home from "../assets/home1.jpg";
import { SiViaplay } from "react-icons/si";
import ai from "../assets/ai.png";
import Logo from "../Component/Logo.jsx";
import ExploreCourses from "../Component/ExploreCourses.jsx";
import CardPage from "../Component/CardPage.jsx";
import { useNavigate } from "react-router-dom";
import About from "../Component/About.jsx";
import Footer from "../Component/Footer.jsx";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden">
      <Nav />

      <div className="relative w-full bg-blue-300">
        {/* Hero Image Section */}
        <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[90vh]  bg-blue-300">
          {/* Main Image Container */}
          <div className="absolute inset-0">
            <img
              src={home}
              className="object-cover w-full h-full"
              alt="Home"
            />
            <div className="absolute inset-0 bg-black/30 "></div>
          </div>

          {/* Inside/Concave Curve SVG */}
          <div className="absolute -bottom-1 left-0 w-full">
            <svg 
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none" 
              className="w-full h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32"
            >
              <path 
                d="M0,0 Q600,120 1200,0 L1200,120 L0,120 Z" 
                className="fill-white"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-black text-center tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-2 sm:mb-3 lg:mb-4">
              Empower Your Mind
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl text-blue-400 font-bold text-center tracking-wider drop-shadow-[0_2px_6px_rgba(59,130,246,0.8)] mb-6 sm:mb-8 lg:mb-12">
              Elevate Your Career
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xl px-4">
              <button
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-white rounded-2xl text-white text-sm sm:text-base lg:text-lg font-medium flex gap-2 items-center justify-center hover:bg-white hover:text-black transition-all duration-300 shadow-lg min-w-[180px]"
                onClick={() => navigate("/allcourses")}
              >
                View all Courses
                <SiViaplay className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              <button 
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-white text-white rounded-2xl text-sm sm:text-base lg:text-lg font-medium flex gap-2 items-center justify-center hover:bg-white hover:text-black transition-all duration-300 shadow-lg min-w-[180px]" 
                onClick={() => navigate("/search")}
              >
                Search with AI
                <img
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                  src={ai}
                  alt="AI icon"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="w-full flex items-center justify-center  mt-8 sm:mt-10 mb-6 sm:mb-8 px-4 
      ">
        <Logo />
      </section>

      <section className="w-full flex flex-col items-center justify-center mt-8 sm:mt-10 mb-8 sm:mb-10 px-4">
        <ExploreCourses />
      </section>

      <section className="w-full flex items-center justify-center mt-8 sm:mt-10 mb-8 sm:mb-10 px-4">
        <CardPage />
      </section>

      <section className="w-full flex flex-col items-center justify-center mt-8 sm:mt-10 mb-8 sm:mb-10 px-4">
        <About />
      </section>

      <section className="w-full flex flex-col items-center justify-center mt-8 sm:mt-10">
        <Footer />
      </section>
    </div>
  );
};