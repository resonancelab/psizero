import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, startOfDay } from "date-fns";

interface UsageData {
  date: string;
  requests: number;
  errors: number;
  avgResponseTime: number;
  totalCost: number;
}

interface EndpointUsage {
  endpoint: string;
  method: string;
  requests: number;
  totalCost: number;
}

const ApiUsageChart = () => {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [endpointUsage, setEndpointUsage] = useState<EndpointUsage[]>([]);
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageData();
  }, [timeRange]);

  const fetchUsageData = async () => {
    setLoading(true);
    try {
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 1;
      const startDate = startOfDay(subDays(new Date(), days));

      // Fetch daily usage data
      const { data: usageResults, error: usageError } = await supabase
        .from('api_usage')
        .select('timestamp, status_code, response_time_ms, cost_units, endpoint_path, method')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true });

      if (usageError) throw usageError;

      // Process daily usage data
      const dailyData = new Map<string, {
        requests: number;
        errors: number;
        totalResponseTime: number;
        totalCost: number;
      }>();

      usageResults?.forEach(record => {
        const date = format(new Date(record.timestamp), 'yyyy-MM-dd');
        const current = dailyData.get(date) || {
          requests: 0,
          errors: 0,
          totalResponseTime: 0,
          totalCost: 0,
        };

        current.requests += 1;
        if (record.status_code >= 400) current.errors += 1;
        current.totalResponseTime += record.response_time_ms || 0;
        current.totalCost += record.cost_units || 1;

        dailyData.set(date, current);
      });

      const chartData: UsageData[] = Array.from(dailyData.entries()).map(([date, data]) => ({
        date,
        requests: data.requests,
        errors: data.errors,
        avgResponseTime: data.requests > 0 ? Math.round(data.totalResponseTime / data.requests) : 0,
        totalCost: data.totalCost,
      }));

      setUsageData(chartData);

      // Process endpoint usage data
      const endpointData = new Map<string, {
        method: string;
        requests: number;
        totalCost: number;
      }>();

      usageResults?.forEach(record => {
        const key = `${record.method} ${record.endpoint_path}`;
        const current = endpointData.get(key) || {
          method: record.method,
          requests: 0,
          totalCost: 0,
        };

        current.requests += 1;
        current.totalCost += record.cost_units || 1;

        endpointData.set(key, current);
      });

      const endpointChartData: EndpointUsage[] = Array.from(endpointData.entries())
        .map(([endpoint, data]) => ({
          endpoint: endpoint.replace(`${data.method} `, ''),
          method: data.method,
          requests: data.requests,
          totalCost: data.totalCost,
        }))
        .sort((a, b) => b.requests - a.requests)
        .slice(0, 10);

      setEndpointUsage(endpointChartData);

    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-api-success/10 text-api-success";
      case "POST": return "bg-api-secondary/10 text-api-secondary";
      case "PUT": return "bg-api-warning/10 text-api-warning";
      case "DELETE": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">API Usage Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Usage Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests Chart */}
        <Card>
          <CardHeader>
            <CardTitle>API Requests</CardTitle>
            <CardDescription>Daily request volume and errors</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="hsl(var(--primary))" name="Requests" />
                <Line type="monotone" dataKey="errors" stroke="hsl(var(--destructive))" name="Errors" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
            <CardDescription>Average response time in milliseconds</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avgResponseTime" 
                  stroke="hsl(var(--chart-2))" 
                  name="Avg Response Time (ms)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Endpoint Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Top Endpoints</CardTitle>
          <CardDescription>Most used API endpoints by request count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {endpointUsage.length > 0 ? (
              endpointUsage.map((endpoint, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <Badge className={getMethodColor(endpoint.method)}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono">{endpoint.endpoint}</code>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{endpoint.requests} requests</div>
                    <div className="text-sm text-muted-foreground">{endpoint.totalCost} cost units</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No API usage data available for the selected time range.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cost Chart */}
      <Card>
        <CardHeader>
          <CardTitle>API Costs</CardTitle>
          <CardDescription>Daily cost units consumed</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalCost" fill="hsl(var(--chart-3))" name="Cost Units" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiUsageChart;