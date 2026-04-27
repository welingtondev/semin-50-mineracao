import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Heart, Sparkles, ArrowRight, ShieldCheck, QrCode, CreditCard, FileText } from "lucide-react";
import CheckoutModal from "./CheckoutModal";

const CrowdfundingSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="apoie" className="py-16 md:py-32 bg-semin-dark relative overflow-hidden">
      {/* Background elements - Paleta Ouro e Dark do Site */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-semin-yellow/20 to-transparent" />
      <div className="absolute top-0 right-0 w-64 md:w-[600px] h-64 md:h-[600px] bg-semin-yellow/5 rounded-full blur-[60px] md:blur-[140px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 md:w-[500px] h-48 md:h-[500px] bg-semin-orange/5 rounded-full blur-[40px] md:blur-[120px] mix-blend-screen pointer-events-none" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[700px] h-[300px] md:h-[700px] border border-semin-yellow/[0.03] rounded-full pointer-events-none" />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 md:mb-24 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-semin-yellow/30 bg-semin-yellow/10 backdrop-blur-md mb-8 shadow-[0_0_30px_rgba(210,155,33,0.15)]">
            <Sparkles className="h-4 w-4 text-semin-yellow" />
            <span className="font-body text-xs md:text-sm uppercase tracking-[0.3em] font-bold text-semin-yellow">
              Apoio Comunitário
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 md:mb-8 tracking-tight leading-tight">
            Precisamos de Vocês para <br className="hidden md:block" /> Realizar{" "}
            <span className="bg-gradient-to-r from-semin-yellow via-amber-300 to-semin-orange bg-clip-text text-transparent">
              Este Sonho
            </span>
          </h2>

          <p className="font-body text-lg md:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed px-2 font-medium">
            Organizar um evento histórico de 50 anos exige um esforço monumental e os custos estruturais são altos. Hoje, pedimos o apoio de toda a nossa comunidade, parceiros e, especialmente, dos nossos egressos.
          </p>
        </div>

        {/* Premium Support Card */}
        <div className={`max-w-3xl mx-auto mb-16 md:mb-24 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="relative group">
            {/* Elegant Glow da paleta original */}
            <div className="absolute -inset-1 bg-gradient-to-r from-semin-yellow/20 via-amber-400/10 to-semin-orange/20 rounded-[3rem] opacity-40 group-hover:opacity-70 blur-2xl transition duration-1000"></div>
            
            <div className="relative bg-[#0a0d12]/80 backdrop-blur-3xl border border-white/10 p-10 md:p-16 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] text-center overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-semin-yellow/50 to-transparent" />
              
              <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-semin-yellow/20 to-semin-orange/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-semin-yellow/20 shadow-[0_0_30px_rgba(210,155,33,0.2)] relative overflow-hidden group-hover:scale-110 transition-transform duration-700">
                <div className="absolute inset-0 bg-semin-yellow/10 animate-pulse" />
                <Heart className="h-12 w-12 md:h-14 md:w-14 text-semin-yellow relative z-10 drop-shadow-md" fill="currentColor" />
              </div>

              <div className="space-y-6 mb-12">
                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                  Viabilize a nossa <span className="text-semin-yellow">Festa</span>
                </h3>
                <p className="font-body text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
                  Sem a união da comunidade, viabilizar essa celebração não seria possível. Seja você um egresso, estudante, parceiro ou entusiasta, sua ajuda é fundamental para mantermos viva a nossa história.
                </p>
              </div>
              
              {/* Payment Icons */}
              <div className="flex justify-center gap-6 md:gap-10 mb-12">
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
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-semin-yellow group-hover:border-semin-yellow/40 transition-colors duration-500 shadow-inner">
                    <FileText className="h-7 w-7 md:h-8 md:w-8" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-white/50 font-bold">Boleto</span>
                </div>
              </div>

              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto min-w-[340px] md:min-w-[400px] font-display font-black text-xl md:text-2xl py-8 md:py-12 rounded-3xl bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange text-semin-dark hover:from-white hover:to-white hover:text-semin-dark shadow-[0_20px_50px_rgba(210,155,33,0.3)] transition-all duration-500 active:scale-95 hover:scale-[1.03] hover:shadow-[0_20px_60px_rgba(210,155,33,0.5)] group/btn"
              >
                <span className="flex items-center justify-center gap-4">
                  Fazer Minha Contribuição
                  <ArrowRight className="h-6 w-6 md:h-7 md:w-7 group-hover/btn:translate-x-2 transition-transform duration-300" />
                </span>
              </Button>
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
