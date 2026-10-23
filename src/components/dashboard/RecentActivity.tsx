import { ArrowUpRight, BookOpen, ClipboardCheck, GraduationCap, UserPlus } from "lucide-react";
import { useUniversityData } from "@/context/UniversityDataContext";

const activityIcons = [
  UserPlus,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
];

const activityColors = [
  "bg-blue-50 text-blue-800",
  "bg-red-50 text-red-700",
  "bg-blue-50 text-blue-800",
  "bg-red-50 text-red-700",
];

export default function RecentActivity() {
  const { activities, selectedAcademicYear } = useUniversityData();
  const visibleActivities = activities
    .filter((activity) => !activity.academicYear || activity.academicYear === selectedAcademicYear)
    .slice(0, 4);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-blue-950">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest updates across the university
          </p>
        </div>

        <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">
          Latest
        </span>
      </div>

      {/* Activity List */}
      <div className="mt-6 divide-y divide-slate-100">
        {visibleActivities.length > 0 ? visibleActivities.map((activity, index) => {
          const Icon = activityIcons[index % activityIcons.length];
          const colorClass =
            activityColors[index % activityColors.length];

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
            >
              {/* Activity Icon */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorClass}`}
              >
                <Icon size={19} strokeWidth={1.8} />
              </div>

              {/* Activity Details */}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-slate-800">
                  {activity.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {activity.description}
                </p>

                <p className="mt-2 text-xs font-medium text-slate-400">
                  {activity.time}
                </p>
              </div>

              {/* Small Arrow */}
              <ArrowUpRight
                size={16}
                className="mt-1 shrink-0 text-slate-400"
              />
            </div>
          );
        }) : (
          <p className="py-6 text-center text-sm text-slate-500">No recent activity for this academic year.</p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500">
          Activity records are sample data for demonstration purposes.
        </p>
      </div>
    </div>
  );
}
