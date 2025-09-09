import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
  name: "course",
  initialState: {
    courseData: [],           // Keep this for backward compatibility if needed
    creatorCourses: [],       // For creator's courses (home page)
    publishedCourses: [],     // For all published courses (AllCourses page)
  },
  reducers: {
    // Original reducer - keep for backward compatibility
    setCourseData: (state, action) => {
      console.log("Setting course data:", action.payload);
      state.courseData = action.payload;
    },
    
    // New reducers for separate course types
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
    
    // Add course to published courses
    addPublishedCourse: (state, action) => {
      state.publishedCourses.push(action.payload);
    },
    
    // Original add course (backward compatibility)
    addCourse: (state, action) => {
      state.courseData.push(action.payload);
    },
    
    // Update creator course
    updateCreatorCourse: (state, action) => {
      const index = state.creatorCourses.findIndex(
        (course) => course._id === action.payload._id
      );
      if (index !== -1) {
        state.creatorCourses[index] = action.payload;
      }
    },
    
    // Update published course
    updatePublishedCourse: (state, action) => {
      const index = state.publishedCourses.findIndex(
        (course) => course._id === action.payload._id
      );
      if (index !== -1) {
        state.publishedCourses[index] = action.payload;
      }
    },
    
    // Original update course (backward compatibility)
    updateCourse: (state, action) => {
      const index = state.courseData.findIndex(
        (course) => course._id === action.payload._id
      );
      if (index !== -1) {
        state.courseData[index] = action.payload;
      }
    },
    
    // Remove from creator courses
    removeCreatorCourse: (state, action) => {
      state.creatorCourses = state.creatorCourses.filter(
        (course) => course._id !== action.payload
      );
    },
    
    // Remove from published courses
    removePublishedCourse: (state, action) => {
      state.publishedCourses = state.publishedCourses.filter(
        (course) => course._id !== action.payload
      );
    },
    
    // Original remove course (backward compatibility)
    removeCourse: (state, action) => {
      state.courseData = state.courseData.filter(
        (course) => course._id !== action.payload
      );
    },
  },
});

export  const {
  // Original actions (backward compatibility)
  setCourseData,
  clearCourseData,
  addCourse,
  updateCourse,
  removeCourse,
  
  // New actions for creator courses
  setCreatorCourses,
  clearCreatorCourses,
  addCreatorCourse,
  updateCreatorCourse,
  removeCreatorCourse,
  
  // New actions for published courses
  setPublishedCourses,
  clearPublishedCourses,
  addPublishedCourse,
  updatePublishedCourse,
  removePublishedCourse,
  
  // Utility action
  clearAllCourses,
} = courseSlice.actions;

export default courseSlice.reducer;