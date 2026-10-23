import { useEffect, useRef } from "react";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TeacherRecord } from "@/types/teacher";

interface Props { teacher: TeacherRecord | null; onClose: () => void; onEdit: (teacher: TeacherRecord) => void }
function Detail({ label, value }: { label: string; value?: string }) {
  return <div className="min-w-0"><dt className="text-xs font-medium text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-slate-800">{value?.trim() || "—"}</dd></div>;
}
function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function TeacherDetails({ teacher, onClose, onEdit }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (teacher && !dialog.open) dialog.showModal();
    if (!teacher && dialog.open) dialog.close();
  }, [teacher]);
  if (!teacher) return null;

  return (
    <dialog ref={dialogRef} aria-labelledby="teacher-details-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClose={onClose} className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50">
      <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-7"><div><p className="text-xs font-semibold uppercase tracking-wider text-red-600">Teacher record</p><h2 id="teacher-details-title" className="mt-1 text-xl font-bold text-blue-950">{teacher.firstName} {teacher.lastName}</h2><p className="mt-1 text-sm text-slate-500">{teacher.teacherId}</p></div><button type="button" onClick={onClose} aria-label="Close teacher details" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={19} /></button></div>
      <div className="space-y-5 p-5 sm:p-7">
        <section className="rounded-xl border border-slate-200 p-4 sm:p-5"><h3 className="text-sm font-bold text-blue-950">Personal Information</h3><dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2"><Detail label="Full name" value={`${teacher.firstName} ${teacher.lastName}`} /><Detail label="Teacher ID" value={teacher.teacherId} /><Detail label="Email" value={teacher.email} /><Detail label="Phone" value={teacher.phone} /><Detail label="Gender" value={teacher.gender} /><Detail label="Date of birth" value={formatDate(teacher.dateOfBirth)} /><div className="sm:col-span-2"><Detail label="Address" value={teacher.address} /></div></dl></section>
        <section className="rounded-xl border border-slate-200 p-4 sm:p-5"><h3 className="text-sm font-bold text-blue-950">Professional Information</h3><dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2"><Detail label="Faculty" value={teacher.faculty} /><Detail label="Department" value={teacher.department} /><Detail label="Academic rank" value={teacher.academicRank} /><Detail label="Qualification" value={teacher.qualification} /><Detail label="Specialization" value={teacher.specialization} /><Detail label="Employment type" value={teacher.employmentType} /><Detail label="Joining date" value={formatDate(teacher.joiningDate)} /><Detail label="Employment status" value={teacher.employmentStatus} /><Detail label="Office location" value={teacher.officeLocation} /></dl></section>
        <section className="rounded-xl border border-slate-200 p-4 sm:p-5"><h3 className="text-sm font-bold text-blue-950">Emergency Contact</h3><dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2"><Detail label="Contact name" value={teacher.emergencyContactName} /><Detail label="Contact phone" value={teacher.emergencyContactPhone} /></dl></section>
        {teacher.bio && <section className="rounded-xl border border-slate-200 p-4 sm:p-5"><h3 className="text-sm font-bold text-blue-950">Additional Information</h3><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{teacher.bio}</p></section>}
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4 sm:px-7"><Button type="button" variant="outline" onClick={onClose} className="rounded-lg">Close</Button><Button type="button" onClick={() => onEdit(teacher)} className="rounded-lg bg-blue-900 text-white hover:bg-blue-950"><Pencil size={15} /> Edit Teacher</Button></div>
    </dialog>
  );
}
