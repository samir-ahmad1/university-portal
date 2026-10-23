import { useEffect, useRef } from "react";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StudentRecord } from "@/types/student";

interface Props { student: StudentRecord | null; onClose: () => void; onEdit: (student: StudentRecord) => void }
function Detail({ label, value }: { label: string; value?: string }) {
  return <div className="min-w-0"><dt className="text-xs font-medium text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-slate-800">{value?.trim() || "—"}</dd></div>;
}
function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function StudentDetails({ student, onClose, onEdit }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (student && !dialog.open) dialog.showModal();
    if (!student && dialog.open) dialog.close();
  }, [student]);
  if (!student) return null;

  return (
    <dialog ref={dialogRef} aria-labelledby="student-details-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClose={onClose} className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50">
      <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-7"><div><p className="text-xs font-semibold uppercase tracking-wider text-red-600">Student record</p><h2 id="student-details-title" className="mt-1 text-xl font-bold text-blue-950">{student.firstName} {student.lastName}</h2><p className="mt-1 text-sm text-slate-500">{student.studentId}</p></div><button type="button" onClick={onClose} aria-label="Close student details" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={19} /></button></div>
      <div className="space-y-5 p-5 sm:p-7">
        <section className="rounded-xl border border-slate-200 p-4 sm:p-5"><h3 className="text-sm font-bold text-blue-950">Personal Information</h3><dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2"><Detail label="Full name" value={`${student.firstName} ${student.lastName}`} /><Detail label="Student ID" value={student.studentId} /><Detail label="Date of birth" value={formatDate(student.dateOfBirth)} /><Detail label="Gender" value={student.gender} /><Detail label="Email" value={student.email} /><Detail label="Phone" value={student.phone} /><div className="sm:col-span-2"><Detail label="Address" value={student.address} /></div></dl></section>
        <section className="rounded-xl border border-slate-200 p-4 sm:p-5"><h3 className="text-sm font-bold text-blue-950">Academic Information</h3><dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2"><Detail label="Faculty" value={student.faculty} /><Detail label="Department" value={student.department} /><Detail label="Academic year" value={student.academicYear} /><Detail label="Semester" value={student.semester} /><Detail label="Enrollment date" value={formatDate(student.enrollmentDate)} /><Detail label="Student status" value={student.status} /></dl></section>
        <section className="rounded-xl border border-slate-200 p-4 sm:p-5"><h3 className="text-sm font-bold text-blue-950">Guardian Information</h3><dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2"><Detail label="Guardian name" value={student.guardianName} /><Detail label="Guardian phone" value={student.guardianPhone} /></dl></section>
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4 sm:px-7"><Button type="button" variant="outline" onClick={onClose} className="rounded-lg">Close</Button><Button type="button" onClick={() => onEdit(student)} className="rounded-lg bg-blue-900 text-white hover:bg-blue-950"><Pencil size={15} /> Edit Student</Button></div>
    </dialog>
  );
}
