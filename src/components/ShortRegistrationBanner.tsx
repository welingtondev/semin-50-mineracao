import { Button } from "@/components/ui/button";
import { ArrowRight, HardHat, Heart, MapPin, Calendar, ExternalLink } from "lucide-react";
import { RegistrationModal } from "./RegistrationModal";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ShortRegistrationBanner = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative py-12 md:py-16 bg-semin-yellow overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "radial-gradient(#000 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      
      {/* Dynamic diagonal cuts */}
      <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/20 to-transparent" />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className={`bg-white/20 backdrop-blur-lg border border-white/30 rounded-[2rem] p-8 md:p-12 shadow-2xl transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
            
            <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/10 border border-black/5 text-semin-dark text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                <Heart className="w-4 h-4 text-red-600" fill="currentColor" />
                Edição Histórica • 50 Anos
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-semin-dark tracking-tight">
                O maior encontro da <span className="text-white drop-shadow-md">nossa história</span> está chegando
              </h2>
              <div className="font-body text-semin-dark/80 font-medium text-base md:text-lg max-w-2xl leading-relaxed mb-6">
                <p className="mb-4">Onde cada trajetória é o estopim de um futuro brilhante. Inscreva-se agora para garantir sua cadeira no evento que marca o meio século da Engenharia de Minas UFBA.</p>
                
                <div className="bg-black/5 border border-black/5 rounded-2xl p-5 md:p-6 mb-4">
                  <p className="text-semin-dark font-bold text-sm md:text-base leading-relaxed">
                    Compromisso Social: <span className="font-medium opacity-90">O seu ingresso é o seu gesto de solidariedade. Realize seu cadastro agora e lembre-se de entregar sua doação de 1kg de alimento fisicamente no balcão de credenciamento.</span>
                  </p>
                </div>

                <p className="font-bold text-semin-dark leading-relaxed">
                  Juntos, vamos bater a meta de arrecadação para o{" "}
                  <a 
                    href="https://investidoresdaesperanca.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white underline underline-offset-4 transition-colors"
                  >
                    <span className="whitespace-nowrap">Instituto IDE</span>
                  </a>!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-8 pt-4 border-t border-black/10 w-full">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-semin-dark" />
                  <span className="font-sans text-sm font-semibold text-semin-dark">Auditório Leopoldo Amaral - UFBA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-semin-dark" />
                  <span className="font-sans text-sm font-semibold text-semin-dark">09 a 12 de Nov 2026</span>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 w-full lg:w-auto flex justify-center">
              <RegistrationModal>
                <Button
                  size="lg"
                  className="bg-semin-dark text-white hover:bg-black font-display font-bold text-lg px-10 py-8 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all duration-300 active:scale-95 hover:scale-105 hover:shadow-[0_15px_50px_rgba(0,0,0,0.4)] w-full sm:w-auto relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  <HardHat className="h-6 w-6 mr-3 text-semin-yellow" />
                  Garantir Entrada Solidária
                  <ArrowRight className="ml-3 h-5 w-5 text-semin-yellow group-hover:translate-x-1 transition-transform" />
                </Button>
              </RegistrationModal>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ShortRegistrationBanner;
