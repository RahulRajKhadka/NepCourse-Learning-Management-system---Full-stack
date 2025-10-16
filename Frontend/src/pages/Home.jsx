import React from "react";
import Nav from "../Component/Nav.jsx";
import home from "../assets/home1.jpg";
import { SiViaplay } from "react-icons/si";
import ai from "../assets/ai.png";
import ai1 from "../assets/SearchAi.png";
import Logo from "../Component/Logo.jsx";
import ExploreCourses from "../Component/ExploreCourses.jsx";
import CardPage from "../Component/CardPage.jsx";
import { useNavigate } from "react-router-dom";
import About from "../Component/About.jsx";
import Footer from "../Component/Footer.jsx";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center overflow-hidden">
        <Nav />

        <div className="relative w-full">
          <img
            src={home}
            className="object-fill w-full lg:h-[100%] h-[80vh]"
            alt="Home"
          />
          <span className="lg:text-[70px] md:text-[40px] absolute lg:top-[10%] top-[20%] w-full flex items-center justify-center text-white font-black text-[16px] px-2 text-center tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Empower Your Mind
          </span>
          <span className="lg:text-[70px] md:text-[20px] absolute lg:top-[18%] top-[25%] w-full flex items-center justify-center text-blue-400 font-bold text-[16px] px-2 text-center tracking-wider drop-shadow-[0_2px_4px_rgba(59,130,246,0.6)]">
            Elevate Your Career
          </span>

          <div className="absolute w-full flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap top-[100%] md:top-[80%] lg:top-[30%] mt-4 px-4">
            <button
              className="px-[20px] py-[10px] border-2 lg:border-white border-black rounded-2xl lg:text-white text-black text-[16px] font-light flex gap-2 cursor-pointer items-center justify-center min-w-[160px]"
              onClick={() => navigate("/allcourses")}
            >
              View all Courses
              <SiViaplay className="w-[25px] h-[25px]" />
            </button>
            <button className="px-[20px] py-[10px] border-2 lg:border-white border-black lg:text-white text-black rounded-[10px] text-[16px] font-light flex gap-2 cursor-pointer items-center justify-center min-w-[160px]">
              Search with AI
              <img
                className="w-[25px] h-[25px] rounded-full hidden lg:block"
                src={ai}
                alt="AI icon"
              />
              <img
                className="w-[20px] h-[20px] rounded-full lg:hidden"
                src={ai1}
                alt="Search with AI icon"
              />
            </button>
          </div>
        </div>

        <section className="w-full flex  items-center justify-center mt-20 mb-10">
          <Logo />
        </section>

        <section className="w-full flex flex-col items-center justify-center mt-16 mb-16">
          <ExploreCourses />
        </section>

        <section className="w-full flex  items-center justify-center mt-16 mb-16">
          <CardPage />
        </section>

        <section className="w-full flex flex-col items-center justify-center mt-16 mb-16">
          <About />
        </section>

        <section className="w-full flex flex-col items-center justify-center mt-16">
          <Footer />
        </section>
      </div>
    </>
  );
};
