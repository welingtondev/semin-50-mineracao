import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Sparkles, Diamond } from "lucide-react";
import cristalJrLogo from "@/assets/cristal-jr-logo.webp";
import daeminLogo from "@/assets/daemin-logo.webp";
import abemLogo from "@/assets/abem_logo.webp";
import { Users, UserCircle2, ShieldCheck, Target, Heart } from "lucide-react";
import gabrielImg from "@/assets/committee/gabriel-pereira.png";
import welingtonImg from "@/assets/committee/welington-santos.png";
import norberthImg from "@/assets/committee/norberth-reis.png";

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

const committeeMembers = [
  {
    name: "Gabriel de Sousa",
    role: "Presidente da comissão",
    area: "Presidência",
    image: gabrielImg,
    icon: ShieldCheck,
    color: "from-blue-400 to-semin-blue",
  },
  {
    name: "Welington Santos",
    role: "Coordenador de marketing e estratégia",
    area: "Marketing e estratégia",
    image: welingtonImg,
    icon: Target,
    color: "from-amber-400 to-semin-orange",
  },
  {
    name: "Norberth Reis",
    role: "Coordenador financeiro",
    area: "Financeiro",
    image: norberthImg,
    icon: Heart,
    color: "from-emerald-400 to-teal-600",
  },
];

const SupportSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 md:py-32 bg-semin-dark relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] border border-semin-yellow/[0.04] rounded-full animate-[spin_100s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] md:w-[900px] h-[550px] md:h-[900px] border border-semin-yellow/[0.02] rounded-full border-dashed animate-[spin_150s_linear_infinite]" />
        <div className="absolute top-10 right-20 w-32 md:w-72 h-32 md:h-72 bg-semin-yellow/[0.03] rounded-full blur-[40px] md:blur-[100px]" />
        <div className="absolute bottom-10 left-20 w-24 md:w-56 h-24 md:h-56 bg-semin-orange/[0.03] rounded-full blur-[30px] md:blur-[80px]" />
      </div>

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 md:mb-24 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-semin-yellow font-semibold mb-3 md:mb-4">
            <Sparkles className="h-3.5 w-3.5 text-semin-yellow" />
            Organização do evento
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 tracking-tight leading-tight text-white">
            Nossa <span className="text-semin-yellow">Realização</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Diamond className="h-4 w-4 md:h-5 md:w-5 text-semin-yellow/60" />
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {realizacao.map((s, i) => (
            <div
              key={s.name}
              className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="relative bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-[2rem] px-6 py-8 md:px-8 md:py-10 shadow-2xl hover:shadow-[0_20px_50px_rgba(210,155,33,0.12)] hover:border-semin-yellow/30 hover:bg-white/[0.05] transition-all duration-500 hover:-translate-y-2 h-full flex flex-col justify-between mx-auto overflow-hidden group/card">
                {/* Top accent line */}
                <div className="absolute top-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-semin-yellow/40 to-transparent" />
                
                <div className="flex flex-col items-center text-center">
                  {/* High-contrast solid white logo badge */}
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white border-2 border-transparent group-hover/card:border-semin-yellow/40 flex items-center justify-center mb-6 transition-all duration-500 relative shadow-[0_8px_24px_rgba(0,0,0,0.25)] p-4">
                    {/* Golden glow behind logo badge */}
                    <div className="absolute inset-0 bg-semin-yellow/10 rounded-full blur-md opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                    <img
                      src={s.logo}
                      alt={s.name}
                      width="96"
                      height="96"
                      className="h-full w-full object-contain transition-all duration-500 group-hover/card:scale-105"
                      loading="lazy"
                    />
                  </div>
                  
                  <h3 className="font-display text-lg md:text-xl font-bold text-white mb-3 group-hover/card:text-semin-yellow transition-colors duration-300">
                    {s.name}
                  </h3>
                  
                  <p className="font-body text-xs md:text-sm text-white/50 leading-relaxed group-hover/card:text-white/70 transition-colors duration-300">
                    {s.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Committee Section */}
        <div className={`mt-24 md:mt-32 text-center mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-semin-orange font-semibold mb-3 md:mb-4">
            <Users className="h-3.5 w-3.5" />
            Comissão Organizadora
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight text-white">
            Quem transforma esta edição histórica em uma <span className="text-semin-orange">experiência relevante.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {committeeMembers.map((member, idx) => (
            <div 
              key={member.name}
              className={`bg-white/[0.02] backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-lg group hover:border-semin-orange/30 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${400 + idx * 150}ms` }}
            >
              <div className="relative mb-8 rounded-2xl overflow-hidden aspect-square bg-white/5">
                <div className={`absolute inset-0 bg-gradient-to-tr ${member.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top filter grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <UserCircle2 className="w-24 h-24" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-semin-dark/80 backdrop-blur-sm p-2 rounded-xl shadow-sm border border-white/10">
                  <member.icon className="w-5 h-5 text-semin-yellow" />
                </div>
              </div>
              
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-semin-orange mb-2 block">{member.area}</span>
                <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-1 group-hover:text-semin-yellow transition-colors">{member.name}</h3>
                <p className="text-sm text-white/50 font-medium">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
