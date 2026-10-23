import { RotateCcw, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { academicYears } from "@/context/UniversityDataContext";
import type { StudentStatus } from "@/types/student";

export interface StudentFilterValues {
  search: string;
  academicYear: string;
  faculty: string;
  department: string;
  semester: string;
  status: string;
}

interface StudentFiltersProps {
  filters: StudentFilterValues;
  options: { faculties: string[]; departments: string[] };
  onChange: (filters: StudentFilterValues) => void;
}

const statuses: StudentStatus[] = ["Active", "Inactive", "Graduated", "Suspended"];
const semesters = ["Spring", "Summer", "Fall"];
const selectClass = "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100";

export default function StudentFilters({ filters, options, onChange }: StudentFiltersProps) {
  const set = (key: keyof StudentFilterValues, value: string) => onChange({ ...filters, [key]: value });
  const hasFilters = Object.values(filters).some(Boolean);
  const select = (id: keyof Omit<StudentFilterValues, "search">, label: string, values: string[]) => (
    <div key={id}>
      <label htmlFor={`student-filter-${id}`} className="sr-only">Filter by {label.toLowerCase()}</label>
      <select id={`student-filter-${id}`} value={filters[id]} onChange={(event) => set(id, event.target.value)} className={selectClass}>
        <option value="">All {label}</option>
        {values.map((value) => <option key={value} value={value}>{value}</option>)}
      </select>
    </div>
  );

  return (
    <section aria-label="Search and filter students" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="relative sm:col-span-2 xl:col-span-2">
          <label htmlFor="student-search" className="sr-only">Search students</label>
          <Search aria-hidden="true" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input id="student-search" type="search" value={filters.search} onChange={(event) => set("search", event.target.value)} placeholder="Search by name, student ID, email, phone, or department..." className="h-10 rounded-lg border-slate-200 bg-white pl-9 pr-10 text-sm" />
          {filters.search && <button type="button" onClick={() => set("search", "")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={15} /></button>}
        </div>
        {select("academicYear", "Academic Year", [...academicYears])}
        {select("faculty", "Faculty", options.faculties)}
        {select("department", "Department", options.departments)}
        {select("semester", "Semester", semesters)}
        {select("status", "Student Status", statuses)}
        <button type="button" disabled={!hasFilters} onClick={() => onChange({ search: "", academicYear: "", faculty: "", department: "", semester: "", status: "" })} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-40">
          <RotateCcw size={15} /> Clear Filters
        </button>
      </div>
    </section>
  );
}
