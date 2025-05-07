// app.tsx
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

const GoogleTranslateLoader = () => {
  useEffect(() => {
    if (window.google?.translate) return;

    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,ur,bn,ta,te,mr,gu,kn,ml,pa',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      );
    };

    return () => {
      const script = document.querySelector('script[src*="translate.google.com"]');
      if (script) document.head.removeChild(script);
    };
  }, []);

  return null;
};

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
          <GoogleTranslateLoader />
          <div id="google_translate_element" className="fixed bottom-4 right-4 z-[9999] opacity-0 h-0 w-0 overflow-hidden"></div>
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
