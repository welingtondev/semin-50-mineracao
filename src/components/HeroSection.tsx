import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Mountain, Pickaxe, Gem, HardHat, ArrowRight } from "lucide-react";


// Lazy-load modal components — they are only needed on button click
const RegistrationModal = lazy(() => import("./RegistrationModal").then(m => ({ default: m.RegistrationModal })));
const SponsorModal = lazy(() => import("./SponsorModal").then(m => ({ default: m.SponsorModal })));

const Counter = ({ end, label, suffix = "" }: { end: number; label: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
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
        {count}{suffix}
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
  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-semin-dark"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <svg className="absolute bottom-0 left-0 w-full h-28 sm:h-40 md:h-64 opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="hsl(40 73% 48%)" d="M0,192L60,181.3C120,171,240,149,360,160C480,171,600,213,720,218.7C840,224,960,192,1080,181.3C1200,171,1320,181,1380,186.7L1440,192L1440,320L0,320Z" />
        </svg>
        <svg className="absolute bottom-0 left-0 w-full h-32 md:h-48 opacity-5" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="hsl(30 100% 38%)" d="M0,256L80,234.7C160,213,320,171,480,165.3C640,160,800,192,960,202.7C1120,213,1280,203,1360,197.3L1440,192L1440,320L0,320Z" />
        </svg>

        {/* Soft, premium unified ambient golden gradient centered behind the content (no harsh splotches) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(210,155,33,0.06)_0%,rgba(215,35,15,0.02)_40%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(210,155,33,0.08)_0%,transparent_50%)] pointer-events-none" />

        {/* Corner ambient glows — extremely soft, large-radius to avoid splotches */}
        <div className="absolute -top-[20%] -left-[10%] w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-semin-yellow/[0.04] rounded-full blur-[100px] md:blur-[180px] pointer-events-none" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-semin-orange/[0.03] rounded-full blur-[100px] md:blur-[180px] pointer-events-none" />

        <div className="absolute inset-0 opacity-[0.05] sm:opacity-[0.06]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='240' height='160' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23d29b21' stroke-width='1.5'%3E%3Cpath d='M0 40 L240 40 M0 120 L240 120' stroke-opacity='0.25'/%3E%3Cpath d='M60 40 L180 120 M180 40 L240 80 M0 80 L60 120' stroke-opacity='0.35' stroke-dasharray='12 8'/%3E%3Cg stroke-opacity='0.5'%3E%3Ccircle cx='60' cy='40' r='8'/%3E%3Ccircle cx='180' cy='40' r='8'/%3E%3Ccircle cx='60' cy='120' r='8'/%3E%3Ccircle cx='180' cy='120' r='8'/%3E%3C/g%3E%3Cg stroke='none' fill='%23d29b21' fill-opacity='0.8'%3E%3Ccircle cx='60' cy='40' r='3.5'/%3E%3Ccircle cx='180' cy='40' r='3.5'/%3E%3Ccircle cx='60' cy='120' r='3.5'/%3E%3Ccircle cx='180' cy='120' r='3.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '360px 240px'
        }} />

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

        <Mountain className="absolute top-[18%] left-[8%] h-6 w-6 md:h-8 md:w-8 text-semin-yellow/10 hidden sm:block" />
        <Pickaxe className="absolute top-[12%] right-[12%] h-5 w-5 md:h-7 md:w-7 text-semin-yellow/8 hidden sm:block" />
        <Gem className="absolute bottom-[25%] right-[8%] h-6 w-6 md:h-9 md:w-9 text-semin-orange/8 hidden sm:block" />
        <HardHat className="absolute bottom-[30%] left-[15%] h-5 w-5 md:h-6 md:w-6 text-semin-yellow/8 hidden sm:block" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center -mt-10 sm:mt-16 md:mt-24">
        <div className="animate-fade-in-up opacity-0 [animation-delay:100ms]">
          <div className="relative inline-flex items-center mb-8 md:mb-10 group cta-float">
            {/* Glow ring outsite */}
            <div className="absolute inset-0 bg-gradient-to-r from-semin-yellow via-semin-orange to-semin-yellow opacity-40 blur-xl rounded-full" />
            
            <div className="relative inline-flex items-center gap-2 md:gap-3 px-5 py-2.5 md:px-8 md:py-3.5 border-2 border-semin-yellow/60 rounded-full bg-semin-dark/80 backdrop-blur-xl shadow-[0_0_20px_rgba(210,155,33,0.4)]">
              <Pickaxe className="h-4 w-4 md:h-5 md:w-5 text-semin-yellow drop-shadow-md" />
              <span className="bg-gradient-to-r from-semin-yellow via-amber-300 to-semin-orange bg-clip-text text-transparent font-display text-xs sm:text-sm font-black tracking-[0.2em] sm:tracking-[0.25em] uppercase">
                Edição Histórica • 50 Anos
              </span>
              <Gem className="h-4 w-4 md:h-5 md:w-5 text-semin-yellow drop-shadow-md" />
            </div>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black mb-4 md:mb-6 leading-tight tracking-tighter">
            <span className="text-golden-mirror filter drop-shadow-[0_0_15px_rgba(210,155,33,0.4)]">
              SEMIN UFBA
            </span>
            <span className="block text-lg sm:text-2xl md:text-3xl lg:text-4xl font-medium mt-2 md:mt-4 tracking-wider bg-gradient-to-r from-white/60 via-white to-white/60 bg-clip-text text-transparent drop-shadow-sm">
              Semana de Mineração da UFBA
            </span>
          </h1>

          <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <PilaoIcon className="h-5 w-5 md:h-6 md:w-6 text-semin-yellow/60" />
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>

          <p className="font-body text-sm sm:text-lg md:text-xl lg:text-[24px] text-white/75 sm:text-white/50 max-w-4xl mx-auto mb-8 md:mb-12 leading-relaxed px-4">
            Celebrando 50 anos de excelência na Engenharia de Minas da UFBA — unindo tradição, inovação e o futuro do setor.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 mb-14 md:mb-20 px-4 sm:px-0">
            <Suspense fallback={null}>
              <RegistrationModal>
                <div className="relative inline-flex w-auto sm:w-auto cta-float cursor-pointer">
                  {/* Glow ring behind CTA */}
                  <div className="absolute -inset-1 md:-inset-1.5 rounded-full md:rounded-xl bg-gradient-to-r from-semin-yellow via-semin-orange to-semin-yellow opacity-50 blur-md cta-glow" />
                  <Button
                    size="lg"
                    className="cta-shine relative w-auto min-w-[240px] sm:w-auto md:w-[320px] bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange text-semin-dark hover:from-semin-orange hover:via-amber-500 hover:to-semin-yellow font-display font-bold text-sm md:text-lg px-8 py-4 md:py-8 rounded-full md:rounded-xl shadow-2xl shadow-semin-yellow/30 transition-all duration-300 hover:shadow-semin-yellow/50 active:scale-95 md:hover:scale-105 group"
                  >
                    <HardHat className="h-4 w-4 md:h-6 md:w-6 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Inscreva-se
                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </RegistrationModal>
            </Suspense>
            <Suspense fallback={null}>
              <SponsorModal>
                <div className="relative inline-flex w-auto sm:w-auto cursor-pointer">
                  <div className="absolute -inset-[1px] rounded-full md:rounded-xl bg-gradient-to-r from-semin-yellow/60 via-semin-orange/40 to-semin-yellow/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Button
                    size="lg"
                    variant="outline"
                    className="relative w-auto min-w-[240px] sm:w-auto md:w-[320px] border-2 border-semin-yellow/40 text-semin-yellow hover:bg-semin-yellow/10 hover:border-semin-yellow/80 font-display font-semibold text-sm md:text-lg px-8 py-4 md:py-8 rounded-full md:rounded-xl backdrop-blur-sm transition-all duration-300 active:scale-95 md:hover:scale-105 group hover:shadow-lg hover:shadow-semin-yellow/15"
                  >
                    <Gem className="h-4 w-4 md:h-6 md:w-6 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Seja um Patrocinador
                  </Button>
                </div>
              </SponsorModal>
            </Suspense>
          </div>

          <div className="flex justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-24">
            <Counter end={50} label="Anos de história" />
            <Counter end={4} label="Edições realizadas" />
            <Counter end={400} label="Participantes" suffix="+" />
          </div>
        </div>

        <a
          href="#sobre"
          className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 text-white/30 hover:text-semin-yellow transition-colors animate-bounce p-2"
        >
          <ChevronDown className="h-6 w-6 md:h-8 md:w-8" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
