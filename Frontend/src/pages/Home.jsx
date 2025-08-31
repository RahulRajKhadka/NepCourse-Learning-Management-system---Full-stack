import React from "react";
import Nav from "../Component/Nav.jsx";
import home from "../assets/home1.jpg";
import { SiViaplay } from "react-icons/si";
import ai from "../assets/ai.png";
import ai1 from "../assets/SearchAi.png";
import Logo from "../Component/Logo.jsx";
import ExploreCourses from "../Component/ExploreCourses.jsx";

export const Home = () => {
  return (
    <>
      <div className="">
        <div className="">
          <Nav />
          <div className="w-[100%] relative">
            <img
              src={home}
              className="object-fit md:object-fill w-[100%] lg:h-[100%] h-[80vh]"
              alt="Home"
            />

            <span
              className="lg:text-[70px] absolute md:text-[40px] lg:top-[10%] top-[20%] w-[100%] flex items-center justify-center 
               text-white font-black text-[16px] px-2 text-center tracking-wide
               drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              Empower Your Mind
            </span>
            <span
              className="lg:text-[70px] absolute md:text-[20px] lg:top-[18%] top-[25%] w-[100%] flex items-center justify-center 
               text-blue-400 font-bold text-[16px] px-2 text-center tracking-wider
               drop-shadow-[0_2px_4px_rgba(59,130,246,0.6)]"
            >
              Elevate Your Career
            </span>
            {/* Buttons wrapper */}
            <div className="absolute w-[100%] flex items-center justify-center gap-2 flex-col sm:flex-row sm:gap-3 flex-wrap top-[100%] md:top-[80%] lg:top-[30%] mt-[20px] md:mt-0 lg:mt-0 px-4">
              {/* View all Courses button */}
              <button className="px-[15px] sm:px-[20px] py-[8px] sm:py-[10px] border-2 lg:border-white border-black rounded-2xl lg:text-white text-black text-[14px] sm:text-[16px] md:text-[18px] font-light flex gap-2 cursor-pointer items-center justify-center min-w-[140px] sm:min-w-[160px]">
                View all Courses
                <SiViaplay className="w-[20px] h-[20px] sm:w-[25px] sm:h-[25px] lg:w-[30px] lg:h-[30px] fill-current" />
              </button>

              {/* Search with AI button */}
              <button className="px-[15px] sm:px-[20px] py-[8px] sm:py-[10px] border-2 lg:border-white border-black lg:text-white text-black rounded-[10px] text-[14px] sm:text-[16px] md:text-[18px] font-light flex gap-2 cursor-pointer items-center justify-center min-w-[140px] sm:min-w-[160px]">
                Search with AI
                <img
                  className="w-[20px] h-[20px] sm:w-[25px] sm:h-[25px] lg:w-[30px] lg:h-[30px] rounded-full hidden lg:block"
                  src={ai}
                  alt=""
                />
                <img
                  className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] rounded-full lg:hidden"
                  src={ai1}
                  alt="Search with AI icon"
                />
              </button>
            </div>
          </div>

          {/* Logo positioned outside the image container for better responsiveness */}
          <div className="w-full mt-20 pt-12">
            <Logo />
          </div>
          <div>
            <ExploreCourses />
          </div>
        </div>
      </div>
    </>
  );
};
