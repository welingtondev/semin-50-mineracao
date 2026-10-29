import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ResetPasswordModal } from "@/components/ResetPasswordModal";
import Index from "./pages/Index";

// Lazy-load heavy pages to reduce initial bundle (~253 KiB savings)
const QuizPage = React.lazy(() => import("./pages/Quiz"));
const AdminGallery = React.lazy(() => import("./pages/AdminGallery"));
const ThankYouPage = React.lazy(() => import("./pages/ThankYou"));
const InscricaoPage = React.lazy(() => import("./pages/Inscricao"));
const EncontroEngenheirosPage = React.lazy(() => import("./pages/EncontroEngenheiros"));
const CredenciamentoFestaPage = React.lazy(() => import("./pages/CredenciamentoFesta"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ResetPasswordModal />
        <BrowserRouter>
          <Suspense fallback={<div style={{minHeight:'100vh',background:'#161b22'}} />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/inscricao" element={<InscricaoPage />} />
              <Route path="/inscricoes" element={<InscricaoPage />} />
              {/* Páginas exclusivas do 16º Encontro dos Engenheiros de Minas (apenas quem tem o link direto) */}
              <Route path="/16-encontro-engenheiros-minas" element={<EncontroEngenheirosPage />} />
              <Route path="/encontro-engenheiros" element={<EncontroEngenheirosPage />} />
              <Route path="/credenciamento-festa" element={<CredenciamentoFestaPage />} />
              <Route path="/validador" element={<CredenciamentoFestaPage />} />
              <Route path="/desafio-semin" element={<QuizPage />} />
              <Route path="/admin" element={<AdminGallery />} />
              <Route path="/obrigado" element={<ThankYouPage />} />
              <Route path="/patrocinio" element={<Navigate to="/" replace />} />
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