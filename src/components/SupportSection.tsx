import { motion } from "framer-motion";

const supporters = [
  { name: "UFBA", subtitle: "Universidade Federal da Bahia" },
  { name: "Politécnica", subtitle: "Escola Politécnica" },
  { name: "Eng. Minas", subtitle: "Engenharia de Minas" },
];

const SupportSection = () => {
  return (
    <section className="py-20 md:py-24 bg-semin-cream">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-semin-blue mb-2">
            Apoio Institucional
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-semin-yellow to-semin-orange mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
          {supporters.map((s, i) => (
            <motion.div
              key={s.name}
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-3 rounded-2xl bg-white shadow-sm border border-semin-blue/10 flex items-center justify-center group-hover:shadow-lg group-hover:border-semin-yellow/30 transition-all duration-500 group-hover:-translate-y-1">
                <span className="font-display text-lg md:text-xl font-bold text-semin-blue group-hover:text-semin-orange transition-colors">{s.name}</span>
              </div>
              <p className="font-body text-xs text-semin-blue/50">{s.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
