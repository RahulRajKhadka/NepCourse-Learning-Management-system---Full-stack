// redux/courseSlice.jsx
import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
  name: "course",
  initialState: {
    creatorCourses: [],
    educatorPublishedCourses: [],
    publishedCourses: [],
    selectedCourse: null,
    loading: false,
  },
  reducers: {
    setCreatorCourses: (state, action) => {
      state.creatorCourses = action.payload;
      state.educatorPublishedCourses = action.payload.filter(
        (course) => course.isPublished
      );
    },

    setEducatorPublishedCourses: (state, action) => {
      state.educatorPublishedCourses = action.payload;
    },

    setPublishedCourses: (state, action) => {
      state.publishedCourses = action.payload;
    },

    updateCreatorCourse: (state, action) => {
      const updatedCourse = action.payload;

      const index = state.creatorCourses.findIndex(
        (course) => course._id === updatedCourse._id
      );
      if (index !== -1) {
        state.creatorCourses[index] = updatedCourse;
      }

      const pubIndex = state.educatorPublishedCourses.findIndex(
        (course) => course._id === updatedCourse._id
      );

      if (updatedCourse.isPublished) {
        if (pubIndex !== -1) {
          state.educatorPublishedCourses[pubIndex] = updatedCourse;
        } else {
          state.educatorPublishedCourses.push(updatedCourse);
        }
      } else {
        if (pubIndex !== -1) {
          state.educatorPublishedCourses.splice(pubIndex, 1);
        }
      }

      const globalIndex = state.publishedCourses.findIndex(
        (course) => course._id === updatedCourse._id
      );
      if (globalIndex !== -1 && updatedCourse.isPublished) {
        state.publishedCourses[globalIndex] = updatedCourse;
      } else if (globalIndex !== -1 && !updatedCourse.isPublished) {
        state.publishedCourses.splice(globalIndex, 1);
      }
    },

    removeCreatorCourse: (state, action) => {
      state.creatorCourses = state.creatorCourses.filter(
        (course) => course._id !== action.payload
      );
      state.educatorPublishedCourses = state.educatorPublishedCourses.filter(
        (course) => course._id !== action.payload
      );
      state.publishedCourses = state.publishedCourses.filter(
        (course) => course._id !== action.payload
      );
    },

    addEducatorPublishedCourse: (state, action) => {
      const course = action.payload;
      const exists = state.educatorPublishedCourses.some(
        (c) => c._id === course._id
      );
      if (!exists) {
        state.educatorPublishedCourses.push(course);
      }
    },

    updateEducatorPublishedCourse: (state, action) => {
      const updatedCourse = action.payload;
      const index = state.educatorPublishedCourses.findIndex(
        (course) => course._id === updatedCourse._id
      );

      if (index !== -1) {
        state.educatorPublishedCourses[index] = updatedCourse;
      } else {
        state.educatorPublishedCourses.push(updatedCourse);
      }
    },

    removeEducatorPublishedCourse: (state, action) => {
      state.educatorPublishedCourses = state.educatorPublishedCourses.filter(
        (course) => course._id !== action.payload
      );
    },

    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setCreatorCourses,
  setEducatorPublishedCourses,
  setPublishedCourses,
  updateCreatorCourse,
  removeCreatorCourse,
  addEducatorPublishedCourse,
  updateEducatorPublishedCourse,
  removeEducatorPublishedCourse,
  setSelectedCourse,
  setLoading,
} = courseSlice.actions;

export default courseSlice.reducer;
