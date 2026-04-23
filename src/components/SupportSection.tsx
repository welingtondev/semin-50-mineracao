import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Sparkles, Diamond } from "lucide-react";
import cristalJrLogo from "@/assets/cristal-jr-logo.webp";
import daeminLogo from "@/assets/daemin-logo.webp";
import abemLogo from "@/assets/abem_logo.png";

const realizacao = [
  { 
    name: "DAEMIN", 
    logo: daeminLogo,
    description: "Diretório acadêmico representante dos estudantes de Engenharia de Minas da UFBA, promovendo a integração com o setor mineral."
  },
  { 
    name: "CRISTAL JR", 
    logo: cristalJrLogo,
    description: "Empresa Júnior dos cursos de Engenharia de Minas, Petróleo e Geologia da UFBA, focada em conectar alunos à prática do mercado."
  },
  {
    name: "ABEM",
    logo: abemLogo,
    description: "Associação Baiana de Engenheiros de Minas, promovendo a valorização profissional e o desenvolvimento da mineração na Bahia."
  },
];

const SupportSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-16 md:py-28 bg-semin-dark relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] border border-semin-yellow/[0.04] rounded-full" />
        <div className="absolute top-10 right-20 w-40 md:w-72 h-40 md:h-72 bg-semin-yellow/[0.03] rounded-full blur-[80px]" />
        <div className="absolute bottom-10 left-20 w-32 md:w-56 h-32 md:h-56 bg-semin-orange/[0.03] rounded-full blur-[60px]" />
      </div>

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-10 md:mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-semin-yellow font-semibold mb-3 md:mb-4">
            <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5" />
            Organização do evento
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 md:mb-5">
            Realização
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Diamond className="h-4 w-4 md:h-5 md:w-5 text-semin-yellow/60" />
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-stretch gap-10 md:gap-16 lg:gap-24">
          {realizacao.map((s, i) => (
            <div
              key={s.name}
              className={`flex-1 min-w-[280px] max-w-sm text-center group transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${i * 200 + 200}ms` }}
            >
              <div className="relative bg-white rounded-2xl px-8 py-6 md:px-14 md:py-10 shadow-xl shadow-black/15 ring-1 ring-white/10 group-hover:shadow-2xl group-hover:shadow-semin-yellow/10 transition-all duration-500 group-hover:-translate-y-2 h-full flex flex-col justify-between max-w-sm mx-auto overflow-hidden">
                {/* Top accent */}
                <div className="absolute top-0 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-semin-yellow/30 via-semin-yellow/60 to-semin-yellow/30 rounded-full" />
                <div>
                  <img
                    src={s.logo}
                    alt={s.name}
                    width="112"
                    height="112"
                    className="h-20 md:h-28 w-auto object-contain mx-auto transition-all duration-500 group-hover:scale-105 mb-6 md:mb-8"
                    style={{ imageRendering: 'auto' }}
                    loading="lazy"
                  />
                  <h3 className="font-display text-xl md:text-2xl font-bold text-semin-dark mb-3">{s.name}</h3>
                  <p className="font-body text-sm md:text-base text-gray-600 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
