import { Eye, Pencil, Trash2 } from "lucide-react";
import type { TeacherRecord, EmploymentStatus } from "@/types/teacher";

export type TeacherSortKey = "teacherId" | "name" | "faculty" | "department" | "academicRank" | "joiningDate";
interface Props {
  teachers: TeacherRecord[];
  sortKey: TeacherSortKey;
  sortDirection: "asc" | "desc";
  onSort: (key: TeacherSortKey) => void;
  onView: (teacher: TeacherRecord) => void;
  onEdit: (teacher: TeacherRecord) => void;
  onDelete: (teacher: TeacherRecord) => void;
}

const statusColors: Record<EmploymentStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  "On Leave": "bg-amber-50 text-amber-700 ring-amber-600/15",
  Inactive: "bg-slate-100 text-slate-600 ring-slate-500/15",
};

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function TeacherTable({ teachers, sortKey, sortDirection, onSort, onView, onEdit, onDelete }: Props) {
  const sortable = (label: string, field: TeacherSortKey) => <button type="button" onClick={() => onSort(field)} className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-blue-900">{label}<span aria-hidden="true" className="text-[10px] text-slate-400">{sortKey === field ? (sortDirection === "asc" ? "▲" : "▼") : "↕"}</span></button>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1450px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500"><tr>
          <th scope="col" className="px-4 py-3">{sortable("Teacher ID", "teacherId")}</th>
          <th scope="col" className="px-4 py-3">{sortable("Teacher", "name")}</th>
          <th scope="col" className="px-4 py-3">Email</th><th scope="col" className="px-4 py-3">Phone</th>
          <th scope="col" className="px-4 py-3">{sortable("Faculty", "faculty")}</th><th scope="col" className="px-4 py-3">{sortable("Department", "department")}</th>
          <th scope="col" className="px-4 py-3">{sortable("Academic Rank", "academicRank")}</th><th scope="col" className="px-4 py-3">Employment Type</th>
          <th scope="col" className="px-4 py-3">{sortable("Joining Date", "joiningDate")}</th><th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3 text-right">Actions</th>
        </tr></thead>
        <tbody className="divide-y divide-slate-100">{teachers.map((teacher) => {
          const name = `${teacher.firstName} ${teacher.lastName}`.trim();
          const initials = `${teacher.firstName[0] ?? ""}${teacher.lastName[0] ?? ""}`.toUpperCase() || "—";
          return <tr key={teacher.id} className="transition-colors hover:bg-slate-50/80">
            <td className="whitespace-nowrap px-4 py-4 font-medium text-blue-950">{teacher.teacherId}</td>
            <td className="whitespace-nowrap px-4 py-4"><div className="flex items-center gap-3">{teacher.profileImage ? <img src={teacher.profileImage} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-900 ring-1 ring-blue-100">{initials}</span>}<span className="font-semibold text-slate-800">{name}</span></div></td>
            <td className="max-w-56 truncate px-4 py-4 text-slate-500" title={teacher.email}>{teacher.email}</td><td className="whitespace-nowrap px-4 py-4 text-slate-500">{teacher.phone}</td>
            <td className="max-w-48 truncate px-4 py-4 text-slate-600" title={teacher.faculty}>{teacher.faculty}</td><td className="max-w-52 truncate px-4 py-4 text-slate-600" title={teacher.department}>{teacher.department}</td>
            <td className="whitespace-nowrap px-4 py-4 text-slate-600">{teacher.academicRank}</td><td className="whitespace-nowrap px-4 py-4 text-slate-600">{teacher.employmentType}</td>
            <td className="whitespace-nowrap px-4 py-4 text-slate-600">{formatDate(teacher.joiningDate)}</td><td className="whitespace-nowrap px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusColors[teacher.employmentStatus]}`}>{teacher.employmentStatus}</span></td>
            <td className="whitespace-nowrap px-4 py-4"><div className="flex justify-end gap-1">
              <button type="button" onClick={() => onView(teacher)} aria-label={`View details for ${name}`} title="View details" className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"><Eye size={16} /></button>
              <button type="button" onClick={() => onEdit(teacher)} aria-label={`Edit ${name}`} title="Edit teacher" className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"><Pencil size={15} /></button>
              <button type="button" onClick={() => onDelete(teacher)} aria-label={`Delete ${name}`} title="Delete teacher" className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"><Trash2 size={16} /></button>
            </div></td>
          </tr>;
        })}</tbody>
      </table>
    </div>
  );
}
