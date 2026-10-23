export type TeacherGender = "Female" | "Male" | "Other";
export type AcademicRank = "Lecturer" | "Assistant Professor" | "Associate Professor" | "Professor";
export type EmploymentType = "Full-time" | "Part-time" | "Contract";
export type EmploymentStatus = "Active" | "On Leave" | "Inactive";

export interface TeacherRecord {
  id: string;
  teacherId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: TeacherGender;
  dateOfBirth: string;
  address: string;
  profileImage?: string;
  faculty: string;
  department: string;
  academicRank: AcademicRank;
  qualification: string;
  specialization: string;
  employmentType: EmploymentType;
  joiningDate: string;
  employmentStatus: EmploymentStatus;
  salary?: string;
  officeLocation?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  bio?: string;
  isNew?: boolean;
}
