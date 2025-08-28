import { MdOutlineCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FcOnlineSupport } from "react-icons/fc"
import { GrSupport } from "react-icons/gr";
const Logo = () => {
  return (
    <div className="w-[100vw] min-h-[90px] flex items-center justify-center flex-wrap gap-4 md:mb-[50px]">
      <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-3xl  bg-gray-200 cursor-pointer text-[#03394b]">
        <MdOutlineCastForEducation className="w-[35px] h-[35px] fill-[#03394b]" />
        20k+ online courses
      </div>
      <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-3xl  bg-gray-200 cursor-pointer text-[#03394b]">
        <SiOpenaccess className="w-[35px] h-[35px] fill-[#03394b]" />
        Life Time Access
      </div>
       <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-3xl  bg-gray-200 cursor-pointer text-[#03394b]">
        <FaSackDollar className="w-[35px] h-[35px] fill-[#03394b]" />
        Value for Money
      </div>
      <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-3xl  bg-gray-200 cursor-pointer text-[#03394b]">
        <BiSupport className="w-[35px] h-[35px] fill-[#03394b]" />
        Life Time Support
      </div>
     
      <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-3xl  bg-gray-200 cursor-pointer text-[#03394b]">
        <GrSupport  className="w-[35px] h-[35px] fill-[#03394b]" />
        Community Support
      </div>
      <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-3xl  bg-gray-200 cursor-pointer text-[#03394b]">
        <FcOnlineSupport  className="w-[35px] h-[35px] fill-[#03394b]" />
        Expert Instructors
      </div>
    </div>
  );
};

export default Logo;

