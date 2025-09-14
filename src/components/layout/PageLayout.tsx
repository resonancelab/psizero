import Navigation from "@/components/Navigation";

interface PageLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const PageLayout = ({ children, showNavigation = true }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {showNavigation && <Navigation />}
      <main>{children}</main>
    </div>
  );
};

export default PageLayout;