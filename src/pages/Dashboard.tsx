import StatCard from "@/components/dashboard/StatCard";
import EnrollmentChart from "@/components/dashboard/EnrollmentChart";
import AttendanceChart from "@/components/dashboard/AttendanceChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AddNewDialog from "@/components/dashboard/AddNewDialog";

import { CalendarDays, ChevronDown } from "lucide-react";
import { useUniversityData } from "@/context/UniversityDataContext";
import { dashboardStats } from "@/data/mockData";

export default function Dashboard() {
  const { selectedAcademicYear, setSelectedAcademicYear, newRecordCounts } = useUniversityData();
  const totals = selectedAcademicYear === "2025-2026"
    ? { students: 1180, faculty: 82, departments: 8, courses: 39 }
    : { students: 1250, faculty: 85, departments: 8, courses: 42 };

  const stats = dashboardStats.map((stat) => {
    const value = stat.title === "Total Students"
      ? totals.students + newRecordCounts.students
      : stat.title === "Total Teachers"
        ? totals.faculty + newRecordCounts.faculty
        : stat.title === "Departments"
          ? totals.departments + newRecordCounts.departments
          : totals.courses + newRecordCounts.courses;
    return { ...stat, value: value.toLocaleString() };
  });

  const enrollmentData = selectedAcademicYear === "2025-2026"
    ? [
        { semester: "Fall 2025", students: 1080 + newRecordCounts.students },
        { semester: "Spring 2026", students: 1180 + newRecordCounts.students },
      ]
    : [
        { semester: "Fall 2026", students: 1250 + newRecordCounts.students },
        { semester: "Spring 2027", students: 1310 + newRecordCounts.students },
      ];

  const attendanceData = selectedAcademicYear === "2025-2026"
    ? [{ name: "Present", value: 76 }, { name: "Absent", value: 14 }, { name: "Late", value: 10 }]
    : [{ name: "Present", value: 78 }, { name: "Absent", value: 12 }, { name: "Late", value: 10 }];

  return (
    <div className="dashboard-enter space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Welcome back! Here's what's happening at Rana University.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
            <CalendarDays size={17} />
            <span className="sr-only">Academic year</span>
            <select
              aria-label="Academic year"
              value={selectedAcademicYear}
              onChange={(event) => setSelectedAcademicYear(event.target.value as "2025-2026" | "2026-2027")}
              className="cursor-pointer appearance-none bg-transparent outline-none"
            >
              <option value="2025-2026">Academic Year 2025–2026</option>
              <option value="2026-2027">Academic Year 2026–2027</option>
            </select>
            <ChevronDown aria-hidden="true" size={15} className="text-slate-400" />
          </label>

          <AddNewDialog />
        </div>
      </div>

      {/* Statistics Cards */}
      <section
        aria-label="University statistics"
        className="dashboard-stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            color={stat.color as "blue" | "red"}
          />
        ))}
      </section>

      {/* Charts Section */}
      <section
        aria-label="University charts"
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
      >
        <div className="dashboard-reveal xl:col-span-2">
          <EnrollmentChart data={enrollmentData} academicYear={selectedAcademicYear} />
        </div>

        <div className="dashboard-reveal xl:col-span-1">
          <AttendanceChart data={attendanceData} />
        </div>
      </section>

      {/* Recent Activity Section */}
      <section
        aria-label="Recent university activity"
        className="dashboard-reveal-late grid grid-cols-1 gap-6"
      >
        <RecentActivity />
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 pt-5">
        <p className="text-center text-xs text-slate-400">
          Rana University Management System · Dashboard
        </p>
      </footer>
    </div>
  );
}
