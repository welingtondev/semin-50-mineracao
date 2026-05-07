import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mountain, Gem } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const speakers = [
  { name: "XXXXXXX", role: "XXXXXXX", org: "XXXXXXX", initials: "XX" },
  { name: "XXXXXXX", role: "XXXXXXX", org: "XXXXXXX", initials: "XX" },
  { name: "XXXXXXX", role: "XXXXXXX", org: "XXXXXXX", initials: "XX" },
  { name: "XXXXXXX", role: "XXXXXXX", org: "XXXXXXX", initials: "XX" },
  { name: "XXXXXXX", role: "XXXXXXX", org: "XXXXXXX", initials: "XX" },
  { name: "XXXXXXX", role: "XXXXXXX", org: "XXXXXXX", initials: "XX" },
];

const SpeakersSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="palestrantes" className="py-16 md:py-32 bg-semin-cream relative overflow-hidden">
      <div className="absolute top-20 right-0 w-40 md:w-80 h-40 md:h-80 bg-semin-yellow/5 rounded-full blur-[80px] md:blur-[100px]" />
      <div className="absolute bottom-20 left-0 w-32 md:w-60 h-32 md:h-60 bg-semin-blue/5 rounded-full blur-[60px] md:blur-[80px]" />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-10 md:mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-semin-orange font-semibold mb-3 md:mb-4">
            <Gem className="h-3 w-3 md:h-3.5 md:w-3.5" />
            Quem estará lá
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-semin-blue mb-6 md:mb-8 tracking-tight leading-tight">
            Nossos <span className="text-semin-yellow">Palestrantes</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
            <div className="w-8 md:w-12 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Mountain className="h-3.5 w-3.5 md:h-4 md:w-4 text-semin-yellow/60" />
            <div className="w-8 md:w-12 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>
          <p className="font-body text-sm md:text-base text-semin-blue/70 max-w-2xl mx-auto">
            Priorizamos a participação de profissionais altamente qualificados e egressos da Engenharia de Minas da UFBA, valorizando a trajetória dos egressos que hoje são grandes referências em inovação tecnológica no mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto px-4 sm:px-0">
          {speakers.map((s, i) => (
            <div
              key={i}
              className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"}`}
              style={{ transitionDelay: `${i * 80 + 200}ms` }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-none ring-1 ring-semin-blue/[0.06] hover:ring-semin-yellow/40 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 md:hover:-translate-y-2 active:scale-[0.98]">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="relative mx-auto mb-3 md:mb-5 w-16 h-16 md:w-24 md:h-24">
                    <Avatar className="relative h-16 w-16 md:h-24 md:w-24 mx-auto ring-2 md:ring-3 ring-semin-blue/10 group-hover:ring-semin-yellow/50 transition-all duration-300">
                      <AvatarFallback className="bg-gradient-to-br from-semin-blue to-semin-dark text-white font-display text-base md:text-xl font-bold">
                        <User className="h-6 w-6 md:h-10 md:w-10" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="font-display text-sm md:text-lg font-semibold text-semin-blue group-hover:text-semin-orange transition-colors">{s.name}</h3>
                  <p className="font-body text-xs md:text-sm text-semin-orange font-medium mt-0.5 md:mt-1">{s.role}</p>
                  <p className="font-body text-[10px] md:text-xs text-semin-blue/40 mt-0.5 md:mt-1">{s.org}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;
