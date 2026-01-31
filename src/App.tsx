import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Contact from "./pages/Contact";

// Dashboard
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Students from "./pages/dashboard/Students";
import Teachers from "./pages/dashboard/Teachers";
import Parents from "./pages/dashboard/Parents";
import Classes from "./pages/dashboard/Classes";
import Finance from "./pages/dashboard/Finance";
import Events from "./pages/dashboard/Events";
import Settings from "./pages/dashboard/Settings";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="parents" element={<Parents />} />
            <Route path="classes" element={<Classes />} />
            <Route path="finance" element={<Finance />} />
            <Route path="events" element={<Events />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
