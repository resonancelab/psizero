import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code } from "lucide-react";
import { ApiEndpoint } from "@/data/apiEndpoints";

interface EndpointCardProps {
  endpoint: ApiEndpoint;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const getMethodColor = (method: string) => {
  switch (method) {
    case "GET": return "bg-api-success/10 text-api-success";
    case "POST": return "bg-api-secondary/10 text-api-secondary";
    case "PUT": return "bg-api-warning/10 text-api-warning";
    case "DELETE": return "bg-destructive/10 text-destructive";
    default: return "bg-muted text-muted-foreground";
  }
};

const EndpointCard = ({ endpoint, isActive, onClick, className }: EndpointCardProps) => {
  return (
    <Card 
      className={`cursor-pointer border-border hover:shadow-elegant transition-all ${
        isActive ? "ring-2 ring-api-secondary" : ""
      } ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className={getMethodColor(endpoint.method)}>
              {endpoint.method}
            </Badge>
            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {endpoint.path}
            </code>
          </div>
          <Button variant="ghost" size="sm">
            <Code className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <CardTitle className="text-lg">{endpoint.title}</CardTitle>
          <CardDescription>{endpoint.description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};

export default EndpointCard;