import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Heart, Sparkles, ArrowRight, ShieldCheck, QrCode, CreditCard } from "lucide-react";
import CheckoutModal from "./CheckoutModal";
import { supabase } from "@/lib/supabase";

const CrowdfundingSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- CONFIGURAÇÃO DO TERMÔMETRO ---
  const [currentDonations, setCurrentDonations] = useState(0);
  const [currentSponsorships, setCurrentSponsorships] = useState(0);
  const GOAL_AMOUNT = 102700;        // Meta total: R$ 102.700,00

  useEffect(() => {
    const fetchFundraisingData = async () => {
      const { data } = await supabase
        .from("gallery_photos")
        .select("*")
        .eq("author_name", "SYSTEM_FUNDRAISING")
        .limit(1);

      if (data && data.length > 0) {
        try {
          const parsed = JSON.parse(data[0].description || "{}");
          setCurrentDonations(parsed.donations || 0);
          setCurrentSponsorships(parsed.sponsorships || 0);
        } catch (e) {
          console.error("Erro ao parsear config de arrecadação");
        }
      }
    };

    fetchFundraisingData();
  }, []);
  
  const TOTAL_RAISED = currentDonations + currentSponsorships;
  const PERCENTAGE_TOTAL = Math.min((TOTAL_RAISED / GOAL_AMOUNT) * 100, 100);
  
  // Garantir que a soma das barras não passe de 100% visualmente
  const percentageDonations = Math.min((currentDonations / GOAL_AMOUNT) * 100, 100);
  const percentageSponsorships = Math.min((currentSponsorships / GOAL_AMOUNT) * 100, 100 - percentageDonations);

  return (
    <section id="apoie" className="py-20 md:py-36 bg-semin-dark relative overflow-hidden">
      {/* Background elements - Paleta Ouro e Dark do Site */}
      <div className="absolute top-0 left-0 w-full h-px bg-[linear-gradient(90deg,#0a0d12_0%,#0a0d12_20%,#d29b21_50%,#0a0d12_80%,#0a0d12_100%)] opacity-50" />
      
      {/* Luzes dinâmicas */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-semin-yellow/10 rounded-full blur-[80px] md:blur-[180px] mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-semin-orange/10 rounded-full blur-[60px] md:blur-[150px] mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] border border-semin-yellow/[0.02] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[1200px] h-[500px] md:h-[1200px] border border-semin-yellow/[0.01] rounded-full pointer-events-none" />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 md:mb-24 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-semin-yellow/40 bg-semin-yellow/10 backdrop-blur-xl mb-8 shadow-[0_0_40px_rgba(210,155,33,0.2)]">
            <Sparkles className="h-4 w-4 text-semin-yellow" />
            <span className="font-body text-xs md:text-sm uppercase tracking-[0.25em] font-bold text-semin-yellow">
              Apoio Comunitário
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            Viabilize a nossa <span className="text-transparent bg-clip-text bg-gradient-to-r from-semin-yellow via-amber-200 to-semin-orange drop-shadow-[0_0_20px_rgba(210,155,33,0.3)]">Festa</span>
          </h2>

          <p className="font-body text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-medium">
            Organizar um evento histórico de 50 anos exige um esforço monumental. Sua ajuda é fundamental para mantermos viva a nossa história e realizarmos esta celebração épica.
          </p>
        </div>

        {/* Premium Support Card */}
        <div className={`max-w-4xl mx-auto mb-20 md:mb-28 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-semin-yellow/30 via-amber-400/20 to-semin-orange/30 rounded-[3rem] opacity-50 group-hover:opacity-100 blur-2xl transition duration-1000 group-hover:duration-500"></div>
            
            <div className="relative bg-[#0a0c12]/90 backdrop-blur-3xl border border-white/10 p-10 md:p-20 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] text-center overflow-hidden">
              {/* Top border highlight */}
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-semin-yellow/80 to-transparent" />
              <div className="absolute top-0 left-1/3 right-1/3 h-[2px] bg-semin-yellow/50 blur-[2px]" />
              
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-semin-yellow/20 to-semin-orange/10 rounded-full flex items-center justify-center mx-auto mb-12 border border-semin-yellow/30 shadow-[0_0_40px_rgba(210,155,33,0.3)] relative group-hover:scale-110 transition-transform duration-700">
                <div className="absolute inset-0 bg-semin-yellow/20 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-0 bg-semin-yellow/10 rounded-full animate-pulse" />
                <Heart className="h-12 w-12 md:h-16 md:w-16 text-semin-yellow relative z-10 drop-shadow-[0_0_15px_rgba(210,155,33,0.8)]" fill="currentColor" />
              </div>

              <div className="flex flex-col items-center gap-12">
                <div className="flex items-center justify-center gap-8 md:gap-20">
                  <div className="flex flex-col items-center gap-4 group/icon">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover/icon:text-semin-yellow group-hover/icon:border-semin-yellow/50 group-hover/icon:bg-semin-yellow/10 transition-all duration-500 shadow-inner group-hover/icon:shadow-[0_0_30px_rgba(210,155,33,0.2)]">
                      <QrCode className="h-8 w-8 md:h-10 md:w-10 group-hover/icon:scale-110 transition-transform duration-500" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-white/50 font-bold group-hover/icon:text-semin-yellow transition-colors">PIX</span>
                  </div>
                  <div className="flex flex-col items-center gap-4 group/icon">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover/icon:text-semin-yellow group-hover/icon:border-semin-yellow/50 group-hover/icon:bg-semin-yellow/10 transition-all duration-500 shadow-inner group-hover/icon:shadow-[0_0_30px_rgba(210,155,33,0.2)]">
                      <CreditCard className="h-8 w-8 md:h-10 md:w-10 group-hover/icon:scale-110 transition-transform duration-500" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-white/50 font-bold group-hover/icon:text-semin-yellow transition-colors">Cartão</span>
                  </div>
                </div>

                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="relative overflow-hidden w-full sm:w-auto min-w-[280px] md:min-w-[450px] font-display font-black text-xl md:text-3xl py-10 md:py-14 rounded-full bg-gradient-to-r from-semin-yellow via-amber-300 to-semin-orange text-semin-dark hover:from-white hover:to-white hover:text-semin-dark shadow-[0_20px_50px_rgba(210,155,33,0.4)] transition-all duration-500 active:scale-95 hover:scale-[1.02] hover:shadow-[0_20px_80px_rgba(210,155,33,0.6)] group/btn border-2 border-transparent hover:border-semin-yellow/50"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-[150%] group-hover/btn:animate-[shimmer_2s_infinite]" />
                  <span className="relative z-10 flex items-center justify-center gap-4 drop-shadow-sm">
                    Fazer Minha Contribuição
                    <ArrowRight className="h-6 w-6 md:h-8 md:w-8 group-hover/btn:translate-x-3 transition-transform duration-500" />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Termômetro de Arrecadação */}
        <div className={`max-w-5xl mx-auto mb-16 md:mb-24 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-14 rounded-[2.5rem] shadow-[inset_0_0_80px_rgba(0,0,0,0.8),0_40px_60px_rgba(0,0,0,0.6)]">
            {/* Top glowing line */}
            <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-8 relative z-10">
              <div className="text-center md:text-left">
                <h3 className="font-display text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">Meta do Termômetro</h3>
                <p className="font-body text-sm md:text-lg text-white/50 max-w-md">Nos ajude a bater a meta histórica do nosso cinquentenário.</p>
              </div>
              <div className="text-center md:text-right bg-white/5 px-8 py-4 rounded-3xl border border-white/5 shadow-inner">
                <p className="font-display text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-semin-yellow to-amber-500 drop-shadow-[0_0_20px_rgba(210,155,33,0.4)]">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(GOAL_AMOUNT)}
                </p>
                <p className="font-body text-sm md:text-base font-bold text-white/70 uppercase tracking-[0.1em] mt-2">
                  Acumulado: <span className="text-rose-500 font-black">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(TOTAL_RAISED)}</span>
                </p>
              </div>
            </div>

            {/* Barra de Progresso - Design Premium Termômetro Clássico (Tons de Vermelho/Laranja) */}
            <div className="relative h-10 md:h-12 w-full bg-[#05070a] rounded-full overflow-hidden border border-white/10 shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)] flex p-1.5 gap-1.5 z-10 group/bar">
              {/* Background grid pattern inside the empty bar */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px] opacity-20 pointer-events-none" />

              {/* Doações da Comunidade (Vermelho Clássico de Termômetro) */}
              <div 
                className="h-full rounded-full bg-gradient-to-r from-red-700 via-rose-600 to-red-500 transition-all duration-[2000ms] ease-out relative shadow-[0_0_25px_rgba(239,68,68,0.6)] overflow-hidden"
                style={{ width: `${percentageDonations}%` }}
              >
                {/* Flowing light effect inside the bar */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] -translate-x-full group-hover/bar:animate-[shimmer_2s_infinite]" />
                <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors rounded-full cursor-help" title={`Doações Comunitárias: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentDonations)}`} />
              </div>
              
              {/* Patrocínios (Laranja/Ouro Termômetro) */}
              <div 
                className="h-full rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 transition-all duration-[2000ms] ease-out relative shadow-[0_0_25px_rgba(249,115,22,0.6)] overflow-hidden"
                style={{ width: `${percentageSponsorships}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full group-hover/bar:animate-[shimmer_2s_infinite_0.5s]" />
                <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors rounded-full cursor-help" title={`Patrocínios Corporativos: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentSponsorships)}`} />
              </div>

              {/* Sparkle at the current edge if there's progress */}
              {TOTAL_RAISED > 0 && TOTAL_RAISED < GOAL_AMOUNT && (
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_5px_rgba(255,255,255,0.9)] z-20 pointer-events-none transition-all duration-[2000ms] ease-out animate-pulse"
                  style={{ left: `calc(${PERCENTAGE_TOTAL}% - 8px)` }}
                />
              )}
              
              {/* 3D Glass overlay on top of the entire bar */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none mix-blend-overlay" />
            </div>

            {/* Legenda e Status */}
            <div className="flex flex-col lg:flex-row items-center justify-between mt-10 gap-8 z-10 relative">
              <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 w-full lg:w-auto bg-white/5 px-8 py-4 rounded-full border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-semin-orange shadow-[0_0_12px_rgba(224,115,19,0.8)] animate-pulse" />
                  <span className="font-body text-sm md:text-base font-semibold text-white/80">
                    Comunidade <strong className="text-white text-lg ml-1">({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(currentDonations)})</strong>
                  </span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-white/10" />
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-semin-yellow shadow-[0_0_12px_rgba(210,155,33,0.8)] animate-pulse" style={{ animationDelay: '1s' }} />
                  <span className="font-body text-sm md:text-base font-semibold text-white/80">
                    Patrocínios <strong className="text-white text-lg ml-1">({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(currentSponsorships)})</strong>
                  </span>
                </div>
              </div>
              
              <div className="relative group/badge">
                <div className="absolute -inset-1 bg-gradient-to-r from-semin-yellow to-semin-orange rounded-full blur opacity-30 group-hover/badge:opacity-60 transition duration-500" />
                <div className="relative px-8 py-4 rounded-full bg-[#0a0c12] border border-semin-yellow/30 font-display font-black text-2xl md:text-3xl text-white shadow-inner flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-semin-yellow" />
                  {PERCENTAGE_TOTAL.toFixed(1)}% 
                  <span className="text-sm font-bold text-semin-yellow/80 uppercase tracking-widest ml-1">Alcançado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Footer - Neutro/Ouro */}
        <div className={`flex flex-col items-center gap-5 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="flex items-center gap-3 px-8 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner">
            <ShieldCheck className="h-5 w-5 text-semin-yellow" />
            <span className="text-white/80 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Transação 100% Segura</span>
          </div>
          <p className="font-body text-xs md:text-sm text-white/40 text-center max-w-lg leading-relaxed">
            Sua contribuição é processada com segurança de nível bancário pelo ambiente Asaas (PIX, Cartão e Boleto).
          </p>
        </div>
      </div>

      <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default CrowdfundingSection;
