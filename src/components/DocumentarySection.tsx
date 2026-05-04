import { Play, Sparkles, Diamond, Crown, Clapperboard } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { SponsorModal } from "./SponsorModal";
import documentaryPoster from "@/assets/documentary-poster.webp";

const DocumentarySection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="documentario" className="py-24 md:py-40 bg-[#06080c] relative overflow-hidden">
      {/* Cinematic Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-semin-yellow/5 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-20">
          
          {/* Film Poster Style Image */}
          <div className={`w-full lg:w-1/2 transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
            <div className="relative group">
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-semin-yellow/30 to-semin-orange/30 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-80 transition duration-700" />
              
              <div className="relative bg-semin-dark rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/50 aspect-[3/4] md:aspect-video lg:aspect-[3/4]">
                <img 
                  src={documentaryPoster} 
                  alt="Documentário 50 Anos" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-semin-dark via-transparent to-transparent" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-semin-yellow/20 backdrop-blur-md border border-semin-yellow/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Play className="h-8 w-8 text-semin-yellow fill-semin-yellow/20" />
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-semin-yellow text-semin-dark font-black text-[10px] uppercase tracking-tighter mb-3">
                    Estreia em Novembro
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">50 Anos de História</h4>
                  <p className="text-white/60 text-sm">Uma jornada épica desde a fundação até o futuro da mineração.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className={`w-full lg:w-1/2 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-semin-yellow/30 bg-semin-yellow/10 backdrop-blur-md mb-8 shadow-[0_0_30px_rgba(210,155,33,0.15)]">
              <Clapperboard className="h-4 w-4 text-semin-yellow" />
              <span className="font-body text-xs md:text-sm uppercase tracking-[0.25em] font-bold text-semin-yellow">
                Documentário 50 Anos
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight">
              O Legado em <br />
              <span className="text-semin-yellow">Alta Definição</span>
            </h2>

            <div className="space-y-6 text-lg text-white/60 leading-relaxed mb-12">
              <p>
                Estamos imortalizando a história da Engenharia de Minas na UFBA através de uma obra audiovisual sem precedentes. Este documentário é o resgate das vozes e visões de um curso que transformou a Bahia em um expoente mineral.
              </p>
              <p>
                Através de depoimentos de fundadores, imagens inéditas de arquivo e a análise da influência do curso nas grandes operações do estado, vamos eternizar a jornada épica que conectou a academia ao coração da indústria mineral baiana.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <SponsorModal>
                <Button size="lg" className="h-16 px-8 rounded-2xl bg-semin-yellow text-semin-dark font-black text-lg hover:bg-white transition-colors group">
                  Seja um Mecenas
                  <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </SponsorModal>
              
              <div className="flex items-center gap-4 px-6 border border-white/10 rounded-2xl bg-white/5">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-full border-2 border-semin-dark bg-semin-yellow/20 flex items-center justify-center"><Diamond className="h-4 w-4 text-semin-yellow" /></div>
                  <div className="w-8 h-8 rounded-full border-2 border-semin-dark bg-semin-orange/20 flex items-center justify-center"><Crown className="h-4 w-4 text-semin-orange" /></div>
                </div>
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Apoio exclusivo Cotas Diamante e Corindon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentarySection;
