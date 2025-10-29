import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { SignUp } from "./pages/SignUp.jsx";
import { serverUrl } from "./config.js";
import { ToastContainer } from "react-toastify";
import useGetCurrentUser from "./customHooks/getCurrentUser.js";
import { useSelector } from "react-redux";
import Profile from "./pages/Profile.jsx";
import { Navigate } from "react-router-dom";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import { Dashboard } from "./pages/Educator/Dashboard.jsx";
import CreateCourse from "./pages/Educator/CreateCourses.jsx";
import EditCourse from "./pages/Educator/EditCourses.jsx";
import Courses from "./pages/Educator/Courses.jsx";
import GetCreatorCourses from "./customHooks/getCreaterCourse.js";
import usePublishedCourses from "./customHooks/useAllPublishedCourses.js";
import AllCourses from "./pages/AllCourses.jsx";
import CreateLecture from "./pages/Educator/CreateLecture.jsx";
import EditLecture from "./pages/Educator/EditLecture.jsx";
import ViewCourses from "./pages/ViewCourses.jsx";
import PaymentPage from "./payments/Payment.jsx";
import Success from "./payments/Sucess.jsx";
import Failure from "./payments/Failure.jsx";
import MyCourses from "./pages/MyEnrolledCourses.jsx";
import ViewLecture from "./pages/ViewLecture.jsx";
import MyEnrolledCourse from "./pages/MyEnrolledCourse.jsx";
import SearchWithAi from "./pages/SearchwithAi.jsx";

export const App = () => {
  useGetCurrentUser();
  GetCreatorCourses();
  usePublishedCourses();
  const { userData, loading } = useSelector((state) => state.user);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />

        <Route
          path="/dashboard"
          element={
            userData?.role === "educator" ? <Dashboard /> : <Navigate to="/" />
          }
        />
       
        <Route
          path="/create"
          element={
            userData?.role === "educator" ? (
              <CreateCourse />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/courses"
          element={
            userData?.role === "educator" ? <Courses /> : <Navigate to="/" />
          }
        />
        <Route
          path="/editcourse/:courseId"
          element={
            userData?.role === "educator" ? <EditCourse /> : <Navigate to="/" />
          }
        />
        <Route
          path="/createlecture/:courseId"
          element={
            userData?.role === "educator" ? (
              <CreateLecture />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/editlecture/:courseId/:lectureId"
          element={
            userData?.role === "educator" ? (
              <EditLecture />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Course Discovery & Learning */}
        <Route path="/allcourses" element={<AllCourses />} />
        <Route
          path="/course/:courseId"
          element={userData ? <ViewCourses /> : <Navigate to="/login" />}
        />
        <Route
          path="/viewlecture/:courseId"
          element={userData ? <ViewLecture /> : <Navigate to="/login" />}
        />

        {/* Payment Routes */}
        <Route
          path="/payment/:courseId"
          element={userData ? <PaymentPage /> : <Navigate to="/login" />}
        />
        <Route path="/payment-success" element={<Success />} />
        <Route path="/payment-failure" element={<Failure />} />

        {/* AI Search */}
        <Route
          path="/search"
          element={userData ? <SearchWithAi /> : <Navigate to="/login" />}
        />

        {/* Profile & Settings */}
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-profile"
          element={userData ? <EditProfile /> : <Navigate to="/login" />}
        />
       

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};
