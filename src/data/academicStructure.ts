export const faculties = [
  "Computer Science",
  "Economics",
  "Law and Political Science",
  "Journalism",
] as const;

export interface AcademicDepartment {
  name: string;
  code: string;
  faculty: (typeof faculties)[number];
}

export const academicDepartments: AcademicDepartment[] = [
  { name: "Software Engineering", code: "SE", faculty: "Computer Science" },
  { name: "Information Technology (IT)", code: "IT", faculty: "Computer Science" },
  { name: "Finance and Banking", code: "FB", faculty: "Economics" },
  { name: "Business Administration", code: "BA", faculty: "Economics" },
  { name: "Law", code: "LAW", faculty: "Law and Political Science" },
  { name: "Political Science", code: "PS", faculty: "Law and Political Science" },
  { name: "Radio and Television", code: "RTV", faculty: "Journalism" },
  { name: "Journalism and Public Relations", code: "JPR", faculty: "Journalism" },
];
