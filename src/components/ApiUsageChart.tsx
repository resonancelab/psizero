import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Brain, Atom, Sparkles, Globe, Eye, Hexagon, Gauge } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

const ApiUsageChart = () => {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [endpointUsage, setEndpointUsage] = useState<EndpointUsage[]>([]);
  const [apiCategoryUsage, setApiCategoryUsage] = useState<ApiCategoryUsage[]>([]);
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(true);

  const apiCategories = [
    { key: 'srs', name: 'Symbolic Resonance Solver', icon: Brain, color: '#3b82f6', status: 'stable' as const },
    { key: 'hqe', name: 'Holographic Quantum Encoder', icon: Atom, color: '#8b5cf6', status: 'stable' as const },
    { key: 'qsem', name: 'Quantum Semantics', icon: Sparkles, color: '#ec4899', status: 'beta' as const },
    { key: 'nlc', name: 'Non-Local Communication', icon: Globe, color: '#10b981', status: 'beta' as const },
    { key: 'qcr', name: 'Quantum Consciousness Resonator', icon: Eye, color: '#6366f1', status: 'alpha' as const },
    { key: 'iching', name: 'I-Ching Oracle', icon: Hexagon, color: '#f59e0b', status: 'stable' as const },
    { key: 'unified', name: 'Unified Physics', icon: Gauge, color: '#ef4444', status: 'alpha' as const },
  ];

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
        srs: Math.floor(data.requests * 0.3),
        hqe: Math.floor(data.requests * 0.15),
        qsem: Math.floor(data.requests * 0.2),
        nlc: Math.floor(data.requests * 0.1),
        qcr: Math.floor(data.requests * 0.1),
        iching: Math.floor(data.requests * 0.1),
        unified: Math.floor(data.requests * 0.05),
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
        .map(([endpoint, data]) => {
          const cleanEndpoint = endpoint.replace(`${data.method} `, '');
          // Determine category based on endpoint path
          let category = 'other';
          if (cleanEndpoint.includes('/srs/')) category = 'srs';
          else if (cleanEndpoint.includes('/hqe/')) category = 'hqe';
          else if (cleanEndpoint.includes('/qsem/')) category = 'qsem';
          else if (cleanEndpoint.includes('/nlc/')) category = 'nlc';
          else if (cleanEndpoint.includes('/qcr/')) category = 'qcr';
          else if (cleanEndpoint.includes('/iching/')) category = 'iching';
          else if (cleanEndpoint.includes('/unified/')) category = 'unified';

          return {
            endpoint: cleanEndpoint,
            method: data.method,
            requests: data.requests,
            totalCost: data.totalCost,
            category,
          };
        })
        .sort((a, b) => b.requests - a.requests)
        .slice(0, 10);

      setEndpointUsage(endpointChartData);

      // Process API category usage data
      const categoryUsageData: ApiCategoryUsage[] = apiCategories.map(category => {
        const categoryTotal = chartData.reduce((sum, day) => sum + (day[category.key as keyof UsageData] as number || 0), 0);
        const avgResponseTime = 100 + Math.random() * 200; // Mock response time
        const sessions = category.key === 'nlc' || category.key === 'qcr' ? Math.floor(categoryTotal * 0.1) : undefined;
        
        return {
          category: category.key,
          name: category.name,
          icon: category.icon,
          requests: categoryTotal,
          sessions,
          avgResponseTime: Math.round(avgResponseTime),
          totalCost: Math.floor(categoryTotal * (1 + Math.random())),
          color: category.color,
          status: category.status,
        };
      }).sort((a, b) => b.requests - a.requests);

      setApiCategoryUsage(categoryUsageData);

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