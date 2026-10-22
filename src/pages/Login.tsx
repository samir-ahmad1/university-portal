import LoadingScreen from "@/components/layout/LoadingScreen";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setError("");

  if (
    email === "admin@university.com" &&
    password === "admin123"
  ) {
    setIsLoading(true);
    localStorage.setItem("isAuthenticated", "true");

    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
    }

    setTimeout(() => {
      navigate("/");
    }, 1500);
  } else {
    setError("Invalid email or password. Please try again.");
  }
};
if (isLoading) {
  return <LoadingScreen />;
}

  return (
    <main className="h-dvh overflow-hidden bg-slate-100 p-0 sm:p-3 lg:p-4">
      <div className="mx-auto grid h-full w-full max-w-[1600px] grid-cols-1 overflow-hidden bg-white sm:rounded-2xl sm:shadow-xl lg:grid-cols-2">
        {/* LEFT: LOGIN FORM */}
        <section className="flex h-full min-h-0 items-center justify-center overflow-hidden px-6 py-4 sm:px-10 lg:px-8 xl:px-14">
          <div className="w-full max-w-[390px]">
            {/* UNIVERSITY BRAND */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white shadow-sm">
                <img
                  src="/logo.gif"
                  alt="Rana University logo"
                  className="h-10 w-10 object-contain"
                />
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  Rana University
                </h1>
                <p className="text-xs text-slate-500">
                  University Management System
                </p>
              </div>
            </div>

            {/* HEADING */}
            <div className="mb-6">
              <p className="mb-1.5 text-sm font-semibold text-red-600">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Sign in
              </h2>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Access your university management dashboard.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* EMAIL */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@university.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    className="h-11 rounded-lg border-slate-200 bg-slate-50 pl-10 text-sm focus-visible:bg-white"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    className="h-11 rounded-lg border-slate-200 bg-slate-50 pl-10 pr-11 text-sm focus-visible:bg-white"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                  />

                  <label
                    htmlFor="remember"
                    className="cursor-pointer text-sm text-slate-600"
                  >
                    Remember me
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setError("Contact your university administrator to reset your password.")
                  }
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Forgot password?
                </button>
              </div>

              {/* ERROR */}
              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              {/* SUBMIT */}
              <Button
                type="submit"
                className="group h-11 w-full rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-700"
              >
                Sign in to dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            {/* DEMO CREDENTIALS */}
            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Demo account
              </p>

              <p className="text-xs leading-5 text-slate-600">
                Email: admin@university.com
              </p>

              <p className="text-xs leading-5 text-slate-600">
                Password: admin123
              </p>
            </div>

            {/* FOOTER */}
            <p className="mt-5 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} Rana University
            </p>
          </div>
        </section>

        {/* RIGHT: UNIVERSITY BRANDING */}
        <section className="relative hidden h-full min-h-0 overflow-hidden bg-[#111827] p-5 lg:flex lg:items-center lg:justify-center xl:p-8">
          {/* BACKGROUND GRID */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600/15 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl"
          />

          {/* CONTENT */}
          <div className="relative z-10 w-full max-w-[520px] rounded-3xl border border-white/10 bg-white/[0.04] p-6 xl:p-8">
            {/* PANEL HEADER */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">
                <img
                  src="/logo.gif"
                  alt="Rana University logo"
                  className="h-9 w-9 object-contain"
                />
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Rana University
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Academic Management Portal
                </p>
              </div>
            </div>

            {/* MAIN MESSAGE */}
            <div className="mb-7 mt-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                <span className="text-xs font-medium text-red-300">
                  Official University Portal
                </span>
              </div>

              <h2 className="text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">
                Rana University
                <span className="mt-1 block text-red-400">
                  Management Portal
                </span>
              </h2>

              <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
                Manage academic information, student records, faculty,
                and courses through one centralized platform.
              </p>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                  <GraduationCap className="h-5 w-5 text-red-400" />
                </div>

                <h3 className="text-sm font-semibold text-white">
                  Students
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-slate-400">
                  Student records and academic information.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>

                <h3 className="text-sm font-semibold text-white">
                  Faculty
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-slate-400">
                  Faculty information and administration.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <BookOpen className="h-5 w-5 text-emerald-400" />
                </div>

                <h3 className="text-sm font-semibold text-white">
                  Courses
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-slate-400">
                  Courses and academic resources.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <LockKeyhole className="h-5 w-5 text-amber-400" />
                </div>

                <h3 className="text-sm font-semibold text-white">
                  Administration
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-slate-400">
                  Centralized university management.
                </p>
              </div>
            </div>

            {/* BOTTOM DIVIDER */}
            <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
              <p className="text-xs text-slate-500">
                Rana University · Academic Services
              </p>

              <GraduationCap className="h-5 w-5 shrink-0 text-red-400" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
