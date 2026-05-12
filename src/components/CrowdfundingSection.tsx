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
  // Valor padrão/reserva histórico caso não haja internet ou o banco seja resetado
  const DEFAULT_DONATIONS = 15200;
  const DEFAULT_SPONSORSHIPS = 25000;

  const [currentDonations, setCurrentDonations] = useState(() => {
    const cached = localStorage.getItem("semin_fundraising_donations");
    return cached ? Number(cached) : DEFAULT_DONATIONS;
  });
  
  const [currentSponsorships, setCurrentSponsorships] = useState(() => {
    const cached = localStorage.getItem("semin_fundraising_sponsorships");
    return cached ? Number(cached) : DEFAULT_SPONSORSHIPS;
  });

  const GOAL_AMOUNT = 102700;        // Meta total: R$ 102.700,00

  useEffect(() => {
    const fetchFundraisingData = async () => {
      try {
        const { data } = await supabase
          .from("gallery_photos")
          .select("*")
          .eq("author_name", "SYSTEM_FUNDRAISING")
          .limit(1);

        if (data && data.length > 0) {
          const parsed = JSON.parse(data[0].description || "{}");
          const donationsVal = Number(parsed.donations) || 0;
          const sponsorshipsVal = Number(parsed.sponsorships) || 0;

          // Só atualiza se vierem valores válidos para evitar resets acidentais do banco
          if (donationsVal > 0 || sponsorshipsVal > 0) {
            setCurrentDonations(donationsVal);
            setCurrentSponsorships(sponsorshipsVal);
            localStorage.setItem("semin_fundraising_donations", donationsVal.toString());
            localStorage.setItem("semin_fundraising_sponsorships", sponsorshipsVal.toString());
          }
        }
      } catch (e) {
        console.warn("Erro ao buscar ou parsear arrecadação, utilizando cache/fallback.", e);
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
    <section id="apoie" className="py-20 md:py-36 bg-semin-cream relative overflow-hidden">
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
            Viabilize a nossa <span className="text-semin-yellow">Festa</span>
          </h2>

          <p className="font-body text-base md:text-xl text-semin-blue/70 max-w-2xl mx-auto leading-relaxed font-medium">
            Organizar um evento histórico de 50 anos exige um esforço monumental. Sua ajuda é fundamental para mantermos viva a nossa história e realizarmos esta celebração épica.
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
                  className="relative overflow-hidden w-auto sm:w-auto min-w-[260px] md:min-w-[380px] font-display font-black text-lg md:text-2xl py-6 md:py-8 rounded-full bg-gradient-to-r from-semin-orange via-amber-400 to-semin-orange text-white hover:from-semin-blue hover:to-semin-blue hover:text-white shadow-[0_15px_35px_rgba(224,115,19,0.25)] transition-all duration-500 active:scale-95 hover:scale-[1.02] hover:shadow-[0_15px_45px_rgba(224,115,19,0.35)] group/btn border-2 border-transparent"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-[150%] group-hover/btn:animate-[shimmer_2s_infinite]" />
                  <span className="relative z-10 flex items-center justify-center gap-3 drop-shadow-sm">
                    Fazer Minha Contribuição
                    <ArrowRight className="h-5 w-5 md:h-6 md:w-6 group-hover/btn:translate-x-2 transition-transform duration-500" />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Termômetro de Arrecadação */}
        <div className={`max-w-5xl mx-auto mb-16 md:mb-24 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="relative bg-white/90 shadow-[0_24px_60px_rgba(0,0,0,0.04)] border border-black/[0.03] p-8 md:p-14 rounded-[2.5rem]">
            {/* Top glowing line */}
            <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-semin-orange/20 to-transparent" />
            
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-8 relative z-10">
              <div className="text-center md:text-left">
                <h3 className="font-display text-3xl md:text-5xl font-black text-semin-blue mb-3 tracking-tight">Termômetro do Cinquentenário</h3>
                <p className="font-body text-sm md:text-lg text-semin-blue/60 max-w-lg">Cada contribuição é um elo que fortalece nossa união. Juntos, vamos atingir essa meta histórica para viabilizar e consagrar a comemoração dos nossos 50 anos.</p>
              </div>
              <div className="text-center md:text-right bg-semin-cream px-8 py-4 rounded-3xl border border-black/[0.03] shadow-inner">
                <p className="font-display text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-semin-orange to-amber-600 drop-shadow-sm">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(GOAL_AMOUNT)}
                </p>
                <p className="font-body text-sm md:text-base font-bold text-semin-blue/70 uppercase tracking-[0.1em] mt-2">
                  Acumulado: <span className="text-rose-500 font-black">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(TOTAL_RAISED)}</span>
                </p>
              </div>
            </div>

            {/* Barra de Progresso - Design Premium Termômetro Clássico (Tons de Vermelho/Laranja) */}
            <div className="relative h-10 md:h-12 w-full bg-semin-cream rounded-full overflow-hidden border border-black/[0.05] shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] flex p-1.5 gap-1.5 z-10 group/bar">
              {/* Background grid pattern inside the empty bar */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:10px_10px] opacity-20 pointer-events-none" />

              {/* Doações da Comunidade (Vermelho Clássico de Termômetro) */}
              <div 
                className="h-full rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-red-500 transition-all duration-[2000ms] ease-out relative shadow-sm overflow-hidden"
                style={{ width: `${percentageDonations}%` }}
              >
                {/* Flowing light effect inside the bar */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] -translate-x-full group-hover/bar:animate-[shimmer_2s_infinite]" />
                <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors rounded-full cursor-help" title={`Doações Comunitárias: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentDonations)}`} />
              </div>
              
              {/* Patrocínios (Laranja/Ouro Termômetro) */}
              <div 
                className="h-full rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 transition-all duration-[2000ms] ease-out relative shadow-sm overflow-hidden"
                style={{ width: `${percentageSponsorships}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full group-hover/bar:animate-[shimmer_2s_infinite_0.5s]" />
                <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors rounded-full cursor-help" title={`Patrocínios Corporativos: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentSponsorships)}`} />
              </div>

              {/* Sparkle at the current edge if there's progress */}
              {TOTAL_RAISED > 0 && TOTAL_RAISED < GOAL_AMOUNT && (
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_12px_4px_rgba(239,68,68,0.5)] z-20 pointer-events-none transition-all duration-[2000ms] ease-out animate-pulse"
                  style={{ left: `calc(${PERCENTAGE_TOTAL}% - 8px)` }}
                />
              )}
              
              {/* 3D Glass overlay on top of the entire bar */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none mix-blend-overlay" />
            </div>

            {/* Legenda e Status */}
            <div className="flex flex-col lg:flex-row items-center justify-between mt-10 gap-8 z-10 relative">
              <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 w-full lg:w-auto bg-semin-cream px-8 py-4 rounded-full border border-black/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-semin-orange shadow-sm animate-pulse" />
                  <span className="font-body text-sm md:text-base font-semibold text-semin-blue/80">
                    Comunidade <strong className="text-semin-blue text-lg ml-1">({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(currentDonations)})</strong>
                  </span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-black/10" />
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-semin-yellow shadow-sm animate-pulse" style={{ animationDelay: '1s' }} />
                  <span className="font-body text-sm md:text-base font-semibold text-semin-blue/80">
                    Patrocínios <strong className="text-semin-blue text-lg ml-1">({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(currentSponsorships)})</strong>
                  </span>
                </div>
              </div>
              
              <div className="relative group/badge">
                <div className="absolute -inset-1 bg-gradient-to-r from-semin-orange to-amber-500 rounded-full blur opacity-25 group-hover/badge:opacity-50 transition duration-500" />
                <div className="relative px-8 py-4 rounded-full bg-white border border-semin-orange/30 font-display font-black text-2xl md:text-3xl text-semin-blue shadow-md flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-semin-orange" />
                  {PERCENTAGE_TOTAL.toFixed(1)}% 
                  <span className="text-sm font-bold text-semin-orange/80 uppercase tracking-widest ml-1">Alcançado</span>
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
