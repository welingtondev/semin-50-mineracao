import { Heart, Mountain, Crown, Award, Medal, Gem } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ufbaLogo from "@/assets/ufba_logo.png";
import sindimibaLogo from "@/assets/sindimiba-logo.png";

type SponsorLogo = {
  name: string;
  logo?: string;
};

const organizadores: SponsorLogo[] = [
  { name: "UFBA", logo: ufbaLogo },
  { name: "SINDIMIBA", logo: sindimibaLogo },
];

const sponsorsByTier: { tier: string; label: string; icon: React.ElementType; sponsors: SponsorLogo[]; accent: string }[] = [
  {
    tier: "Ouro",
    label: "Ouro",
    icon: Crown,
    accent: "text-semin-yellow border-semin-yellow/30 bg-gradient-to-br from-semin-yellow/10 to-semin-yellow/5",
    sponsors: [
      { name: "Patrocinador Ouro 1" },
      { name: "Patrocinador Ouro 2" },
    ],
  },
  {
    tier: "Prata",
    label: "Prata",
    icon: Award,
    accent: "text-gray-400 border-gray-300/30 bg-gradient-to-br from-gray-100/50 to-gray-50/30",
    sponsors: [
      { name: "Patrocinador Prata 1" },
      { name: "Patrocinador Prata 2" },
      { name: "Patrocinador Prata 3" },
    ],
  },
  {
    tier: "Bronze",
    label: "Bronze",
    icon: Medal,
    accent: "text-amber-700 border-amber-700/20 bg-gradient-to-br from-amber-100/30 to-amber-50/20",
    sponsors: [
      { name: "Patrocinador Bronze 1" },
      { name: "Patrocinador Bronze 2" },
      { name: "Patrocinador Bronze 3" },
      { name: "Patrocinador Bronze 4" },
    ],
  },
];

const logoSizes: Record<string, string> = {
  Ouro: "w-36 h-24 md:w-52 md:h-32",
  Prata: "w-28 h-18 md:w-44 md:h-26",
  Bronze: "w-24 h-16 md:w-36 md:h-22",
};

const SponsorLogosSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="py-14 md:py-28 bg-semin-cream relative overflow-hidden">
      <div ref={ref} className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-semin-orange font-semibold mb-3">
            <Gem className="h-3 w-3 md:h-3.5 md:w-3.5" />
            Quem faz o SEMIN acontecer
          </span>
          <h2 className="font-display text-xl sm:text-2xl md:text-4xl font-bold text-semin-blue mb-3">
            Patrocinadores & Apoiadores
          </h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 md:w-12 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Mountain className="h-3.5 w-3.5 md:h-4 md:w-4 text-semin-yellow/60" />
            <div className="w-8 md:w-12 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>
        </div>

        {/* Patrocinadores por tier */}
        <div
          className={`space-y-12 md:space-y-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {sponsorsByTier.map((group, gi) => (
            <div key={group.tier} style={{ transitionDelay: `${gi * 150}ms` }}>
              <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
                <div className="h-px flex-1 max-w-[60px] md:max-w-[100px] bg-gradient-to-r from-transparent to-semin-blue/15" />
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${group.accent}`}>
                  <group.icon className="h-4 w-4" />
                  <span className="font-body text-xs md:text-sm uppercase tracking-[0.15em] font-bold">
                    {group.label}
                  </span>
                </div>
                <div className="h-px flex-1 max-w-[60px] md:max-w-[100px] bg-gradient-to-l from-transparent to-semin-blue/15" />
              </div>

              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
                {group.sponsors.map((sponsor) => (
                  <div
                    key={sponsor.name}
                    className={`${logoSizes[group.tier]} rounded-2xl bg-white/90 backdrop-blur-sm border border-semin-blue/8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center p-3 md:p-5 active:scale-95 group`}
                  >
                    {sponsor.logo ? (
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <span className="font-body text-[10px] md:text-xs text-semin-blue/25 text-center leading-tight">
                        {sponsor.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Organizadores (antigo Apoio Institucional) — por último */}
        <div className={`mt-16 md:mt-20 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px flex-1 max-w-[60px] md:max-w-[100px] bg-gradient-to-r from-transparent to-semin-blue/15" />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-semin-blue/15 bg-semin-blue/5">
              <Heart className="h-3.5 w-3.5 text-semin-blue" />
              <span className="font-body text-xs md:text-sm uppercase tracking-[0.15em] font-bold text-semin-blue">
                Apoio Institucional
              </span>
            </div>
            <div className="h-px flex-1 max-w-[60px] md:max-w-[100px] bg-gradient-to-l from-transparent to-semin-blue/15" />
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {organizadores.map((sponsor) => (
              <div
                key={sponsor.name}
                className="group"
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="h-16 md:h-24 w-auto object-contain opacity-70 hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorLogosSection;
