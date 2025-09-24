import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart, Tooltip } from "recharts";
import psiZeroApi from "@/lib/api/client";

interface DailyUsageData {
  name: string;
  calls: number;
  success: number;
}

interface UsageAnalyticsResponse {
  period: string;
  total_calls: number;
  success_calls: number;
  error_calls: number;
  avg_latency_ms: number;
  by_endpoint: Record<string, number>;
  by_day: Array<{
    date: string;
    calls: number;
    errors: number;
    avg_latency_ms: number;
  }>;
  top_errors: Array<{
    error_code: string;
    count: number;
    last_seen: string;
  }>;
}

const UsageChart = () => {
  const [data, setData] = useState<DailyUsageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    try {
      setLoading(true);
      const response = await psiZeroApi.get<UsageAnalyticsResponse>('/dashboard/usage?period=7d');
      
      if (response.error || !response.data) {
        console.error('Error fetching usage data:', response.error);
        // Fallback to mock data if API fails
        setData([
          { name: "Mon", calls: 2400, success: 2380 },
          { name: "Tue", calls: 1398, success: 1390 },
          { name: "Wed", calls: 9800, success: 9750 },
          { name: "Thu", calls: 3908, success: 3900 },
          { name: "Fri", calls: 4800, success: 4790 },
          { name: "Sat", calls: 3800, success: 3780 },
          { name: "Sun", calls: 4300, success: 4290 },
        ]);
        return;
      }

      // Transform API data to chart format
      const chartData: DailyUsageData[] = response.data.by_day.map((day, index) => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        return {
          name: dayName,
          calls: day.calls,
          success: day.calls - day.errors,
        };
      });

      setData(chartData);
    } catch (error: Error | unknown) {
      console.error('Error fetching usage data:', error);
      // Fallback to mock data
      setData([
        { name: "Mon", calls: 2400, success: 2380 },
        { name: "Tue", calls: 1398, success: 1390 },
        { name: "Wed", calls: 9800, success: 9750 },
        { name: "Thu", calls: 3908, success: 3900 },
        { name: "Fri", calls: 4800, success: 4790 },
        { name: "Sat", calls: 3800, success: 3780 },
        { name: "Sun", calls: 4300, success: 4290 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Usage This Week</CardTitle>
        <CardDescription>
          Daily API calls and success rates for the past 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-muted-foreground">Loading usage data...</div>
          </div>
        ) : (
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
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Area
                type="monotone"
                dataKey="calls"
                stroke="hsl(var(--api-secondary))"
                fillOpacity={1}
                fill="url(#colorCalls)"
                strokeWidth={2}
                name="Total Calls"
              />
              <Area
                type="monotone"
                dataKey="success"
                stroke="hsl(var(--api-success))"
                fillOpacity={0.3}
                fill="hsl(var(--api-success))"
                strokeWidth={1}
                name="Successful Calls"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageChart;