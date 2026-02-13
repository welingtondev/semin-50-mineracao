import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ScheduleSection from "@/components/ScheduleSection";
import SpeakersSection from "@/components/SpeakersSection";
import GallerySection from "@/components/GallerySection";
import SponsorsSection from "@/components/SponsorsSection";
import SponsorLogosSection from "@/components/SponsorLogosSection";
import RegistrationSection from "@/components/RegistrationSection";
import SupportSection from "@/components/SupportSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ScheduleSection />
      <SpeakersSection />
      <GallerySection />
      <SponsorsSection />
      <SponsorLogosSection />
      <RegistrationSection />
      <SupportSection />
      <Footer />
    </div>
  );
};

export default Index;
