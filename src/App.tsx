import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";

import PageContainer from "./components/layout/PageContainer";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import "./App.css";
import DashboardLayout from "./components/layout/DashoboardLayout";

export function App() {
  return (
    <BrowserRouter>
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
            <Route
              path="students"
              element={
                <PageContainer
                  title="Students"
                  description="Manage student records and academic information."
                />
              }
            />

            {/* Teachers */}
            <Route
              path="teachers"
              element={
                <PageContainer
                  title="Teachers"
                  description="Manage faculty records and teaching assignments."
                />
              }
            />

            {/* Departments */}
            <Route
              path="departments"
              element={
                <PageContainer
                  title="Departments"
                  description="Organize academic departments and their information."
                />
              }
            />

            {/* Courses */}
            <Route
              path="courses"
              element={
                <PageContainer
                  title="Courses"
                  description="Manage courses, subjects, and academic offerings."
                />
              }
            />

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