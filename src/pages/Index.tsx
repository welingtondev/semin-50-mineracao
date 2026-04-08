import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { WhatsAppPopup } from "@/components/WhatsAppPopup";

// Lazy loading the sections below the fold for better performance
const AboutSection = React.lazy(() => import("@/components/AboutSection"));
const ScheduleSection = React.lazy(() => import("@/components/ScheduleSection"));
const JubileeSection = React.lazy(() => import("@/components/JubileeSection"));
const SpeakersSection = React.lazy(() => import("@/components/SpeakersSection"));
const GallerySection = React.lazy(() => import("@/components/GallerySection"));
const SponsorsSection = React.lazy(() => import("@/components/SponsorsSection"));
const SponsorLogosSection = React.lazy(() => import("@/components/SponsorLogosSection"));
const RegistrationSection = React.lazy(() => import("@/components/RegistrationSection"));
const SupportSection = React.lazy(() => import("@/components/SupportSection"));

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      <Suspense fallback={<div className="h-32 flex items-center justify-center text-white/50">Carregando...</div>}>
        <AboutSection />
        <JubileeSection />
        <SpeakersSection />
        <ScheduleSection />
        <GallerySection />
        <SupportSection />
        <RegistrationSection />
        <SponsorLogosSection />
        <SponsorsSection />
      </Suspense>
      
      <Footer />
      {/* Global popups */}
      <NewsletterPopup />
      <WhatsAppPopup />
    </div>
  );
};

export default Index;
