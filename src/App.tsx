import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Docs from "./pages/Docs";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Onboarding from "./pages/Onboarding";
import Account from "./pages/Account";
import Team from "./pages/Team";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";
import Billing from "./pages/Billing";
import Plans from "./pages/Plans";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import InvoiceDetails from "./pages/InvoiceDetails";
import GettingStarted from "./pages/GettingStarted";
import Status from "./pages/Status";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Changelog from "./pages/Changelog";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Examples from "./pages/Examples";
import Demos from "./pages/Demos";
import Patents from "./pages/Patents";
import Tutorials from "./pages/Tutorials";
import Playground from "./pages/Playground";
import SDKs from "./pages/SDKs";
import APIs from "./pages/APIs";
import SRS from "./pages/SRS";
import QSEM from "./pages/QSEM";
import HQE from "./pages/HQE";
import NLC from "./pages/NLC";
import QCR from "./pages/QCR";
import IChing from "./pages/IChing";
import UnifiedPhysics from "./pages/UnifiedPhysics";
import RNET from "./pages/RNET";
import MultiApiDemo from "./pages/MultiApiDemo";
import Webhooks from "./pages/Webhooks";
import Admin from "./pages/Admin";
import PricingAdmin from "./pages/PricingAdmin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ThemeManagement from "./pages/admin/ThemeManagement";
import Organizations from "./pages/Organizations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <OrganizationProvider>
          <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Authentication Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/onboarding" element={<Onboarding />} />
            
            {/* Account Management Routes */}
            <Route path="/account" element={<Account />} />
            <Route path="/organizations" element={
              <ProtectedRoute>
                <Organizations />
              </ProtectedRoute>
            } />
            <Route path="/team" element={<Team />} />
            <Route path="/security" element={<Security />} />
            
            {/* Billing & Subscription Routes */}
            <Route path="/billing" element={<Billing />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failed" element={<PaymentFailed />} />
            <Route path="/invoices/:id" element={<InvoiceDetails />} />
            
            {/* Support & Resources Routes */}
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/status" element={<Status />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/changelog" element={<Changelog />} />
            
            {/* Legal & Compliance Routes */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            
            {/* Developer Resources Routes */}
            <Route path="/examples" element={<Examples />} />
            <Route path="/demos" element={<Demos />} />
            <Route path="/patents" element={<Patents />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/sdks" element={<SDKs />} />
            
            {/* API Documentation Routes */}
            <Route path="/apis" element={<APIs />} />
            <Route path="/apis/srs" element={<SRS />} />
            <Route path="/apis/hqe" element={<HQE />} />
            <Route path="/apis/qsem" element={<QSEM />} />
            <Route path="/apis/nlc" element={<NLC />} />
            <Route path="/apis/qcr" element={<QCR />} />
            <Route path="/apis/iching" element={<IChing />} />
            <Route path="/apis/unified" element={<UnifiedPhysics />} />
            <Route path="/apis/rnet" element={<RNET />} />
            <Route path="/multi-api-demo" element={<MultiApiDemo />} />
            <Route path="/webhooks" element={<Webhooks />} />
            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
            <Route path="/admin/themes" element={<AdminLayout><ThemeManagement /></AdminLayout>} />
            <Route path="/admin/pricing" element={<AdminLayout><PricingAdmin /></AdminLayout>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
        </OrganizationProvider>
      </AuthProvider>
    </ThemeProvider>
</QueryClientProvider>
);

export default App;
