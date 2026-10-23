import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface AttendanceDatum {
  name: string;
  value: number;
}

const COLORS = ["var(--chart-accent)", "var(--chart-highlight)", "#f59e0b"];

export default function AttendanceChart({ data }: { data: AttendanceDatum[] }) {
  const attendanceRate =
    data.find((item) => item.name === "Present")?.value ?? 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-blue-950">
          Attendance Overview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Student attendance distribution
        </p>
      </div>

      {/* Donut Chart */}
      <div className="relative mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={88}
              paddingAngle={4}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [`${value}%`, "Attendance"]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--popover)",
                color: "var(--popover-foreground)",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-blue-950">
            {attendanceRate}%
          </span>

          <span className="mt-1 text-xs text-slate-500">
            Present
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-3">
          {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />

              <span className="text-sm text-slate-600">
                {item.name}
              </span>
            </div>

            <span className="text-sm font-semibold text-blue-950">
              {item.value}%
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500">
          Sample attendance data for demonstration purposes.
        </p>
      </div>
    </div>
  );
}
