import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Sparkles, Pickaxe, Award } from "lucide-react";

const EngineerDaySection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="dia-do-engenheiro" className="py-20 md:py-32 bg-semin-dark relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-semin-yellow/10 rounded-full blur-[80px] md:blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-semin-orange/5 rounded-full blur-[80px] md:blur-[150px] pointer-events-none" />
      </div>

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2.5 font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-semin-yellow font-bold mb-4 md:mb-5">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-semin-yellow" />
              Homenagem Especial • 10 de Julho
            </span>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-white mb-6">
              Dia do <span className="bg-gradient-to-r from-semin-orange to-amber-500 bg-clip-text text-transparent">Engenheiro de Minas</span>
            </h2>
            
            <p className="font-body text-base md:text-lg text-white/80 leading-relaxed mb-6 font-medium">
              No dia 10 de julho, celebramos aqueles que desbravam o subsolo, decifram a terra e transformam recursos naturais em progresso, sustentabilidade e inovação para toda a sociedade.
            </p>
            
            <p className="font-body text-sm md:text-base text-white/50 leading-relaxed mb-8">
              Ser Engenheiro de Minas é unir ciência, coragem e visão de futuro. Nesta edição de 50 anos do curso na Escola Politécnica da UFBA, parabenizamos todos os profissionais, professores, alunos e pioneiros que ajudaram e continuam ajudando a construir a história da mineração na Bahia e no Brasil.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5 shadow-inner">
                <Pickaxe className="h-5 w-5 text-semin-orange" />
                <span className="font-display text-sm font-semibold text-white/90">Tradição & Progresso</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5 shadow-inner">
                <Award className="h-5 w-5 text-semin-yellow" />
                <span className="font-display text-sm font-semibold text-white/90">50 Anos de Legado</span>
              </div>
            </div>
          </div>

          {/* Video Container */}
          <div className="flex-1 w-full max-w-2xl">
            <div className="relative group">
              {/* Decorative 3D glow container */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-semin-orange to-semin-yellow rounded-[2.5rem] opacity-35 group-hover:opacity-75 blur-xl transition duration-1000 group-hover:duration-500 pointer-events-none" />
              
              <div className="relative bg-[#06080c] border border-white/10 rounded-[2.5rem] overflow-hidden aspect-video shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
                <iframe
                  className="w-full h-full object-cover"
                  src="https://www.youtube.com/embed/DVdR_M7WOiM"
                  title="Homenagem ao Dia do Engenheiro de Minas"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EngineerDaySection;
