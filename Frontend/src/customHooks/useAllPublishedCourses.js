import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../config.js";
import { setPublishedCourses, setLoading } from "../redux/courseSlice";

const useAllPublishedCourses = () => {
  const dispatch = useDispatch();
  const publishedCourses = useSelector(
    (state) => state.course.publishedCourses || []
  );
  const loading = useSelector((state) => state.course.loading);

  useEffect(() => {
    const fetchPublishedCourses = async () => {
      try {
        dispatch(setLoading(true));
        console.log("Fetching all published courses...");

        const result = await axios.get(
          serverUrl + "/api/courses/getPublishedCourses",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Published courses fetched:", result.data);

        if (result.data.success) {
          dispatch(setPublishedCourses(result.data.courses));
        }
      } catch (error) {
        console.error("Error fetching published courses:", error);
        dispatch(setPublishedCourses([]));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchPublishedCourses();
  }, [dispatch]);

  return {
    publishedCourses,
    loading,
  };
};

export default useAllPublishedCourses;
