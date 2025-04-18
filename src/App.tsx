
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DiabetesAssessment from "./pages/DiabetesAssessment";
import HeartDiseaseAssessment from "./pages/HeartDiseaseAssessment";
import ParkinsonsAssessment from "./pages/ParkinsonsAssessment";
import Reports from "./pages/Reports";

const queryClient = new QueryClient();

// ScrollToTop component that will execute on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/diabetes" element={<DiabetesAssessment />} />
              <Route path="/heart-disease" element={<HeartDiseaseAssessment />} />
              <Route path="/parkinsons" element={<ParkinsonsAssessment />} />
              <Route path="/reports" element={<Reports />} />
              {/* Add specific routes for each assessment report type */}
              <Route path="/reports/diabetes" element={<Navigate to="/reports?type=diabetes" replace />} />
              <Route path="/reports/heart-disease" element={<Navigate to="/reports?type=heartDisease" replace />} />
              <Route path="/reports/parkinsons" element={<Navigate to="/reports?type=parkinsons" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
