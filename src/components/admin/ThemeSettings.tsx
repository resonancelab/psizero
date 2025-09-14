import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { Monitor, Moon, Sun } from "lucide-react";

export function ThemeSettings() {
  const { theme, setTheme, actualTheme } = useTheme();

  const themeOptions = [
    {
      value: 'light',
      label: 'Light',
      description: 'Light theme for all users',
      icon: Sun,
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Dark theme for all users',
      icon: Moon,
    },
    {
      value: 'system',
      label: 'System',
      description: 'Follow system preference',
      icon: Monitor,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Theme Settings
          <Badge variant="outline" className="ml-auto">
            Currently: {actualTheme}
          </Badge>
        </CardTitle>
        <CardDescription>
          Configure the application theme. Changes apply system-wide for all users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={theme} onValueChange={setTheme}>
          <div className="grid gap-4">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label 
                    htmlFor={option.value} 
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}