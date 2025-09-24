import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Brain, Atom, Sparkles, Globe, Eye, Hexagon, Gauge } from "lucide-react";
import psiZeroApi from "@/lib/api/client";
import { format, subDays, startOfDay } from "date-fns";

interface UsageData {
  date: string;
  requests: number;
  errors: number;
  avgResponseTime: number;
  totalCost: number;
  srs: number;
  hqe: number;
  qsem: number;
  nlc: number;
  qcr: number;
  iching: number;
  unified: number;
}

interface ApiCategoryUsage {
  category: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  requests: number;
  sessions?: number;
  avgResponseTime: number;
  totalCost: number;
  color: string;
  status: "stable" | "beta" | "alpha";
}

interface EndpointUsage {
  endpoint: string;
  method: string;
  requests: number;
  totalCost: number;
  category: string;
}

// API Response types - updated to match backend structure
interface UsageAnalyticsResponse {
  period: string;
  total_calls: number;
  success_calls: number;
  error_calls: number;
  avg_latency_ms: number;
  by_endpoint: Record<string, number>;
  by_day: DailyUsageResponse[];
  top_errors: ErrorSummaryResponse[];
}

interface DailyUsageResponse {
  date: string;
  calls: number;
  errors: number;
  avg_latency_ms: number;
}

interface ErrorSummaryResponse {
  error_code: string;
  count: number;
  last_seen: string;
}

interface OldDailyUsageResponse {
  date: string;
  requests: number;
  errors: number;
  avg_response_time: number;
  total_cost: number;
}

interface EndpointUsageResponse {
  endpoint: string;
  method: string;
  requests: number;
  cost: number;
  category: string;
}

interface CategoryUsageResponse {
  category: string;
  requests: number;
  sessions?: number;
  avg_response_time: number;
  cost: number;
}

const ApiUsageChart = () => {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [endpointUsage, setEndpointUsage] = useState<EndpointUsage[]>([]);
  const [apiCategoryUsage, setApiCategoryUsage] = useState<ApiCategoryUsage[]>([]);
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(true);

  const apiCategories = useMemo(() => [
    { key: 'srs', name: 'Symbolic Resonance Solver', icon: Brain, color: '#3b82f6', status: 'stable' as const },
    { key: 'hqe', name: 'Holographic Quantum Encoder', icon: Atom, color: '#8b5cf6', status: 'stable' as const },
    { key: 'qsem', name: 'Quantum Semantics', icon: Sparkles, color: '#ec4899', status: 'beta' as const },
    { key: 'nlc', name: 'Non-Local Communication', icon: Globe, color: '#10b981', status: 'beta' as const },
    { key: 'qcr', name: 'Quantum Consciousness Resonator', icon: Eye, color: '#6366f1', status: 'alpha' as const },
    { key: 'iching', name: 'I-Ching Oracle', icon: Hexagon, color: '#f59e0b', status: 'stable' as const },
    { key: 'unified', name: 'Unified Physics', icon: Gauge, color: '#ef4444', status: 'alpha' as const },
  ], []);

  const fetchUsageData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch usage analytics from Go API
      const response = await psiZeroApi.get<UsageAnalyticsResponse>(`/dashboard/usage?period=${timeRange}`);
      
      if (response.error || !response.data) {
        console.error('Error fetching usage analytics:', response.error);
        return;
      }

      const analytics = response.data;

      // Process daily usage data - add null safety (fixed to match backend structure)
      if (!analytics || !analytics.by_day || !Array.isArray(analytics.by_day)) {
        console.warn('No daily usage data available');
        setUsageData([]);
        return;
      }

      const chartData: UsageData[] = analytics.by_day.map(day => ({
        date: day.date,
        requests: day.calls,
        errors: day.errors,
        avgResponseTime: day.avg_latency_ms,
        totalCost: 0, // Backend doesn't provide cost data yet
        // Distribute requests across categories based on patterns
        srs: Math.floor(day.calls * 0.3),
        hqe: Math.floor(day.calls * 0.15),
        qsem: Math.floor(day.calls * 0.2),
        nlc: Math.floor(day.calls * 0.1),
        qcr: Math.floor(day.calls * 0.1),
        iching: Math.floor(day.calls * 0.1),
        unified: Math.floor(day.calls * 0.05),
      }));

      setUsageData(chartData);

      // Process endpoint usage data from by_endpoint map
      const endpointChartData: EndpointUsage[] = Object.entries(analytics.by_endpoint || {})
        .map(([endpoint, requests]) => ({
          endpoint: endpoint,
          method: 'GET', // Default method since backend doesn't provide it
          requests: requests,
          totalCost: 0, // Backend doesn't provide cost data yet
          category: 'unknown', // Backend doesn't provide category data yet
        }))
        .sort((a, b) => b.requests - a.requests)
        .slice(0, 10);

      setEndpointUsage(endpointChartData);

      // Process API category usage data - create from chart data since backend doesn't provide category breakdown
      const categoryUsageData: ApiCategoryUsage[] = apiCategories.map(category => {
        // Calculate category usage from chart data since backend doesn't provide category breakdown
        const categoryTotal = chartData.reduce((sum, day) => sum + (day[category.key as keyof UsageData] as number || 0), 0);
        const avgResponseTime = 100 + Math.random() * 200; // Mock response time
        const sessions = undefined; // Backend doesn't provide session data yet
        
        return {
          category: category.key,
          name: category.name,
          icon: category.icon,
          requests: categoryTotal,
          sessions,
          avgResponseTime: Math.round(avgResponseTime),
          totalCost: Math.floor(categoryTotal * (1 + Math.random())), // Mock cost calculation
          color: category.color,
          status: category.status,
        };
      }).sort((a, b) => b.requests - a.requests);

      setApiCategoryUsage(categoryUsageData);

    } catch (error: Error | unknown) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange, apiCategories]);

  useEffect(() => {
    fetchUsageData();
  }, [timeRange, fetchUsageData]);

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-api-success/10 text-api-success";
      case "POST": return "bg-api-secondary/10 text-api-secondary";
      case "PUT": return "bg-api-warning/10 text-api-warning";
      case "DELETE": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#6366f1', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">PsiZero Resonance API Analytics</h2>
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">API Categories</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Usage Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Requests Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Total API Requests</CardTitle>
                <CardDescription>Daily request volume across all APIs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="hsl(var(--primary))" name="Requests" strokeWidth={2} />
                    <Line type="monotone" dataKey="errors" stroke="hsl(var(--destructive))" name="Errors" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* API Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>API Usage Distribution</CardTitle>
                <CardDescription>Request distribution across API categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={apiCategoryUsage}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="requests"
                      nameKey="name"
                    >
                      {apiCategoryUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          {/* API Category Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apiCategoryUsage.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.category}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-muted">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{category.name}</div>
                          <Badge variant="outline" className="text-xs">{category.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Requests</span>
                        <span className="font-semibold">{category.requests.toLocaleString()}</span>
                      </div>
                      {category.sessions && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Sessions</span>
                          <span className="font-semibold">{category.sessions.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg Time</span>
                        <span className="font-semibold">{category.avgResponseTime}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cost Units</span>
                        <span className="font-semibold">{category.totalCost}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
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
                        <Badge variant="outline" className="text-xs">
                          {endpoint.category.toUpperCase()}
                        </Badge>
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
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Response Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>Average response time across all APIs</CardDescription>
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
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cost Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Cost Tracking</CardTitle>
                <CardDescription>Cost units consumed per day</CardDescription>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiUsageChart;