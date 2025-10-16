import { useEffect } from "react";
import { serverUrl } from "../App.jsx";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.jsx";
import axios from "axios";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching current user...");
        console.log("Server URL:", serverUrl);

        const result = await axios.get(serverUrl + "/api/user/getcurrentuser", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("User data fetched:", result.data);

        // Handle both response formats
        const userData = result.data.user || result.data;
        dispatch(setUserData(userData));
      } catch (error) {
        console.log("Error fetching user:", error);

        if (error.response?.status === 401) {
          console.log("User not authenticated - clearing user data");
          dispatch(setUserData(null));
        } else if (error.response?.status === 404) {
          console.log("User not found");
          dispatch(setUserData(null));
        } else {
          console.error(
            "Unexpected error:",
            error.response?.data || error.message
          );
          dispatch(setUserData(null));
        }
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useGetCurrentUser;
