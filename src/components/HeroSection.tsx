import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles } from "lucide-react";
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

const FloatingParticle = ({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-semin-yellow/20"
    style={{ left: x, top: y, width: size, height: size }}
    animate={{
      y: [0, -30, 0],
      opacity: [0.2, 0.6, 0.2],
      scale: [1, 1.3, 1],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-semin-dark"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
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
        <motion.div
          className="absolute top-1/3 left-1/4 w-72 h-72 bg-semin-blue/10 rounded-full blur-[80px]"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Geometric rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-semin-yellow/8 rounded-full"
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ rotate: { duration: 60, repeat: Infinity, ease: "linear" }, scale: { duration: 8, repeat: Infinity } }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-semin-orange/8 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/5 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating particles */}
        <FloatingParticle delay={0} x="15%" y="25%" size={6} />
        <FloatingParticle delay={1} x="75%" y="20%" size={4} />
        <FloatingParticle delay={2} x="85%" y="60%" size={8} />
        <FloatingParticle delay={0.5} x="25%" y="70%" size={5} />
        <FloatingParticle delay={1.5} x="60%" y="80%" size={6} />
        <FloatingParticle delay={3} x="40%" y="15%" size={4} />
        <FloatingParticle delay={2.5} x="90%" y="40%" size={5} />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 border border-semin-yellow/30 rounded-full bg-semin-yellow/5 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Sparkles className="h-4 w-4 text-semin-yellow" />
            <span className="text-semin-yellow font-body text-sm font-medium tracking-widest uppercase">
              Edição Comemorativa
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-white via-semin-cream to-white bg-clip-text text-transparent">
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

          <motion.div
            className="w-20 h-1 bg-gradient-to-r from-semin-yellow to-semin-orange mx-auto mb-8 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 1, duration: 0.6 }}
          />

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
                className="bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark hover:from-semin-orange hover:to-semin-yellow font-bold text-lg px-10 py-7 shadow-xl shadow-semin-yellow/25 transition-all duration-300 hover:shadow-semin-yellow/40 hover:scale-105"
              >
                Inscreva-se
              </Button>
            </a>
            <a href="#patrocinio">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-semin-yellow/40 text-semin-yellow hover:bg-semin-yellow/10 hover:border-semin-yellow font-semibold text-lg px-10 py-7 transition-all duration-300 hover:scale-105"
              >
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
