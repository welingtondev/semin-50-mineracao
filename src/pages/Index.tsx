import React, { Suspense, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";

// Lazy-loaded components
const NewsletterPopup = React.lazy(() => import("@/components/NewsletterPopup").then(module => ({ default: module.NewsletterPopup })));
const WhatsAppPopup = React.lazy(() => import("@/components/WhatsAppPopup").then(module => ({ default: module.WhatsAppPopup })));
const AboutSection = React.lazy(() => import("@/components/AboutSection"));
const ScheduleSection = React.lazy(() => import("@/components/ScheduleSection"));
const ChallengeSection = React.lazy(() => import("@/components/ChallengeSection"));
const ShortRegistrationBanner = React.lazy(() => import("@/components/ShortRegistrationBanner"));
const JubileeSection = React.lazy(() => import("@/components/JubileeSection"));
const SpeakersSection = React.lazy(() => import("@/components/SpeakersSection"));
const GallerySection = React.lazy(() => import("@/components/GallerySection"));
const PastEditionSection = React.lazy(() => import("@/components/PastEditionSection"));
const LegacySection = React.lazy(() => import("@/components/LegacySection"));
const DocumentarySection = React.lazy(() => import("@/components/DocumentarySection"));
const SponsorsSection = React.lazy(() => import("@/components/SponsorsSection"));
const SponsorLogosSection = React.lazy(() => import("@/components/SponsorLogosSection"));
const RegistrationSection = React.lazy(() => import("@/components/RegistrationSection"));
const CrowdfundingSection = React.lazy(() => import("@/components/CrowdfundingSection"));
const SupportSection = React.lazy(() => import("@/components/SupportSection"));
const EngineerDaySection = React.lazy(() => import("@/components/EngineerDaySection"));

const Index = () => {
  const [loadPopups, setLoadPopups] = useState(false);

  useEffect(() => {
    // Handle initial hash in URL if present
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 350);
    }

    const timer = setTimeout(() => {
      setLoadPopups(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfaf5]">
      <Navbar />
      <HeroSection />
      
      {/* 1. Visão Geral & Proposta do Evento (#sobre) */}
      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <AboutSection />
      </Suspense>

      {/* 2. História, Orgulho & Legado dos 50 Anos (#jubileu & #legado) */}
      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <JubileeSection />
        <LegacySection />
      </Suspense>

      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <DocumentarySection />
      </Suspense>

      {/* 3. Programação Oficial & 4 Grandes Painéis (#programacao) */}
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <ScheduleSection />
      </Suspense>

      {/* 4. Inscrição (#inscricao / #inscricoes) */}
      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <div id="inscricao">
          <RegistrationSection />
        </div>
        <ShortRegistrationBanner />
      </Suspense>

      {/* 5. Apoie / Crowdfunding (#apoie) */}
      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <CrowdfundingSection />
      </Suspense>

      {/* 6. Desafio SEMIN & Dia do Engenheiro (#desafio) */}
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <ChallengeSection />
        <EngineerDaySection />
      </Suspense>

      <div className="w-full h-px bg-[linear-gradient(90deg,#06080c_0%,#06080c_35%,#d29b21_50%,#06080c_65%,#06080c_100%)] opacity-80" />

      {/* 7. Prova Social & Galeria (#galeria & #ultima-edicao) */}
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <PastEditionSection />
        <GallerySection />
      </Suspense>

      {/* 8. Cotas de Patrocínio & Parceiros (#parceiros & #cotas) */}
      <Suspense fallback={<div className="min-h-[40vh]" />}>
        {/* <SponsorsSection /> */}
        <SponsorLogosSection />
        <SupportSection />
      </Suspense>
      
      <Footer />

      {/* Global popups */}
      {loadPopups && (
        <Suspense fallback={null}>
          <NewsletterPopup />
          <WhatsAppPopup />
        </Suspense>
      )}
    </div>
  );
};

export default Index;