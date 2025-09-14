import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  background?: "default" | "muted" | "gradient";
  padding?: "sm" | "md" | "lg" | "xl";
}

const Section = ({ 
  children, 
  className, 
  containerClassName,
  background = "default", 
  padding = "lg" 
}: SectionProps) => {
  const backgroundClasses = {
    default: "bg-background",
    muted: "bg-muted/30", 
    gradient: "bg-gradient-hero"
  };

  const paddingClasses = {
    sm: "py-12",
    md: "py-16", 
    lg: "py-24",
    xl: "py-32"
  };

  return (
    <section className={cn(
      backgroundClasses[background],
      paddingClasses[padding],
      className
    )}>
      <div className={cn("container mx-auto px-4", containerClassName)}>
        {children}
      </div>
    </section>
  );
};

export default Section;