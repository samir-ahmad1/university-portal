import { GraduationCap, Users, BookOpen, UserRound } from "lucide-react";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Rana University Dashboard
        </h1>
        <p className="mt-2 text-slate-500">
          Welcome to the University Management System.
        </p>
      </header>

      {/* Statistics Cards */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <Users className="mb-4 h-8 w-8 text-blue-600" />
          <p className="text-sm text-slate-500">Total Students</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">1,250</h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <UserRound className="mb-4 h-8 w-8 text-green-600" />
          <p className="text-sm text-slate-500">Total Faculty</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">85</h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <BookOpen className="mb-4 h-8 w-8 text-red-600" />
          <p className="text-sm text-slate-500">Total Courses</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">32</h2>
        </div>
      </section>

      {/* Welcome Card */}
      <section className="mt-8 rounded-xl bg-slate-900 p-8 text-white">
        <GraduationCap className="mb-4 h-10 w-10 text-red-500" />

        <h2 className="text-2xl font-bold">Dashboard is working! 🎉</h2>

        <p className="mt-2 text-slate-300">
          Your University Management System dashboard is ready for development.
        </p>
      </section>
    </main>
  );
}