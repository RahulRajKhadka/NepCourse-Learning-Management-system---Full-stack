import { useEffect } from "react";
import { serverUrl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setCreatorCourses, setLoading } from "../redux/courseSlice.jsx";
import axios from "axios";

const useEducatorCourses = () => {
  const dispatch = useDispatch();
  const creatorCourses = useSelector((state) => state.course.creatorCourses);
  const educatorPublishedCourses = useSelector(
    (state) => state.course.educatorPublishedCourses
  );
  const loading = useSelector((state) => state.course.loading);

  useEffect(() => {
    const fetchEducatorCourses = async () => {
      try {
        dispatch(setLoading(true));
        console.log("Fetching educator courses...");

        // ✅ CHANGED: /api/course/ → /api/courses/
        const result = await axios.get(
          serverUrl + "/api/courses/getCreatorCourse",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Educator courses fetched:", result.data);

        if (result.data.success) {
          // This automatically populates both creatorCourses and educatorPublishedCourses
          dispatch(setCreatorCourses(result.data.courses));

          const published = result.data.courses.filter(
            (course) => course.isPublished
          );
          console.log("Published courses:", published);
        }
      } catch (error) {
        console.error("Error fetching educator courses:", error);
        dispatch(setCreatorCourses([]));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchEducatorCourses();
  }, [dispatch]);

  // Derived data - draft courses
  const draftCourses = creatorCourses.filter((course) => !course.isPublished);

  return {
    courses: creatorCourses,
    publishedCourses: educatorPublishedCourses,
    draftCourses,
    loading,
  };
};

export default useEducatorCourses;
