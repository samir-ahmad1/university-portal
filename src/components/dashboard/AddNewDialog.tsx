import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Building2, GraduationCap, Plus, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { academicYears, useUniversityData, type AcademicYear } from "@/context/UniversityDataContext";

type RecordKind = "student" | "faculty" | "course" | "department";
type FormValues = Record<string, string>;
type Field = { name: string; label: string; type?: "email" | "select"; options?: string[] };

const recordOptions: { kind: RecordKind; label: string; icon: typeof UserRound }[] = [
  { kind: "student", label: "Add Student", icon: UserRound },
  { kind: "faculty", label: "Add Faculty Member", icon: GraduationCap },
  { kind: "course", label: "Add Course", icon: BookOpen },
  { kind: "department", label: "Add Department", icon: Building2 },
];

export default function AddNewDialog() {
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { selectedAcademicYear, departments, students, courses, addStudent, addCourse, addDepartment } = useUniversityData();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<RecordKind | null>(null);
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormValues>({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const fields: Field[] = kind === "student"
    ? [
        { name: "name", label: "Full Name" },
        { name: "id", label: "Student ID" },
        { name: "email", label: "Email", type: "email" },
        { name: "department", label: "Department", type: "select", options: departments.map((item) => item.name) },
        { name: "academicYear", label: "Academic Year", type: "select", options: [...academicYears] },
      ]
    : kind === "course"
        ? [
            { name: "name", label: "Course Name" },
            { name: "code", label: "Course Code" },
            { name: "department", label: "Department", type: "select", options: departments.map((item) => item.name) },
            { name: "academicYear", label: "Academic Year", type: "select", options: [...academicYears] },
          ]
        : kind === "department"
          ? [
              { name: "name", label: "Department Name" },
              { name: "code", label: "Department Code" },
            ]
          : [];

  const openDialog = () => {
    setKind(null);
    setErrors({});
    setSuccessMessage("");
    setOpen(true);
  };

  const chooseKind = (nextKind: RecordKind) => {
    if (nextKind === "faculty") {
      closeDialog();
      navigate("/teachers?add=1");
      return;
    }
    setKind(nextKind);
    setErrors({});
    setValues({
      department: departments[0]?.name ?? "",
      academicYear: selectedAcademicYear,
    });
  };

  const closeDialog = () => setOpen(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!kind) return;

    const nextErrors: FormValues = {};
    fields.forEach((field) => {
      if (!values[field.name]?.trim()) nextErrors[field.name] = `${field.label} is required.`;
    });

    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    const normalized = (value: string) => value.trim().toLocaleLowerCase();
    if (kind === "student" && students.some((item) => normalized(item.id) === normalized(values.id ?? ""))) {
      nextErrors.id = "This student ID is already in use.";
    }
    if (kind === "course" && courses.some((item) => normalized(item.code) === normalized(values.code ?? ""))) {
      nextErrors.code = "This course code is already in use.";
    }
    if (kind === "department" && departments.some((item) => normalized(item.code) === normalized(values.code ?? ""))) {
      nextErrors.code = "This department code is already in use.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (kind === "faculty") return;
    if (kind === "student") {
      addStudent({
        id: values.id.trim(), name: values.name.trim(), email: values.email.trim(),
        department: values.department, academicYear: values.academicYear as AcademicYear,
      });
    } else if (kind === "course") {
      addCourse({
        name: values.name.trim(), code: values.code.trim(), department: values.department,
        academicYear: values.academicYear as AcademicYear,
      });
    } else {
      addDepartment({ name: values.name.trim(), code: values.code.trim() });
    }

    const label = recordOptions.find((item) => item.kind === kind)?.label.replace("Add ", "") ?? "Record";
    setSuccessMessage(`${label} saved successfully.`);
    closeDialog();
  };

  return (
    <>
      <div className="flex flex-col items-start gap-2">
        <Button
          type="button"
          onClick={openDialog}
          className="h-11 rounded-lg bg-blue-900 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-950"
        >
          <Plus size={17} />
          Add New
        </Button>
        {successMessage && (
          <p role="status" className="text-xs font-medium text-emerald-700">
            {successMessage}
          </p>
        )}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="add-record-title"
        onCancel={(event) => { event.preventDefault(); closeDialog(); }}
        onClick={(event) => { if (event.target === dialogRef.current) closeDialog(); }}
        onClose={() => setOpen(false)}
        className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
          <div>
            {kind && (
              <button
                type="button"
                onClick={() => { setKind(null); setErrors({}); }}
                className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-blue-900"
              >
                <ArrowLeft size={14} /> Back to options
              </button>
            )}
            <h2 id="add-record-title" className="text-lg font-bold text-blue-950">
              {kind ? recordOptions.find((item) => item.kind === kind)?.label : "What would you like to add?"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {kind ? "Enter the details below to add it to the university records." : "Choose a record type to get started."}
            </p>
          </div>
          <button type="button" onClick={closeDialog} aria-label="Close dialog" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        {!kind ? (
          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">
            {recordOptions.map(({ kind: optionKind, label, icon: Icon }) => (
              <button
                key={optionKind}
                type="button"
                onClick={() => chooseKind(optionKind)}
                className="flex min-h-20 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
                  <Icon size={19} />
                </span>
                <span className="text-sm font-semibold text-blue-950">{label}</span>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4 p-5 sm:p-7">
            {fields.map((field, index) => (
              <div key={field.name} className="space-y-1.5">
                <label htmlFor={`add-${field.name}`} className="text-sm font-medium text-slate-700">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    id={`add-${field.name}`}
                    autoFocus={index === 0}
                    value={values[field.name] ?? field.options?.[0] ?? ""}
                    onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                    aria-invalid={Boolean(errors[field.name])}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                  >
                    {(field.options ?? []).map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={`add-${field.name}`}
                    autoFocus={index === 0}
                    type={field.type ?? "text"}
                    value={values[field.name] ?? ""}
                    onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                    aria-invalid={Boolean(errors[field.name])}
                    aria-describedby={errors[field.name] ? `error-${field.name}` : undefined}
                    className="h-11 rounded-lg border-slate-200 bg-white px-3 text-sm"
                  />
                )}
                {errors[field.name] && (
                  <p id={`error-${field.name}`} className="text-xs font-medium text-red-600">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={closeDialog} className="h-10 rounded-lg px-5">
                Cancel
              </Button>
              <Button type="submit" className="h-10 rounded-lg bg-blue-900 px-5 text-white hover:bg-blue-950">
                Save
              </Button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
