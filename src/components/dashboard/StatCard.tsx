import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  color: "blue" | "red";
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: StatCardProps) {
  const colorStyles = {
    blue: {
      icon: "bg-blue-50 text-blue-900",
      accent: "bg-blue-900",
    },
    red: {
      icon: "bg-red-50 text-red-700",
      accent: "bg-red-600",
    },
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Top Accent */}
      <div
        className={`absolute left-0 top-0 h-1 w-full ${colorStyles[color].accent}`}
      />

      {/* Card Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-blue-950">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorStyles[color].icon}`}
        >
          <Icon size={23} strokeWidth={1.8} />
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}