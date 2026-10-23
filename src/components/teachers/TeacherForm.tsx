import { useEffect, useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { academicDepartments, faculties } from "@/data/academicStructure";
import { useUniversityData } from "@/context/UniversityDataContext";
import type { AcademicRank, EmploymentStatus, EmploymentType, TeacherGender, TeacherRecord } from "@/types/teacher";

type FormData = Omit<TeacherRecord, "id" | "isNew" | "salary"> & { salary: string };
type FieldName = keyof FormData;
type Errors = Partial<Record<FieldName, string>>;
interface Props { open: boolean; teacher: TeacherRecord | null; onClose: () => void; onSave: (teacher: TeacherRecord) => void }

const genders: TeacherGender[] = ["Female", "Male", "Other"];
const ranks: AcademicRank[] = ["Lecturer", "Assistant Professor", "Associate Professor", "Professor"];
const employmentTypes: EmploymentType[] = ["Full-time", "Part-time", "Contract"];
const employmentStatuses: EmploymentStatus[] = ["Active", "On Leave", "Inactive"];
const selectClass = "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100";
const emptyForm = (): FormData => ({ teacherId: "", firstName: "", lastName: "", email: "", phone: "", gender: "Other", dateOfBirth: "", address: "", profileImage: "", faculty: "", department: "", academicRank: "Lecturer", qualification: "", specialization: "", employmentType: "Full-time", joiningDate: new Date().toISOString().slice(0, 10), employmentStatus: "Active", salary: "", officeLocation: "", emergencyContactName: "", emergencyContactPhone: "", bio: "" });

export default function TeacherForm({ open, teacher, onClose, onSave }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { teachers } = useUniversityData();
  const [values, setValues] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const departmentOptions = academicDepartments.filter((item) => item.faculty === values.faculty);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (teacher) {
      const { id: _id, isNew: _isNew, ...teacherData } = teacher;
      setValues({ ...teacherData, salary: teacher.salary ?? "" });
    } else setValues(emptyForm());
    setErrors({});
  }, [open, teacher?.id]);

  const setField = <K extends FieldName>(field: K, value: FormData[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Errors = {};
    const required: FieldName[] = ["teacherId", "firstName", "lastName", "email", "phone", "gender", "dateOfBirth", "address", "faculty", "department", "academicRank", "qualification", "specialization", "employmentType", "joiningDate", "employmentStatus", "emergencyContactName", "emergencyContactPhone"];
    required.forEach((field) => { if (!String(values[field] ?? "").trim()) nextErrors[field] = "This field is required."; });
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) nextErrors.email = "Enter a valid email address.";
    for (const field of ["dateOfBirth", "joiningDate"] as const) {
      if (values[field] && Number.isNaN(Date.parse(`${values[field]}T00:00:00`))) nextErrors[field] = "Enter a valid date.";
    }
    if (values.profileImage?.trim()) {
      try { new URL(values.profileImage); } catch { nextErrors.profileImage = "Enter a valid image URL."; }
    }
    if (values.salary.trim() && (!Number.isFinite(Number(values.salary)) || Number(values.salary) < 0)) nextErrors.salary = "Enter a valid non-negative salary.";
    if (values.faculty && values.department && !academicDepartments.some((item) => item.faculty === values.faculty && item.name === values.department)) {
      nextErrors.department = "Choose a department that belongs to the selected faculty.";
    }
    const duplicateId = teachers.some((item) => item.id !== teacher?.id && item.teacherId.trim().toLowerCase() === values.teacherId.trim().toLowerCase());
    if (duplicateId) nextErrors.teacherId = "This teacher ID is already in use.";
    const duplicateEmail = teachers.some((item) => item.id !== teacher?.id && item.email.trim().toLowerCase() === values.email.trim().toLowerCase());
    if (duplicateEmail) nextErrors.email = "This email address is already in use.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({ ...values, email: values.email.trim(), teacherId: values.teacherId.trim(), salary: values.salary.trim() || undefined, id: teacher?.id ?? crypto.randomUUID(), isNew: teacher?.isNew ?? true });
    onClose();
  };

  const textInput = (field: FieldName, label: string, type = "text", required = false) => (
    <div key={field} className="space-y-1.5"><label htmlFor={`teacher-${field}`} className="text-sm font-medium text-slate-700">{label}{required && <span className="ml-1 text-red-600">*</span>}</label><Input id={`teacher-${field}`} type={type} value={values[field] ?? ""} onChange={(event) => setField(field, event.target.value)} aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? `teacher-error-${field}` : undefined} className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm" />{errors[field] && <p id={`teacher-error-${field}`} className="text-xs font-medium text-red-600">{errors[field]}</p>}</div>
  );
  const selectInput = <K extends FieldName>(field: K, label: string, options: readonly string[], required = false) => (
    <div key={field} className="space-y-1.5"><label htmlFor={`teacher-${field}`} className="text-sm font-medium text-slate-700">{label}{required && <span className="ml-1 text-red-600">*</span>}</label><select id={`teacher-${field}`} value={String(values[field] ?? "")} onChange={(event) => { setField(field, event.target.value as FormData[K]); if (field === "faculty") setField("department", ""); }} aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? `teacher-error-${field}` : undefined} className={selectClass}><option value="">Select {label.toLowerCase()}</option>{options.map((option) => { const department = academicDepartments.find((item) => item.name === option); return <option key={option} value={option}>{department ? `${department.name} (${department.code})` : option}</option>; })}</select>{errors[field] && <p id={`teacher-error-${field}`} className="text-xs font-medium text-red-600">{errors[field]}</p>}</div>
  );

  return (
    <dialog ref={dialogRef} aria-labelledby="teacher-form-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClose={onClose} className="m-auto max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50">
      <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-7"><div><h2 id="teacher-form-title" className="text-lg font-bold text-blue-950">{teacher ? "Edit Teacher" : "Add Teacher"}</h2><p className="mt-1 text-sm text-slate-500">Fields marked with <span className="text-red-600">*</span> are required.</p></div><button type="button" onClick={onClose} aria-label="Close teacher form" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={18} /></button></div>
      <form onSubmit={handleSubmit} noValidate className="space-y-6 p-5 sm:p-7">
        <section><h3 className="mb-4 text-sm font-bold text-blue-950">Personal Information</h3><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {textInput("firstName", "First Name", "text", true)}{textInput("lastName", "Last Name", "text", true)}{textInput("teacherId", "Teacher ID", "text", true)}{textInput("email", "Email", "email", true)}{textInput("phone", "Phone", "tel", true)}{selectInput("gender", "Gender", genders, true)}{textInput("dateOfBirth", "Date of Birth", "date", true)}
          <div className="space-y-1.5 sm:col-span-2"><label htmlFor="teacher-address" className="text-sm font-medium text-slate-700">Address<span className="ml-1 text-red-600">*</span></label><textarea id="teacher-address" rows={2} value={values.address} onChange={(event) => setField("address", event.target.value)} aria-invalid={Boolean(errors.address)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100" />{errors.address && <p className="text-xs font-medium text-red-600">{errors.address}</p>}</div>
          {textInput("profileImage", "Profile Image URL", "url")}
        </div></section>
        <section className="border-t border-slate-100 pt-5"><h3 className="mb-4 text-sm font-bold text-blue-950">Professional Information</h3><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selectInput("faculty", "Faculty", faculties, true)}{selectInput("department", "Department", departmentOptions.map((department) => department.name), true)}{selectInput("academicRank", "Academic Rank", ranks, true)}{textInput("qualification", "Qualification", "text", true)}{textInput("specialization", "Specialization", "text", true)}{selectInput("employmentType", "Employment Type", employmentTypes, true)}{textInput("joiningDate", "Joining Date", "date", true)}{selectInput("employmentStatus", "Employment Status", employmentStatuses, true)}{textInput("officeLocation", "Office Location")}{textInput("salary", "Salary (optional)", "number")}
        </div></section>
        <section className="border-t border-slate-100 pt-5"><h3 className="mb-4 text-sm font-bold text-blue-950">Emergency Contact</h3><div className="grid gap-4 sm:grid-cols-2">{textInput("emergencyContactName", "Contact Name", "text", true)}{textInput("emergencyContactPhone", "Contact Phone", "tel", true)}</div></section>
        <section className="border-t border-slate-100 pt-5"><h3 className="mb-4 text-sm font-bold text-blue-950">Additional Information</h3><label htmlFor="teacher-bio" className="text-sm font-medium text-slate-700">Biography</label><textarea id="teacher-bio" rows={3} value={values.bio ?? ""} onChange={(event) => setField("bio", event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100" /></section>
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={onClose} className="h-10 rounded-lg px-5">Cancel</Button><Button type="submit" className="h-10 rounded-lg bg-blue-900 px-5 text-white hover:bg-blue-950">{teacher ? "Save Changes" : "Save Teacher"}</Button></div>
      </form>
    </dialog>
  );
}
