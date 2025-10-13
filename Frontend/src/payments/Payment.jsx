import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetCurrentUser from "../customHooks/getCurrentUser"; // Adjust path as needed

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = useParams();
  const [selectedPayment, setSelectedPayment] = useState("");

  // Redux user state
  const { userData } = useSelector((state) => state.user);
  useGetCurrentUser();

  const { course, amount } = location.state || {};
  const paymentMethods = [
    {
      id: "khalti",
      name: "Khalti",
      logo: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Khalti_Digital_Wallet_Logo.png.jpg",
      description: "Pay with Khalti wallet or cards",
      color: "border-purple-200 hover:border-purple-400",
    },
    {
      id: "esewa",
      name: "eSewa",
      logo: "https://esewa.com.np/common/images/esewa-logo.png",
      description: "Pay with eSewa wallet",
      color: "border-green-200 hover:border-green-400",
    },
    {
      id: "stripe",
      name: "Stripe",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
      description: "International card payments",
      color: "border-gray-200 opacity-60 cursor-not-allowed relative",
      comingSoon: true,
    },
  ];
  const handlePaymentSelect = (paymentId) => {
    setSelectedPayment(paymentId);
  };

  const handleProceedPayment = async () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    if (!userData || (!userData._id && !userData.id)) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    try {
      const paymentData = {
        courseId: courseId,
        paymentGateway: selectedPayment,
        amount: amount ?? 0,
      };

      const response = await fetch(
        "http://localhost:8000/api/payment/initiate-course-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(paymentData),
        }
      );

      if (response.status === 401) {
        alert("Please login to continue");
        navigate("/login");
        return;
      }

      const result = await response.json();
      if (result.success) {
        if (result.enrollmentType === "free") {
          alert("Successfully enrolled in the course!");
          navigate(`/course/${courseId}`);
        } else {
          window.location.href = result.paymentUrl;
        }
      } else {
        alert(result.message || "Payment initiation failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (userData === null || userData === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Course information not found</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6 group"
          >
            ← <span className="font-medium">Back to Course</span>
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Enrollment
            </h1>
            <p className="text-gray-600">
              Choose your preferred payment method
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Select Payment Method
              </h2>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() =>
                      !method.comingSoon && handlePaymentSelect(method.id)
                    }
                    className={`relative border-2 rounded-xl p-4 transition-all duration-200 flex items-center gap-4 ${
                      selectedPayment === method.id
                        ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200"
                        : method.color
                    }`}
                  >
                    {/* ✅ Coming Soon Badge */}
                    {method.comingSoon && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-md text-gray-800">
                        Coming Soon
                      </div>
                    )}

                    <div className="w-16 h-16 flex items-center justify-center bg-white rounded-lg border border-gray-100">
                      <img
                        src={method.logo}
                        alt={method.name}
                        className="w-14 h-10 object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {method.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {method.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  🔒 <span className="font-medium">Secure Payment</span>
                </div>
                <p className="text-sm text-gray-600">
                  Your payment information is encrypted and secure. We never
                  store your payment details.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm leading-tight">
                      {course.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {course.category}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Course Price</span>
                    <span className="font-medium text-gray-900">
                      {amount > 0 ? `Rs. ${amount}` : "Free"}
                    </span>
                  </div>

                  {amount > 0 && (
                    <>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-600">Service Fee</span>
                        <span className="font-medium text-gray-900">Rs. 0</span>
                      </div>

                      <div className="border-t border-gray-200 mt-4 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">
                            Total
                          </span>
                          <span className="text-lg font-semibold text-gray-900">
                            Rs. {amount}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={handleProceedPayment}
                  disabled={
                    !selectedPayment ||
                    !userData ||
                    (!userData._id && !userData.id)
                  }
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    selectedPayment && userData && (userData._id || userData.id)
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {!userData || (!userData._id && !userData.id)
                    ? "Please Login"
                    : amount > 0
                    ? `Pay Rs. ${amount}`
                    : "Enroll for Free"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
