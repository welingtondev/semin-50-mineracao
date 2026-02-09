import { GraduationCap, Factory, Leaf, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: GraduationCap,
    title: "Formação Acadêmica",
    description: "Conectando estudantes e professores às fronteiras do conhecimento em engenharia de minas.",
  },
  {
    icon: Factory,
    title: "Indústria Mineral",
    description: "Aproximando a universidade das demandas reais do setor mineral brasileiro.",
  },
  {
    icon: Leaf,
    title: "Sustentabilidade",
    description: "Discutindo práticas sustentáveis e responsáveis na exploração mineral.",
  },
  {
    icon: Bot,
    title: "Inovação e Tecnologia",
    description: "Explorando novas tecnologias que transformam o futuro da mineração.",
  },
];

const AboutSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="sobre" className="py-20 md:py-28 bg-semin-cream">
      <div ref={ref} className="container mx-auto px-4">
        <div
          className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-semin-blue mb-6">
            Sobre o SEMIN
          </h2>
          <p className="font-body text-base md:text-lg text-semin-blue/70 leading-relaxed">
            O SEMIN – Seminário de Mineração da UFBA – é o principal evento acadêmico-científico
            promovido pelo curso de Engenharia de Minas da Universidade Federal da Bahia. Em sua
            edição comemorativa de 50 anos, o evento reúne estudantes, pesquisadores, profissionais
            e empresas do setor mineral para debater os avanços, desafios e oportunidades da
            mineração no Brasil e no mundo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <Card
              key={f.title}
              className={`bg-white border-none shadow-md hover:shadow-xl transition-all duration-500 group ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-semin-yellow/10 flex items-center justify-center group-hover:bg-semin-yellow/20 transition-colors">
                  <f.icon className="h-8 w-8 text-semin-yellow" />
                </div>
                <h3 className="font-display text-lg font-semibold text-semin-blue mb-3">{f.title}</h3>
                <p className="font-body text-sm text-semin-blue/60 leading-relaxed">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
