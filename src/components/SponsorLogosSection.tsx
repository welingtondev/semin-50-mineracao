import { Heart, Mountain, Diamond, Gem, Sparkles, Crown, Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ufbaLogo from "@/assets/ufba_logo.webp";
import sindimibaLogo from "@/assets/sindimiba-logo.webp";
import jmcLogo from "@/assets/jmc_logo.webp";
import creaLogo from "@/assets/crea_logo.webp";

type SponsorLogo = {
  name: string;
  logo?: string;
  className?: string;
};

const organizadores: SponsorLogo[] = [
  { name: "UFBA", logo: ufbaLogo, className: "h-20 sm:h-24 md:h-32 lg:h-36 max-w-[140px] md:max-w-[220px]" },
  { name: "SINDIMIBA", logo: sindimibaLogo, className: "h-20 sm:h-24 md:h-32 lg:h-36 max-w-[180px] md:max-w-[260px]" },
  { name: "CREA-BA", logo: creaLogo, className: "h-20 sm:h-24 md:h-32 lg:h-36 max-w-[160px] md:max-w-[240px]" },
];

type TierGroup = {
  tier: string;
  label: string;
  icon: React.ElementType;
  sponsors: SponsorLogo[];
  accentFrom: string;
  accentTo: string;
  accentText: string;
  glowColor: string;
  ringColor: string;
};

const sponsorsByTier: TierGroup[] = [
  {
    tier: "Diamante",
    label: "Diamante",
    icon: Diamond,
    accentFrom: "from-sky-400",
    accentTo: "to-indigo-400",
    accentText: "text-sky-300",
    glowColor: "bg-sky-400/20",
    ringColor: "ring-sky-400/30",
    sponsors: [
      { name: "Patrocinador Diamante 1" },
      { name: "Patrocinador Diamante 2" },
    ],
  },
  {
    tier: "Córindon",
    label: "Córindon",
    icon: Gem,
    accentFrom: "from-rose-400",
    accentTo: "to-pink-400",
    accentText: "text-rose-300",
    glowColor: "bg-rose-400/15",
    ringColor: "ring-rose-400/20",
    sponsors: [
      { name: "Patrocinador Córindon 1" },
      { name: "Patrocinador Córindon 2" },
      { name: "Patrocinador Córindon 3" },
    ],
  },
  {
    tier: "Topázio",
    label: "Topázio",
    icon: Gem,
    accentFrom: "from-amber-400",
    accentTo: "to-yellow-300",
    accentText: "text-amber-300",
    glowColor: "bg-amber-400/15",
    ringColor: "ring-amber-400/20",
    sponsors: [
      { name: "JMC", logo: jmcLogo },
      { name: "Pan American Silver" },
      { name: "Patrocinador Topázio 3" },
    ],
  },
  {
    tier: "Quartzo",
    label: "Quartzo",
    icon: Mountain,
    accentFrom: "from-slate-400",
    accentTo: "to-gray-400",
    accentText: "text-slate-300",
    glowColor: "bg-slate-400/10",
    ringColor: "ring-slate-400/15",
    sponsors: [
      { name: "Patrocinador Quartzo 1" },
      { name: "Patrocinador Quartzo 2" },
    ],
  },
];

const logoSizes: Record<string, string> = {
  Diamante: "w-44 h-32 md:w-64 md:h-40",
  "Córindon": "w-44 h-32 md:w-64 md:h-40",
  "Topázio": "w-44 h-32 md:w-64 md:h-40",
  Quartzo: "w-44 h-32 md:w-64 md:h-40",
};

const SponsorLogosSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="parceiros" className="py-24 md:py-36 bg-gray-50 relative overflow-hidden">
      {/* Background Ornaments adapted for light theme */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-48 md:w-96 h-48 md:h-96 bg-semin-yellow/5 rounded-full blur-[30px] md:blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-40 md:w-80 h-40 md:h-80 bg-semin-orange/5 rounded-full blur-[25px] md:blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #d29b21 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 md:mb-24 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-semin-yellow font-semibold mb-3 md:mb-4">
            <Gem className="h-3.5 w-3.5" />
            Rede de Valor
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 tracking-tight leading-tight text-semin-blue">
            Patrocinadores & <span className="text-semin-yellow">Apoiadores</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow/40 rounded-full" />
            <Mountain className="h-4 w-4 md:h-5 md:w-5 text-semin-yellow/40" />
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow/40 rounded-full" />
          </div>
          <p className="font-body text-base md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Empresas e instituições que acreditam no potencial da Engenharia de Minas e na força da nossa história.
          </p>
        </div>

        {/* ── Sponsors by tier ── */}
        <div className="space-y-16 md:space-y-24">
          {sponsorsByTier.map((group, gi) => (
            <div
              key={group.tier}
              className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${gi * 150 + 200}ms` }}
            >
              {/* Tier badge with double glow lines */}
              <div className="flex items-center justify-center gap-4 md:gap-6 mb-10 md:mb-12">
                <div className={`h-px flex-1 max-w-[60px] md:max-w-[160px] bg-gradient-to-r from-transparent ${group.accentFrom} opacity-20`} />
                <div className={`relative inline-flex items-center gap-2.5 px-6 md:px-8 py-2.5 md:py-3 rounded-full border border-gray-200 bg-white shadow-sm`}>
                  <group.icon className={`h-4 w-4 md:h-5 md:w-5 ${group.accentText} relative z-10 drop-shadow-sm`} />
                  <span className={`font-body text-xs md:text-sm uppercase tracking-[0.25em] font-bold ${group.accentText.replace('text-', 'text-')} relative z-10`}>
                    {group.label}
                  </span>
                </div>
                <div className={`h-px flex-1 max-w-[60px] md:max-w-[160px] bg-gradient-to-l from-transparent ${group.accentTo} opacity-20`} />
              </div>

              <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
                {group.sponsors.map((sponsor) => (
                  <div
                    key={sponsor.name}
                    className="relative group w-[calc(50%-6px)] sm:w-[calc(50%-12px)] md:w-64 h-24 sm:h-32 md:h-40 flex items-center justify-center p-3 sm:p-6 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl hover:border-semin-yellow/40 transition-all duration-500 cursor-pointer hover:-translate-y-1 sm:hover:-translate-y-2"
                  >
                    {/* Card top accent line */}
                    <div className={`absolute top-0 left-[15%] right-[15%] h-[2px] bg-gradient-to-r ${group.accentFrom} ${group.accentTo} opacity-60 rounded-full`} />

                    {sponsor.logo ? (
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width="256"
                        height="160"
                        className="max-w-full max-h-full object-contain transition-all duration-500 group-hover:scale-110"
                        style={{ imageRendering: 'auto' }}
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                          <group.icon className={`h-5 w-5 sm:h-7 sm:w-7 md:h-8 md:w-8 ${group.accentText} opacity-70 group-hover:opacity-100 transition-opacity duration-300`} />
                        </div>
                        <span className="font-body text-[9px] sm:text-[10px] md:text-xs text-gray-400 group-hover:text-semin-dark text-center leading-tight transition-colors duration-300 font-semibold px-1 block">
                          {sponsor.name}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Apoio Institucional ── */}
        <div className={`mt-24 md:mt-32 transition-all duration-700 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-10 md:mb-12">
            <div className="h-px flex-1 max-w-[60px] md:max-w-[140px] bg-gradient-to-r from-transparent to-semin-yellow/20" />
            <div className="relative inline-flex items-center gap-2.5 px-6 md:px-8 py-2.5 md:py-3 rounded-full border border-semin-yellow/10 bg-white shadow-sm">
              <Heart className="h-4 w-4 md:h-5 md:w-5 text-semin-yellow relative z-10" />
              <span className="font-body text-xs md:text-sm uppercase tracking-[0.25em] font-bold text-semin-dark relative z-10">
                Apoio Institucional
              </span>
            </div>
            <div className="h-px flex-1 max-w-[60px] md:max-w-[140px] bg-gradient-to-l from-transparent to-semin-yellow/20" />
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-5 md:gap-14 max-w-5xl mx-auto">
            {organizadores.map((sponsor) => (
              <div
                key={sponsor.name}
                className="group cursor-pointer w-[calc(50%-6px)] sm:w-[calc(50%-10px)] md:w-auto"
              >
                <div className="relative bg-white rounded-2xl px-3 sm:px-6 py-4 sm:py-6 shadow-xl shadow-black/15 ring-1 ring-semin-yellow/10 hover:shadow-2xl hover:ring-semin-yellow/25 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 flex items-center justify-center w-full h-24 sm:h-32 md:w-64 md:h-40">
                  {/* Gold accent top line */}
                  <div className="absolute top-0 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-semin-yellow/40 via-amber-400/60 to-semin-yellow/40 rounded-full" />
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width="240"
                      height="176"
                      className={`${sponsor.className || "h-8 sm:h-10 md:h-20 lg:h-24 max-w-[100px] sm:max-w-none"} w-auto object-contain transition-all duration-500 group-hover:scale-110`}
                      style={{ imageRendering: 'auto' }}
                      loading="lazy"
                    />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorLogosSection;
