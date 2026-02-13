import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { User, Mountain, Gem } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const speakers = [
  { name: "XXXXXXX", role: "XXXXXXX", org: "XXXXXXX", initials: "XX", bio: "XXXXXXX", topic: "XXXXXXX" },
  { name: "XXXXXXX", role: "XXXXXXX", org: "XXXXXXX", initials: "XX", bio: "XXXXXXX", topic: "XXXXXXX" },
  { name: "XXXXXXX", role: "XXXXXXX", org: "XXXXXXX", initials: "XX", bio: "XXXXXXX", topic: "XXXXXXX" },
  { name: "XXXXXXX", role: "XXXXXXX", org: "XXXXXXX", initials: "XX", bio: "XXXXXXX", topic: "XXXXXXX" },
  { name: "XXXXXXX", role: "XXXXXXX", org: "XXXXXXX", initials: "XX", bio: "XXXXXXX", topic: "XXXXXXX" },
  { name: "XXXXXXX", role: "XXXXXXX", org: "XXXXXXX", initials: "XX", bio: "XXXXXXX", topic: "XXXXXXX" },
];

const SpeakersSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="palestrantes" className="py-24 md:py-32 bg-semin-cream relative overflow-hidden">
      <div className="absolute top-20 right-0 w-80 h-80 bg-semin-yellow/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 left-0 w-60 h-60 bg-semin-blue/5 rounded-full blur-[80px]" />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.3em] text-semin-orange font-semibold mb-4">
            <Gem className="h-3.5 w-3.5" />
            Quem estará lá
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-semin-blue mb-4">
            Palestrantes
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Mountain className="h-4 w-4 text-semin-yellow/60" />
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>
          <p className="font-body text-semin-blue/60 max-w-xl mx-auto">
            Conheça os especialistas que compartilharão conhecimento e experiência no setor mineral.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {speakers.map((s, i) => (
            <div
              key={i}
              className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"}`}
              style={{ transitionDelay: `${i * 80 + 200}ms` }}
            >
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <Card className="bg-white/80 backdrop-blur-sm border border-semin-blue/10 hover:border-semin-yellow/50 shadow-sm hover:shadow-2xl cursor-pointer transition-all duration-300 group hover:-translate-y-2">
                    <CardContent className="p-8 text-center">
                      <div className="relative mx-auto mb-5 w-24 h-24">
                        <Avatar className="relative h-24 w-24 mx-auto ring-3 ring-semin-blue/10 group-hover:ring-semin-yellow/50 transition-all duration-300">
                          <AvatarFallback className="bg-gradient-to-br from-semin-blue to-semin-dark text-white font-display text-xl font-bold">
                            <User className="h-10 w-10" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-semin-blue group-hover:text-semin-orange transition-colors">{s.name}</h3>
                      <p className="font-body text-sm text-semin-orange font-medium mt-1">{s.role}</p>
                      <p className="font-body text-xs text-semin-blue/40 mt-1">{s.org}</p>
                    </CardContent>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 bg-white/95 backdrop-blur-sm border-semin-blue/10 shadow-xl">
                  <div className="space-y-2">
                    <h4 className="font-display font-semibold text-semin-blue">{s.name}</h4>
                    <p className="font-body text-sm text-semin-blue/70">{s.bio}</p>
                    <div className="pt-2 border-t border-semin-cream">
                      <p className="font-body text-xs text-semin-orange font-semibold flex items-center gap-1.5">
                        <Gem className="h-3 w-3" />
                        Tema: {s.topic}
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;
