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

const FloatingMineral = ({ delay, x, y, size, icon: Icon }: { delay: number; x: string; y: string; size: number; icon: React.ElementType }) => (
  <motion.div
    className="absolute text-semin-yellow/15"
    style={{ left: x, top: y }}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 15, -15, 0],
      opacity: [0.1, 0.3, 0.1],
    }}
    transition={{
      duration: 6,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <Icon style={{ width: size, height: size }} />
  </motion.div>
);

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-semin-dark"
    >
      {/* Mining-themed background pattern */}
      <div className="absolute inset-0">
        {/* Layered mountain silhouette */}
        <svg className="absolute bottom-0 left-0 w-full h-64 opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="hsl(40 73% 48%)" d="M0,192L60,181.3C120,171,240,149,360,160C480,171,600,213,720,218.7C840,224,960,192,1080,181.3C1200,171,1320,181,1380,186.7L1440,192L1440,320L0,320Z" />
        </svg>
        <svg className="absolute bottom-0 left-0 w-full h-48 opacity-5" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="hsl(30 100% 38%)" d="M0,256L80,234.7C160,213,320,171,480,165.3C640,160,800,192,960,202.7C1120,213,1280,203,1360,197.3L1440,192L1440,320L0,320Z" />
        </svg>

        {/* Glowing orbs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-semin-yellow/8 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-semin-orange/6 rounded-full blur-[120px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Diamond grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, hsl(40 73% 48%) 35px, hsl(40 73% 48%) 36px),
                            repeating-linear-gradient(-45deg, transparent, transparent 35px, hsl(40 73% 48%) 35px, hsl(40 73% 48%) 36px)`
        }} />

        {/* Geometric mining rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-semin-yellow/8 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-semin-yellow/30 rounded-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-semin-orange/30 rounded-full" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-semin-orange/6 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating mining icons */}
        <FloatingMineral delay={0} x="10%" y="20%" size={32} icon={Mountain} />
        <FloatingMineral delay={1.5} x="80%" y="15%" size={28} icon={Pickaxe} />
        <FloatingMineral delay={3} x="88%" y="55%" size={36} icon={Gem} />
        <FloatingMineral delay={0.8} x="18%" y="65%" size={24} icon={HardHat} />
        <FloatingMineral delay={2.2} x="65%" y="75%" size={30} icon={Mountain} />
        <FloatingMineral delay={4} x="45%" y="10%" size={22} icon={Gem} />
        <FloatingMineral delay={1} x="92%" y="80%" size={26} icon={Pickaxe} />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Mining-themed badge */}
          <motion.div
            className="inline-flex items-center gap-3 mb-8 px-6 py-3 border border-semin-yellow/30 rounded-full bg-semin-yellow/5 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Pickaxe className="h-4 w-4 text-semin-yellow" />
            <span className="text-semin-yellow font-body text-sm font-medium tracking-widest uppercase">
              Edição Comemorativa • 50 Anos
            </span>
            <Gem className="h-4 w-4 text-semin-orange" />
          </motion.div>

          <motion.h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-semin-yellow via-semin-cream to-semin-yellow bg-clip-text text-transparent">
              SEMIN
            </span>
            <motion.span
              className="block text-xl md:text-2xl lg:text-3xl font-medium text-semin-cream/80 mt-4 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Seminário de Mineração da UFBA
            </motion.span>
          </motion.h1>

          {/* Decorative pickaxe divider */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Mountain className="h-5 w-5 text-semin-yellow/60" />
            <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </motion.div>

          <motion.p
            className="font-body text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            50 anos da Engenharia de Minas: passado, presente e futuro da mineração
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
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
          </motion.div>

          <motion.div
            className="flex justify-center gap-16 md:gap-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <Counter end={50} label="Anos de história" suffix="+" />
            <Counter end={12} label="Edições realizadas" />
            <Counter end={500} label="Participantes" suffix="+" />
          </motion.div>
        </motion.div>

        <motion.a
          href="#sobre"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 hover:text-semin-yellow transition-colors"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-8 w-8" />
        </motion.a>
      </div>
    </section>
  );
};

export default HeroSection;
