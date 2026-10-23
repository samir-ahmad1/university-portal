import { useEffect, useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { academicYears, useUniversityData } from "@/context/UniversityDataContext";
import { academicDepartments, faculties } from "@/data/academicStructure";
import type { AcademicYear, Semester, StudentGender, StudentRecord, StudentStatus } from "@/types/student";

type FormData = Omit<StudentRecord, "id" | "isNew">;
type FieldName = keyof FormData;
type Errors = Partial<Record<FieldName, string>>;
interface Props { open: boolean; student: StudentRecord | null; onClose: () => void; onSave: (student: StudentRecord) => void }

const genders: StudentGender[] = ["Female", "Male", "Other"];
const semesters: Semester[] = ["Spring", "Summer", "Fall"];
const statuses: StudentStatus[] = ["Active", "Inactive", "Graduated", "Suspended"];
const selectClass = "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100";
const emptyForm = (year: AcademicYear): FormData => ({ studentId: "", firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "", gender: "Other", address: "", faculty: "", department: "", academicYear: year, semester: "Fall", enrollmentDate: new Date().toISOString().slice(0, 10), status: "Active", guardianName: "", guardianPhone: "" });

export default function StudentForm({ open, student, onClose, onSave }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { selectedAcademicYear, students } = useUniversityData();
  const [values, setValues] = useState<FormData>(() => emptyForm(selectedAcademicYear));
  const [errors, setErrors] = useState<Errors>({});
  const departmentOptions = values.faculty
    ? academicDepartments.filter((item) => item.faculty === values.faculty).map((item) => item.name)
    : academicDepartments.map((item) => item.name);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (student) {
      const { id: _id, isNew: _isNew, ...formData } = student;
      setValues(formData);
    } else setValues(emptyForm(selectedAcademicYear));
    setErrors({});
  }, [open, student?.id, selectedAcademicYear]);

  const setField = <K extends FieldName>(field: K, value: FormData[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Errors = {};
    const required: FieldName[] = ["firstName", "lastName", "studentId", "email", "phone", "faculty", "department", "academicYear", "semester", "enrollmentDate", "status"];
    required.forEach((field) => { if (!String(values[field]).trim()) nextErrors[field] = "This field is required."; });
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) nextErrors.email = "Enter a valid email address.";
    for (const field of ["dateOfBirth", "enrollmentDate"] as const) {
      if (values[field] && Number.isNaN(Date.parse(`${values[field]}T00:00:00`))) nextErrors[field] = "Enter a valid date.";
    }
    const duplicate = students.some((item) => item.id !== student?.id && item.studentId.trim().toLowerCase() === values.studentId.trim().toLowerCase());
    if (duplicate) nextErrors.studentId = "This student ID is already in use.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSave({ ...values, id: student?.id ?? crypto.randomUUID(), isNew: student?.isNew ?? true });
    onClose();
  };

  const textInput = (field: FieldName, label: string, type = "text", required = false) => (
    <div key={field} className="space-y-1.5"><label htmlFor={`student-${field}`} className="text-sm font-medium text-slate-700">{label}{required && <span className="ml-1 text-red-600">*</span>}</label><Input id={`student-${field}`} type={type} value={values[field]} onChange={(event) => setField(field, event.target.value)} aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? `student-error-${field}` : undefined} className="h-10 rounded-lg border-slate-200 bg-white px-3 text-sm" />{errors[field] && <p id={`student-error-${field}`} className="text-xs font-medium text-red-600">{errors[field]}</p>}</div>
  );
  const selectInput = <K extends FieldName>(field: K, label: string, options: readonly string[], required = false) => (
    <div key={field} className="space-y-1.5"><label htmlFor={`student-${field}`} className="text-sm font-medium text-slate-700">{label}{required && <span className="ml-1 text-red-600">*</span>}</label><select id={`student-${field}`} value={String(values[field])} onChange={(event) => { const nextValue = event.target.value as FormData[K]; setField(field, nextValue); if (field === "faculty") setField("department", ""); }} aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? `student-error-${field}` : undefined} className={selectClass}><option value="">Select {label.toLowerCase()}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>{errors[field] && <p id={`student-error-${field}`} className="text-xs font-medium text-red-600">{errors[field]}</p>}</div>
  );

  return (
    <dialog ref={dialogRef} aria-labelledby="student-form-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClose={onClose} className="m-auto max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50">
      <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-7"><div><h2 id="student-form-title" className="text-lg font-bold text-blue-950">{student ? "Edit Student" : "Add Student"}</h2><p className="mt-1 text-sm text-slate-500">Fields marked with <span className="text-red-600">*</span> are required.</p></div><button type="button" onClick={onClose} aria-label="Close student form" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={18} /></button></div>
      <form onSubmit={handleSubmit} noValidate className="space-y-6 p-5 sm:p-7">
        <section><h3 className="mb-4 text-sm font-bold text-blue-950">Personal Information</h3><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {textInput("firstName", "First Name", "text", true)}{textInput("lastName", "Last Name", "text", true)}{textInput("studentId", "Student ID", "text", true)}{textInput("email", "Email", "email", true)}{textInput("phone", "Phone", "tel", true)}{textInput("dateOfBirth", "Date of Birth", "date")}{selectInput("gender", "Gender", genders)}
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-3"><label htmlFor="student-address" className="text-sm font-medium text-slate-700">Address</label><textarea id="student-address" rows={2} value={values.address} onChange={(event) => setField("address", event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100" /></div>
        </div></section>
        <section className="border-t border-slate-100 pt-5"><h3 className="mb-4 text-sm font-bold text-blue-950">Academic Information</h3><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selectInput("faculty", "Faculty", faculties, true)}{selectInput("department", "Department", departmentOptions, true)}{selectInput("academicYear", "Academic Year", academicYears, true)}{selectInput("semester", "Semester", semesters, true)}{selectInput("status", "Status", statuses, true)}{textInput("enrollmentDate", "Enrollment Date", "date", true)}
        </div></section>
        <section className="border-t border-slate-100 pt-5"><h3 className="mb-4 text-sm font-bold text-blue-950">Guardian Information</h3><div className="grid gap-4 sm:grid-cols-2">{textInput("guardianName", "Guardian Name")}{textInput("guardianPhone", "Guardian Phone", "tel")}</div></section>
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={onClose} className="h-10 rounded-lg px-5">Cancel</Button><Button type="submit" className="h-10 rounded-lg bg-blue-900 px-5 text-white hover:bg-blue-950">{student ? "Save Changes" : "Save Student"}</Button></div>
      </form>
    </dialog>
  );
}
