import { createSlice } from "@reduxjs/toolkit";

const lectureSlice = createSlice({
  name: "lecture",
  initialState: {
    lectures: [],
  },
  reducers: {
    setAllLectures: (state, action) => {
      state.lectures = action.payload;
    },
    addLecture: (state, action) => {
      state.lectures.push(action.payload);
    },
    removeLecture: (state, action) => {
      state.lectures = state.lectures.filter(
        (lecture) => lecture._id !== action.payload
      );
    },
    clearLectures: (state) => {
      state.lectures = [];
    },
  },
});

export const { setAllLectures, addLecture, removeLecture, clearLectures } =
  lectureSlice.actions;

export default lectureSlice.reducer;
