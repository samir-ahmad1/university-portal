import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  School,
  ClipboardCheck,
  FileText,
  CalendarDays,
  Menu,
  X,
} from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    path: "/students",
    icon: Users,
  },
  {
    title: "Teachers",
    path: "/teachers",
    icon: GraduationCap,
  },
  {
    title: "Departments",
    path: "/departments",
    icon: Building2,
  },
  {
    title: "Courses",
    path: "/courses",
    icon: BookOpen,
  },
  {
    title: "Classes & Sections",
    path: "/classes",
    icon: School,
  },
  {
    title: "Attendance",
    path: "/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Examinations & Grades",
    path: "/examinations",
    icon: FileText,
  },
  {
    title: "Timetable",
    path: "/timetable",
    icon: CalendarDays,
  },
];

export default function AppSidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMobileMenu = (restoreFocus = true) => {
    setMobileMenuOpen(false);
    if (restoreFocus) menuButtonRef.current?.focus();
  };

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const updateInert = () => {
      sidebar.inert = !mobileMenuOpen && window.matchMedia("(max-width: 767px)").matches;
    };

    updateInert();
    window.addEventListener("resize", updateInert);

    if (mobileMenuOpen) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setMobileMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("resize", updateInert);
      };
    }

    return () => window.removeEventListener("resize", updateInert);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        ref={menuButtonRef}
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={mobileMenuOpen}
        className="fixed left-4 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-blue-950 shadow-sm transition hover:bg-blue-50 md:hidden"
      >
        <Menu size={21} />
      </button>

      {/* Mobile Overlay */}
      <button
        type="button"
        aria-label="Close navigation menu"
        aria-hidden={!mobileMenuOpen}
        tabIndex={mobileMenuOpen ? 0 : -1}
        disabled={!mobileMenuOpen}
        onClick={() => closeMobileMenu()}
        className={`mobile-overlay fixed inset-0 z-40 bg-slate-950/40 md:hidden ${
          mobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`mobile-sidebar fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white md:z-40 md:w-64 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full pointer-events-none md:pointer-events-auto"
        }`}
      >
        {/* University Branding */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-3">
            <img
              src="/logo.gif"
              alt="Rana University"
              className="h-12 w-12 shrink-0 object-contain"
            />

            <div>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Rana University
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => closeMobileMenu()}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-950 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="flex-1 overflow-y-auto px-3 py-6"
        >
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            Main Menu
          </p>

          <div className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => closeMobileMenu(false)}
                  className={({ isActive }) =>
                    `group relative flex min-h-11 items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-950"
                        : "text-slate-600 hover:bg-slate-50 hover:text-blue-950"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Red Active Indicator */}
                      {isActive && (
                        <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-red-600" />
                      )}

                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.2 : 1.8}
                        className={`shrink-0 transition-colors ${
                          isActive
                            ? "text-red-600"
                            : "text-slate-400 group-hover:text-blue-800"
                        }`}
                      />

                      <span className="flex-1">{item.title}</span>

                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="shrink-0 border-t border-slate-200 p-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600" />

              <p className="text-xs font-semibold text-blue-950">
                Rana University
              </p>
            </div>

            <p className="mt-1 pl-4 text-xs text-slate-500">
              University Management System
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
