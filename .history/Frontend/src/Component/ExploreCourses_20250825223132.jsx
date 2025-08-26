import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  LineChart, 
  Figma,
  Smartphone, 
  Database, 
  BrainCircuit, 
  Globe, 
  PieChart,
  Play
} from 'lucide-react';

const ExploreCourses = () => {
  const courses = [
    { 
      icon: Bot, 
      name: "Artificial Intelligence",
      color: "from-blue-500 to-cyan-400"
    },
    { 
      icon: BrainCircuit, 
      name: "Machine Learning",
      color: "from-purple-500 to-pink-400"
    },
    { 
      icon: LineChart, 
      name: "Data Analytics",
      color: "from-green-500 to-emerald-400"
    },
    { 
      icon: Database, 
      name: "Data Science",
      color: "from-indigo-500 to-blue-400"
    },
    { 
      icon: Figma, 
      name: "UI/UX Design",
      color: "from-pink-500 to-rose-400"
    },
    { 
      icon: Smartphone, 
      name: "Mobile Development",
      color: "from-orange-500 to-amber-400"
    },
    { 
      icon: Globe, 
      name: "Web Development",
      color: "from-teal-500 to-green-400"
    },
    { 
      icon: PieChart, 
      name: "Business Analytics",
      color: "from-violet-500 to-purple-400"
    }
  ];

  return (
    <div className="w-[100vw] min-h-[50vh] lg:h-[50vh] flex flex-col lg:flex-row items-center justify-center gap-4 px-[30px]">
      {/* Left Div */}
      <div className="w-[100%] lg:w-[350px] lg:h-[100%] h-[400px] flex flex-col items-start justify-center gap-1 md:px-[40px] px-[20px]">
        <span className="text-[35px] font-semibold">Explore</span>
        <span className="text-[35px] font-semibold">Our Courses</span>
        <p className="text-[17px]">
          Discover cutting-edge technology courses designed to elevate your skills. From AI and machine learning to web development and data science, unlock your potential with our comprehensive learning programs.
        </p>
        <motion.button 
          className="px-[20px] py-[10px] border-2 bg-[black] border-white text-white rounded-[10px] text-[18px] font-light flex gap-2 mt-[40px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Courses 
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Play className="w-[20px] h-[20px] fill-white" />
          </motion.div>
        </motion.button>
      </div>

      {/* Right Div (Icons) */}
      <div className="w-[720px] max-w-[90%] lg:h-[300px] md:min-h-[300px] flex items-center justify-center lg:gap-[60px] gap-[50px] flex-wrap mb-[50px] lg:mb-[0px]">
        {courses.map((course, index) => {
          const IconComponent = course.icon;
          
          return (
            <motion.div 
              key={index} 
              className="w-[50px] h-[100px] font-light text-[13px] flex flex-col gap-3 text-center cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div 
                className={`w-[100px] h-[90px] bg-gradient-to-br ${course.color} rounded-lg flex items-center justify-center shadow-lg`}
                whileHover={{ 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  y: -5
                }}
                // Removed the wobble animation from container
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 8 + (index * 0.5), // Slower and staggered duration
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <IconComponent className="w-[20px] h-[40px] text-white drop-shadow-lg" />
                </motion.div>
              </motion.div>
              
              <motion.span 
                className="text-gray-700"
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