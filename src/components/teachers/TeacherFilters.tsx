import { RotateCcw, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { faculties } from "@/data/academicStructure";
import type { AcademicRank, EmploymentStatus, EmploymentType, TeacherGender } from "@/types/teacher";

export interface TeacherFilterValues {
  search: string;
  faculty: string;
  department: string;
  academicRank: string;
  employmentType: string;
  employmentStatus: string;
  gender: string;
}

interface Props {
  filters: TeacherFilterValues;
  departments: string[];
  onChange: (filters: TeacherFilterValues) => void;
}

const ranks: AcademicRank[] = ["Lecturer", "Assistant Professor", "Associate Professor", "Professor"];
const employmentTypes: EmploymentType[] = ["Full-time", "Part-time", "Contract"];
const statuses: EmploymentStatus[] = ["Active", "On Leave", "Inactive"];
const genders: TeacherGender[] = ["Female", "Male", "Other"];
const selectClass = "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100";

export default function TeacherFilters({ filters, departments, onChange }: Props) {
  const set = (key: keyof TeacherFilterValues, value: string) => {
    if (key === "faculty") {
      const departmentStillValid = departments.includes(filters.department);
      onChange({ ...filters, faculty: value, department: departmentStillValid && value === filters.faculty ? filters.department : "" });
      return;
    }
    onChange({ ...filters, [key]: value });
  };
  const hasFilters = Object.values(filters).some(Boolean);
  const select = (key: keyof Omit<TeacherFilterValues, "search">, label: string, values: readonly string[]) => (
    <div key={key}>
      <label htmlFor={`teacher-filter-${key}`} className="sr-only">Filter by {label.toLowerCase()}</label>
      <select id={`teacher-filter-${key}`} value={filters[key]} onChange={(event) => set(key, event.target.value)} className={selectClass}>
        <option value="">All {label}</option>
        {values.map((value) => <option key={value} value={value}>{value}</option>)}
      </select>
    </div>
  );

  return (
    <section aria-label="Search and filter teachers" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="relative sm:col-span-2 xl:col-span-2">
          <label htmlFor="teacher-search" className="sr-only">Search teachers</label>
          <Search aria-hidden="true" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input id="teacher-search" type="search" value={filters.search} onChange={(event) => set("search", event.target.value)} placeholder="Search by name, ID, email, phone, or specialization..." className="h-10 rounded-lg border-slate-200 bg-white pl-9 pr-10 text-sm" />
          {filters.search && <button type="button" onClick={() => set("search", "")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={15} /></button>}
        </div>
        {select("faculty", "Faculty", faculties)}
        {select("department", "Department", departments)}
        {select("academicRank", "Academic Rank", ranks)}
        {select("employmentType", "Employment Type", employmentTypes)}
        {select("employmentStatus", "Employment Status", statuses)}
        {select("gender", "Gender", genders)}
        <button type="button" disabled={!hasFilters} onClick={() => onChange({ search: "", faculty: "", department: "", academicRank: "", employmentType: "", employmentStatus: "", gender: "" })} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-40">
          <RotateCcw size={15} /> Clear Filters
        </button>
      </div>
    </section>
  );
}
