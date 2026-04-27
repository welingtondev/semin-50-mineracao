import { Heart, Mountain, Diamond, Gem, Sparkles, Crown, Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ufbaLogo from "@/assets/ufba_logo.png";
import sindimibaLogo from "@/assets/sindimiba-logo.webp";
import jmcLogo from "@/assets/jmc_logo.png";

type SponsorLogo = {
  name: string;
  logo?: string;
  className?: string;
};

const organizadores: SponsorLogo[] = [
  { name: "UFBA", logo: ufbaLogo, className: "h-16 sm:h-20 md:h-28 lg:h-32 max-w-[180px] md:max-w-[280px]" },
  { name: "SINDIMIBA", logo: sindimibaLogo, className: "h-20 sm:h-24 md:h-36 lg:h-40 max-w-[240px] md:max-w-[320px]" },
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
    <section className="py-20 md:py-36 relative overflow-hidden" style={{ background: "linear-gradient(165deg, hsl(220 18% 8%) 0%, hsl(215 25% 12%) 30%, hsl(220 20% 9%) 60%, hsl(210 15% 7%) 100%)" }}>
      {/* ── Premium background layers ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Ambient glow orbs — reduced on mobile */}
        <div className="absolute top-[10%] left-[5%] w-48 md:w-[600px] h-48 md:h-[600px] bg-gradient-to-br from-semin-yellow/[0.04] to-amber-500/[0.02] rounded-full blur-[40px] md:blur-[150px]" />
        <div className="absolute bottom-[10%] right-[5%] w-40 md:w-[500px] h-40 md:h-[500px] bg-gradient-to-tl from-sky-500/[0.04] to-indigo-500/[0.02] rounded-full blur-[30px] md:blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block md:w-[800px] md:h-[800px] bg-gradient-to-br from-semin-yellow/[0.015] to-transparent rounded-full md:blur-[100px]" />

        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block md:w-[900px] md:h-[900px] border border-white/[0.02] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block md:w-[650px] md:h-[650px] border border-semin-yellow/[0.03] rounded-full" />

        {/* Floating gems */}
        <Diamond className="absolute top-[15%] right-[12%] h-5 w-5 md:h-7 md:w-7 text-sky-400/[0.08] float-gem-1 hidden sm:block" />
        <Gem className="absolute bottom-[20%] left-[10%] h-4 w-4 md:h-6 md:w-6 text-amber-400/[0.06] float-gem-2 hidden sm:block" />
        <Star className="absolute top-[30%] left-[20%] h-3 w-3 md:h-4 md:w-4 text-semin-yellow/[0.08] float-gem-3 hidden sm:block" />
        <Crown className="absolute bottom-[30%] right-[15%] h-5 w-5 md:h-6 md:w-6 text-rose-400/[0.06] float-gem-1 hidden sm:block" />

        {/* Subtle noise grain texture */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }} />
      </div>

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        {/* ── Header ── */}
        <div className={`text-center mb-16 md:mb-24 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2.5 font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-semin-yellow/80 font-semibold mb-4 md:mb-5">
            <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5 animate-pulse" />
            Quem faz o SEMIN UFBA acontecer
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold mb-5 md:mb-6 bg-gradient-to-r from-white via-semin-cream to-white bg-clip-text text-transparent">
            Patrocinadores & Apoiadores
          </h2>
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent via-semin-yellow/40 to-semin-yellow/60 rounded-full" />
            <Diamond className="h-4 w-4 md:h-5 md:w-5 text-semin-yellow/50" />
            <div className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent via-semin-yellow/40 to-semin-yellow/60 rounded-full" />
          </div>
          <p className="font-body text-xs md:text-sm text-white/35 max-w-lg mx-auto leading-relaxed">
            Empresas e instituições que acreditam no futuro da mineração e investem na formação de excelência
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
                <div className={`h-px flex-1 max-w-[60px] md:max-w-[160px] bg-gradient-to-r from-transparent ${group.accentFrom} opacity-40`} />
                <div className={`relative inline-flex items-center gap-2.5 px-6 md:px-8 py-2.5 md:py-3 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-none md:backdrop-blur-md`}>
                  {/* Badge inner glow */}
                  <div className={`absolute inset-0 rounded-full ${group.glowColor} blur-xl opacity-50`} />
                  <group.icon className={`h-4 w-4 md:h-5 md:w-5 ${group.accentText} relative z-10 drop-shadow-sm`} />
                  <span className={`font-body text-xs md:text-sm uppercase tracking-[0.25em] font-bold ${group.accentText} relative z-10`}>
                    {group.label}
                  </span>
                </div>
                <div className={`h-px flex-1 max-w-[60px] md:max-w-[160px] bg-gradient-to-l from-transparent ${group.accentTo} opacity-40`} />
              </div>

              {/* Logo cards with glassmorphism */}
              <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
                {group.sponsors.map((sponsor) => (
                  <div
                    key={sponsor.name}
                    className={`${logoSizes[group.tier]} relative rounded-2xl bg-white/[0.97] shadow-xl shadow-black/15 ring-1 ${group.ringColor} hover:-translate-y-3 hover:shadow-2xl transition-all duration-500 flex items-center justify-center p-3 md:p-4 group cursor-pointer`}
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
                        <div className="w-14 h-14 md:w-18 md:h-18 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-inner">
                          <group.icon className={`h-7 w-7 md:h-9 md:w-9 ${group.accentText} opacity-50 group-hover:opacity-90 transition-opacity duration-300`} />
                        </div>
                        <span className="font-body text-[10px] md:text-xs text-gray-400 group-hover:text-gray-600 text-center leading-tight transition-colors duration-300 font-medium">
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
            <div className="h-px flex-1 max-w-[60px] md:max-w-[140px] bg-gradient-to-r from-transparent to-semin-yellow/25" />
            <div className="relative inline-flex items-center gap-2.5 px-6 md:px-8 py-2.5 md:py-3 rounded-full border border-semin-yellow/15 bg-semin-yellow/[0.04] backdrop-blur-none md:backdrop-blur-md">
              <div className="absolute inset-0 rounded-full bg-semin-yellow/10 blur-xl opacity-40" />
              <Heart className="h-4 w-4 md:h-5 md:w-5 text-semin-yellow relative z-10" />
              <span className="font-body text-xs md:text-sm uppercase tracking-[0.25em] font-bold text-semin-yellow relative z-10">
                Apoio Institucional
              </span>
            </div>
            <div className="h-px flex-1 max-w-[60px] md:max-w-[140px] bg-gradient-to-l from-transparent to-semin-yellow/25" />
          </div>

          <div className="flex flex-wrap justify-center items-center gap-5 sm:gap-8 md:gap-14">
            {organizadores.map((sponsor) => (
              <div
                key={sponsor.name}
                className="group cursor-pointer"
              >
                <div className="relative bg-white rounded-2xl px-4 py-3 sm:px-6 sm:py-4 md:px-6 md:py-4 shadow-xl shadow-black/15 ring-1 ring-semin-yellow/10 hover:shadow-2xl hover:ring-semin-yellow/25 hover:-translate-y-2 transition-all duration-500 flex items-center justify-center min-w-[160px] md:min-w-[240px] h-32 md:h-44">
                  {/* Gold accent top line */}
                  <div className="absolute top-0 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-semin-yellow/40 via-amber-400/60 to-semin-yellow/40 rounded-full" />
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width="240"
                    height="176"
                    className={`${sponsor.className || "h-10 sm:h-14 md:h-20 lg:h-24 max-w-[140px] sm:max-w-none"} w-auto object-contain transition-all duration-500 group-hover:scale-110`}
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
