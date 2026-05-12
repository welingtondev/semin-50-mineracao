import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";

// Lazy-load heavy pages to reduce initial bundle (~253 KiB savings)
const QuizPage = React.lazy(() => import("./pages/Quiz"));
const AdminGallery = React.lazy(() => import("./pages/AdminGallery"));
const ThankYouPage = React.lazy(() => import("./pages/ThankYou"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div style={{minHeight:'100vh',background:'#161b22'}} />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/admin" element={<AdminGallery />} />
              <Route path="/obrigado" element={<ThankYouPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

