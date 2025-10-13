import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
  name: "course",
  
  initialState: {

    creatorCourses: [],
    publishedCourses: [],
    selectedCourse:null,
  },
  reducers: {
    
  
    setCreatorCourses: (state, action) => {
      console.log("Setting creator courses:", action.payload);
      state.creatorCourses = action.payload;
    },

    setPublishedCourses: (state, action) => {
      console.log("Setting published courses:", action.payload);
      state.publishedCourses = action.payload;
    },

    clearCourseData: (state) => {
      state.courseData = [];
    },

    clearCreatorCourses: (state) => {
      state.creatorCourses = [];
    },

    clearPublishedCourses: (state) => {
      state.publishedCourses = [];
    },

    clearAllCourses: (state) => {
      state.courseData = [];
      state.creatorCourses = [];
      state.publishedCourses = [];
    },

    // Add course to creator courses
    addCreatorCourse: (state, action) => {
      state.creatorCourses.push(action.payload);
    },

    addPublishedCourse: (state, action) => {
      state.publishedCourses.push(action.payload);
    },

    addCourse: (state, action) => {
      state.courseData.push(action.payload);
    },

    updateCreatorCourse: (state, action) => {
      const index = state.creatorCourses.findIndex(
        (course) => course._id === action.payload._id
      );
      if (index !== -1) {
        state.creatorCourses[index] = action.payload;
      }
    },

    updatePublishedCourse: (state, action) => {
      const index = state.publishedCourses.findIndex(
        (course) => course._id === action.payload._id
      );
      if (index !== -1) {
        state.publishedCourses[index] = action.payload;
      }
    },

    updateCourse: (state, action) => {
      const index = state.courseData.findIndex(
        (course) => course._id === action.payload._id
      );
      if (index !== -1) {
        state.courseData[index] = action.payload;
      }
    },

    removeCreatorCourse: (state, action) => {
      state.creatorCourses = state.creatorCourses.filter(
        (course) => course._id !== action.payload
      );
    },

    removePublishedCourse: (state, action) => {
      state.publishedCourses = state.publishedCourses.filter(
        (course) => course._id !== action.payload
      );
    },

    removeCourse: (state, action) => {
      state.courseData = state.courseData.filter(
        (course) => course._id !== action.payload
      );
    },

    setSelectedCourse:(state,action)=>{
      state.selectedCourse=action.payload
    }
  },
});

export const {


  setCreatorCourses,
  clearCreatorCourses,
  addCreatorCourse,
  updateCreatorCourse,
  removeCreatorCourse,

  setPublishedCourses,
  clearPublishedCourses,
  addPublishedCourse,
  updatePublishedCourse,
  removePublishedCourse,

  clearAllCourses,

  setSelectedCourse
} = courseSlice.actions;

export default courseSlice.reducer;
