import {SiViaplay} from "react-icons/si";

const ExploreCourses = () => {
  return (
    <>
      <div className="w-[100vw] min-h-[50vh] lg:h-[50vh] flexx flex-col lg:flex-row items-center justify-center gap-4 px-[30px]">
        <div className="w-[100%] lg:w-[350px] lg:h-[100%] h-[400px] flex flex-col items-start justify-center gap-1 md:px-[40px] px-[20px]">
          <span className="text-[35px] font-semibold ">Explore</span>
          <span  className="text-[35px] font-semibold ">Our Courses</span>
          <p className="text-[17px">Lorem ipsum dzzzzzzzzzolor sit, amet consectetur adipisicing elit. Impedit, nemo quis totam voluptates quia, ut fuga quaerat suscizpit dolor sed magni facere eaque provident aliquam recusandae eligendi est iste id.z 
          </p>
          <button className="px-[20px] py-[10px] border-2 bg-[black] border-white text-white rounded-[10px] text-[18px] font-light flex gap-2 mt-[40px]"> Explore Courses <SiViaplay className="w-[20px] h-[20px] fill-white"/></button>
        </div>

        <div className="w-[720px] max-w-[90%] lg:h-[300px] md:min-h-[300px] flex items-center justify-center lg:gap-[60px] gap-[50px] flex-wrap mb-[50px] lg:mb-[0px]">

          <div className="w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center">

            
          </div>



        </div>
      </div>
    </>
  );
};

export default ExploreCourses;
