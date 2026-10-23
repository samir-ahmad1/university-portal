import { useEffect, useMemo, useRef, useState } from "react";
import { GraduationCap, Trash2, UserCheck, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import StudentDetails from "@/components/students/StudentDetails";
import StudentFilters, { type StudentFilterValues } from "@/components/students/StudentFilters";
import StudentForm from "@/components/students/StudentForm";
import StudentTable, { type StudentSortKey } from "@/components/students/StudentTable";
import { useUniversityData } from "@/context/UniversityDataContext";
import type { StudentRecord } from "@/types/student";
import { faculties } from "@/data/academicStructure";

type PageSize = 5 | 10 | 20;
const emptyFilters: StudentFilterValues = { search: "", academicYear: "", faculty: "", department: "", semester: "", status: "" };

export default function Students() {
  const { students, departments, selectedAcademicYear, addStudent, updateStudent, deleteStudent } = useUniversityData();
  const [filters, setFilters] = useState<StudentFilterValues>(emptyFilters);
  const [sortKey, setSortKey] = useState<StudentSortKey>("studentId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [viewingStudent, setViewingStudent] = useState<StudentRecord | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<StudentRecord | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = deleteDialogRef.current;
    if (!dialog) return;
    if (deletingStudent && !dialog.open) dialog.showModal();
    if (!deletingStudent && dialog.open) dialog.close();
  }, [deletingStudent]);

  const filterOptions = useMemo(() => ({
    faculties: [...faculties],
    departments: [...new Set([...departments.map((item) => item.name), ...students.map((item) => item.department)].filter(Boolean))].sort(),
  }), [students, departments]);

  const filteredStudents = useMemo(() => {
    const query = filters.search.trim().toLocaleLowerCase();
    const searched = students.filter((student) => {
      const fields = [student.firstName, student.lastName, `${student.firstName} ${student.lastName}`, student.studentId, student.email, student.phone, student.faculty, student.department];
      const matchesSearch = !query || fields.some((field) => (field ?? "").toLocaleLowerCase().includes(query));
      return matchesSearch
        && (!filters.academicYear || student.academicYear === filters.academicYear)
        && (!filters.faculty || student.faculty === filters.faculty)
        && (!filters.department || student.department === filters.department)
        && (!filters.semester || student.semester === filters.semester)
        && (!filters.status || student.status === filters.status);
    });

    return [...searched].sort((left, right) => {
      const leftValue = sortKey === "name" ? `${left.firstName} ${left.lastName}` : left[sortKey];
      const rightValue = sortKey === "name" ? `${right.firstName} ${right.lastName}` : right[sortKey];
      const comparison = leftValue.localeCompare(rightValue);
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [students, filters, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const visibleStudents = filteredStudents.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => { setPage((current) => Math.min(current, totalPages)); }, [totalPages]);

  const setFilterValues = (next: StudentFilterValues) => { setFilters(next); setPage(1); };
  const sortBy = (key: StudentSortKey) => {
    if (key === sortKey) setSortDirection((direction) => direction === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDirection("asc"); }
    setPage(1);
  };

  const openAdd = () => { setSuccessMessage(""); setEditingStudent(null); setFormOpen(true); };
  const openEdit = (student: StudentRecord) => { setSuccessMessage(""); setEditingStudent(student); setFormOpen(true); };
  const saveStudent = (student: StudentRecord) => {
    if (editingStudent) {
      updateStudent(student);
      setSuccessMessage(`${student.firstName} ${student.lastName}'s record was updated.`);
    } else {
      addStudent(student);
      setSuccessMessage(`${student.firstName} ${student.lastName} was added successfully.`);
      setFilterValues(emptyFilters);
    }
  };

  const confirmDelete = () => {
    if (!deletingStudent) return;
    const name = `${deletingStudent.firstName} ${deletingStudent.lastName}`;
    deleteStudent(deletingStudent.id);
    setSuccessMessage(`${name} was deleted successfully.`);
    setDeletingStudent(null);
  };

  const admissions = students.filter((student) => student.academicYear === selectedAcademicYear).length;
  const stats = [
    { title: "Total Students", value: String(students.length), description: "All student records", icon: Users, color: "blue" as const },
    { title: "Active Students", value: String(students.filter((student) => student.status === "Active").length), description: "Currently enrolled", icon: UserCheck, color: "blue" as const },
    { title: "Graduated Students", value: String(students.filter((student) => student.status === "Graduated").length), description: "Completed their studies", icon: GraduationCap, color: "red" as const },
    { title: "New Admissions", value: String(admissions), description: `Admitted in ${selectedAcademicYear}`, icon: UserPlus, color: "red" as const },
  ];
  const startIndex = filteredStudents.length ? (page - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(page * pageSize, filteredStudents.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div><h1 className="text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl">Students Management</h1><p className="mt-2 text-sm text-slate-500">Manage student records, academic information, and enrollment details.</p></div>
        <Button type="button" onClick={openAdd} className="h-11 rounded-lg bg-blue-900 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-950"><UserPlus size={17} /> Add Student</Button>
      </div>

      {successMessage && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{successMessage}</p>}

      <section aria-label="Student summary" className="dashboard-stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </section>

      <StudentFilters filters={filters} options={filterOptions} onChange={setFilterValues} />

      <section aria-label="Student records" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-sm font-semibold text-blue-950">Student Records</h2><p className="mt-1 text-xs text-slate-500">Showing {startIndex}–{endIndex} of {filteredStudents.length} matching students</p></div>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-500">Rows per page
            <select aria-label="Rows per page" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value) as PageSize); setPage(1); }} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100">
              <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option>
            </select>
          </label>
        </div>

        {visibleStudents.length ? (
          <StudentTable students={visibleStudents} sortKey={sortKey} sortDirection={sortDirection} onSort={sortBy} onView={setViewingStudent} onEdit={openEdit} onDelete={setDeletingStudent} />
        ) : (
          <div className="px-5 py-14 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-900"><Users size={22} /></div><h3 className="mt-4 text-sm font-semibold text-blue-950">No students found</h3><p className="mt-1 text-sm text-slate-500">Try another search or clear the filters to see all students.</p><button type="button" onClick={() => setFilterValues(emptyFilters)} className="mt-4 text-sm font-semibold text-blue-800 hover:text-blue-950">Clear search and filters</button></div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <span className="text-xs text-slate-500">Page {filteredStudents.length ? page : 0} of {filteredStudents.length ? totalPages : 0}</span>
          <div className="flex gap-2"><Button type="button" variant="outline" size="sm" disabled={page <= 1 || filteredStudents.length === 0} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</Button><Button type="button" variant="outline" size="sm" disabled={page >= totalPages || filteredStudents.length === 0} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next</Button></div>
        </div>
      </section>

      <StudentDetails student={viewingStudent} onClose={() => setViewingStudent(null)} onEdit={(student) => { setViewingStudent(null); openEdit(student); }} />
      <StudentForm open={formOpen} student={editingStudent} onClose={() => setFormOpen(false)} onSave={saveStudent} />

      <dialog ref={deleteDialogRef} aria-labelledby="delete-student-title" onCancel={(event) => { event.preventDefault(); setDeletingStudent(null); }} onClose={() => setDeletingStudent(null)} className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50">
        {deletingStudent && <div className="p-6 sm:p-7"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><Trash2 size={20} /></div><h2 id="delete-student-title" className="mt-4 text-lg font-bold text-blue-950">Delete student?</h2><p className="mt-2 text-sm leading-6 text-slate-600">Are you sure you want to delete <strong>{deletingStudent.firstName} {deletingStudent.lastName}</strong> ({deletingStudent.studentId})? This action removes the record from the current session.</p><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={() => setDeletingStudent(null)} className="rounded-lg">Cancel</Button><Button type="button" onClick={confirmDelete} className="rounded-lg bg-red-600 text-white hover:bg-red-700">Delete Student</Button></div></div>}
      </dialog>
    </div>
  );
}
