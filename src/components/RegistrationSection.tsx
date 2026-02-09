import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const RegistrationSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="inscricoes" className="py-20 md:py-28 bg-semin-blue relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-80 h-80 bg-semin-yellow/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-semin-orange/5 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div
          className={`max-w-2xl mx-auto text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
            Inscreva-se no SEMIN
          </h2>
          <p className="font-body text-lg text-white/70 mb-4 leading-relaxed">
            Participe do principal evento de mineração da UFBA e celebre conosco os 50 anos da
            Engenharia de Minas. Garanta sua vaga!
          </p>
          <p className="font-body text-sm text-semin-yellow/80 mb-10">
            Vagas limitadas • Inscrições abertas para estudantes, profissionais e professores
          </p>

          <a href="#" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-semin-yellow text-semin-dark hover:bg-semin-orange hover:text-white font-bold text-xl px-12 py-7 shadow-2xl shadow-semin-yellow/30 group"
            >
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
