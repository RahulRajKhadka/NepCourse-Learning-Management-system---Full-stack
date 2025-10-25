import { MdOutlineCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FcOnlineSupport } from "react-icons/fc";
import { GrSupport } from "react-icons/gr";

const Logo = () => {
  const features = [
    {
      icon: MdOutlineCastForEducation,
      text: "20k+ online courses",
    },
    {
      icon: SiOpenaccess,
      text: "Life Time Access",
    },
    {
      icon: FaSackDollar,
      text: "Value for Money",
    },
    {
      icon: BiSupport,
      text: "Life Time Support",
    },
    {
      icon: GrSupport,
      text: "Community Support",
    },
    {
      icon: FcOnlineSupport,
      text: "Expert Instructors",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 xl:gap-5">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={index}
              className="flex flex-col xs:flex-row items-center justify-center gap-1 xs:gap-2 sm:gap-3 px-2 xs:px-3 sm:px-4 py-2 xs:py-3 sm:py-4 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gray-200 hover:bg-gray-300 cursor-pointer text-[#03394b] transition-all duration-300 hover:shadow-md sm:hover:shadow-lg hover:scale-105 group"
            >
              <IconComponent className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 fill-[#03394b] flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] xs:text-xs sm:text-sm lg:text-base font-medium text-center whitespace-nowrap">
                {feature.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Logo;