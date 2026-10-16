import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Mountain, Pickaxe, Gem, HardHat, ArrowRight, Heart } from "lucide-react";
import CheckoutModal from "./CheckoutModal";
import { SponsorModal } from "./SponsorModal";
import seminLogoWhite from "@/assets/logo branca semin site.png";

const Counter = ({ end, label, prefix = "", suffix = "" }: { end: number; label: string; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return end;
    }
    return 0;
  });
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let current = 0;
          const step = Math.max(1, Math.floor(end / 40));
          const interval = setInterval(() => {
            current += step;
            if (current >= end) {
              current = end;
              clearInterval(interval);
            }
            setCount(current);
          }, 40);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
      <span className="text-lg sm:text-xl md:text-2xl font-display font-extrabold text-semin-yellow drop-shadow-sm leading-none">
        {prefix}{count}{suffix}
      </span>
      <span className="text-white/70 font-body text-[10px] sm:text-xs md:text-sm font-medium tracking-wide">
        {label}
      </span>
    </div>
  );
};

const PilaoIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Caixa do explodidor */}
    <rect x="6" y="10" width="12" height="12" rx="1.5" strokeWidth="1.5" />
    {/* Haste do pilão */}
    <path d="M12 10V2" strokeWidth="2" />
    {/* Alça/T-bar */}
    <path d="M8 2h8" strokeWidth="2.5" />
    {/* Terminais e fio */}
    <circle cx="10" cy="14" r="1" fill="currentColor" />
    <circle cx="14" cy="14" r="1" fill="currentColor" />
    <path d="M14 14c3 0 4 2 4 5s2 3 4 3" strokeWidth="1" strokeDasharray="2 2" />
  </svg>
);
const HeroSection = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] flex flex-col justify-center items-center overflow-hidden bg-semin-dark pt-20 pb-8 sm:pt-24 sm:pb-12 md:pt-24 md:pb-12"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#06080c]">
        {/* Soft, premium unified ambient golden gradient centered behind the content (no harsh splotches) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(210,155,33,0.08)_0%,rgba(215,35,15,0.03)_45%,transparent_75%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(210,155,33,0.1)_0%,transparent_50%)] pointer-events-none" />

        {/* Concentric Golden Orbits / Rings (Astrolabe / Gyroscope Effect) — Ultra Elegant */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] md:w-[850px] h-[350px] sm:h-[550px] md:h-[850px] pointer-events-none select-none opacity-[0.08] sm:opacity-[0.12]">
          {/* Outer Solid Ring */}
          <div className="absolute inset-0 rounded-full border border-semin-yellow animate-[spin_180s_linear_infinite]" />
          
          {/* Middle Dotted Ring (Spinning Counter-Clockwise) */}
          <div className="absolute inset-[8%] rounded-full border border-dashed border-semin-orange/80 animate-[spin_120s_linear_infinite] [animation-direction:reverse]" />
          
          {/* Inner Ring with Double Stroke */}
          <div className="absolute inset-[18%] rounded-full border border-semin-yellow/60 border-double border-[3px] animate-[spin_90s_linear_infinite]" />
          
          {/* Tech Accent Ring (Dashed, Counter-Clockwise) */}
          <div className="absolute inset-[28%] rounded-full border border-dashed border-white/25 animate-[spin_60s_linear_infinite] [animation-direction:reverse]" />

          {/* Core Golden Aura Ring */}
          <div className="absolute inset-[38%] rounded-full border border-semin-yellow/40 shadow-[0_0_50px_rgba(210,155,33,0.15)]" />
        </div>

        {/* Corner ambient glows — extremely soft, large-radius to avoid splotches */}
        <div className="absolute -top-[20%] -left-[10%] w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-semin-yellow/[0.05] rounded-full blur-[100px] md:blur-[180px] pointer-events-none" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-semin-orange/[0.04] rounded-full blur-[100px] md:blur-[180px] pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="animate-fade-in-up opacity-0 [animation-delay:100ms]">
          <div className="relative inline-flex items-center mb-3 sm:mb-4 group cta-float">
            {/* Glow ring outside */}
            <div className="absolute inset-0 bg-gradient-to-r from-semin-orange to-amber-500 opacity-30 blur-xl rounded-full" />
            
            <div className="relative inline-flex items-center gap-1.5 sm:gap-2.5 px-3 py-1 sm:px-6 sm:py-1.5 border border-semin-orange/60 rounded-full bg-semin-dark/95 backdrop-blur-xl shadow-[0_0_20px_rgba(224,115,19,0.25)]">
              <Gem className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-semin-orange drop-shadow-md animate-pulse shrink-0" />
              <span className="bg-gradient-to-r from-semin-orange to-amber-500 bg-clip-text text-transparent font-display text-[9px] sm:text-xs md:text-sm font-extrabold tracking-[0.16em] sm:tracking-[0.25em] uppercase">
                1976 - 2026 • Edição Histórica • 50 Anos
              </span>
              <Gem className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-semin-orange drop-shadow-md shrink-0" />
            </div>
          </div>

          <h1 className="flex flex-col items-center mb-3 sm:mb-4">
            <span className="sr-only">SEMIN UFBA - 50 Anos Jubileu de Ouro</span>
            <div className="relative mx-auto flex justify-center items-center px-2">
              <img 
                src={seminLogoWhite} 
                alt="SEMIN UFBA 2026" 
                className="w-full max-w-[260px] sm:max-w-[380px] md:max-w-[480px] lg:max-w-[560px] h-auto object-contain mx-auto filter drop-shadow-[0_8px_25px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:scale-[1.02]" 
                fetchPriority="high" 
              />
            </div>
          </h1>

          <div className="flex items-center justify-center gap-2.5 mb-2.5 sm:mb-3.5">
            <div className="w-8 md:w-12 h-[1px] bg-gradient-to-r from-transparent via-semin-orange/40 to-semin-orange rounded-full" />
            <Gem className="h-3.5 w-3.5 text-semin-orange drop-shadow-md" />
            <div className="w-8 md:w-12 h-[1px] bg-gradient-to-l from-transparent via-semin-orange/40 to-semin-orange rounded-full" />
          </div>

          <p className="font-body text-xs sm:text-sm md:text-base text-white/80 max-w-2xl mx-auto mb-3.5 sm:mb-4.5 leading-relaxed px-4 font-medium">
            Celebre conosco o marco de <strong>50 anos do curso de Engenharia de Minas</strong>, honrando nossa rica trajetória, unindo gerações de pioneiros e moldando o futuro da nossa profissão.
          </p>

          {/* Contador Regressivo de Escassez / Evento */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 mb-4 sm:mb-5">
            <div className="bg-white/5 border border-semin-yellow/20 backdrop-blur-md px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-center shadow-md">
              <span className="block font-display text-base sm:text-xl md:text-2xl font-black text-semin-yellow leading-tight">09 a 14</span>
              <span className="text-[8px] sm:text-[10px] font-body font-bold text-white/70 uppercase tracking-widest">Novembro 2026</span>
            </div>
            <div className="bg-white/5 border border-semin-orange/20 backdrop-blur-md px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-center shadow-md">
              <span className="block font-display text-base sm:text-xl md:text-2xl font-black text-semin-orange leading-tight">Salvador</span>
              <span className="text-[8px] sm:text-[10px] font-body font-bold text-white/70 uppercase tracking-widest">Escola Politécnica UFBA</span>
            </div>
            <div className="bg-gradient-to-r from-semin-orange/20 to-amber-500/20 border border-semin-orange/40 backdrop-blur-md px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-center shadow-md">
              <span className="block font-display text-base sm:text-xl md:text-2xl font-black text-amber-400 leading-tight">100% Gratuito</span>
              <span className="text-[8px] sm:text-[10px] font-body font-bold text-amber-300 uppercase tracking-widest animate-pulse">Vagas Esgotando</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-5 sm:mb-6 px-4 sm:px-0">
            <Link to="/inscricao" className="relative inline-flex w-full sm:w-auto cta-float cursor-pointer justify-center">
              {/* Glow ring behind CTA */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-semin-yellow via-semin-orange to-semin-yellow opacity-40 blur-md cta-glow" />
              <Button
                size="lg"
                className="cta-shine relative w-full sm:w-auto min-w-[200px] md:min-w-[250px] bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange text-semin-dark hover:from-semin-orange hover:via-amber-500 hover:to-semin-yellow font-display font-bold text-sm sm:text-base px-6 py-3.5 sm:py-5 rounded-xl shadow-xl shadow-semin-yellow/20 transition-all duration-300 hover:shadow-semin-orange/30 active:scale-95 md:hover:scale-105 group cursor-pointer"
              >
                <HardHat className="h-4 w-4 md:h-5 md:w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Inscrição
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>

            <a href="#apoie" className="relative inline-flex w-full sm:w-auto cursor-pointer justify-center">
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-semin-orange/60 via-amber-500/40 to-semin-orange/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Button
                size="lg"
                variant="outline"
                className="relative w-full sm:w-auto min-w-[200px] md:min-w-[250px] border-2 border-semin-orange/50 text-white bg-white/5 hover:bg-semin-orange/20 hover:border-semin-orange font-display font-bold text-sm sm:text-base px-6 py-3.5 sm:py-5 rounded-xl backdrop-blur-md transition-all duration-300 active:scale-95 md:hover:scale-105 group hover:shadow-lg hover:shadow-semin-orange/25"
              >
                <Heart className="h-4 w-4 md:h-5 md:w-5 mr-2 text-semin-orange group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
                Apoie os 50 Anos
              </Button>
            </a>
          </div>

          {/* Alternativas de Apoio e Patrocínio */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 text-xs text-white/50 font-body font-medium mb-6 sm:mb-8 animate-fade-in-up opacity-0 [animation-delay:400ms]">
            <span>Quer apoiar de outras formas?</span>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <button 
                onClick={() => setIsCheckoutOpen(true)}
                className="text-semin-orange hover:text-white underline underline-offset-4 transition-colors font-bold cursor-pointer bg-transparent border-0 p-0"
              >
                Contribua como Pessoa Física
              </button>
              <span className="text-white/25 hidden sm:inline">|</span>
              <SponsorModal>
                <button 
                  className="text-semin-yellow hover:text-white underline underline-offset-4 transition-colors font-bold cursor-pointer bg-transparent border-0 p-0"
                >
                  Patrocine como Empresa
                </button>
              </SponsorModal>
            </div>
          </div>

          <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-5 md:gap-7 bg-white/[0.04] border border-white/10 backdrop-blur-lg px-4 py-2 sm:px-6 sm:py-2 rounded-full max-w-full mx-auto shadow-md">
            <Counter end={50} label="Anos de história" />
            <div className="hidden sm:block w-px h-4 bg-white/15" />
            <Counter end={120} label="Vagas confirmadas" prefix="+" />
            <div className="hidden sm:block w-px h-4 bg-white/15" />
            <Counter end={10} label="Empresas parceiras" suffix="+" />
          </div>
        </div>

        <a
          href="#sobre"
          className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 text-white/30 hover:text-semin-yellow transition-colors animate-bounce p-1"
        >
          <ChevronDown className="h-5 w-5 md:h-6 md:w-6" />
        </a>
      </div>
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </section>
  );
};

export default HeroSection;
