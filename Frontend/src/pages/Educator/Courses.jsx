import { FaArrowLeftLong, FaE, FaRegMoneyBill1 } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import img from "../../assets/empty.jpg";
import { FaEdit } from "react-icons/fa";

const Courses = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className=" flex min-h-screen bg-gray-100">
        <div className="w-[100%] min-h-screen p-4 sm:p-6 bg-gary-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div className="flex items-center justifFy-center gap-3">
              <FaArrowLeftLong
                className="w-[22px] h-[22px] cursor-pointer text-gray-500"
                onClick={() => navigate("/Dashboard")}
              />
              <h1>All Created Courses</h1>
            </div>
            <button
              className="bg-[black] text-white px-4 py-2 rounded"
              onClick={() => navigate("/create")}
            >
              Create Course
            </button>
          </div>

          {/* for large screen table */}

          <div className="hidden md:block bg-white rounded-xl shadow-md p-4 overflow x-auto ">
            <table className="min-w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4">Courses</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50 transistion duration-200">
                  <td className="py-3 px-4 flex items-center gap-4 ">
                    <img
                      src={img}
                      className="w-25 h-10 object-cover rounded-md "
                      alt=""
                    />{" "}
                    <span className="text-gray-600">Course Title</span>
                  </td>
                  <td className="px-3 py-3">Rupees NA</td>
                  <td className="px-3 py-3">
                    <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">
                      Draft
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <FaEdit className=" text-gray-600 hover:text-blue-600 cursor-pointer" />
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="text-center text-sm text-gray-400 mt-6">
              A list of your recent courses
            </p>
          </div>

          <div className="sm:hidden space-y-4">
            <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3 ">
              <div className="flex gap-2 items-center">
                <img
                  src={img}
                  alt=""
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h2 className="font-medium text-sm ">title</h2>
                  <p className="text-xs text-gray-600 mt-1">NA</p>
                </div>
                <FaEdit className="text-gray-600 hover:text-blue-600 cursor-pointer" />
              </div>
              <span className="w-fit px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 ">Draft</span>
            </div>
            <p className="text-xs text-gray-600 mt-1 flex justify-center">A list of your recent courses</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;
