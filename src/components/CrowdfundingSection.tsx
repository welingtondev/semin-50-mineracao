import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { 
  Heart, Sparkles, ArrowRight, ShieldCheck, QrCode, CreditCard, 
  Gem, Award, Film, BookOpen, Check, Star, Users, Flame
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CheckoutModal from "./CheckoutModal";

const SponsorModal = lazy(() => import("./SponsorModal").then(m => ({ default: m.SponsorModal })));

const RECENT_TESTIMONIALS = [
  { text: "Orgulho incomensurável de fazer parte desses 50 anos que moldaram minha história e profissão.", author: "Eng. Turma 1986" },
  { text: "Pela formação de excelência que a Poli nos proporcionou. Vamos juntos fazer a maior edição da história!", author: "Ex-aluno & Apoiador" },
  { text: "Uma homenagem merecida a todos os mestres e pioneiros que construíram a Engenharia de Minas da Bahia.", author: "Comunidade UFBA" }
];

const CrowdfundingSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const formatBRLInput = (val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) return "";
    const cents = parseInt(clean, 10);
    const floatVal = cents / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(floatVal);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomValue(formatBRLInput(e.target.value));
  };

  const handleOpenCheckout = () => {
    setIsModalOpen(true);
  };

  return (
    <section id="apoie" className="py-24 md:py-36 bg-[#07090e] relative overflow-hidden text-white border-t border-amber-500/20">
      
      {/* ── LUXURY AMBIENT BACKGROUND GLOWS ── */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-amber-500/15 via-yellow-500/5 to-transparent rounded-full blur-[160px] pointer-events-none animate-pulse" style={{ animationDuration: "7s" }} />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-semin-orange/15 via-amber-600/5 to-transparent rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: "9s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Subtle Gold Dust Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Top Gold Horizon Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

      <div ref={ref} className="container mx-auto px-4 relative z-10 max-w-5xl">
        
        {/* ── HEADER ── */}
        <div className={`text-center mb-16 md:mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-xl mb-6 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <Sparkles className="h-4 w-4 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
            <span className="font-body text-xs md:text-sm uppercase tracking-[0.25em] font-bold text-amber-300">
              Financiamento Coletivo · Jubileu de Ouro
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Eternize seu Nome no <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
              Livro de Ouro dos 50 Anos
            </span>
          </h2>

          <p className="font-body text-base md:text-xl text-white/75 max-w-3xl mx-auto leading-relaxed font-light">
            Não há valores fixos: cada contribuição — seja de ex-aluno, professor, estudante ou amigo da Escola Politécnica — é uma demonstração de carinho que viabiliza o evento, o documentário histórico e perpetua sua memória na Engenharia de Minas da UFBA.
          </p>

          {/* Key Pillars */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-xs md:text-sm text-white/60">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Registro Histórico Perpétuo</span>
            </div>
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-400" />
              <span>Apoio ao Documentário Oficial</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Certificado Oficial de Benfeitor</span>
            </div>
          </div>
        </div>

        {/* ── CENTRAL OPEN-DONATION CARD ── */}
        <div className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="relative group">
            {/* Ambient Halo */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/25 via-yellow-500/35 to-semin-orange/25 rounded-[3rem] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative bg-[#0d121d]/90 backdrop-blur-2xl border border-amber-500/30 p-8 md:p-16 rounded-[3rem] shadow-2xl text-center overflow-hidden">
              
              {/* Gold Top Crest */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-amber-400/20 to-semin-orange/10 border border-amber-400/40 flex items-center justify-center mx-auto mb-8 shadow-inner relative group-hover:scale-105 transition-transform duration-500">
                <Heart className="w-10 h-10 md:w-12 md:h-12 text-amber-400 fill-amber-400/30 animate-pulse" />
              </div>

              <h3 className="text-2xl md:text-4xl font-black text-white mb-4 font-display">
                Contribua com o Valor que Desejar
              </h3>
              
              <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto mb-10 leading-relaxed font-light">
                Defina livremente a quantia com a qual deseja colaborar. Seu nome será inserido no Livro de Ouro oficial e exibido com honra nos memoriais do Cinquentenário.
              </p>

              {/* Direct Value Input with Mask */}
              <div className="max-w-md mx-auto mb-8">
                <label className="block text-xs uppercase tracking-widest font-bold text-amber-400/90 mb-3">
                  Digite o valor da sua contribuição:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={customValue}
                    onChange={handleCustomChange}
                    placeholder="R$ 0,00"
                    className="w-full h-16 md:h-20 bg-black/40 border-2 border-amber-500/40 focus:border-amber-400 rounded-2xl text-center text-3xl md:text-4xl font-black text-amber-300 placeholder:text-white/20 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all font-display"
                  />
                </div>
                <p className="text-[11px] text-white/40 mt-2 font-medium">
                  Você também pode ajustar o valor diretamente na tela de pagamento a seguir.
                </p>
              </div>

              {/* Primary Master CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <Button
                  onClick={handleOpenCheckout}
                  className="relative overflow-hidden w-full sm:w-auto min-w-[280px] md:min-w-[420px] h-16 md:h-18 font-display font-black text-lg md:text-xl rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-semin-orange text-black hover:from-amber-300 hover:via-yellow-300 hover:to-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.35)] transition-all duration-500 active:scale-95 group/btn border-2 border-amber-300/40 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] -translate-x-[150%] group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                  <span className="relative z-10 flex items-center justify-center gap-3 drop-shadow-sm">
                    <Heart className="w-6 h-6 fill-black" />
                    {customValue ? `Fazer Doação de ${customValue}` : "Fazer Minha Contribuição"}
                    <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 transition-transform duration-500" />
                  </span>
                </Button>
              </div>

              {/* What Every Donor Receives */}
              <div className="pt-8 border-t border-white/10 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/40">
                      <Check className="w-3 h-3 text-amber-300" />
                    </div>
                    <span className="text-xs text-white/80 leading-snug">Nome no Livro de Ouro Perpétuo</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/40">
                      <Check className="w-3 h-3 text-amber-300" />
                    </div>
                    <span className="text-xs text-white/80 leading-snug">Certificado Oficial do Jubileu</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/40">
                      <Check className="w-3 h-3 text-amber-300" />
                    </div>
                    <span className="text-xs text-white/80 leading-snug">Apoio direto ao Documentário</span>
                  </div>
                </div>
              </div>

              {/* Accepted Payment badges */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-white/50">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>PIX Instantâneo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Cartão de Crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Ambiente Protegido ASAAS</span>
                </div>
              </div>

              {/* Corporate Sponsorship Alternative */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-xs text-white/50 mb-3">
                  Representa uma empresa, mineradora ou fornecedor e busca patrocínio institucional com estande e palestras?
                </p>
                <Suspense fallback={null}>
                  <SponsorModal>
                    <Button
                      variant="ghost"
                      className="text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 font-bold text-xs md:text-sm rounded-xl px-5 py-2 transition-all gap-2"
                    >
                      <Gem className="w-4 h-4" />
                      Conhecer Oportunidades de Patrocínio Corporativo
                    </Button>
                  </SponsorModal>
                </Suspense>
              </div>

            </div>
          </div>
        </div>

        {/* ── TESTIMONIAL QUOTES ── */}
        <div className={`max-w-3xl mx-auto text-center mt-12 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
            <p className="text-sm md:text-base italic text-white/70 font-serif leading-relaxed mb-3">
              "{RECENT_TESTIMONIALS[activeTestimonial].text}"
            </p>
            <div className="flex items-center justify-center gap-3 text-xs font-bold text-amber-400/80">
              <Award className="w-3.5 h-3.5" />
              <span>{RECENT_TESTIMONIALS[activeTestimonial].author}</span>
            </div>
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {RECENT_TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeTestimonial === i ? "w-6 bg-amber-400" : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Depoimento ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialValue={customValue}
      />
    </section>
  );
};

export default CrowdfundingSection;
