import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/students": "Students",
  "/teachers": "Teachers",
  "/departments": "Departments",
  "/courses": "Courses",
  "/classes": "Classes & Sections",
  "/attendance": "Attendance",
  "/examinations": "Examinations & Grades",
  "/timetable": "Timetable",
};

export default function Header() {
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="pl-12 md:pl-0">
        <h1 className="text-lg font-bold text-blue-950 sm:text-xl">
          {pageTitle}
        </h1>

        <p className="hidden text-sm text-slate-500 sm:block">
          Rana University Management Portal
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3 sm:gap-5">
        
        <div className="hidden h-10 w-px bg-slate-200 sm:block" />

        {/* Administrator Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-blue-950">
              Administrator
            </p>

            <p className="text-xs text-slate-500">
              University Admin
            </p>
          </div>


          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-red-100 bg-blue-950 text-sm font-bold text-white">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
