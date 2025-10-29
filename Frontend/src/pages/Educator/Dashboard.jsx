import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Add this line at the top to use environment variable
const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use API_URL variable instead of hardcoded URL
      const response = await fetch(`${API_URL}/api/dashboard/instructor`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
      } else {
        throw new Error(data.message || "Failed to load dashboard");
      }
    } catch (err) {
      setError(err.message);
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path) => navigate(path);
  const goBack = () => navigate("/");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full rounded-xl bg-white p-8 shadow-lg">
          <div className="text-center">
            <div className="mb-4 text-red-600">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Unable to Connect
            </p>
            <p className="text-sm text-gray-600 mb-1">{error}</p>
            <p className="text-xs text-gray-500 mb-6">
              Make sure your backend server is running at {API_URL}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={fetchDashboardData}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition"
              >
                Try Again
              </button>
              <button
                onClick={() => navigateTo("/courses")}
                className="rounded-lg bg-gray-200 px-6 py-2 text-gray-700 font-medium hover:bg-gray-300 transition"
              >
                Create Course
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { overview, courseStats, recentEnrollments, revenueChartData } =
    dashboardData || {};

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Back Button */}
      <button
        onClick={goBack}
        className="absolute left-[5%] top-[5%] z-10 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

      <div className="w-full px-6 py-10 bg-gray-50 space-y-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-4">
              <img
                src={userData?.photoUrl || "https://via.placeholder.com/150"}
                alt="educator"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500"
              />
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800">
                  Welcome, {userData?.name || "User"}!
                </h2>
                <p className="text-gray-600 mt-1">
                  {userData?.description || "Full Stack Developer"}
                </p>
              </div>
            </div>
            <button
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-medium"
              onClick={() => navigateTo("/courses")}
            >
              Create New Course
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`NPR ${overview?.totalRevenue?.toLocaleString() || 0}`}
            icon={
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            bgColor="bg-green-500"
          />
          <StatCard
            title="Total Students"
            value={overview?.totalStudents || 0}
            subtitle={`+${overview?.newStudentsLast7Days || 0} this week`}
            icon={
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            bgColor="bg-blue-500"
          />
          <StatCard
            title="Total Courses"
            value={overview?.totalCourses || 0}
            subtitle={`${overview?.publishedCourses || 0} published`}
            icon={
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            }
            bgColor="bg-purple-500"
          />
          <StatCard
            title="New Students (30d)"
            value={overview?.newStudentsLast30Days || 0}
            icon={
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
            bgColor="bg-orange-500"
          />
        </div>

        {/* Revenue Chart */}
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Revenue Overview (Last 6 Months)
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={revenueChartData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value) => [
                  `NPR ${value.toLocaleString()}`,
                  "Revenue",
                ]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Course Performance Charts */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Courses by Enrollment */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Top Courses by Enrollment
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseStats?.slice(0, 5) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="title"
                  angle={-20}
                  textAnchor="end"
                  height={80}
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="enrollmentCount"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Revenue Distribution by Course
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={
                    courseStats?.slice(0, 6).filter((c) => c.revenue > 0) || []
                  }
                  dataKey="revenue"
                  nameKey="title"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(entry) => `NPR ${entry.revenue.toLocaleString()}`}
                  labelLine={{ stroke: "#6b7280" }}
                >
                  {(courseStats?.slice(0, 6) || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `NPR ${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Your Courses */}
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Your Courses</h2>
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {courseStats?.length || 0} total courses
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseStats && courseStats.length > 0 ? (
              courseStats.map((course) => (
                <div
                  key={course._id}
                  className="group cursor-pointer rounded-lg border-2 border-gray-200 overflow-hidden transition hover:border-blue-500 hover:shadow-xl"
                  onClick={() => navigateTo(`/course/${course._id}`)}
                >
                  <div className="relative">
                    <img
                      src={
                        course.thumbnail ||
                        "https://via.placeholder.com/400x200?text=No+Image"
                      }
                      alt={course.title}
                      className="h-40 w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          course.isPublished
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                      {course.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <svg
                          className="h-4 w-4 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span className="font-medium">
                          {course.enrollmentCount}
                        </span>
                        <span>students</span>
                      </div>
                      <span className="font-bold text-green-600">
                        NPR {course.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        Created{" "}
                        {new Date(course.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <svg
                  className="mx-auto h-16 w-16 mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <p className="text-lg font-medium">No courses yet</p>
                <p className="mt-1">Create your first course to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Recent Enrollments
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentEnrollments && recentEnrollments.length > 0 ? (
                  recentEnrollments.map((enrollment) => (
                    <tr
                      key={enrollment._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              enrollment.studentPhoto ||
                              "https://via.placeholder.com/40"
                            }
                            alt={enrollment.studentName}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-200"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {enrollment.studentName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {enrollment.studentEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {enrollment.courseName}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-green-600">
                        NPR {enrollment.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 rounded-full bg-gray-200 overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-700">
                            {enrollment.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(enrollment.enrolledAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      <svg
                        className="mx-auto h-12 w-12 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <p className="font-medium">No enrollments yet</p>
                      <p className="text-sm mt-1">
                        Students will appear here once they enroll in your
                        courses
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle, bgColor }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start gap-4">
        <div
          className={`${bgColor} flex h-14 w-14 items-center justify-center rounded-lg text-white shadow-lg`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
