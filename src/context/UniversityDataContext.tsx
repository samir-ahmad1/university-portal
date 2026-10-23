import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { studentMockData } from "@/data/studentMockData";
import { academicDepartments } from "@/data/academicStructure";
import { teacherMockData } from "@/data/teacherMockData";
import type { AcademicYear, StudentRecord } from "@/types/student";
import type { TeacherRecord } from "@/types/teacher";

export const academicYears = ["2025-2026", "2026-2027"] as const;
export type { AcademicYear } from "@/types/student";

export interface FacultyRecord { id: string; name: string; email: string; department: string; isNew: boolean }
export interface CourseRecord { name: string; code: string; department: string; academicYear: AcademicYear; isNew: boolean }
export interface DepartmentRecord { name: string; code: string; isNew: boolean; faculty?: string }
export interface ActivityRecord { id: string; title: string; description: string; time: string; academicYear?: AcademicYear }
export interface QuickStudentInput { id: string; name: string; email: string; department: string; academicYear: AcademicYear }

interface UniversityDataValue {
  selectedAcademicYear: AcademicYear;
  setSelectedAcademicYear: (year: AcademicYear) => void;
  students: StudentRecord[];
  teachers: TeacherRecord[];
  faculty: FacultyRecord[];
  courses: CourseRecord[];
  departments: DepartmentRecord[];
  activities: ActivityRecord[];
  addStudent: (record: StudentRecord | QuickStudentInput) => void;
  updateStudent: (record: StudentRecord) => void;
  deleteStudent: (id: string) => void;
  addTeacher: (record: TeacherRecord) => void;
  updateTeacher: (record: TeacherRecord) => void;
  deleteTeacher: (id: string) => void;
  addCourse: (record: Omit<CourseRecord, "isNew">) => void;
  addDepartment: (record: Omit<DepartmentRecord, "isNew">) => void;
  newRecordCounts: { students: number; faculty: number; courses: number; departments: number };
}

const UniversityDataContext = createContext<UniversityDataValue | null>(null);

const sampleCourses: CourseRecord[] = [
  { name: "Data Structures", code: "CS-204", department: "Software Engineering", academicYear: "2025-2026", isNew: false },
  { name: "Introduction to Programming", code: "CS-101", department: "Information Technology (IT)", academicYear: "2026-2027", isNew: false },
  { name: "Principles of Management", code: "BUS-110", department: "Business Administration", academicYear: "2026-2027", isNew: false },
];
const sampleDepartments: DepartmentRecord[] = academicDepartments.map((department) => ({ ...department, isNew: false }));
const initialActivities: ActivityRecord[] = [
  { id: "sample-activity-1", title: "New student registered", description: "A student joined the Software Engineering department.", time: "Today" },
  { id: "sample-activity-2", title: "Faculty profile updated", description: "Faculty information was updated.", time: "Yesterday" },
  { id: "sample-activity-3", title: "Course added to catalog", description: "A course was added to the academic catalog.", time: "This week" },
];

export function UniversityDataProvider({ children }: { children: ReactNode }) {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYear>("2026-2027");
  const [students, setStudents] = useState<StudentRecord[]>(studentMockData);
  const [teachers, setTeachers] = useState<TeacherRecord[]>(teacherMockData);
  const [courses, setCourses] = useState(sampleCourses);
  const [departments, setDepartments] = useState(sampleDepartments);
  const [activities, setActivities] = useState(initialActivities);

  const addActivity = (title: string, description: string, academicYear?: AcademicYear) => {
    setActivities((current) => [
      { id: crypto.randomUUID(), title, description, time: "Just now", academicYear },
      ...current,
    ]);
  };

  const addStudent = (input: StudentRecord | QuickStudentInput) => {
    const record: StudentRecord = "studentId" in input ? input : (() => {
      const [firstName, ...lastName] = input.name.trim().split(/\s+/);
      return {
        id: crypto.randomUUID(), studentId: input.id, firstName, lastName: lastName.join(" ") || "Student",
        email: input.email, phone: "—", dateOfBirth: "", gender: "Other", address: "—",
        faculty: academicDepartments.find((department) => department.name === input.department)?.faculty ?? "Journalism", department: input.department,
        academicYear: input.academicYear, semester: "Fall", enrollmentDate: new Date().toISOString().slice(0, 10),
        status: "Active", guardianName: "—", guardianPhone: "", isNew: true,
      };
    })();
    const savedRecord = { ...record, isNew: true };
    setStudents((current) => [...current, savedRecord]);
    addActivity("New student registered", `${record.firstName} ${record.lastName} joined ${record.department}.`, record.academicYear);
  };

  const value = useMemo<UniversityDataValue>(() => ({
    selectedAcademicYear,
    setSelectedAcademicYear,
    students,
    teachers,
    faculty: teachers.map((teacher) => ({
      id: teacher.teacherId,
      name: `${teacher.firstName} ${teacher.lastName}`,
      email: teacher.email,
      department: teacher.department,
      isNew: Boolean(teacher.isNew),
    })),
    courses,
    departments,
    activities,
    addStudent,
    updateStudent: (record) => {
      setStudents((current) => current.map((student) => student.id === record.id ? record : student));
      addActivity("Student record updated", `${record.firstName} ${record.lastName}'s information was updated.`, record.academicYear);
    },
    deleteStudent: (id) => {
      const student = students.find((record) => record.id === id);
      setStudents((current) => current.filter((record) => record.id !== id));
      if (student) addActivity("Student record deleted", `${student.firstName} ${student.lastName}'s record was removed.`, student.academicYear);
    },
    addTeacher: (record) => {
      const savedRecord = { ...record, isNew: true };
      setTeachers((current) => [...current, savedRecord]);
      addActivity("Teacher added", `${record.firstName} ${record.lastName} joined ${record.department}.`);
    },
    updateTeacher: (record) => {
      setTeachers((current) => current.map((teacher) => teacher.id === record.id ? record : teacher));
      addActivity("Teacher record updated", `${record.firstName} ${record.lastName}'s information was updated.`);
    },
    deleteTeacher: (id) => {
      const teacher = teachers.find((record) => record.id === id);
      setTeachers((current) => current.filter((record) => record.id !== id));
      if (teacher) addActivity("Teacher removed", `${teacher.firstName} ${teacher.lastName}'s record was removed.`);
    },
    addCourse: (record) => {
      setCourses((current) => [...current, { ...record, isNew: true }]);
      addActivity("New course added", `${record.name} was added to ${record.department}.`, record.academicYear);
    },
    addDepartment: (record) => {
      setDepartments((current) => [...current, { ...record, isNew: true }]);
      addActivity("New department created", `${record.name} was added to the university.`);
    },
    newRecordCounts: {
      students: students.filter((record) => record.isNew && record.academicYear === selectedAcademicYear).length,
      faculty: teachers.filter((record) => record.isNew).length,
      courses: courses.filter((record) => record.isNew && record.academicYear === selectedAcademicYear).length,
      departments: departments.filter((record) => record.isNew).length,
    },
  }), [selectedAcademicYear, students, teachers, courses, departments, activities]);

  return <UniversityDataContext.Provider value={value}>{children}</UniversityDataContext.Provider>;
}

export function useUniversityData() {
  const context = useContext(UniversityDataContext);
  if (!context) throw new Error("useUniversityData must be used within UniversityDataProvider");
  return context;
}
