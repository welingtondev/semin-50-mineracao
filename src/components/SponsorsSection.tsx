import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Award, Medal, Heart } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const tiers = [
  {
    name: "Ouro",
    icon: Crown,
    color: "border-semin-yellow bg-gradient-to-b from-semin-yellow/10 to-white",
    iconColor: "text-semin-yellow",
    badge: "bg-semin-yellow text-semin-dark",
    featured: true,
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
    color: "border-gray-300 bg-gradient-to-b from-gray-50 to-white",
    iconColor: "text-gray-400",
    badge: "bg-gray-200 text-gray-700",
    featured: false,
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
    color: "border-amber-700/30 bg-gradient-to-b from-amber-50 to-white",
    iconColor: "text-amber-700",
    badge: "bg-amber-100 text-amber-800",
    featured: false,
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
    color: "border-semin-blue/20 bg-gradient-to-b from-semin-blue/5 to-white",
    iconColor: "text-semin-blue",
    badge: "bg-semin-blue/10 text-semin-blue",
    featured: false,
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
    <section id="patrocinio" className="py-20 md:py-28 bg-white">
      <div ref={ref} className="container mx-auto px-4">
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-semin-blue mb-4">
            Cotas de Patrocínio
          </h2>
          <p className="font-body text-semin-blue/60 max-w-xl mx-auto">
            Associe sua marca ao principal evento de mineração da UFBA e conecte-se com futuros profissionais e líderes do setor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {tiers.map((t, i) => (
            <Card
              key={t.name}
              className={`${t.color} border-2 shadow-sm hover:shadow-xl transition-all duration-500 ${
                t.featured ? "lg:-mt-4 lg:mb-4 ring-2 ring-semin-yellow/30" : ""
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <CardHeader className="text-center pb-2">
                <div className={`inline-flex mx-auto mb-3 px-3 py-1 rounded-full text-xs font-bold ${t.badge}`}>
                  {t.featured && "★ "}Cota {t.name}
                </div>
                <t.icon className={`h-10 w-10 mx-auto ${t.iconColor}`} />
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {t.benefits.map((b) => (
                  <div key={b} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-semin-yellow mt-0.5 shrink-0" />
                    <span className="font-body text-sm text-semin-blue/70">{b}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="mailto:semin@ufba.br">
            <Button
              size="lg"
              className="bg-semin-yellow text-semin-dark hover:bg-semin-orange hover:text-white font-semibold text-lg px-10 py-6 shadow-lg shadow-semin-yellow/20"
            >
              Quero Patrocinar o SEMIN
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
