import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts";

const UsageChart = () => {
  const data = [
    { name: "Mon", calls: 2400, success: 2380 },
    { name: "Tue", calls: 1398, success: 1390 },
    { name: "Wed", calls: 9800, success: 9750 },
    { name: "Thu", calls: 3908, success: 3900 },
    { name: "Fri", calls: 4800, success: 4790 },
    { name: "Sat", calls: 3800, success: 3780 },
    { name: "Sun", calls: 4300, success: 4290 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Usage This Week</CardTitle>
        <CardDescription>
          Daily API calls and success rates for the past 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--api-secondary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--api-secondary))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              fontSize={12}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              fontSize={12}
            />
            <Area
              type="monotone"
              dataKey="calls"
              stroke="hsl(var(--api-secondary))"
              fillOpacity={1}
              fill="url(#colorCalls)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UsageChart;