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
    <div className="w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      <Nav />

      {/* Hero Section */}
      <div className="relative w-full">
        <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[90vh]">
          {/* Image with Overlay */}
          <div className="absolute inset-0">
            <img src={home} className="object-cover w-full h-full" alt="Home" />
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70"></div>
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 z-10">
            {/* Main Heading with Animation */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-black text-center tracking-wide mb-2 sm:mb-3 lg:mb-4 animate-fade-in-up">
              <span className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                Empower Your Mind
              </span>
            </h1>

            {/* Subtitle */}
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-blue-400 font-bold text-center tracking-wider mb-8 sm:mb-10 lg:mb-14 animate-fade-in-up animation-delay-200">
              <span className="drop-shadow-[0_4px_12px_rgba(59,130,246,0.9)]">
                Elevate Your Career
              </span>
            </h2>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full max-w-2xl px-4 animate-fade-in-up animation-delay-400">
              <button
                className="group w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 border-2 border-white/90 rounded-2xl text-white text-sm sm:text-base lg:text-lg font-semibold flex gap-3 items-center justify-center hover:bg-white hover:text-black hover:border-white hover:scale-105 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_32px_rgba(255,255,255,0.3)] backdrop-blur-sm bg-white/5 min-w-[200px]"
                onClick={() => navigate("/allcourses")}
              >
                View all Courses
                <SiViaplay className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <button
                className="group w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 border-2 border-blue-400/90 bg-blue-500/10 text-white rounded-2xl text-sm sm:text-base lg:text-lg font-semibold flex gap-3 items-center justify-center hover:bg-blue-500 hover:border-blue-500 hover:scale-105 transition-all duration-300 shadow-[0_8px_24px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_32px_rgba(59,130,246,0.5)] backdrop-blur-sm min-w-[200px]"
                onClick={() => navigate("/search")}
              >
                Search with AI
                <img
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full group-hover:rotate-12 transition-transform duration-300"
                  src={ai}
                  alt="AI icon"
                />
              </button>
            </div>
          </div>

          {/* Bottom Fade to Black */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
        </div>
      </div>

      {/* Logo Section */}
      <section className="w-full flex items-center justify-center py-12 sm:py-16 px-4 bg-black">
        <div className="w-full max-w-7xl">
          <Logo />
        </div>
      </section>

      {/* Explore Courses Section */}
      <section className="w-full flex flex-col items-center justify-center py-12 sm:py-16 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="w-full max-w-7xl">
          <ExploreCourses />
        </div>
      </section>

      {/* Card Page Section */}
      <section className="w-full flex items-center justify-center py-12 sm:py-16 px-4 bg-black">
        <div className="w-full max-w-7xl">
          <CardPage />
        </div>
      </section>

      {/* About Section */}
      <section className="w-full flex flex-col items-center justify-center py-12 sm:py-16 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="w-full max-w-7xl">
          <About />
        </div>
      </section>

      {/* Footer Section */}
      <section className="w-full flex flex-col items-center justify-center bg-black">
        <Footer />
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};
