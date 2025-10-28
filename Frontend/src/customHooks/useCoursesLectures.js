// hooks/useCourseLectures.js
import { useEffect } from "react";
import { serverUrl } from "../config.js";
import { useDispatch, useSelector } from "react-redux";
import { setAllLectures, setLoading } from "../redux/lectureSlice.jsx";
import axios from "axios";

const useCourseLectures = (courseId) => {
  const dispatch = useDispatch();
  const lectures = useSelector((state) => state.lecture.lectures);
  const loading = useSelector((state) => state.lecture.loading);

  useEffect(() => {
    if (!courseId) return;

    const fetchLectures = async () => {
      try {
        dispatch(setLoading(true));
        console.log("Fetching lectures for course:", courseId);

        const result = await axios.get(
          serverUrl + `/api/courses/getCourseLectures/${courseId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Lectures fetched:", result.data);

        if (result.data.success) {
          dispatch(setAllLectures(result.data.lectures));
        }
      } catch (error) {
        console.log("Error fetching lectures:", error);
        dispatch(setAllLectures([]));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchLectures();
  }, [courseId, dispatch]);

  return { lectures, loading };
};

export default useCourseLectures;
