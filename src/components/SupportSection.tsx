import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const supporters = [
  { name: "UFBA", subtitle: "Universidade Federal da Bahia" },
  { name: "Politécnica", subtitle: "Escola Politécnica" },
  { name: "Eng. Minas", subtitle: "Engenharia de Minas" },
];

const SupportSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-14 md:py-24 bg-semin-cream">
      <div ref={ref} className="container mx-auto px-4">
        <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-semin-blue mb-2">
            Apoio Institucional
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-semin-yellow to-semin-orange mx-auto mt-3 md:mt-4 rounded-full" />
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 lg:gap-16">
          {supporters.map((s, i) => (
            <div
              key={s.name}
              className={`text-center group transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${i * 150 + 200}ms` }}
            >
              <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 mx-auto mb-2 md:mb-3 rounded-xl md:rounded-2xl bg-white shadow-sm border border-semin-blue/10 flex items-center justify-center group-hover:shadow-lg group-hover:border-semin-yellow/30 transition-all duration-500 group-hover:-translate-y-1 active:scale-95">
                <span className="font-display text-sm md:text-lg lg:text-xl font-bold text-semin-blue group-hover:text-semin-orange transition-colors">{s.name}</span>
              </div>
              <p className="font-body text-[10px] md:text-xs text-semin-blue/50">{s.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
