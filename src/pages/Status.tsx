import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, XCircle, Activity } from "lucide-react";

const Status = () => {
  const services = [
    {
      name: "API Gateway",
      status: "operational",
      uptime: 99.99,
      responseTime: "45ms",
      icon: Activity
    },
    {
      name: "Authentication Service",
      status: "operational", 
      uptime: 99.95,
      responseTime: "32ms",
      icon: CheckCircle
    },
    {
      name: "Database",
      status: "operational",
      uptime: 99.98,
      responseTime: "28ms",
      icon: CheckCircle
    },
    {
      name: "File Storage",
      status: "degraded",
      uptime: 98.5,
      responseTime: "120ms",
      icon: AlertTriangle
    }
  ];

  const incidents = [
    {
      date: "Dec 12, 2024",
      title: "Increased response times for file uploads",
      status: "investigating",
      description: "We are currently investigating slower than normal response times for file upload operations."
    },
    {
      date: "Dec 10, 2024", 
      title: "Scheduled maintenance completed",
      status: "resolved",
      description: "Database maintenance has been completed successfully with no impact to service availability."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-api-success";
      case "degraded":
        return "text-yellow-500";
      case "outage":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-api-success/10 text-api-success">Operational</Badge>;
      case "degraded":
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">Degraded</Badge>;
      case "outage":
        return <Badge variant="destructive">Outage</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              API Status
            </h1>
            <p className="text-muted-foreground">
              Real-time status and performance metrics for all APIFlow services
            </p>
          </div>

          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-api-success" />
                  Overall System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-lg">All systems operational</span>
                  <Badge className="bg-api-success/10 text-api-success">
                    99.98% Uptime
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Service Status</h2>
            <div className="space-y-4">
              {services.map((service) => (
                <Card key={service.name}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <service.icon className={`h-5 w-5 ${getStatusColor(service.status)}`} />
                        <h3 className="font-medium">{service.name}</h3>
                      </div>
                      {getStatusBadge(service.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Uptime:</span>
                        <div className="mt-1">
                          <Progress value={service.uptime} className="h-2" />
                          <span className="text-xs text-muted-foreground mt-1 block">
                            {service.uptime}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Response Time:</span>
                        <p className="font-medium mt-1">{service.responseTime}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Recent Incidents</h2>
            <div className="space-y-4">
              {incidents.map((incident, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{incident.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={incident.status === "resolved" ? "secondary" : "outline"}
                          className={incident.status === "resolved" ? "bg-api-success/10 text-api-success" : ""}
                        >
                          {incident.status === "resolved" ? "Resolved" : "Investigating"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{incident.date}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{incident.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Status;