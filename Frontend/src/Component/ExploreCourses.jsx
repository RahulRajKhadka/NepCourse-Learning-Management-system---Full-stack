import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  LineChart,
  Figma,
  Smartphone,
  Database,
  BrainCircuit,
  Globe,
  PieChart,
  Play,
} from "lucide-react";

const ExploreCourses = () => {
  const navigate = useNavigate();
  const courses = [
    {
      icon: Bot,
      name: "Artificial Intelligence",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: BrainCircuit,
      name: "Machine Learning",
      color: "from-purple-500 to-pink-400",
    },
    {
      icon: LineChart,
      name: "Data Analytics",
      color: "from-green-500 to-emerald-400",
    },
    {
      icon: Database,
      name: "Data Science",
      color: "from-indigo-500 to-blue-400",
    },
    { icon: Figma, name: "UI/UX Design", color: "from-pink-500 to-rose-400" },
    {
      icon: Smartphone,
      name: "Mobile Development",
      color: "from-orange-500 to-amber-400",
    },
    {
      icon: Globe,
      name: "Web Development",
      color: "from-teal-500 to-green-400",
    },
    {
      icon: PieChart,
      name: "Business Analytics",
      color: "from-violet-500 to-purple-400",
    },
  ];

  return (
    <div className="w-full min-h-[60vh] flex flex-col xl:flex-row items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 gap-6 sm:gap-8 lg:gap-10 py-8 sm:py-12">
      {/* Left Div */}
      <div className="w-full xl:w-1/2 flex flex-col items-center xl:items-start justify-center gap-3 sm:gap-4 text-center xl:text-left">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          Explore
          <br />
          Our Courses
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl">
          Discover cutting-edge technology courses designed to elevate your
          skills. From AI and machine learning to web development and data
          science, unlock your potential with our comprehensive learning
          programs.
        </p>
        <motion.button
          className="px-4 sm:px-6 py-2 sm:py-3 border-2 bg-black border-white text-white rounded-lg sm:rounded-xl text-base sm:text-lg font-light flex items-center gap-2 mt-4 sm:mt-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/allcourses")}
        >
          Explore Courses
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
          </motion.div>
        </motion.button>
      </div>

      {/* Right Div (Icons Grid) */}
      <div className="w-full xl:w-1/2 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-6 xl:mt-0">
        {courses.map((course, index) => {
          const IconComponent = course.icon;
          return (
            <motion.div
              key={index}
              className="w-[70px] sm:w-[80px] md:w-[90px] lg:w-[100px] flex flex-col items-center gap-2 sm:gap-3 text-center cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                className={`w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] md:w-[55px] md:h-[55px] bg-gradient-to-br ${course.color} rounded-lg flex items-center justify-center shadow-lg`}
                whileHover={{
                  boxShadow:
                    "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                  y: -5,
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8 + index * 0.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <IconComponent className="w-5 h-8 sm:w-6 sm:h-10 text-white drop-shadow-lg" />
                </motion.div>
              </motion.div>
              <motion.span
                className="text-gray-700 text-xs sm:text-sm font-medium leading-tight"
                whileHover={{ color: "#7c3aed" }}
              >
                {course.name}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreCourses;