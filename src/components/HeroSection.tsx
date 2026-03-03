import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Mountain, Pickaxe, Gem, HardHat } from "lucide-react";
import { motion } from "framer-motion";

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
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-semin-yellow drop-shadow-[0_0_20px_rgba(210,155,33,0.3)]">
        {count}{suffix}
      </div>
      <div className="text-white/60 font-body text-[10px] sm:text-xs md:text-sm mt-1.5 md:mt-2 tracking-wide uppercase">{label}</div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-semin-dark"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <svg className="absolute bottom-0 left-0 w-full h-40 md:h-64 opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="hsl(40 73% 48%)" d="M0,192L60,181.3C120,171,240,149,360,160C480,171,600,213,720,218.7C840,224,960,192,1080,181.3C1200,171,1320,181,1380,186.7L1440,192L1440,320L0,320Z" />
        </svg>
        <svg className="absolute bottom-0 left-0 w-full h-32 md:h-48 opacity-5" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="hsl(30 100% 38%)" d="M0,256L80,234.7C160,213,320,171,480,165.3C640,160,800,192,960,202.7C1120,213,1280,203,1360,197.3L1440,192L1440,320L0,320Z" />
        </svg>

        <div className="absolute top-20 left-10 w-48 md:w-96 h-48 md:h-96 bg-semin-yellow/10 rounded-full blur-[80px] md:blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-64 md:w-[500px] h-64 md:h-[500px] bg-semin-orange/6 rounded-full blur-[80px] md:blur-[120px]" />

        <div className="absolute inset-0 opacity-[0.03] hidden md:block" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, hsl(40 73% 48%) 35px, hsl(40 73% 48%) 36px),
                            repeating-linear-gradient(-45deg, transparent, transparent 35px, hsl(40 73% 48%) 35px, hsl(40 73% 48%) 36px)`
        }} />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] border border-semin-yellow/8 rounded-full animate-[spin_60s_linear_infinite] hidden sm:block" />

        <Mountain className="absolute top-[18%] left-[8%] h-6 w-6 md:h-8 md:w-8 text-semin-yellow/10 hidden sm:block" />
        <Pickaxe className="absolute top-[12%] right-[12%] h-5 w-5 md:h-7 md:w-7 text-semin-yellow/8 hidden sm:block" />
        <Gem className="absolute bottom-[25%] right-[8%] h-6 w-6 md:h-9 md:w-9 text-semin-orange/8 hidden sm:block" />
        <HardHat className="absolute bottom-[30%] left-[15%] h-5 w-5 md:h-6 md:w-6 text-semin-yellow/8 hidden sm:block" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center pt-20 pb-16 md:pt-0 md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 md:gap-3 mb-6 md:mb-8 px-4 md:px-6 py-2.5 md:py-3 border border-semin-yellow/30 rounded-full bg-semin-yellow/5 backdrop-blur-sm">
            <Pickaxe className="h-3.5 w-3.5 md:h-4 md:w-4 text-semin-yellow" />
            <span className="text-semin-yellow font-body text-[10px] md:text-sm font-medium tracking-widest uppercase">
              Edição Comemorativa • 50 Anos
            </span>
            <Gem className="h-3.5 w-3.5 md:h-4 md:w-4 text-semin-orange" />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 md:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-semin-yellow via-semin-cream to-semin-yellow bg-clip-text text-transparent">
              SEMIN
            </span>
            <span className="block text-base sm:text-lg md:text-2xl lg:text-3xl font-medium text-semin-cream/80 mt-2 md:mt-4 tracking-wide">
              Seminário de Mineração da UFBA
            </span>
          </h1>

          <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Mountain className="h-4 w-4 md:h-5 md:w-5 text-semin-yellow/60" />
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>

          <p className="font-body text-sm sm:text-base md:text-xl text-white/50 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed px-2">
            50 anos da Engenharia de Minas: passado, presente e futuro da mineração
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-14 md:mb-20 px-4 sm:px-0">
            <a href="#inscricoes" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark hover:from-semin-orange hover:to-semin-yellow font-bold text-base md:text-lg px-8 md:px-10 py-6 md:py-7 shadow-xl shadow-semin-yellow/25 transition-all duration-300 hover:shadow-semin-yellow/40 active:scale-95 md:hover:scale-105 group"
              >
                <HardHat className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Inscreva-se
              </Button>
            </a>
            <a href="#patrocinio" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-semin-yellow/40 text-semin-yellow hover:bg-semin-yellow/10 hover:border-semin-yellow font-semibold text-base md:text-lg px-8 md:px-10 py-6 md:py-7 transition-all duration-300 active:scale-95 md:hover:scale-105 group"
              >
                <Gem className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Seja um Patrocinador
              </Button>
            </a>
          </div>

          <div className="flex justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-24">
            <Counter end={50} label="Anos de história" suffix="+" />
            <Counter end={12} label="Edições realizadas" />
            <Counter end={500} label="Participantes" suffix="+" />
          </div>
        </motion.div>

        <motion.a
          href="#sobre"
          className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 text-white/30 hover:text-semin-yellow transition-colors animate-bounce p-2"
        >
          <ChevronDown className="h-6 w-6 md:h-8 md:w-8" />
        </motion.a>
      </div>
    </section>
  );
};

export default HeroSection;
