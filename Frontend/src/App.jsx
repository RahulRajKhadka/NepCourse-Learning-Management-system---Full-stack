import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { SignUp } from "./pages/SignUp.jsx";
export const serverUrl = "http://localhost:8000";
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
  const { userData } = useSelector((state) => state.user);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to="/signup" />}
        />
        <Route
          path="/forgot-password"
          element={!userData ? <ForgetPassword /> : <Navigate to="/signup" />}
        />
        <Route
          path="/edit-Profile"
          element={userData ? <EditProfile /> : <Navigate to="/signup" />}
        />
        <Route
          path="/allcourses"
          element={userData ? <AllCourses /> : <Navigate to="/signup" />}
        />
        <Route path="/Dashboard" element={<Dashboard />} />
    
        <Route
          path="/create"
          element={userData ? <CreateCourse /> : <Navigate to="/signup" />}
        />
        <Route
          path="/courses"
          element={userData ? <Courses /> : <Navigate to="/signup" />}
        />
        <Route
          path="/editcourse/:courseId"
          element={userData ? <EditCourse /> : <Navigate to="/signup" />}
        />
        <Route
          path="/createlecture/:courseId"
          element={userData ? <CreateLecture /> : <Navigate to="/signup" />}
        />
        <Route
          path="/editlecture/:courseId/:lectureId"
          element={userData ?.role === "educator" ? <EditLecture /> : <Navigate to="/signup" />}
        />
        <Route
          path="/course/:courseId"
          element={
            userData?.role === "educator" ? (
              <ViewCourses />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route path="/payment/:courseId" element={<PaymentPage />} />
        <Route path="/payment-success" element={<Success />} />
        <Route path="/payment-failure" element={<Failure />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/viewlecture/:courseId" element={<ViewLecture />} />
        <Route path="/my-enrolled-courses" element={<MyEnrolledCourse />} />
        <Route path="/search" element={<SearchWithAi />} />
      </Routes>
    </>
  );
};
