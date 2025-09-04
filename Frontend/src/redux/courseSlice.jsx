import { createSlice } from '@reduxjs/toolkit';

const courseSlice = createSlice({
  name: 'course',
  initialState: {
    createCourseData: null,
  },
  reducers: {
    setCreateCourseData: (state, action) => {
      console.log('Setting create course data:', action.payload);
      state.createCourseData = action.payload;
    },
    clearCreateCourseData: (state) => {
      state.createCourseData = null;
    }
  }
});

export const { setCreateCourseData, clearCreateCourseData } = courseSlice.actions;
export default courseSlice.reducer;
