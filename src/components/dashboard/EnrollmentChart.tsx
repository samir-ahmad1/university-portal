import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EnrollmentPoint {
  semester: string;
  students: number;
}

interface EnrollmentChartProps {
  data: EnrollmentPoint[];
  academicYear: string;
}

export default function EnrollmentChart({ data, academicYear }: EnrollmentChartProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Chart Header */}
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-blue-950">
            Student Enrollment
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enrollment trends for academic year {academicYear}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-800" />

          <span className="text-xs font-medium text-slate-600">
            Total Students
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 8, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="enrollmentGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--chart-accent)"
                  stopOpacity={0.2}
                />

                <stop
                  offset="95%"
                  stopColor="var(--chart-accent)"
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="var(--chart-grid)"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="semester"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--chart-label)", fontSize: 11 }}
              tickMargin={12}
              interval="preserveStartEnd"
              minTickGap={20}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--chart-label)", fontSize: 12 }}
              tickMargin={8}
              domain={[0, "dataMax + 200"]}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--popover)",
                color: "var(--popover-foreground)",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
              }}
              formatter={(value) => [
                `${Number(value).toLocaleString()} students`,
                "Enrollment",
              ]}
            />

            <Area
              type="monotone"
              dataKey="students"
              stroke="var(--chart-accent)"
              strokeWidth={3}
              fill="url(#enrollmentGradient)"
              activeDot={{
                r: 6,
                fill: "var(--chart-highlight)",
                stroke: "var(--card)",
                strokeWidth: 2,
              }}
              dot={{
                r: 3,
                fill: "var(--chart-accent)",
                stroke: "var(--card)",
                strokeWidth: 1.5,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500">
          Sample data for demonstration purposes.
        </p>
      </div>
    </div>
  );
}
