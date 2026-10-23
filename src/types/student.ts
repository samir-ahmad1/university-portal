export type AcademicYear = "2025-2026" | "2026-2027";
export type StudentGender = "Female" | "Male" | "Other";
export type StudentStatus = "Active" | "Inactive" | "Graduated" | "Suspended";
export type Semester = "Spring" | "Summer" | "Fall";

export interface StudentRecord {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: StudentGender;
  address: string;
  faculty: string;
  department: string;
  academicYear: AcademicYear;
  semester: Semester;
  enrollmentDate: string;
  status: StudentStatus;
  guardianName: string;
  guardianPhone: string;
  isNew?: boolean;
}
