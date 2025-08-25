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

export const App = () => {
  useGetCurrentUser();
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
          element={! userData ? <ForgetPassword /> : <Navigate to="/signup" />}
        />
        <Route
          path="/edit-Profile" 
        
      </Routes>
    </>
  );
};
