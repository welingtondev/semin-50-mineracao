import { Button } from "@/components/ui/button";
import { ArrowRight, HardHat, Mountain } from "lucide-react";
import { RegistrationModal } from "./RegistrationModal";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const RegistrationSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="inscricoes" className="py-16 md:py-32 bg-semin-dark relative overflow-hidden">
      {/* Top gold separator line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-semin-yellow/30 to-transparent" />
      <div className="absolute top-0 right-0 w-48 md:w-[400px] h-48 md:h-[400px] bg-semin-yellow/[0.03] rounded-full blur-[80px] md:blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-40 md:w-80 h-40 md:h-80 bg-semin-orange/[0.03] rounded-full blur-[60px] md:blur-[100px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(26,54,93,0.1)_0%,transparent_60%)]" />

      {/* Mountain background decor */}
      <div className="absolute bottom-0 left-0 w-full opacity-5 pointer-events-none">
        <svg className="w-full h-32 md:h-48" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="hsl(40 73% 48%)" d="M0,192L60,181.3C120,171,240,149,360,160C480,171,600,213,720,218.7C840,224,960,192,1080,181.3C1200,171,1320,181,1380,186.7L1440,192L1440,320L0,320Z" />
        </svg>
      </div>

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className={`max-w-2xl mx-auto text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-3 md:px-4 py-2 border border-semin-yellow/20 rounded-full bg-semin-yellow/5">
            <HardHat className="h-3.5 w-3.5 md:h-4 md:w-4 text-semin-yellow" />
            <span className="font-body text-[10px] md:text-xs text-semin-yellow font-medium uppercase tracking-wider">Vagas limitadas</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Inscreva-se no SEMIN 2026
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
            <div className="w-8 md:w-12 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Mountain className="h-3.5 w-3.5 md:h-4 md:w-4 text-semin-yellow/60" />
            <div className="w-8 md:w-12 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>
          <p className="font-body text-sm md:text-lg text-white/70 mb-3 md:mb-4 leading-relaxed px-2 lg:px-12">
            A Semana de Mineração da UFBA chega à sua edição mais especial. Celebre meio século de Engenharia de Minas participando de palestras técnicas, minicursos e rodadas de networking com as maiores empresas do setor mineral.
          </p>
          <p className="font-body text-xs md:text-sm text-semin-yellow/60 mb-8 md:mb-12">
            Inscrições abertas para estudantes, profissionais e professores
          </p>

          <RegistrationModal>
            <div className="relative inline-flex w-full sm:w-auto cta-float cursor-pointer">
              <div className="absolute -inset-1.5 md:-inset-2 rounded-2xl bg-gradient-to-r from-semin-yellow via-semin-orange to-semin-yellow opacity-40 blur-lg cta-glow" />
              <Button
                size="lg"
                className="cta-shine relative bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange text-semin-dark hover:from-semin-orange hover:via-amber-500 hover:to-semin-yellow font-bold text-base md:text-xl px-10 md:px-16 py-7 md:py-9 rounded-xl shadow-2xl shadow-semin-yellow/30 group transition-all duration-300 active:scale-95 md:hover:scale-105 hover:shadow-semin-yellow/50 w-full sm:w-auto"
              >
                <HardHat className="h-5 w-5 md:h-6 md:w-6 mr-2.5 group-hover:rotate-12 transition-transform duration-300" />
                Inscreva-se Agora
                <ArrowRight className="ml-2.5 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Button>
            </div>
          </RegistrationModal>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;
