import { useUniversityData } from "@/context/UniversityDataContext";
import { academicDepartments, faculties } from "@/data/academicStructure";

type DirectoryKind = "students" | "faculty" | "courses" | "departments";

interface RecordDirectoryProps {
  kind: DirectoryKind;
  title: string;
  description: string;
}

interface DirectoryRecord {
  primary: string;
  secondary: string;
  detail: string;
  year?: string;
  isNew: boolean;
}

export default function RecordDirectory({ kind, title, description }: RecordDirectoryProps) {
  const { selectedAcademicYear, students, faculty, courses, departments } = useUniversityData();

  let records: DirectoryRecord[];
  if (kind === "students") {
    records = students
      .filter((student) => student.academicYear === selectedAcademicYear)
      .map((student) => ({ primary: `${student.firstName} ${student.lastName}`, secondary: student.studentId, detail: `${student.email} · ${student.department}`, year: student.academicYear, isNew: Boolean(student.isNew) }));
  } else if (kind === "faculty") {
    records = faculty.map((member) => ({ primary: member.name, secondary: member.id, detail: `${member.email} · ${member.department}`, isNew: member.isNew }));
  } else if (kind === "courses") {
    records = courses
      .filter((course) => course.academicYear === selectedAcademicYear)
      .map((course) => ({ primary: course.name, secondary: course.code, detail: course.department, year: course.academicYear, isNew: course.isNew }));
  } else {
    records = departments.map((department) => ({ primary: department.name, secondary: department.code, detail: department.faculty ? `Faculty of ${department.faculty}` : "Academic department", isNew: department.isNew }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-blue-950">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
        {(kind === "students" || kind === "courses") && (
          <p className="mt-2 text-xs font-medium text-blue-800">Academic year: {selectedAcademicYear}</p>
        )}
      </div>

      {kind === "departments" && (
        <section aria-label="Faculties and departments" className="grid gap-4 md:grid-cols-2">
          {faculties.map((facultyName) => {
            const facultyDepartments = academicDepartments.filter((department) => department.faculty === facultyName);
            return (
              <article key={facultyName} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-blue-950">{facultyName}</h2>
                {facultyDepartments.length ? (
                  <ul className="mt-3 space-y-2">
                    {facultyDepartments.map((department) => <li key={department.code} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700"><span>{department.name}</span><span className="text-xs text-slate-400">{department.code}</span></li>)}
                  </ul>
                ) : <p className="mt-3 text-sm text-slate-500">No departments listed</p>}
              </article>
            );
          })}
        </section>
      )}

      <section aria-label={`${title} records`} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-blue-950">{title} records</h2>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
            {records.length} {records.length === 1 ? "record" : "records"}
          </span>
        </div>

        {records.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {records.map((record) => (
              <li key={`${record.secondary}-${record.primary}`} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-800">{record.primary}</p>
                    {record.isNew && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">New</span>}
                  </div>
                  <p className="mt-1 break-words text-xs text-slate-500">{record.detail}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-xs text-slate-500">
                  <span className="rounded-md bg-slate-50 px-2.5 py-1.5 font-medium text-blue-900">{record.secondary}</span>
                  {record.year && <span>{record.year}</span>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-slate-500">
            No {title.toLowerCase()} found for {selectedAcademicYear}.
          </p>
        )}
      </section>
    </div>
  );
}
