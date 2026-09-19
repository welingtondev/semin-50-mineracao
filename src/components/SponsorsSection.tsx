import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Gem, Mountain, Diamond, Crown, Star, ChevronDown, Rocket } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SponsorModal } from "./SponsorModal";
import { motion, AnimatePresence } from "framer-motion";

const tiers = [
  {
    name: "Diamante",
    price: "R$ 20.000",
    icon: Diamond,
    featured: true,
    benefits: [
      "Exposição da logomarca em cartazes, folders, banners e mídias sociais do evento",
      "Inserir brindes e folheto publicitário na pasta dos participantes (peça de responsabilidade do patrocinador)",
      "Espaço para exposição da empresa (material de responsabilidade do patrocinador)",
      "Palestra de 30 min + 10 min de Q&A sobre tema inspirado no norte do congresso",
      "Mediação oficial em um dos 4 Painéis de Discussão Técnicos (Desmonte, Terras Raras, Gestão e Inovação)",
      "Logomarca no porta-moedas da moeda comemorativa dos 50 anos de Engenharia de Minas",
      "Logomarca como mecenas / patrocinador do documentário dos 50 anos da Engenharia de Minas na UFBA",
      "Patrocinador Oficial do DESAFIO SEMIN UFBA",
    ],
  },
  {
    name: "Córindon",
    price: "R$ 10.000",
    icon: Gem,
    featured: false,
    accentFrom: "from-rose-500",
    accentTo: "to-pink-600",
    iconColor: "text-rose-400",
    checkColor: "text-rose-400",
    badgeBg: "bg-gradient-to-r from-rose-500 to-pink-500",
    borderColor: "border-rose-500/30",
    glowShadow: "hover:shadow-rose-500/20",
    benefits: [
      "Exposição da logomarca em cartazes, folders, banners e mídias sociais do evento",
      "Inserir brindes e folheto publicitário na pasta dos participantes (peça de responsabilidade do patrocinador)",
      "Espaço para exposição da empresa (material de responsabilidade do patrocinador)",
      "Palestra de 30 min + 10 min de Q&A sobre tema inspirado no norte do congresso",
      "Mediação oficial em um dos 4 Painéis de Discussão Técnicos (Desmonte, Terras Raras, Gestão e Inovação)",
      "Patrocinador Oficial do DESAFIO SEMIN UFBA",
    ],
  },
  {
    name: "Topázio",
    price: "R$ 5.000",
    icon: Star,
    featured: false,
    accentFrom: "from-amber-400",
    accentTo: "to-yellow-600",
    iconColor: "text-amber-400",
    checkColor: "text-amber-400",
    badgeBg: "bg-gradient-to-r from-amber-400 to-yellow-600",
    borderColor: "border-amber-500/30",
    glowShadow: "hover:shadow-amber-500/20",
    benefits: [
      "Exposição da logomarca em cartazes, folders, banners e mídias sociais do evento",
      "Inserir brindes e folheto publicitário na pasta dos participantes (peça de responsabilidade do patrocinador)",
      "Palestra de 30 min + 10 min de Q&A sobre tema inspirado no norte do congresso",
    ],
  },
  {
    name: "Quartzo",
    price: "R$ 2.500",
    icon: Mountain,
    featured: false,
    accentFrom: "from-slate-400",
    accentTo: "to-slate-600",
    iconColor: "text-slate-300",
    checkColor: "text-slate-300",
    badgeBg: "bg-gradient-to-r from-slate-500 to-slate-600",
    borderColor: "border-slate-500/30",
    glowShadow: "hover:shadow-slate-500/20",
    benefits: [
      "Exposição da logomarca em cartazes, folders, banners e mídias sociais do evento",
      "Inserir brindes e folheto publicitário na pasta dos participantes (peça de responsabilidade do patrocinador)",
    ],
  },
];

const SponsorsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({
    Diamante: true,
  });

  const toggleTier = (name: string) => {
    setExpandedTiers(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <section id="parceiros" className="py-24 md:py-36 bg-semin-dark relative overflow-hidden text-white border-t border-semin-yellow/20">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-semin-orange/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Decorative Top Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-semin-yellow to-transparent opacity-50" />

      <div ref={ref} className="container mx-auto px-4 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className={`text-center mb-16 md:mb-24 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2 font-body text-xs md:text-sm uppercase tracking-[0.3em] text-semin-yellow font-bold mb-4 bg-semin-yellow/10 px-4 py-1.5 rounded-full border border-semin-yellow/20">
            <Sparkles className="h-4 w-4" />
            Oportunidades de Parceria
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
            Cotas de <span className="bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange bg-clip-text text-transparent">Patrocínio</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 md:w-20 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow" />
            <Crown className="h-5 w-5 text-semin-yellow" />
            <div className="w-12 md:w-20 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow" />
          </div>
          <p className="font-body text-base md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed font-light">
            Conecte sua empresa aos futuros líderes e aos mais renomados especialistas da mineração na Bahia e no Brasil através de cotas exclusivas de alto impacto.
          </p>
        </div>

        {/* ── COTA DIAMANTE - destaque principal ── */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16">
          <div
            className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            <div className="relative group">
              {/* Outer Intense Glow */}
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 opacity-30 group-hover:opacity-60 blur-xl transition-all duration-500 animate-pulse" />

              <Card className="relative overflow-hidden bg-gradient-to-b from-[#0b1528] via-[#08101e] to-[#040811] border-2 border-sky-400/50 rounded-[2rem] shadow-[0_0_50px_rgba(56,189,248,0.2)]">
                {/* Internal dynamic mesh & reflections */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/10 via-transparent to-transparent pointer-events-none" />

                <CardHeader className="text-center pb-4 pt-12 md:pt-16 px-6 md:px-10 relative z-10">
                  <div className="inline-flex mx-auto mb-6 px-6 py-2.5 rounded-full text-xs md:text-sm font-bold bg-white/5 border border-sky-400/30 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.15)] tracking-[0.2em] uppercase">
                    <Crown className="h-4 w-4 mr-2.5 text-sky-400" />
                    Cota Diamante
                  </div>
                  <Diamond className="h-20 w-20 md:h-28 md:w-28 mx-auto text-sky-400 drop-shadow-[0_0_25px_rgba(56,189,248,0.4)]" />
                  <div className="mt-6 md:mt-8">
                    <span className="font-display text-5xl md:text-7xl font-black bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent drop-shadow-lg">R$ 20.000</span>
                  </div>
                </CardHeader>
                <CardContent className="px-6 md:px-14 pb-12 relative z-10">
                  <div className="text-center mb-8">
                    <Button
                      variant="ghost"
                      onClick={() => toggleTier("Diamante")}
                      className="text-sky-300 hover:text-sky-200 hover:bg-sky-400/10 font-bold gap-2 rounded-xl transition-all duration-300 border border-sky-400/20"
                    >
                      {expandedTiers["Diamante"] ? "Ocultar Pacote de Benefícios" : "Ver Pacote de Benefícios"}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expandedTiers["Diamante"] ? "rotate-180" : ""}`} />
                    </Button>
                  </div>

                  <AnimatePresence>
                    {expandedTiers["Diamante"] && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-x-12 md:gap-y-6 border-t border-white/10 pt-8 overflow-hidden"
                      >
                        {tiers[0].benefits.map((b) => (
                          <div key={b} className="flex items-start gap-4">
                            <div className="mt-1 shrink-0 w-6 h-6 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                              <Check className="h-3.5 w-3.5 text-sky-300" />
                            </div>
                            <span className="font-body text-sm md:text-base text-white/80 leading-relaxed">{b}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* ── DEMAIS COTAS ── grid uniforme ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {tiers.slice(1).map((t, i) => (
            <div
              key={t.name}
              className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: `${i * 150 + 400}ms` }}
            >
              <Card
                className={`relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col group hover:bg-white/10`}
              >
                {/* Glowing border effect on hover */}
                <div className={`absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-b ${t.accentFrom} to-transparent`} style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', padding: '1px' }} />

                <CardHeader className="text-center pb-4 px-6 md:px-8 pt-10">
                  <div className={`inline-flex mx-auto items-center gap-1.5 mb-5 px-4 py-1.5 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-white/90 uppercase tracking-widest`}>
                    Cota {t.name}
                  </div>
                  <t.icon className={`h-12 w-12 md:h-16 md:w-16 mx-auto ${t.iconColor} drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-transform duration-500 group-hover:scale-110`} />
                  <div className="mt-5 md:mt-6">
                    <span className="font-display text-3xl md:text-4xl font-bold text-white">{t.price}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 px-6 md:px-8 pb-8 flex-1 flex flex-col justify-between relative z-10">
                  <div className="text-center mt-4 mb-6">
                    <Button
                      variant="ghost"
                      onClick={() => toggleTier(t.name)}
                      className="w-full text-white/60 hover:text-white hover:bg-white/10 font-bold gap-2 rounded-xl transition-all duration-300"
                    >
                      {expandedTiers[t.name] ? "Ocultar" : "Ver Benefícios"}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expandedTiers[t.name] ? "rotate-180" : ""}`} />
                    </Button>
                  </div>

                  <AnimatePresence>
                    {expandedTiers[t.name] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 border-t border-white/10 pt-6 overflow-hidden"
                      >
                        {t.benefits.map((b) => (
                          <div key={b} className="flex items-start gap-3">
                            <div className={`mt-1 shrink-0 w-5 h-5 rounded-full bg-white/5 border border-white/20 flex items-center justify-center`}>
                              <Check className={`h-3 w-3 ${t.iconColor}`} />
                            </div>
                            <span className="font-body text-xs md:text-sm text-white/70 leading-relaxed">{b}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* ── CTA Button ── */}
        <div className={`text-center mt-16 md:mt-24 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "800ms" }}>
          <SponsorModal>
            <div className="relative inline-flex cta-float cursor-pointer">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-semin-yellow via-semin-orange to-semin-yellow opacity-40 blur-xl animate-pulse" />
              <Button
                size="lg"
                className="relative bg-gradient-to-r from-semin-yellow via-amber-500 to-semin-orange text-semin-dark hover:from-amber-400 hover:via-semin-yellow hover:to-amber-500 font-black text-base md:text-xl px-10 md:px-16 py-8 md:py-10 rounded-2xl shadow-[0_0_40px_rgba(224,115,19,0.3)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(224,115,19,0.5)] active:scale-95 group"
              >
                <Rocket className="h-5 w-5 md:h-6 md:w-6 mr-3 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300" />
                Seja um Patrocinador Oficial
              </Button>
            </div>
          </SponsorModal>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;