import { Button } from "@/components/ui/button";
import { ArrowRight, HardHat, Mountain } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const RegistrationSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="inscricoes" className="py-24 md:py-32 bg-semin-blue relative overflow-hidden">
      {/* Static glows */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-semin-yellow/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-semin-orange/6 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,hsl(var(--semin-blue))_70%)]" />

      {/* Mountain silhouette */}
      <div className="absolute bottom-0 left-0 w-full opacity-[0.04]">
        <svg viewBox="0 0 1440 200" className="w-full" preserveAspectRatio="none">
          <path d="M0,120 L200,80 L350,130 L500,60 L650,110 L800,50 L950,100 L1100,70 L1250,120 L1440,80 L1440,200 L0,200Z" fill="hsl(40 73% 48%)" />
        </svg>
      </div>

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className={`max-w-2xl mx-auto text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-semin-yellow/20 rounded-full bg-semin-yellow/5">
            <HardHat className="h-4 w-4 text-semin-yellow" />
            <span className="font-body text-xs text-semin-yellow font-medium uppercase tracking-wider">Vagas limitadas</span>
          </div>

          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
            Inscreva-se no SEMIN
          </h2>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Mountain className="h-4 w-4 text-semin-yellow/60" />
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>
          <p className="font-body text-lg text-white/60 mb-4 leading-relaxed">
            Participe do principal evento de mineração da UFBA e celebre conosco os 50 anos da
            Engenharia de Minas. Garanta sua vaga!
          </p>
          <p className="font-body text-sm text-semin-yellow/60 mb-12">
            Inscrições abertas para estudantes, profissionais e professores
          </p>

          <a href="#" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark hover:from-semin-orange hover:to-semin-yellow font-bold text-xl px-14 py-8 shadow-2xl shadow-semin-yellow/30 group transition-all duration-300 hover:scale-105 hover:shadow-semin-yellow/50"
            >
              <HardHat className="h-6 w-6 mr-2 group-hover:rotate-12 transition-transform" />
              Inscreva-se Agora
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;
