import React, { Suspense, useState, useEffect, useRef } from "react";
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

// Component that delays rendering its children until it enters the viewport
const ScrollTriggeredSuspense = ({ children, fallbackBg = "transparent", minHeight = "40vh", id }: { children: React.ReactNode, fallbackBg?: string, minHeight?: string, id?: string }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If hash matches this id, load immediately
    if (id && window.location.hash === `#${id}`) {
      setShouldLoad(true);
      return;
    }

    // Se o navegador não suportar IntersectionObserver, carrega imediatamente
    if (!window.IntersectionObserver) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect(); // Only need to trigger once
        }
      },
      { rootMargin: "300px" } // Load when within 300px of viewport
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const handleHashChange = () => {
      if (window.location.hash === `#${id}`) {
        setShouldLoad(true);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [id]);

  return (
    <div id={id} ref={ref} style={{ minHeight: shouldLoad ? "auto" : minHeight, background: fallbackBg }}>
      {shouldLoad ? (
        <Suspense fallback={<div style={{ minHeight, background: fallbackBg }} />}>
          {children}
        </Suspense>
      ) : null}
    </div>
  );
};

const Index = () => {
  const [loadPopups, setLoadPopups] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadPopups(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      {/* 1. Visão Geral & Proposta do Evento */}
      <ScrollTriggeredSuspense fallbackBg="#F8F9FA">
        <AboutSection />
      </ScrollTriggeredSuspense>

      {/* 2. História, Orgulho & Legado dos 50 Anos (Construção de Valor Emocional) */}
      <ScrollTriggeredSuspense>
        <JubileeSection />
        <LegacySection />
      </ScrollTriggeredSuspense>

      <ScrollTriggeredSuspense fallbackBg="#06080c">
        <DocumentarySection />
      </ScrollTriggeredSuspense>

      {/* 3. O que o participante vai viver (Programação & Inscrição Principal) */}
      <ScrollTriggeredSuspense id="programacao">
        <ScheduleSection />
      </ScrollTriggeredSuspense>

      <ScrollTriggeredSuspense id="inscricao">
        <RegistrationSection />
      </ScrollTriggeredSuspense>

      <ScrollTriggeredSuspense>
        <ShortRegistrationBanner />
      </ScrollTriggeredSuspense>

      {/* 4. Apoie / Contribua (Doação & Vaquinha no auge da inspiração) */}
      <ScrollTriggeredSuspense id="apoie" fallbackBg="#F8F9FA">
        <CrowdfundingSection />
      </ScrollTriggeredSuspense>

      {/* 5. Engajamento Adicional (Desafio & Dia do Engenheiro) */}
      <ScrollTriggeredSuspense>
        <ChallengeSection />
      </ScrollTriggeredSuspense>

      <ScrollTriggeredSuspense fallbackBg="#06080c">
        <EngineerDaySection />
      </ScrollTriggeredSuspense>

      <div className="w-full h-px bg-[linear-gradient(90deg,#06080c_0%,#06080c_35%,#d29b21_50%,#06080c_65%,#06080c_100%)] opacity-80" />

      {/* 6. Prova Social (Edições Anteriores & Galeria) */}
      <ScrollTriggeredSuspense fallbackBg="#F8F9FA">
        <PastEditionSection />
      </ScrollTriggeredSuspense>

      <ScrollTriggeredSuspense fallbackBg="#0a0c12" minHeight="100vh">
        <GallerySection />
      </ScrollTriggeredSuspense>

      {/* 7. Patrocinadores & Realização/Comissão */}
      <ScrollTriggeredSuspense id="parceiros" fallbackBg="#F8F9FA">
        <SponsorLogosSection />
      </ScrollTriggeredSuspense>

      <ScrollTriggeredSuspense fallbackBg="#F8F9FA">
        <SupportSection />
      </ScrollTriggeredSuspense>
      
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
