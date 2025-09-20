import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import courseSlice from "./courseSlice";
import lectureSlice from "./LectureSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    course: courseSlice,
    lecture: lectureSlice,
  },
});