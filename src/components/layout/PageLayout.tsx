import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
}

const PageLayout = ({
  children,
  showNavigation = true,
  showFooter = true
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showNavigation && <Navigation />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

export default PageLayout;