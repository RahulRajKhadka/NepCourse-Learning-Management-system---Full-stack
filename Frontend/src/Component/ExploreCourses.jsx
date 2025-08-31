import React from "react";
import { motion } from "framer-motion";
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
    <div className="w-full min-h-[60vh] flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 gap-10">
      {/* Left Div */}
      <div className="w-full lg:w-1/2 flex flex-col items-start justify-center gap-4">
        <h2 className="text-4xl font-bold leading-tight">
          Explore
          <br />
          Our Courses
        </h2>
        <p className="text-lg text-gray-700">
          Discover cutting-edge technology courses designed to elevate your
          skills. From AI and machine learning to web development and data
          science, unlock your potential with our comprehensive learning
          programs.
        </p>
        <motion.button
          className="px-6 py-3 border-2 bg-black border-white text-white rounded-xl text-lg font-light flex gap-2 mt-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Courses
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Play className="w-5 h-5 fill-white" />
          </motion.div>
        </motion.button>
      </div>

      {/* Right Div (Icons Grid) */}
      <div className="w-full lg:w-1/2 flex flex-wrap justify-center gap-5">
        {courses.map((course, index) => {
          const IconComponent = course.icon;
          return (
            <motion.div
              key={index}
              className="w-[80px] flex flex-col items-center flex-wrap gap-3 text-center cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                className={`w-[50px] h-[50px] bg-gradient-to-br ${course.color} rounded-lg flex items-center justify-center shadow-lg`}
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
                  <IconComponent className="w-6 h-10 text-white drop-shadow-lg" />
                </motion.div>
              </motion.div>
              <motion.span
                className="text-gray-700 text-sm font-medium"
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
