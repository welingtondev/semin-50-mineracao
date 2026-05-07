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

// Component that delays rendering its children until it enters the viewport
const ScrollTriggeredSuspense = ({ children, fallbackBg = "transparent", minHeight = "40vh" }: { children: React.ReactNode, fallbackBg?: string, minHeight?: string }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      { rootMargin: "600px" } // Load when within 600px of viewport
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: shouldLoad ? "auto" : minHeight, background: fallbackBg }}>
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
      
      {/* First fold — loads immediately after hero since it's likely in or near viewport */}
      <ScrollTriggeredSuspense fallbackBg="#F8F9FA">
        <AboutSection />
      </ScrollTriggeredSuspense>

      <ScrollTriggeredSuspense>
        <ShortRegistrationBanner />
      </ScrollTriggeredSuspense>

      <ScrollTriggeredSuspense fallbackBg="#06080c">
        <DocumentarySection />
      </ScrollTriggeredSuspense>

      <ScrollTriggeredSuspense>
        <JubileeSection />
        <LegacySection />
      </ScrollTriggeredSuspense>

      <div className="w-full h-px bg-[linear-gradient(90deg,#06080c_0%,#06080c_35%,#d29b21_50%,#06080c_65%,#06080c_100%)] opacity-80" />

      {/* Heavy sections — isolated Suspense so they load independently on scroll */}
      <ScrollTriggeredSuspense fallbackBg="#0a0c12" minHeight="100vh">
        <GallerySection />
      </ScrollTriggeredSuspense>

      <ScrollTriggeredSuspense fallbackBg="#F8F9FA">
        <PastEditionSection />
      </ScrollTriggeredSuspense>

      <ScrollTriggeredSuspense>
        <ChallengeSection />
        <RegistrationSection />
        <ScheduleSection />
      </ScrollTriggeredSuspense>

      <ScrollTriggeredSuspense fallbackBg="#F8F9FA">
        <SponsorsSection />
        <CrowdfundingSection />
        <SponsorLogosSection />
        <SupportSection />
      </ScrollTriggeredSuspense>
      
      <Footer />

      {/* Global popups — load them globally after a delay so they don't block main thread */}
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
