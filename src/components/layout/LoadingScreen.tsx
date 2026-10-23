export default function LoadingScreen() {
  return (
    <main className="loading-screen relative flex min-h-dvh items-center justify-center overflow-hidden bg-slate-950 px-4">

      {/* 3D Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[100px]" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* 3D University Logo */}
        <div className="logo-float relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-red-400/30 bg-gradient-to-br from-red-500/20 via-red-700/10 to-slate-900 shadow-[0_15px_50px_rgba(220,38,38,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl">

          {/* Logo Glow */}
          <div className="absolute inset-0 rounded-3xl bg-red-500/10 blur-xl" />

          {/* University Logo */}
          <img
            src="/logo.gif"
            alt="Rana University Logo"
            className="relative z-10 h-16 w-16 object-contain drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          />

          {/* 3D Highlight */}
          <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>

        {/* University Name */}
        <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.1)] sm:text-3xl">
          Rana University
        </h1>

   
        {/* 3D Loading Indicator */}
        <div className="relative mt-10 flex h-10 w-10 items-center justify-center">

          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-red-500/15" />

          {/* Animated Ring */}
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-red-500 border-r-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]" />

          {/* Inner Glow */}
          <div className="h-3 w-3 animate-pulse rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.8)]" />
        </div>

        {/* Loading Text */}
        <p className="mt-5 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
          Please wait...
        </p>

        {/* Bottom Accent */}
        <div className="mt-6 h-px w-24 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
      </div>

      {/* Custom Animation */}
      <style>{`
        .logo-float {
          animation: logoFloat 3.5s ease-in-out infinite;
          transform-style: preserve-3d;
          will-change: transform;
        }

        @keyframes logoFloat {
          0%, 100% {
            transform: perspective(800px) rotateX(0deg) rotateY(-5deg) translateY(0);
          }
          50% {
            transform: perspective(800px) rotateX(5deg) rotateY(5deg) translateY(-8px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-float {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
