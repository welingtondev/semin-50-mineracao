import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

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
      <div className="text-4xl md:text-5xl font-display font-bold text-semin-yellow">
        {count}{suffix}
      </div>
      <div className="text-white/70 font-body text-sm mt-1">{label}</div>
    </div>
  );
};

const HeroSection = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-semin-dark"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-semin-yellow/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-semin-orange/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-semin-yellow/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-semin-orange/10 rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div
          className={`transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-block mb-6 px-4 py-2 border border-semin-yellow/30 rounded-full">
            <span className="text-semin-yellow font-body text-sm font-medium tracking-widest uppercase">
              Edição Comemorativa
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            SEMIN
            <span className="block text-2xl md:text-3xl lg:text-4xl font-medium text-semin-cream mt-2">
              Seminário de Mineração da UFBA
            </span>
          </h1>

          <p className="font-body text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            50 anos da Engenharia de Minas: passado, presente e futuro da mineração
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="#inscricoes">
              <Button
                size="lg"
                className="bg-semin-yellow text-semin-dark hover:bg-semin-orange hover:text-white font-semibold text-lg px-8 py-6 shadow-lg shadow-semin-yellow/20"
              >
                Inscreva-se
              </Button>
            </a>
            <a href="#patrocinio">
              <Button
                size="lg"
                variant="outline"
                className="border-semin-yellow/40 text-semin-yellow hover:bg-semin-yellow/10 font-semibold text-lg px-8 py-6"
              >
                Seja um Patrocinador
              </Button>
            </a>
          </div>

          <div className="flex justify-center gap-12 md:gap-20">
            <Counter end={50} label="Anos de história" suffix="+" />
            <Counter end={12} label="Edições realizadas" />
            <Counter end={500} label="Participantes" suffix="+" />
          </div>
        </div>

        <a
          href="#sobre"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-semin-yellow transition-colors animate-bounce"
        >
          <ChevronDown className="h-8 w-8" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
