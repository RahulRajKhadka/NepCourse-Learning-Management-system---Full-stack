import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const courseId = searchParams.get("courseId");

  useEffect(() => {
    const verifyEnrollment = async () => {
      try {
        if (!courseId) {
          setVerifying(false);
          return;
        }

        
        const res = await axios.get(
          `http://localhost:5000/api/enrollment/status?courseId=${courseId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
         
          navigate(`/view-course/${courseId}`);
        } else {
        
          setVerifying(false);
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        setVerifying(false);
      }
    };

    verifyEnrollment();
  }, [courseId, navigate]);

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-2 text-green-700">
            Verifying Payment...
          </h2>
          <p className="mb-6 text-gray-600">
            Please wait while we confirm your payment with eSewa/Khalti.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <svg
          className="mx-auto mb-4 w-16 h-16 text-green-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2l4 -4M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10z"
          />
        </svg>
        <h2 className="text-2xl font-bold mb-2 text-green-700">
          Payment Successful!
        </h2>
        <p className="mb-6 text-gray-600">
          Thank you for your payment. You are now enrolled in the course.
        </p>
        <button
          onClick={() => navigate(`/view-course/${courseId}`)}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Go to Course
        </button>
      </div>
    </div>
  );
};

export default Success;
