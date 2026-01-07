import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { CalendarDays } from "lucide-react";

interface ForecastData {
  date: string;
  temp: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  description: string;
}

interface ForecastChartProps {
  data: ForecastData[];
  loading: boolean;
}

const ForecastChart = ({ data, loading }: ForecastChartProps) => {
  if (loading) {
    return (
      <Card className="glass animate-slide-up">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="glass animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            5-Day Forecast
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground">Select a location to view forecast</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          5-Day Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickFormatter={(value) => `${value}°`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number, name: string) => [
                `${Math.round(value)}°C`,
                name === "temp" ? "Temperature" : name,
              ]}
            />
            <Area
              type="monotone"
              dataKey="temp_max"
              stroke="hsl(43, 96%, 56%)"
              fill="none"
              strokeWidth={2}
              dot={{ fill: "hsl(43, 96%, 56%)", strokeWidth: 0, r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="hsl(199, 89%, 48%)"
              fill="url(#tempGradient)"
              strokeWidth={2}
              dot={{ fill: "hsl(199, 89%, 48%)", strokeWidth: 0, r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="temp_min"
              stroke="hsl(262, 83%, 58%)"
              fill="none"
              strokeWidth={2}
              dot={{ fill: "hsl(262, 83%, 58%)", strokeWidth: 0, r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(43,96%,56%)]" />
            <span className="text-sm text-muted-foreground">Max</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(199,89%,48%)]" />
            <span className="text-sm text-muted-foreground">Avg</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(262,83%,58%)]" />
            <span className="text-sm text-muted-foreground">Min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastChart;