import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPublishedCourses } from "../redux/courseSlice";
import { serverUrl } from "../App";

const usePublishedCourses = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get current course data from Redux
  const courseData = useSelector((state) => state.course.courseData);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${serverUrl}/api/course/getPublishedCourses`
        );
        dispatch(setPublishedCourses(response.data));
        console.log("Course data fetched and stored in Redux:", response.data);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setError(error.message || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [dispatch]);

  // Return the course data along with loading and error states
  return {
    courseData,
    loading,
    error,
    refetch: () => {
      // Allow manual refetch if needed
      const fetchCourseData = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await axios.get(
            `${serverUrl}/api/course/getPublishedCourses`
          );
          dispatch(setPublishedCourses(response.data));
        } catch (error) {
          setError(error.message || "Failed to fetch courses");
        } finally {
          setLoading(false);
        }
      };
      fetchCourseData();
    },
  };
};

export default usePublishedCourses;
