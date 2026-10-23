import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
} from "lucide-react";

export const dashboardStats = [
  {
    title: "Total Students",
    value: "1,250",
    description: "Currently enrolled students",
    icon: Users,
    color: "blue",
  },
  {
    title: "Total Teachers",
    value: "85",
    description: "Active faculty members",
    icon: GraduationCap,
    color: "red",
  },
  {
    title: "Departments",
    value: "8",
    description: "Academic departments",
    icon: Building2,
    color: "blue",
  },
  {
    title: "Courses",
    value: "42",
    description: "Available courses",
    icon: BookOpen,
    color: "red",
  },
];

export const enrollmentData = [
  { semester: "Spring 2024", students: 820 },
  { semester: "Fall 2024", students: 910 },
  { semester: "Spring 2025", students: 980 },
  { semester: "Fall 2025", students: 1080 },
  { semester: "Spring 2026", students: 1180 },
  { semester: "Fall 2026", students: 1250 },
];

export const attendanceData = [
  { name: "Present", value: 78 },
  { name: "Absent", value: 12 },
  { name: "Late", value: 10 },
];

export const recentActivities = [
  {
    id: 1,
    title: "New student registered",
    description: "A new student record was added.",
    time: "10 minutes ago",
    color: "blue",
  },
  {
    id: 2,
    title: "Teacher information updated",
    description: "A faculty member's information was updated.",
    time: "35 minutes ago",
    color: "red",
  },
  {
    id: 3,
    title: "New course added",
    description: "A course was added to the academic catalog.",
    time: "1 hour ago",
    color: "blue",
  },
  {
    id: 4,
    title: "Attendance recorded",
    description: "Class attendance was recorded.",
    time: "2 hours ago",
    color: "red",
  },
];
