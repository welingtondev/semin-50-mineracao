import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const speakers = [
  {
    name: "Dra. Maria Helena Silva",
    role: "Professora Titular",
    org: "UFBA – Engenharia de Minas",
    initials: "MH",
    bio: "Especialista em beneficiamento mineral com mais de 25 anos de experiência acadêmica.",
    topic: "Panorama da Mineração no Brasil",
  },
  {
    name: "Eng. Carlos Augusto Menezes",
    role: "Diretor de Operações",
    org: "Vale S.A.",
    initials: "CA",
    bio: "Líder de projetos de grande porte em mineração de ferro no Brasil.",
    topic: "Sustentabilidade e ESG",
  },
  {
    name: "Dr. Roberto Figueiredo",
    role: "Pesquisador Sênior",
    org: "CETEM",
    initials: "RF",
    bio: "Referência em tecnologias de processamento mineral e economia circular.",
    topic: "Tecnologias de Lavra e Beneficiamento",
  },
  {
    name: "Profa. Ana Cláudia Santos",
    role: "Coordenadora de Pesquisa",
    org: "USP – Escola Politécnica",
    initials: "AC",
    bio: "Pesquisadora em geotecnia de barragens e segurança em minas.",
    topic: "Geotecnia e Segurança de Barragens",
  },
  {
    name: "Eng. João Pedro Alves",
    role: "CTO",
    org: "MineralTech Soluções",
    initials: "JP",
    bio: "Empreendedor com foco em IA e automação aplicada ao setor mineral.",
    topic: "Inteligência Artificial na Mineração",
  },
  {
    name: "Dra. Fernanda Oliveira",
    role: "Consultora Ambiental",
    org: "EcoMiner Consultoria",
    initials: "FO",
    bio: "Especialista em gestão ambiental e recuperação de áreas mineradas.",
    topic: "Economia Mineral e Mercado Global",
  },
];

const SpeakersSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="palestrantes" className="py-20 md:py-28 bg-semin-cream">
      <div ref={ref} className="container mx-auto px-4">
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-semin-blue mb-4">
            Palestrantes
          </h2>
          <p className="font-body text-semin-blue/60 max-w-xl mx-auto">
            Conheça os especialistas que compartilharão conhecimento e experiência.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {speakers.map((s, i) => (
            <HoverCard key={s.name} openDelay={200}>
              <HoverCardTrigger asChild>
                <Card
                  className={`bg-white border border-semin-blue/10 hover:border-semin-yellow/50 shadow-sm hover:shadow-lg cursor-pointer transition-all duration-500 group ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4 ring-2 ring-semin-yellow/30 group-hover:ring-semin-yellow transition-all">
                      <AvatarFallback className="bg-semin-blue text-white font-display text-xl font-bold">
                        {s.initials}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-display text-lg font-semibold text-semin-blue">{s.name}</h3>
                    <p className="font-body text-sm text-semin-orange font-medium">{s.role}</p>
                    <p className="font-body text-xs text-semin-blue/50 mt-1">{s.org}</p>
                  </CardContent>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-white border-semin-blue/10">
                <div className="space-y-2">
                  <h4 className="font-display font-semibold text-semin-blue">{s.name}</h4>
                  <p className="font-body text-sm text-semin-blue/70">{s.bio}</p>
                  <div className="pt-2 border-t border-semin-cream">
                    <p className="font-body text-xs text-semin-orange font-semibold">
                      Tema: {s.topic}
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;
