import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemePreview() {
  const { actualTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Preview</CardTitle>
        <CardDescription>
          Preview how the interface looks with the current theme
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg border bg-card">
          <h3 className="font-semibold text-card-foreground mb-2">Sample Card</h3>
          <p className="text-muted-foreground text-sm mb-3">
            This is how cards and content will appear with the {actualTheme} theme.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button variant="default" size="sm">Primary</Button>
            <Button variant="secondary" size="sm">Secondary</Button>
            <Button variant="outline" size="sm">Outline</Button>
            <Badge>Status Badge</Badge>
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-muted">
          <h4 className="font-medium text-foreground mb-1">Muted Background</h4>
          <p className="text-muted-foreground text-sm">
            Subtle backgrounds and secondary content areas
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 rounded bg-primary"></div>
          <span>Primary Color</span>
          <div className="w-4 h-4 rounded bg-secondary ml-4"></div>
          <span>Secondary Color</span>
          <div className="w-4 h-4 rounded bg-accent ml-4"></div>
          <span>Accent Color</span>
        </div>
      </CardContent>
    </Card>
  );
}