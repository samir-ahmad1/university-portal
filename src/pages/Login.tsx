import LoadingScreen from "@/components/layout/LoadingScreen";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const navigationTimeout = useRef<number | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (navigationTimeout.current !== null) {
        window.clearTimeout(navigationTimeout.current);
      }
    };
  }, []);

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

    navigationTimeout.current = window.setTimeout(() => {
      navigate("/");
    }, 2500);
  } else {
    setError("Invalid email or password. Please try again.");
  }
};
if (isLoading) {
  return <LoadingScreen />;
}

  return (
    <main className="login-enter flex min-h-dvh items-center justify-center overflow-y-auto bg-slate-100 p-4 sm:p-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* LEFT: LOGIN FORM */}
        <section className="flex items-center justify-center px-6 py-8 sm:px-10 sm:py-10">
          <div className="w-full">
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
        
      </div>
    </main>
  );
}
