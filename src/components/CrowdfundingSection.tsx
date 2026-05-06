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
    <section id="apoie" className="py-16 md:py-32 bg-semin-dark relative overflow-hidden">
      {/* Background elements - Paleta Ouro e Dark do Site */}
      <div className="absolute top-0 left-0 w-full h-px bg-[linear-gradient(90deg,#0a0d12_0%,#0a0d12_35%,#d29b21_50%,#0a0d12_65%,#0a0d12_100%)] opacity-30" />
      <div className="absolute top-0 right-0 w-64 md:w-[600px] h-64 md:h-[600px] bg-semin-yellow/5 rounded-full blur-[60px] md:blur-[140px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 md:w-[500px] h-48 md:h-[500px] bg-semin-orange/5 rounded-full blur-[40px] md:blur-[120px] mix-blend-screen pointer-events-none" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[700px] h-[300px] md:h-[700px] border border-semin-yellow/[0.03] rounded-full pointer-events-none" />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 md:mb-24 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-semin-yellow/30 bg-semin-yellow/10 backdrop-blur-md mb-8 shadow-[0_0_30px_rgba(210,155,33,0.15)]">
            <Sparkles className="h-4 w-4 text-semin-yellow" />
            <span className="font-body text-xs md:text-sm uppercase tracking-[0.25em] font-bold text-semin-yellow">
              Apoio Comunitário
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 md:mb-8 tracking-tight leading-tight">
            Viabilize a nossa <span className="text-semin-yellow">Festa</span>
          </h2>

          <p className="font-body text-base md:text-xl text-white/60 max-w-2xl mx-auto mb-10 md:mb-16 leading-relaxed font-medium">
            Organizar um evento histórico de 50 anos exige um esforço monumental. Sua ajuda é fundamental para mantermos viva a nossa história e realizarmos esta celebração.
          </p>
        </div>

        {/* Premium Support Card */}
        <div className={`max-w-3xl mx-auto mb-16 md:mb-20 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-semin-yellow/20 via-amber-400/10 to-semin-orange/20 rounded-[3rem] opacity-40 group-hover:opacity-70 blur-2xl transition duration-1000"></div>
            
            <div className="relative bg-[#0a0d12]/80 backdrop-blur-3xl border border-white/10 p-10 md:p-16 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] text-center overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-semin-yellow/50 to-transparent" />
              
              <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-semin-yellow/20 to-semin-orange/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-semin-yellow/20 shadow-[0_0_30px_rgba(210,155,33,0.2)] relative overflow-hidden group-hover:scale-110 transition-transform duration-700">
                <div className="absolute inset-0 bg-semin-yellow/10 animate-pulse" />
                <Heart className="h-12 w-12 md:h-14 md:w-14 text-semin-yellow relative z-10 drop-shadow-md" fill="currentColor" />
              </div>

              <div className="flex flex-col items-center gap-10">
                <div className="flex items-center justify-center gap-8 md:gap-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-semin-yellow group-hover:border-semin-yellow/40 transition-colors duration-500 shadow-inner">
                      <QrCode className="h-7 w-7 md:h-8 md:w-8" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-white/50 font-bold">PIX</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-semin-yellow group-hover:border-semin-yellow/40 transition-colors duration-500 shadow-inner">
                      <CreditCard className="h-7 w-7 md:h-8 md:w-8" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-white/50 font-bold">Cartão</span>
                  </div>
                </div>

                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto min-w-[280px] md:min-w-[400px] font-display font-black text-xl md:text-2xl py-8 md:py-12 rounded-3xl bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange text-semin-dark hover:from-white hover:to-white hover:text-semin-dark shadow-[0_20px_50px_rgba(210,155,33,0.3)] transition-all duration-500 active:scale-95 hover:scale-[1.03] hover:shadow-[0_20px_60px_rgba(210,155,33,0.5)] group/btn"
                >
                  <span className="flex items-center justify-center gap-4">
                    Fazer Minha Contribuição
                    <ArrowRight className="h-6 w-6 md:h-7 md:w-7 group-hover/btn:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Termômetro de Arrecadação */}
        <div className={`max-w-4xl mx-auto mb-16 md:mb-24 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="relative bg-[#0a0d12]/80 backdrop-blur-3xl border border-semin-yellow/10 p-8 md:p-12 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-0 bg-gradient-to-b from-semin-yellow/[0.02] to-transparent rounded-[2rem] pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-8 gap-6 relative z-10">
              <div className="text-center sm:text-left">
                <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">Meta de Arrecadação</h3>
                <p className="font-body text-sm md:text-base text-white/50">Acompanhe o progresso rumo ao SEMIN 50 Anos</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="font-display text-4xl md:text-6xl font-black text-semin-yellow drop-shadow-[0_0_15px_rgba(210,155,33,0.3)]">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(TOTAL_RAISED)}
                </p>
                <p className="font-body text-xs md:text-sm font-bold text-white/40 uppercase tracking-widest mt-1">
                  de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(GOAL_AMOUNT)}
                </p>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="relative h-6 md:h-8 w-full bg-black/50 rounded-full overflow-hidden border border-white/10 shadow-inner flex p-1 gap-1 z-10">
              {/* Doações da Comunidade */}
              <div 
                className="h-full rounded-full bg-gradient-to-r from-semin-orange to-rose-500 transition-all duration-1000 relative"
                style={{ width: `${percentageDonations}%` }}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity rounded-full cursor-help" title={`Doações: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentDonations)}`} />
              </div>
              
              {/* Patrocínios */}
              <div 
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-semin-yellow transition-all duration-1000 relative"
                style={{ width: `${percentageSponsorships}%` }}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity rounded-full cursor-help" title={`Patrocínios: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentSponsorships)}`} />
              </div>
              
              {/* Gloss effect */}
              <div className="absolute top-1 left-1 right-1 h-1/3 bg-white/20 rounded-full pointer-events-none" />
            </div>

            {/* Legenda */}
            <div className="flex flex-col md:flex-row items-center justify-between mt-6 md:mt-8 gap-6 z-10 relative">
              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-semin-orange shadow-[0_0_8px_rgba(224,115,19,0.5)]" />
                  <span className="font-body text-xs md:text-sm font-medium text-white/70">
                    Apoio da Comunidade <strong className="text-white">({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(currentDonations)})</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-semin-yellow shadow-[0_0_8px_rgba(210,155,33,0.5)]" />
                  <span className="font-body text-xs md:text-sm font-medium text-white/70">
                    Patrocínios Corporativos <strong className="text-white">({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(currentSponsorships)})</strong>
                  </span>
                </div>
              </div>
              
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 font-display font-bold text-xl md:text-2xl text-white/90 shadow-inner">
                {PERCENTAGE_TOTAL.toFixed(1)}% <span className="text-xs font-medium text-white/50 uppercase tracking-widest ml-1">Alcançado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Footer - Neutro/Ouro */}
        <div className={`flex flex-col items-center gap-4 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <ShieldCheck className="h-5 w-5 text-semin-yellow" />
            <span className="text-white/70 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em]">Transação Segura via ASAAS</span>
          </div>
          <p className="font-body text-xs md:text-sm text-white/30 text-center leading-relaxed">
            Sua contribuição é processada com segurança pelo ambiente Asaas (PIX, Cartão e Boleto).
          </p>
        </div>
      </div>

      <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default CrowdfundingSection;
