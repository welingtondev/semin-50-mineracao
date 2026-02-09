import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const supporters = [
  { name: "UFBA", subtitle: "Universidade Federal da Bahia" },
  { name: "Politécnica", subtitle: "Escola Politécnica" },
  { name: "Eng. Minas", subtitle: "Engenharia de Minas" },
];

const SupportSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-16 md:py-20 bg-semin-cream">
      <div ref={ref} className="container mx-auto px-4">
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-semin-blue mb-2">
            Apoio Institucional
          </h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
          {supporters.map((s, i) => (
            <div
              key={s.name}
              className={`text-center transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-3 rounded-2xl bg-white shadow-sm border border-semin-blue/10 flex items-center justify-center">
                <span className="font-display text-lg md:text-xl font-bold text-semin-blue">{s.name}</span>
              </div>
              <p className="font-body text-xs text-semin-blue/50">{s.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
