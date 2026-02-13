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
      <div className="text-5xl md:text-6xl font-display font-bold text-semin-yellow drop-shadow-[0_0_20px_rgba(210,155,33,0.3)]">
        {count}{suffix}
      </div>
      <div className="text-white/60 font-body text-sm mt-2 tracking-wide uppercase">{label}</div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-semin-dark"
    >
      {/* Lightweight background — CSS only, no JS animations for bg */}
      <div className="absolute inset-0">
        <svg className="absolute bottom-0 left-0 w-full h-64 opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="hsl(40 73% 48%)" d="M0,192L60,181.3C120,171,240,149,360,160C480,171,600,213,720,218.7C840,224,960,192,1080,181.3C1200,171,1320,181,1380,186.7L1440,192L1440,320L0,320Z" />
        </svg>
        <svg className="absolute bottom-0 left-0 w-full h-48 opacity-5" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="hsl(30 100% 38%)" d="M0,256L80,234.7C160,213,320,171,480,165.3C640,160,800,192,960,202.7C1120,213,1280,203,1360,197.3L1440,192L1440,320L0,320Z" />
        </svg>

        {/* Static glows — no JS animation */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-semin-yellow/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-semin-orange/6 rounded-full blur-[120px]" />

        {/* Diamond grid pattern — pure CSS */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, hsl(40 73% 48%) 35px, hsl(40 73% 48%) 36px),
                            repeating-linear-gradient(-45deg, transparent, transparent 35px, hsl(40 73% 48%) 35px, hsl(40 73% 48%) 36px)`
        }} />

        {/* Single CSS-animated ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-semin-yellow/8 rounded-full animate-[spin_60s_linear_infinite]" />

        {/* Static mining icons as subtle watermarks */}
        <Mountain className="absolute top-[18%] left-[8%] h-8 w-8 text-semin-yellow/10" />
        <Pickaxe className="absolute top-[12%] right-[12%] h-7 w-7 text-semin-yellow/8" />
        <Gem className="absolute bottom-[25%] right-[8%] h-9 w-9 text-semin-orange/8" />
        <HardHat className="absolute bottom-[30%] left-[15%] h-6 w-6 text-semin-yellow/8" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 border border-semin-yellow/30 rounded-full bg-semin-yellow/5 backdrop-blur-sm">
            <Pickaxe className="h-4 w-4 text-semin-yellow" />
            <span className="text-semin-yellow font-body text-sm font-medium tracking-widest uppercase">
              Edição Comemorativa • 50 Anos
            </span>
            <Gem className="h-4 w-4 text-semin-orange" />
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-semin-yellow via-semin-cream to-semin-yellow bg-clip-text text-transparent">
              SEMIN
            </span>
            <span className="block text-xl md:text-2xl lg:text-3xl font-medium text-semin-cream/80 mt-4 tracking-wide">
              Seminário de Mineração da UFBA
            </span>
          </h1>

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Mountain className="h-5 w-5 text-semin-yellow/60" />
            <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>

          <p className="font-body text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
            50 anos da Engenharia de Minas: passado, presente e futuro da mineração
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <a href="#inscricoes">
              <Button
                size="lg"
                className="bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark hover:from-semin-orange hover:to-semin-yellow font-bold text-lg px-10 py-7 shadow-xl shadow-semin-yellow/25 transition-all duration-300 hover:shadow-semin-yellow/40 hover:scale-105 group"
              >
                <HardHat className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Inscreva-se
              </Button>
            </a>
            <a href="#patrocinio">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-semin-yellow/40 text-semin-yellow hover:bg-semin-yellow/10 hover:border-semin-yellow font-semibold text-lg px-10 py-7 transition-all duration-300 hover:scale-105 group"
              >
                <Gem className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Seja um Patrocinador
              </Button>
            </a>
          </div>

          <div className="flex justify-center gap-16 md:gap-24">
            <Counter end={50} label="Anos de história" suffix="+" />
            <Counter end={12} label="Edições realizadas" />
            <Counter end={500} label="Participantes" suffix="+" />
          </div>
        </motion.div>

        <motion.a
          href="#sobre"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 hover:text-semin-yellow transition-colors animate-bounce"
        >
          <ChevronDown className="h-8 w-8" />
        </motion.a>
      </div>
    </section>
  );
};

export default HeroSection;
