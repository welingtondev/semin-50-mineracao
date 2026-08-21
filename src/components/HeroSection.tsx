import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Mountain, Pickaxe, Gem, HardHat, ArrowRight, Heart } from "lucide-react";
import CheckoutModal from "./CheckoutModal";
import { SponsorModal } from "./SponsorModal";


// Lazy-load modal components — they are only needed on button click
const RegistrationModal = lazy(() => import("./RegistrationModal").then(m => ({ default: m.RegistrationModal })));

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
    <div ref={ref} className="text-center">
      <div className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold text-semin-yellow drop-shadow-[0_0_20px_rgba(210,155,33,0.3)]">
        {prefix}{count}{suffix}
      </div>
      <div className="text-white/50 font-body text-[9px] sm:text-xs md:text-sm mt-1 md:mt-2 tracking-wider uppercase">{label}</div>
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
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-semin-dark"
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

      <div className="container mx-auto px-4 relative z-10 text-center -mt-10 sm:mt-16 md:mt-24">
        <div className="animate-fade-in-up opacity-0 [animation-delay:100ms]">
          <div className="relative inline-flex items-center mb-8 md:mb-12 group cta-float">
            {/* Glow ring outsite */}
            <div className="absolute inset-0 bg-gradient-to-r from-semin-orange to-amber-500 opacity-30 blur-2xl rounded-full" />
            
            <div className="relative inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-10 md:py-4 border-2 border-semin-orange/60 rounded-full bg-semin-dark/95 backdrop-blur-xl shadow-[0_0_30px_rgba(224,115,19,0.25)]">
              <Gem className="h-4 w-4 md:h-5 md:w-5 text-semin-orange drop-shadow-md animate-pulse" />
              <span className="bg-gradient-to-r from-semin-orange to-amber-500 bg-clip-text text-transparent font-display text-xs sm:text-sm font-extrabold tracking-[0.25em] sm:tracking-[0.3em] uppercase">
                1976 - 2026 • Edição Histórica • 50 Anos
              </span>
              <Gem className="h-4 w-4 md:h-5 md:w-5 text-semin-orange drop-shadow-md" />
            </div>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black mb-4 md:mb-6 leading-tight tracking-tighter">
            <span className="text-golden-mirror filter drop-shadow-[0_0_15px_rgba(210,155,33,0.4)] block mb-1">
              SEMIN UFBA
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-wide bg-gradient-to-r from-semin-orange to-amber-500 bg-clip-text text-transparent font-extrabold drop-shadow-sm mt-3">
              50 Anos • Jubileu de Ouro
            </span>
            <span className="block text-xs sm:text-sm md:text-base font-semibold mt-4 tracking-widest text-white/50 uppercase">
              Edição Histórica • Semana de Mineração da UFBA
            </span>
          </h1>

          <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
            <div className="w-10 md:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-semin-orange/40 to-semin-orange rounded-full" />
            <Gem className="h-4 w-4 text-semin-orange drop-shadow-md" />
            <div className="w-10 md:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-semin-orange/40 to-semin-orange rounded-full" />
          </div>

          <p className="font-body text-sm sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-4xl mx-auto mb-8 md:mb-12 leading-relaxed px-4 font-medium">
            Celebre conosco o marco de <strong>50 anos do curso de Engenharia de Minas</strong>, honrando nossa rica trajetória, unindo gerações de pioneiros e moldando o futuro da nossa profissão.
          </p>

          {/* Contador Regressivo de Escassez / Evento */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-8 md:mb-12">
            <div className="bg-white/5 border border-semin-yellow/20 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-3 rounded-2xl text-center shadow-lg">
              <span className="block font-display text-2xl sm:text-4xl font-black text-semin-yellow">09 a 13</span>
              <span className="text-[10px] sm:text-xs font-body font-bold text-white/70 uppercase tracking-widest">Novembro 2026</span>
            </div>
            <div className="bg-white/5 border border-semin-orange/20 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-3 rounded-2xl text-center shadow-lg">
              <span className="block font-display text-2xl sm:text-4xl font-black text-semin-orange">Salvador</span>
              <span className="text-[10px] sm:text-xs font-body font-bold text-white/70 uppercase tracking-widest">Escola Politécnica UFBA</span>
            </div>
            <div className="bg-gradient-to-r from-semin-orange/20 to-amber-500/20 border border-semin-orange/40 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-3 rounded-2xl text-center shadow-lg">
              <span className="block font-display text-2xl sm:text-4xl font-black text-amber-400">100% Gratuito</span>
              <span className="text-[10px] sm:text-xs font-body font-bold text-amber-300 uppercase tracking-widest animate-pulse">Vagas Esgotando</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 mb-14 md:mb-16 px-4 sm:px-0">
            <Suspense fallback={null}>
              <RegistrationModal>
                <div className="relative inline-flex w-auto sm:w-auto cta-float cursor-pointer">
                  {/* Glow ring behind CTA */}
                  <div className="absolute -inset-1 md:-inset-1.5 rounded-2xl bg-gradient-to-r from-semin-yellow via-semin-orange to-semin-yellow opacity-40 blur-md cta-glow" />
                  <Button
                    size="lg"
                    className="cta-shine relative w-auto min-w-[240px] sm:w-auto md:w-[320px] bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange text-semin-dark hover:from-semin-orange hover:via-amber-500 hover:to-semin-yellow font-display font-bold text-sm md:text-lg px-8 py-4 md:py-8 rounded-2xl shadow-2xl shadow-semin-yellow/20 transition-all duration-300 hover:shadow-semin-orange/30 active:scale-95 md:hover:scale-105 group"
                  >
                    <HardHat className="h-4 w-4 md:h-6 md:w-6 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Garantir Minha Vaga
                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </RegistrationModal>
            </Suspense>

            <a href="#apoie" className="relative inline-flex w-auto sm:w-auto cursor-pointer">
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-semin-orange/60 via-amber-500/40 to-semin-orange/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Button
                size="lg"
                variant="outline"
                className="relative w-auto min-w-[240px] sm:w-auto md:w-[320px] border-2 border-semin-orange/40 text-black hover:bg-semin-orange/20 hover:border-semin-orange font-display font-bold text-sm md:text-lg px-8 py-4 md:py-8 rounded-2xl backdrop-blur-md transition-all duration-300 active:scale-95 md:hover:scale-105 group hover:shadow-lg hover:shadow-semin-orange/25"
              >
                <Heart className="h-4 w-4 md:h-6 md:w-6 mr-2 text-semin-orange group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
                Apoie os 50 Anos
              </Button>
            </a>
          </div>

          {/* Alternativas de Apoio e Patrocínio */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs md:text-sm text-white/50 font-body font-medium mb-12 animate-fade-in-up opacity-0 [animation-delay:400ms]">
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

          <div className="flex justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-24 bg-white/5 border border-white/10 backdrop-blur-xl p-6 md:p-8 rounded-3xl max-w-4xl mx-auto shadow-2xl">
            <Counter end={50} label="Anos de história" />
            <Counter end={5} label="Dias de imersão" />
            <Counter end={120} label="Vagas confirmadas" prefix="+" />
            <Counter end={10} label="Empresas parceiras" suffix="+" />
          </div>
        </div>

        <a
          href="#sobre"
          className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 text-white/30 hover:text-semin-yellow transition-colors animate-bounce p-2"
        >
          <ChevronDown className="h-6 w-6 md:h-8 md:w-8" />
        </a>
      </div>
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </section>
  );
};

export default HeroSection;
