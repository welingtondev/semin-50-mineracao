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
      "Palestra de 30 min + 10 min de Q & A sobre tema inspirado no norte do congresso",
      "Representante em um dos painéis do evento para expor a visão da empresa",
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
      "Palestra de 30 min + 10 min de Q & A sobre tema inspirado no norte do congresso",
      "Representante em um dos painéis do evento para expor a visão da empresa",
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
      "Palestra de 30 min + 10 min de Q & A sobre tema inspirado no norte do congresso",
    ],
  },
  {
    name: "Quartzo",
    price: "R$ 2.500",
    icon: Mountain,
    featured: false,
    accentFrom: "from-slate-300",
    accentTo: "to-slate-500",
    iconColor: "text-slate-300",
    checkColor: "text-slate-300",
    badgeBg: "bg-gradient-to-r from-slate-400 to-slate-600",
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
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({});

  const toggleTier = (name: string) => {
    setExpandedTiers(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <section id="patrocinio" className="py-24 md:py-36 bg-semin-dark relative overflow-hidden">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-[linear-gradient(90deg,transparent_0%,hsl(var(--semin-yellow))_50%,transparent_100%)] opacity-20" />

      {/* Background ornaments */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-[800px] h-[500px] bg-semin-yellow/5 rounded-[100%] blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] w-72 md:w-[500px] h-72 md:h-[500px] bg-sky-500/5 rounded-full blur-[100px]" />
        
        <Diamond className="absolute top-[20%] left-[10%] h-8 w-8 md:h-12 md:w-12 text-sky-400/20 float-gem-2 hidden md:block" />
        <Crown className="absolute bottom-[25%] right-[10%] h-8 w-8 md:h-10 md:w-10 text-amber-400/20 float-gem-3 hidden md:block" />
        <Gem className="absolute top-[45%] right-[8%] h-6 w-6 text-rose-400/15 float-gem-1 hidden md:block" />

        {/* Subtle grid pattern for dark mode */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        {/* ── Header ── */}
        <div className={`text-center mb-16 md:mb-24 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <span className="inline-flex items-center gap-2.5 font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-semin-yellow font-bold mb-4 md:mb-5">
            <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5" />
            Faça parte da história
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 tracking-tight leading-tight text-white">
            Cotas de <span className="bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-yellow bg-clip-text text-transparent">Patrocínio</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-5 md:mb-8">
            <div className="w-12 md:w-24 h-px bg-gradient-to-r from-transparent to-semin-yellow/50" />
            <Gem className="h-4 w-4 md:h-6 md:w-6 text-semin-yellow" />
            <div className="w-12 md:w-24 h-px bg-gradient-to-l from-transparent to-semin-yellow/50" />
          </div>
          <p className="font-body text-sm md:text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
            Associe a sua marca ao maior evento acadêmico de Engenharia de Minas do Norte e Nordeste, ganhando destaque absoluto na celebração histórica do Jubileu de Ouro (50 anos) do curso.
          </p>
        </div>

        {/* ── COTA DIAMANTE — destaque principal ── */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-20">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="relative group">
              {/* Glowing aura behind diamond card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 via-indigo-500 to-sky-400 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              
              <Card className="relative overflow-hidden bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl transition-all duration-500">
                {/* Premium top bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-300" />
                
                {/* Internal highlight gradients */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

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

        {/* ── DEMAIS COTAS — grid uniforme ── */}
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
