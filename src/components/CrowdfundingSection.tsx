import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Heart, Sparkles, ArrowRight, ShieldCheck, QrCode, CreditCard, Gem } from "lucide-react";
import CheckoutModal from "./CheckoutModal";

const SponsorModal = lazy(() => import("./SponsorModal").then(m => ({ default: m.SponsorModal })));


const CrowdfundingSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-20 md:py-36 bg-semin-cream relative overflow-hidden">
      {/* Top gold separator line that blends with light background */}
      <div className="absolute top-0 left-0 w-full h-px bg-[linear-gradient(90deg,transparent_0%,transparent_35%,hsl(var(--semin-yellow))_50%,transparent_65%,transparent_100%)] opacity-30" />
      
      {/* Luzes dinâmicas */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-semin-yellow/15 rounded-full blur-[80px] md:blur-[180px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-semin-orange/10 rounded-full blur-[60px] md:blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] border border-semin-yellow/[0.05] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[1200px] h-[500px] md:h-[1200px] border border-semin-yellow/[0.03] rounded-full pointer-events-none" />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 md:mb-24 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-semin-orange/30 bg-semin-orange/5 backdrop-blur-xl mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 text-semin-orange" />
            <span className="font-body text-xs md:text-sm uppercase tracking-[0.25em] font-bold text-semin-orange">
              Apoio Comunitário
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-semin-blue mb-6 tracking-tight leading-tight">
            Deixe seu Nome no <span className="text-semin-yellow">Livro de Ouro</span> dos 50 Anos
          </h2>

          <p className="font-body text-base md:text-xl text-semin-blue/70 max-w-3xl mx-auto leading-relaxed font-medium">
            Sua contribuição como ex-aluno, profissional ou apoiador viabiliza as celebrações do Cinquentenário, o documentário oficial e imortaliza sua trajetória na história da Engenharia de Minas da UFBA.
          </p>
        </div>

        {/* Premium Support Card */}
        <div className={`max-w-4xl mx-auto mb-20 md:mb-28 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-semin-orange/10 via-amber-500/10 to-semin-orange/10 rounded-[3rem] opacity-50 group-hover:opacity-100 blur-2xl transition duration-1000 group-hover:duration-500"></div>
            
            <div className="relative bg-white shadow-[0_24px_70px_rgba(0,0,0,0.04)] border border-black/[0.03] p-10 md:p-20 rounded-[3rem] text-center overflow-hidden">
              {/* Top border highlight */}
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-semin-orange/60 to-transparent" />
              <div className="absolute top-0 left-1/3 right-1/3 h-[2px] bg-semin-orange/25 blur-[2px]" />
              
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-semin-orange/10 to-semin-orange/5 rounded-full flex items-center justify-center mx-auto mb-12 border border-semin-orange/20 shadow-sm relative group-hover:scale-110 transition-transform duration-700">
                <div className="absolute inset-0 bg-semin-orange/20 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-0 bg-semin-orange/10 rounded-full animate-pulse" />
                <Heart className="h-12 w-12 md:h-16 md:w-16 text-semin-orange relative z-10 drop-shadow-sm" fill="currentColor" />
              </div>

              <div className="flex flex-col items-center gap-12">
                <div className="flex items-center justify-center gap-8 md:gap-20">
                  <div className="flex flex-col items-center gap-4 group/icon">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-semin-blue/5 border border-black/[0.04] flex items-center justify-center text-semin-blue/50 group-hover/icon:text-semin-orange group-hover/icon:border-semin-orange/50 group-hover/icon:bg-semin-orange/10 transition-all duration-500 shadow-inner">
                      <QrCode className="h-8 w-8 md:h-10 md:w-10 group-hover/icon:scale-110 transition-transform duration-500" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-semin-blue/60 font-bold group-hover/icon:text-semin-orange transition-colors">PIX</span>
                  </div>
                  <div className="flex flex-col items-center gap-4 group/icon">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-semin-blue/5 border border-black/[0.04] flex items-center justify-center text-semin-blue/50 group-hover/icon:text-semin-orange group-hover/icon:border-semin-orange/50 group-hover/icon:bg-semin-orange/10 transition-all duration-500 shadow-inner">
                      <CreditCard className="h-8 w-8 md:h-10 md:w-10 group-hover/icon:scale-110 transition-transform duration-500" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-semin-blue/60 font-bold group-hover/icon:text-semin-orange transition-colors">Cartão</span>
                  </div>
                </div>

                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="relative overflow-hidden w-full sm:w-auto min-w-[260px] sm:min-w-[340px] md:min-w-[380px] h-14 md:h-16 font-display font-black text-lg md:text-xl rounded-full bg-gradient-to-r from-semin-orange via-amber-400 to-semin-orange text-white hover:from-semin-blue hover:to-semin-blue hover:text-white shadow-[0_15px_35px_rgba(224,115,19,0.25)] transition-all duration-500 active:scale-95 hover:scale-[1.02] hover:shadow-[0_15px_45px_rgba(224,115,19,0.35)] group/btn border-2 border-transparent flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-[150%] group-hover/btn:animate-[shimmer_2s_infinite]" />
                  <span className="relative z-10 flex items-center justify-center gap-3 drop-shadow-sm">
                    Fazer Minha Contribuição
                    <ArrowRight className="h-5 w-5 md:h-6 md:w-6 group-hover/btn:translate-x-2 transition-transform duration-500 shrink-0" />
                  </span>
                </Button>

                {/* Opção Doar como Patrocinador */}
                <div className="flex flex-col items-center gap-4 mt-6 pt-6 border-t border-black/5 w-full max-w-md">
                  <p className="font-body text-sm md:text-base text-semin-blue/60 font-semibold text-center">
                    Quer doar ou apoiar como patrocinador corporativo?
                  </p>
                  <Suspense fallback={null}>
                    <SponsorModal>
                      <div className="w-full sm:w-auto">
                        <Button
                          size="lg"
                          variant="outline"
                          className="relative w-full sm:w-auto min-w-[220px] md:min-w-[280px] h-12 md:h-14 border-2 border-semin-yellow text-semin-yellow hover:bg-semin-yellow/10 hover:border-semin-yellow font-display font-semibold text-sm md:text-base px-6 rounded-2xl transition-all duration-300 active:scale-95 group hover:shadow-lg hover:shadow-semin-yellow/15 flex items-center justify-center cursor-pointer"
                        >
                          <Gem className="h-4 w-4 md:h-5 md:w-5 mr-2 group-hover:rotate-12 transition-transform duration-300 shrink-0" />
                          <span>Seja um Patrocinador</span>
                        </Button>
                      </div>
                    </SponsorModal>
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Security Footer */}
        <div className={`flex flex-col items-center gap-5 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="flex items-center gap-3 px-8 py-3 rounded-full bg-white border border-black/[0.03] shadow-sm">
            <ShieldCheck className="h-5 w-5 text-semin-orange" />
            <span className="text-semin-blue/80 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Transação 100% Segura</span>
          </div>
          <p className="font-body text-xs md:text-sm text-semin-blue/60 text-center max-w-lg leading-relaxed font-medium">
            Sua contribuição é processada com segurança de nível bancário pelo ambiente Asaas (PIX e Cartão).
          </p>
        </div>
      </div>

      <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default CrowdfundingSection;
