import { Eye, Pencil, Trash2 } from "lucide-react";
import type { StudentRecord, StudentStatus } from "@/types/student";

export type StudentSortKey = "studentId" | "name" | "department" | "academicYear" | "enrollmentDate";
interface Props {
  students: StudentRecord[];
  sortKey: StudentSortKey;
  sortDirection: "asc" | "desc";
  onSort: (key: StudentSortKey) => void;
  onView: (student: StudentRecord) => void;
  onEdit: (student: StudentRecord) => void;
  onDelete: (student: StudentRecord) => void;
}

const statusColors: Record<StudentStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  Inactive: "bg-slate-100 text-slate-600 ring-slate-500/15",
  Graduated: "bg-blue-50 text-blue-800 ring-blue-700/15",
  Suspended: "bg-red-50 text-red-700 ring-red-600/15",
};

function SortButton({ label, field, active, direction, onSort }: { label: string; field: StudentSortKey; active: StudentSortKey; direction: "asc" | "desc"; onSort: (field: StudentSortKey) => void }) {
  return <button type="button" onClick={() => onSort(field)} className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-blue-900">{label}<span aria-hidden="true" className="text-[10px] text-slate-400">{active === field ? (direction === "asc" ? "▲" : "▼") : "↕"}</span></button>;
}
function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function StudentTable({ students, sortKey, sortDirection, onSort, onView, onEdit, onDelete }: Props) {
  const sortable = (label: string, field: StudentSortKey) => <SortButton label={label} field={field} active={sortKey} direction={sortDirection} onSort={onSort} />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1550px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500"><tr>
          <th scope="col" className="px-4 py-3">{sortable("Student ID", "studentId")}</th>
          <th scope="col" className="px-4 py-3">{sortable("Student Name", "name")}</th>
          <th scope="col" className="px-4 py-3">Email</th><th scope="col" className="px-4 py-3">Phone</th><th scope="col" className="px-4 py-3">Faculty</th>
          <th scope="col" className="px-4 py-3">{sortable("Department", "department")}</th>
          <th scope="col" className="px-4 py-3">{sortable("Academic Year", "academicYear")}</th><th scope="col" className="px-4 py-3">Semester</th>
          <th scope="col" className="px-4 py-3">{sortable("Enrollment Date", "enrollmentDate")}</th><th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3 text-right">Actions</th>
        </tr></thead>
        <tbody className="divide-y divide-slate-100">{students.map((student) => {
          const name = `${student.firstName} ${student.lastName}`.trim() || "—";
          const initials = `${student.firstName[0] ?? ""}${student.lastName[0] ?? ""}`.toUpperCase() || "—";
          return <tr key={student.id} className="transition-colors hover:bg-slate-50/80">
            <td className="whitespace-nowrap px-4 py-4 font-medium text-blue-950">{student.studentId || "—"}</td>
            <td className="whitespace-nowrap px-4 py-4"><div className="flex items-center gap-3"><span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-900 ring-1 ring-blue-100">{initials}</span><span className="font-semibold text-slate-800">{name}</span></div></td>
            <td className="whitespace-nowrap px-4 py-4 text-slate-500">{student.email || "—"}</td><td className="whitespace-nowrap px-4 py-4 text-slate-500">{student.phone || "—"}</td>
            <td className="whitespace-nowrap px-4 py-4 text-slate-600">{student.faculty || "—"}</td><td className="whitespace-nowrap px-4 py-4 text-slate-600">{student.department || "—"}</td>
            <td className="whitespace-nowrap px-4 py-4 text-slate-600">{student.academicYear || "—"}</td>
            <td className="whitespace-nowrap px-4 py-4 text-slate-600">{student.semester || "—"}</td><td className="whitespace-nowrap px-4 py-4 text-slate-600">{formatDate(student.enrollmentDate)}</td>
            <td className="whitespace-nowrap px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusColors[student.status]}`}>{student.status}</span></td>
            <td className="whitespace-nowrap px-4 py-4"><div className="flex justify-end gap-1">
              <button type="button" onClick={() => onView(student)} aria-label={`View details for ${name}`} title="View details" className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"><Eye size={16} /></button>
              <button type="button" onClick={() => onEdit(student)} aria-label={`Edit ${name}`} title="Edit student" className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"><Pencil size={15} /></button>
              <button type="button" onClick={() => onDelete(student)} aria-label={`Delete ${name}`} title="Delete student" className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"><Trash2 size={16} /></button>
            </div></td>
          </tr>;
        })}</tbody>
      </table>
    </div>
  );
}
