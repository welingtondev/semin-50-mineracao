import { GraduationCap, Factory, Leaf, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
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
    <section id="sobre" className="py-24 md:py-32 bg-semin-cream relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-semin-yellow/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-semin-orange/5 rounded-full blur-[80px]" />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block font-body text-xs uppercase tracking-[0.3em] text-semin-orange font-semibold mb-4">
            Conheça o evento
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-semin-blue mb-6">
            Sobre o SEMIN
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-semin-yellow to-semin-orange mx-auto mb-8 rounded-full" />
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
              <Card className="bg-white/80 backdrop-blur-sm border-none shadow-md hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 h-full">
                <CardContent className="p-8 text-center">
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
