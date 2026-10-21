import { GraduationCap, LoaderCircle } from "lucide-react";

export default function LoadingScreen() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-950 px-4">
      <div className="flex flex-col items-center text-center">
        {/* University Logo */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-600/20">
          <GraduationCap className="h-11 w-11 text-white" />
        </div>

        {/* University Name */}
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Rana University
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Preparing your university dashboard
        </p>

        {/* Loading Animation */}
        <LoaderCircle className="mt-8 h-8 w-8 animate-spin text-red-500" />

        <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Please wait...
        </p>
      </div>
    </main>
  );
}