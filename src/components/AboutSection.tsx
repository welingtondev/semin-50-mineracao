import { GraduationCap, Factory, Leaf, Bot, Mountain, Layers, Drill, Gem } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: GraduationCap,
    accent: Gem,
    title: "Formação Acadêmica",
    description: "Conectando estudantes e professores às fronteiras do conhecimento em engenharia de minas e geologia aplicada.",
  },
  {
    icon: Factory,
    accent: Drill,
    title: "Indústria Mineral",
    description: "Aproximando a universidade das demandas reais do setor mineral brasileiro, da lavra ao beneficiamento.",
  },
  {
    icon: Leaf,
    accent: Mountain,
    title: "Sustentabilidade",
    description: "Discutindo práticas sustentáveis e responsáveis na exploração mineral e recuperação ambiental.",
  },
  {
    icon: Bot,
    accent: Layers,
    title: "Inovação e Tecnologia",
    description: "Explorando automação, sensoriamento remoto e novas tecnologias que transformam a mineração.",
  },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-24 md:py-32 bg-semin-cream relative overflow-hidden">
      {/* Mining-themed decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-semin-yellow/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-semin-orange/5 rounded-full blur-[80px]" />
      
      {/* Subtle geological layer lines */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-[0.03]">
        <svg viewBox="0 0 1440 128" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,40 C300,80 600,20 900,60 C1100,80 1300,30 1440,50 L1440,128 L0,128Z" fill="hsl(40 73% 48%)" />
          <path d="M0,70 C200,50 500,90 800,60 C1000,40 1200,80 1440,70 L1440,128 L0,128Z" fill="hsl(30 100% 38%)" opacity="0.5" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.3em] text-semin-orange font-semibold mb-4">
            <Mountain className="h-3.5 w-3.5" />
            Conheça o evento
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-semin-blue mb-6">
            Sobre o SEMIN
          </h2>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Gem className="h-4 w-4 text-semin-yellow" />
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>
          <p className="font-body text-base md:text-lg text-semin-blue/70 leading-relaxed">
            O SEMIN – Seminário de Mineração da UFBA – é o principal evento acadêmico-científico
            promovido pelo curso de Engenharia de Minas da Universidade Federal da Bahia. Em sua
            edição comemorativa de 50 anos, o evento reúne estudantes, pesquisadores, profissionais
            e empresas do setor mineral para debater os avanços, desafios e oportunidades da
            mineração no Brasil e no mundo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-none shadow-md hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 h-full relative overflow-hidden">
                {/* Subtle mining pattern on hover */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500">
                  <f.accent className="w-full h-full text-semin-orange" />
                </div>
                <CardContent className="p-8 text-center relative">
                  <div className="w-18 h-18 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-semin-yellow/15 to-semin-orange/10 flex items-center justify-center group-hover:from-semin-yellow/25 group-hover:to-semin-orange/20 transition-all duration-500 p-4">
                    <f.icon className="h-9 w-9 text-semin-yellow group-hover:text-semin-orange transition-colors duration-300" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-semin-blue mb-3">{f.title}</h3>
                  <p className="font-body text-sm text-semin-blue/60 leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
