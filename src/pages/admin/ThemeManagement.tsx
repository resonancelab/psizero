import { ThemeSettings } from "@/components/admin/ThemeSettings";
import { ThemePreview } from "@/components/admin/ThemePreview";

export default function ThemeManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Theme Management</h1>
        <p className="text-muted-foreground mt-2">
          Configure the application's visual theme and appearance settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ThemeSettings />
        <ThemePreview />
      </div>
    </div>
  );
}