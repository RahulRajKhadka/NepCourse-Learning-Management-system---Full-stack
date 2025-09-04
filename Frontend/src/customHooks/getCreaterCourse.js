import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setCreateCourseData } from "../redux/courseSlice.jsx";
import { useSelector } from "react-redux";

const GetCreatorCourses = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const CreateCourses = async () => {
      try {
        const result = await axios.get(
          serverUrl + "/api/course/getCreatorCourse",
          {
            withCredentials: true,
          }
        );
        console.log("Fetched creator courses:", result.data);
        dispatch(setCreateCourseData(result.data.courses));
      } catch (error) {
        console.error("Error fetching creator courses:", error);
      }
    };
    CreateCourses();
  }, [userData]);
};

export default GetCreatorCourses;
