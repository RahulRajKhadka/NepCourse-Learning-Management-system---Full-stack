import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../config.js";
import { useDispatch } from "react-redux";
import { setCreatorCourses } from "../redux/courseSlice";
import { useSelector } from "react-redux";

const GetCreatorCourses = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const CreateCourses = async () => {
      try {
        const result = await axios.get(
          serverUrl + "/api/courses/getCreatorCourse",
          {
            withCredentials: true,
          }
        );
        console.log("Fetched creator courses:", result.data);
        dispatch(setCreatorCourses(result.data.courses));
      } catch (error) {
        console.error("Error fetching creator courses:", error);
      }
    };
    CreateCourses();
  }, [userData]);
};

export default GetCreatorCourses;
