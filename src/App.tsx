import { useLayoutEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";

import PageContainer from "./components/layout/PageContainer";
import RecordDirectory from "./components/dashboard/RecordDirectory";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";

import "./App.css";
import DashboardLayout from "./components/layout/DashoboardLayout";

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Dashboard */}
            <Route index element={<Dashboard />} />

            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            {/* Students */}
            <Route path="students" element={<Students />} />

            {/* Teachers */}
            <Route path="teachers" element={<Teachers />} />

            {/* Departments */}
            <Route path="departments" element={<RecordDirectory kind="departments" title="Departments" description="Organize academic departments and their information." />} />

            {/* Courses */}
            <Route path="courses" element={<RecordDirectory kind="courses" title="Courses" description="Manage courses, subjects, and academic offerings." />} />

            {/* Classes & Sections */}
            <Route
              path="classes"
              element={
                <PageContainer
                  title="Classes & Sections"
                  description="Organize classes, sections, and student groups."
                />
              }
            />

            {/* Attendance */}
            <Route
              path="attendance"
              element={
                <PageContainer
                  title="Attendance"
                  description="Track and review student attendance records."
                />
              }
            />

            {/* Examinations & Grades */}
            <Route
              path="examinations"
              element={
                <PageContainer
                  title="Examinations & Grades"
                  description="Manage examinations, grades, and student results."
                />
              }
            />

            {/* Timetable */}
            <Route
              path="timetable"
              element={
                <PageContainer
                  title="Timetable"
                  description="View and organize academic schedules."
                />
              }
            />
          </Route>
        </Route>

        {/* Unknown Routes */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
