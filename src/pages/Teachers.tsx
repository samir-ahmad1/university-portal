import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, Trash2, UserCheck, UserRoundCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import TeacherDetails from "@/components/teachers/TeacherDetails";
import TeacherFilters, { type TeacherFilterValues } from "@/components/teachers/TeacherFilters";
import TeacherForm from "@/components/teachers/TeacherForm";
import TeacherTable, { type TeacherSortKey } from "@/components/teachers/TeacherTable";
import { useUniversityData } from "@/context/UniversityDataContext";
import { academicDepartments } from "@/data/academicStructure";
import type { TeacherRecord } from "@/types/teacher";

type PageSize = 5 | 10 | 20;
const emptyFilters: TeacherFilterValues = { search: "", faculty: "", department: "", academicRank: "", employmentType: "", employmentStatus: "", gender: "" };

export default function Teachers() {
  const location = useLocation();
  const navigate = useNavigate();
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useUniversityData();
  const [filters, setFilters] = useState<TeacherFilterValues>(emptyFilters);
  const [sortKey, setSortKey] = useState<TeacherSortKey>("teacherId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherRecord | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<TeacherRecord | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<TeacherRecord | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = deleteDialogRef.current;
    if (!dialog) return;
    if (deletingTeacher && !dialog.open) dialog.showModal();
    if (!deletingTeacher && dialog.open) dialog.close();
  }, [deletingTeacher]);

  const departmentOptions = useMemo(() => academicDepartments
    .filter((department) => !filters.faculty || department.faculty === filters.faculty)
    .map((department) => department.name), [filters.faculty]);

  const filteredTeachers = useMemo(() => {
    const query = filters.search.trim().toLocaleLowerCase();
    const searched = teachers.filter((teacher) => {
      const fields = [teacher.teacherId, teacher.firstName, teacher.lastName, `${teacher.firstName} ${teacher.lastName}`, teacher.email, teacher.phone, teacher.faculty, teacher.department, teacher.academicRank, teacher.specialization];
      return (!query || fields.some((field) => field.toLocaleLowerCase().includes(query)))
        && (!filters.faculty || teacher.faculty === filters.faculty)
        && (!filters.department || teacher.department === filters.department)
        && (!filters.academicRank || teacher.academicRank === filters.academicRank)
        && (!filters.employmentType || teacher.employmentType === filters.employmentType)
        && (!filters.employmentStatus || teacher.employmentStatus === filters.employmentStatus)
        && (!filters.gender || teacher.gender === filters.gender);
    });
    return [...searched].sort((left, right) => {
      const leftValue = sortKey === "name" ? `${left.firstName} ${left.lastName}` : left[sortKey];
      const rightValue = sortKey === "name" ? `${right.firstName} ${right.lastName}` : right[sortKey];
      const comparison = leftValue.localeCompare(rightValue);
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [teachers, filters, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredTeachers.length / pageSize));
  const visibleTeachers = filteredTeachers.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => { setPage((current) => Math.min(current, totalPages)); }, [totalPages]);

  const setFilterValues = (next: TeacherFilterValues) => { setFilters(next); setPage(1); };
  const sortBy = (key: TeacherSortKey) => {
    if (key === sortKey) setSortDirection((direction) => direction === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDirection("asc"); }
    setPage(1);
  };
  const openAdd = () => { setSuccessMessage(""); setEditingTeacher(null); setFormOpen(true); };
  const openEdit = (teacher: TeacherRecord) => { setSuccessMessage(""); setEditingTeacher(teacher); setFormOpen(true); };
  const saveTeacher = (teacher: TeacherRecord) => {
    if (editingTeacher) {
      updateTeacher(teacher);
      setSuccessMessage(`${teacher.firstName} ${teacher.lastName}'s record was updated.`);
    } else {
      addTeacher(teacher);
      setSuccessMessage(`${teacher.firstName} ${teacher.lastName} was added successfully.`);
      setFilterValues(emptyFilters);
    }
  };
  const confirmDelete = () => {
    if (!deletingTeacher) return;
    const name = `${deletingTeacher.firstName} ${deletingTeacher.lastName}`;
    deleteTeacher(deletingTeacher.id);
    setSuccessMessage(`${name} was deleted successfully.`);
    setDeletingTeacher(null);
  };

  useEffect(() => {
    if (new URLSearchParams(location.search).get("add") !== "1") return;
    openAdd();
    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.search, navigate]);

  const currentYear = new Date().getFullYear();
  const stats = [
    { title: "Total Teachers", value: String(teachers.length), description: "All teacher records", icon: Users, color: "blue" as const },
    { title: "Active Teachers", value: String(teachers.filter((teacher) => teacher.employmentStatus === "Active").length), description: "Currently active", icon: UserCheck, color: "blue" as const },
    { title: "On Leave", value: String(teachers.filter((teacher) => teacher.employmentStatus === "On Leave").length), description: "Currently on leave", icon: GraduationCap, color: "red" as const },
    { title: "New Teachers", value: String(teachers.filter((teacher) => teacher.joiningDate.startsWith(`${currentYear}-`)).length), description: `Joined in ${currentYear}`, icon: UserRoundCheck, color: "red" as const },
  ];
  const startIndex = filteredTeachers.length ? (page - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(page * pageSize, filteredTeachers.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div><h1 className="text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl">Teachers Management</h1><p className="mt-2 text-sm text-slate-500">Manage university teachers and their academic information.</p></div>
        <Button type="button" onClick={openAdd} className="h-11 rounded-lg bg-blue-900 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-950"><UserRoundCheck size={17} /> Add Teacher</Button>
      </div>

      {successMessage && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{successMessage}</p>}

      <section aria-label="Teacher summary" className="dashboard-stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatCard key={stat.title} {...stat} />)}</section>

      <TeacherFilters filters={filters} departments={departmentOptions} onChange={setFilterValues} />

      <section aria-label="Teacher records" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-sm font-semibold text-blue-950">Teacher Records</h2><p className="mt-1 text-xs text-slate-500">Showing {startIndex}–{endIndex} of {filteredTeachers.length} matching teachers</p></div>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-500">Rows per page
            <select aria-label="Rows per page" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value) as PageSize); setPage(1); }} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option></select>
          </label>
        </div>
        {visibleTeachers.length ? <TeacherTable teachers={visibleTeachers} sortKey={sortKey} sortDirection={sortDirection} onSort={sortBy} onView={setViewingTeacher} onEdit={openEdit} onDelete={setDeletingTeacher} /> : (
          <div className="px-5 py-14 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-900"><Users size={22} /></div><h3 className="mt-4 text-sm font-semibold text-blue-950">No teachers found</h3><p className="mt-1 text-sm text-slate-500">Try another search or clear the filters to see all teachers.</p><button type="button" onClick={() => setFilterValues(emptyFilters)} className="mt-4 text-sm font-semibold text-blue-800 hover:text-blue-950">Clear search and filters</button></div>
        )}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3"><span className="text-xs text-slate-500">Page {filteredTeachers.length ? page : 0} of {filteredTeachers.length ? totalPages : 0}</span><div className="flex gap-2"><Button type="button" variant="outline" size="sm" disabled={page <= 1 || filteredTeachers.length === 0} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</Button><Button type="button" variant="outline" size="sm" disabled={page >= totalPages || filteredTeachers.length === 0} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next</Button></div></div>
      </section>

      <TeacherDetails teacher={viewingTeacher} onClose={() => setViewingTeacher(null)} onEdit={(teacher) => { setViewingTeacher(null); openEdit(teacher); }} />
      <TeacherForm open={formOpen} teacher={editingTeacher} onClose={() => setFormOpen(false)} onSave={saveTeacher} />
      <dialog ref={deleteDialogRef} aria-labelledby="delete-teacher-title" onCancel={(event) => { event.preventDefault(); setDeletingTeacher(null); }} onClose={() => setDeletingTeacher(null)} className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50">
        {deletingTeacher && <div className="p-6 sm:p-7"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><Trash2 size={20} /></div><h2 id="delete-teacher-title" className="mt-4 text-lg font-bold text-blue-950">Delete teacher?</h2><p className="mt-2 text-sm leading-6 text-slate-600">Are you sure you want to delete <strong>{deletingTeacher.firstName} {deletingTeacher.lastName}</strong> ({deletingTeacher.teacherId})? This removes the record from the current session.</p><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={() => setDeletingTeacher(null)} className="rounded-lg">Cancel</Button><Button type="button" onClick={confirmDelete} className="rounded-lg bg-red-600 text-white hover:bg-red-700">Delete Teacher</Button></div></div>}
      </dialog>
    </div>
  );
}
