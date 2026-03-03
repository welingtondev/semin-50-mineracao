import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Award, Medal, Heart, Sparkles, Gem, Mountain } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const tiers = [
  {
    name: "Ouro",
    icon: Crown,
    gradient: "from-semin-yellow/20 via-yellow-50 to-white",
    border: "border-semin-yellow",
    iconColor: "text-semin-yellow",
    badge: "bg-gradient-to-r from-semin-yellow to-semin-orange text-white",
    featured: true,
    glow: "shadow-semin-yellow/20",
    benefits: [
      "Logo em destaque em todos os materiais",
      "Espaço exclusivo para stand",
      "5 inscrições cortesia",
      "Palestra de 30 minutos",
      "Menção em mídias sociais",
      "Banner no local do evento",
    ],
  },
  {
    name: "Prata",
    icon: Award,
    gradient: "from-gray-100 via-gray-50 to-white",
    border: "border-gray-300",
    iconColor: "text-gray-400",
    badge: "bg-gray-200 text-gray-700",
    featured: false,
    glow: "",
    benefits: [
      "Logo nos materiais do evento",
      "Espaço para stand compartilhado",
      "3 inscrições cortesia",
      "Menção em mídias sociais",
      "Banner no local do evento",
    ],
  },
  {
    name: "Bronze",
    icon: Medal,
    gradient: "from-amber-100/50 via-amber-50 to-white",
    border: "border-amber-700/30",
    iconColor: "text-amber-700",
    badge: "bg-amber-100 text-amber-800",
    featured: false,
    glow: "",
    benefits: [
      "Logo nos materiais do evento",
      "2 inscrições cortesia",
      "Menção em mídias sociais",
      "Banner no local do evento",
    ],
  },
  {
    name: "Apoiador",
    icon: Heart,
    gradient: "from-semin-blue/5 via-blue-50/30 to-white",
    border: "border-semin-blue/20",
    iconColor: "text-semin-blue",
    badge: "bg-semin-blue/10 text-semin-blue",
    featured: false,
    glow: "",
    benefits: [
      "Logo no site do evento",
      "1 inscrição cortesia",
      "Menção em mídias sociais",
    ],
  },
];

const SponsorsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="patrocinio" className="py-16 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-semin-yellow via-semin-orange to-semin-yellow" />
      <div className="absolute bottom-10 right-10 opacity-[0.02] hidden md:block">
        <Mountain className="w-48 h-48 text-semin-blue" />
      </div>

      <div ref={ref} className="container mx-auto px-4">
        <div className={`text-center mb-10 md:mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-semin-orange font-semibold mb-3 md:mb-4">
            <Gem className="h-3 w-3 md:h-3.5 md:w-3.5" />
            Invista no futuro
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-semin-blue mb-3 md:mb-4">
            Cotas de Patrocínio
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
            <div className="w-8 md:w-12 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Gem className="h-3.5 w-3.5 md:h-4 md:w-4 text-semin-yellow" />
            <div className="w-8 md:w-12 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>
          <p className="font-body text-sm md:text-base text-semin-blue/60 max-w-xl mx-auto">
            Associe sua marca ao principal evento de mineração da UFBA.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {tiers.map((t, i) => (
            <div
              key={t.name}
              className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${t.featured ? "lg:-mt-4 lg:mb-4" : ""}`}
              style={{ transitionDelay: `${i * 100 + 200}ms` }}
            >
              <Card
                className={`bg-gradient-to-b ${t.gradient} border-2 ${t.border} shadow-sm hover:shadow-2xl ${t.glow} transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 h-full active:scale-[0.98] ${
                  t.featured ? "ring-2 ring-semin-yellow/30" : ""
                }`}
              >
                <CardHeader className="text-center pb-2 px-4 md:px-6">
                  {t.featured && (
                    <div className="flex justify-center mb-2">
                      <Sparkles className="h-4 w-4 text-semin-yellow" />
                    </div>
                  )}
                  <div className={`inline-flex mx-auto mb-2 md:mb-3 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold ${t.badge} shadow-sm`}>
                    {t.featured && "★ "}Cota {t.name}
                  </div>
                  <t.icon className={`h-8 w-8 md:h-12 md:w-12 mx-auto ${t.iconColor} drop-shadow-sm`} />
                </CardHeader>
                <CardContent className="space-y-2 md:space-y-3 pt-0 px-4 md:px-6">
                  {t.benefits.map((b) => (
                    <div key={b} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-semin-yellow mt-0.5 shrink-0" />
                      <span className="font-body text-xs md:text-sm text-semin-blue/70">{b}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className={`text-center mt-10 md:mt-14 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "600ms" }}>
          <a href="mailto:semin@ufba.br">
            <Button
              size="lg"
              className="bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark hover:from-semin-orange hover:to-semin-yellow font-bold text-sm md:text-lg px-8 md:px-12 py-6 md:py-7 shadow-xl shadow-semin-yellow/25 transition-all duration-300 hover:shadow-semin-yellow/40 active:scale-95 md:hover:scale-105 group"
            >
              <Gem className="h-4 w-4 md:h-5 md:w-5 mr-2 group-hover:rotate-12 transition-transform" />
              Quero Patrocinar o SEMIN
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
