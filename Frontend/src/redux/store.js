import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import CourseSlice from "./CourseSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    course:CourseSlice
  },
});
