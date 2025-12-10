import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", visitors: 1200 },
  { name: "Tue", visitors: 1800 },
  { name: "Wed", visitors: 1400 },
  { name: "Thu", visitors: 2200 },
  { name: "Fri", visitors: 1900 },
  { name: "Sat", visitors: 2400 },
  { name: "Sun", visitors: 1600 },
];

export function TrafficChart() {
  return (
    <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Visitor Traffic</h3>
        <p className="text-sm text-muted-foreground">Weekly website visits</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Bar
              dataKey="visitors"
              fill="hsl(var(--chart-2))"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
