import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Gem, Mountain, Diamond, Crown, Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SponsorModal } from "./SponsorModal";

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
    accentTo: "to-pink-400",
    iconColor: "text-rose-400",
    checkColor: "text-rose-400",
    badgeBg: "bg-gradient-to-r from-rose-500 to-pink-500",
    borderColor: "border-rose-400/30",
    glowShadow: "hover:shadow-rose-400/15",
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
    icon: Gem,
    featured: false,
    accentFrom: "from-amber-500",
    accentTo: "to-yellow-400",
    iconColor: "text-amber-400",
    checkColor: "text-amber-400",
    badgeBg: "bg-gradient-to-r from-amber-500 to-yellow-500",
    borderColor: "border-amber-400/30",
    glowShadow: "hover:shadow-amber-400/15",
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
    accentFrom: "from-slate-400",
    accentTo: "to-gray-400",
    iconColor: "text-slate-400",
    checkColor: "text-slate-400",
    badgeBg: "bg-gradient-to-r from-slate-500 to-gray-500",
    borderColor: "border-slate-400/25",
    glowShadow: "hover:shadow-slate-400/10",
    benefits: [
      "Exposição da logomarca em cartazes, folders, banners e mídias sociais do evento",
      "Inserir brindes e folheto publicitário na pasta dos participantes (peça de responsabilidade do patrocinador)",
    ],
  },
];

const SponsorsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="patrocinio" className="py-20 md:py-36 bg-semin-cream relative overflow-hidden">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-[linear-gradient(90deg,transparent_0%,transparent_35%,hsl(var(--semin-yellow))_50%,transparent_65%,transparent_100%)] opacity-30" />

      {/* Background ornaments */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[8%] right-[5%] w-80 md:w-[500px] h-80 md:h-[500px] bg-semin-yellow/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[8%] left-[5%] w-72 md:w-[400px] h-72 md:h-[400px] bg-semin-orange/10 rounded-full blur-[100px]" />
        <Diamond className="absolute top-[18%] left-[8%] h-8 w-8 md:h-12 md:w-12 text-sky-200/20 float-gem-2 hidden md:block" />
        <Crown className="absolute bottom-[22%] right-[10%] h-6 w-6 md:h-10 md:w-10 text-amber-200/20 float-gem-3 hidden md:block" />
        <Star className="absolute top-[40%] right-[5%] h-5 w-5 text-rose-200/15 float-gem-1 hidden md:block" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(hsl(215 32% 22%) 1px, transparent 1px), linear-gradient(90deg, hsl(215 32% 22%) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        {/* ── Header ── */}
        <div className={`text-center mb-14 md:mb-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2.5 font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-semin-orange font-semibold mb-4 md:mb-5">
            <Gem className="h-3 w-3 md:h-3.5 md:w-3.5" />
            Invista no futuro da mineração
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 tracking-tight leading-tight text-semin-blue">
            Cotas de <span className="text-semin-yellow">Patrocínio</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-5 md:mb-7">
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-r from-transparent via-semin-yellow/50 to-semin-yellow rounded-full" />
            <Gem className="h-4 w-4 md:h-5 md:w-5 text-semin-yellow/70" />
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-l from-transparent via-semin-yellow/50 to-semin-yellow rounded-full" />
          </div>
          <p className="font-body text-sm md:text-base text-semin-blue/50 max-w-xl mx-auto leading-relaxed">
            Associe sua marca ao principal evento corporativo e acadêmico de mineração da UFBA
          </p>
        </div>

        {/* ── COTA DIAMANTE — destaque principal ── */}
        <div className="max-w-4xl mx-auto mb-10 md:mb-14">
          <div
            className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-white via-sky-50/60 to-indigo-50/40 border-0 shadow-2xl shadow-sky-200/30 ring-1 ring-sky-300/40 hover:shadow-[0_25px_60px_-12px_rgba(56,189,248,0.25)] transition-all duration-500">
              {/* Premium top bar */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-300" />

              {/* Corner sparkle ornament */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6">
                <Sparkles className="h-5 w-5 md:h-7 md:w-7 text-sky-300/40 animate-pulse" />
              </div>

              <CardHeader className="text-center pb-4 pt-10 md:pt-12 px-6 md:px-10">
                <div className="inline-flex mx-auto mb-4 md:mb-5 px-6 md:px-8 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-400/30 tracking-wider uppercase">
                  <Crown className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                  Cota Diamante
                </div>
                <Diamond className="h-14 w-14 md:h-20 md:w-20 mx-auto text-sky-400 drop-shadow-lg" />
                <div className="mt-4 md:mt-5">
                  <span className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">R$ 20.000</span>
                </div>
              </CardHeader>
              <CardContent className="px-6 md:px-12 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-12 md:gap-y-5">
                  {tiers[0].benefits.map((b) => (
                    <div key={b} className="flex items-start gap-4">
                      <div className="mt-1.5 shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-sky-400 to-indigo-400 flex items-center justify-center shadow-sm shadow-sky-300/30">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="font-body text-sm md:text-base text-semin-blue/75 leading-relaxed tracking-wide">{b}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── DEMAIS COTAS — grid uniforme ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-7 max-w-5xl mx-auto">
          {tiers.slice(1).map((t, i) => (
            <div
              key={t.name}
              className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 100 + 400}ms` }}
            >
              <Card
                className={`relative overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-lg ${t.borderColor ? `ring-1 ${t.borderColor}` : "ring-1 ring-gray-200/60"} ${t.glowShadow || ""} hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full active:scale-[0.98] flex flex-col`}
              >
                {/* Top accent gradient */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${t.accentFrom || "from-slate-400"} ${t.accentTo || "to-gray-400"}`} />

                <CardHeader className="text-center pb-3 px-5 md:px-7 pt-8">
                  <div className={`inline-flex mx-auto items-center gap-1.5 mb-3 md:mb-4 px-4 md:px-5 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold ${t.badgeBg || "bg-gradient-to-r from-slate-500 to-gray-500"} text-white shadow-md tracking-wider uppercase`}>
                    Cota {t.name}
                  </div>
                  <t.icon className={`h-10 w-10 md:h-14 md:w-14 mx-auto ${t.iconColor || "text-slate-400"} drop-shadow-md`} />
                  <div className="mt-3 md:mt-4">
                    <span className="font-display text-2xl md:text-3xl font-bold text-semin-blue">{t.price}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-2 px-5 md:px-8 pb-8 flex-1">
                  {t.benefits.map((b) => (
                    <div key={b} className="flex items-start gap-3">
                      <div className={`mt-1.5 shrink-0 w-4 h-4 rounded-full bg-gradient-to-br ${t.accentFrom || "from-slate-400"} ${t.accentTo || "to-gray-400"} flex items-center justify-center shadow-sm`}>
                        <Check className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="font-body text-xs md:text-sm text-semin-blue/70 leading-relaxed tracking-wide">{b}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* ── CTA Button ── */}
        <div className={`text-center mt-14 md:mt-18 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "600ms" }}>
          <SponsorModal>
            <div className="relative inline-flex cta-float cursor-pointer">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-semin-yellow via-semin-orange to-semin-yellow opacity-30 blur-xl cta-glow" />
              <Button
                size="lg"
                className="cta-shine relative bg-gradient-to-r from-semin-yellow via-amber-400 to-semin-orange text-semin-dark hover:from-semin-orange hover:via-amber-500 hover:to-semin-yellow font-bold text-sm md:text-lg px-12 md:px-16 py-7 md:py-9 rounded-2xl shadow-2xl shadow-semin-yellow/25 transition-all duration-300 hover:shadow-semin-yellow/50 active:scale-95 md:hover:scale-105 group"
              >
                <Gem className="h-4 w-4 md:h-5 md:w-5 mr-2.5 group-hover:rotate-12 transition-transform duration-300" />
                Quero Patrocinar o SEMIN UFBA
              </Button>
            </div>
          </SponsorModal>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
