import { useEffect } from "react";
import { serverUrl } from "../config.js";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCourse, setLoading } from "../redux/courseSlice.jsx";
import axios from "axios";

const useCourseById = (courseId) => {
  const dispatch = useDispatch();
  const course = useSelector((state) => state.course.selectedCourse);
  const loading = useSelector((state) => state.course.loading);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        dispatch(setLoading(true));
        console.log("Fetching course by ID:", courseId);

        const result = await axios.get(
          serverUrl + `/api/courses/getCourseById/${courseId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Course fetched:", result.data);

        if (result.data.success) {
          dispatch(setSelectedCourse(result.data.course));
        }
      } catch (error) {
        console.log("Error fetching course:", error);
        dispatch(setSelectedCourse(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCourse();
  }, [courseId, dispatch]);

  return { course, loading };
};

export default useCourseById;
