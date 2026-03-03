import { GraduationCap, Factory, Leaf, Bot, Gem } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: GraduationCap,
    title: "Formação Acadêmica",
    description: "Conectando estudantes e professores às fronteiras do conhecimento em engenharia de minas e geologia aplicada.",
  },
  {
    icon: Factory,
    title: "Indústria Mineral",
    description: "Aproximando a universidade das demandas reais do setor mineral brasileiro, da lavra ao beneficiamento.",
  },
  {
    icon: Leaf,
    title: "Sustentabilidade",
    description: "Discutindo práticas sustentáveis e responsáveis na exploração mineral e recuperação ambiental.",
  },
  {
    icon: Bot,
    title: "Inovação e Tecnologia",
    description: "Explorando automação, sensoriamento remoto e novas tecnologias que transformam a mineração.",
  },
];

const AboutSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="sobre" className="py-16 md:py-32 bg-semin-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-semin-yellow/5 rounded-full blur-[80px] md:blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-36 md:w-72 h-36 md:h-72 bg-semin-orange/5 rounded-full blur-[60px] md:blur-[80px]" />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className={`max-w-3xl mx-auto text-center mb-10 md:mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-semin-orange font-semibold mb-3 md:mb-4">
            <Gem className="h-3 w-3 md:h-3.5 md:w-3.5" />
            Conheça o evento
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-semin-blue mb-4 md:mb-6">
            Sobre o SEMIN
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
            <div className="w-8 md:w-12 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Gem className="h-3.5 w-3.5 md:h-4 md:w-4 text-semin-yellow" />
            <div className="w-8 md:w-12 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>
          <p className="font-body text-sm md:text-lg text-semin-blue/70 leading-relaxed px-2">
            O SEMIN – Seminário de Mineração da UFBA – é o principal evento acadêmico-científico
            promovido pelo curso de Engenharia de Minas da Universidade Federal da Bahia. Em sua
            edição comemorativa de 50 anos, o evento reúne estudantes, pesquisadores, profissionais
            e empresas do setor mineral para debater os avanços, desafios e oportunidades da
            mineração no Brasil e no mundo.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 100 + 200}ms` }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-none shadow-md hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 md:hover:-translate-y-2 h-full active:scale-[0.98]">
                <CardContent className="p-4 md:p-8 text-center">
                  <div className="w-12 h-12 md:w-18 md:h-18 mx-auto mb-3 md:mb-5 rounded-xl md:rounded-2xl bg-gradient-to-br from-semin-yellow/15 to-semin-orange/10 flex items-center justify-center group-hover:from-semin-yellow/25 group-hover:to-semin-orange/20 transition-all duration-300 p-2.5 md:p-4">
                    <f.icon className="h-6 w-6 md:h-9 md:w-9 text-semin-yellow group-hover:text-semin-orange transition-colors duration-300" />
                  </div>
                  <h3 className="font-display text-sm md:text-lg font-semibold text-semin-blue mb-1.5 md:mb-3">{f.title}</h3>
                  <p className="font-body text-xs md:text-sm text-semin-blue/60 leading-relaxed hidden sm:block">{f.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
