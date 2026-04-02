import { Heart, Mountain } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ufbaLogo from "@/assets/ufba_logo.png";
import sindimibaLogo from "@/assets/sindimiba-logo.png";

type SponsorLogo = {
  name: string;
  logo?: string;
};

const institutionalSponsors: SponsorLogo[] = [
  { name: "UFBA", logo: ufbaLogo },
  { name: "SINDIMIBA", logo: sindimibaLogo },
];

const sponsorsByTier: { tier: string; label: string; sponsors: SponsorLogo[] }[] = [
  {
    tier: "Ouro",
    label: "🥇 Ouro",
    sponsors: [
      { name: "Patrocinador Ouro 1" },
      { name: "Patrocinador Ouro 2" },
    ],
  },
  {
    tier: "Prata",
    label: "🥈 Prata",
    sponsors: [
      { name: "Patrocinador Prata 1" },
      { name: "Patrocinador Prata 2" },
      { name: "Patrocinador Prata 3" },
    ],
  },
  {
    tier: "Bronze",
    label: "🥉 Bronze",
    sponsors: [
      { name: "Patrocinador Bronze 1" },
      { name: "Patrocinador Bronze 2" },
      { name: "Patrocinador Bronze 3" },
      { name: "Patrocinador Bronze 4" },
    ],
  },
];

const logoSizes: Record<string, string> = {
  Ouro: "w-32 h-20 md:w-48 md:h-28",
  Prata: "w-28 h-16 md:w-40 md:h-24",
  Bronze: "w-24 h-14 md:w-32 md:h-20",
};

const SponsorLogosSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="py-14 md:py-28 bg-semin-cream/50 relative">
      <div ref={ref} className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-display text-xl sm:text-2xl md:text-4xl font-bold text-semin-blue mb-3">
            Nossos Patrocinadores & Apoiadores
          </h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 md:w-12 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Mountain className="h-3.5 w-3.5 md:h-4 md:w-4 text-semin-yellow/60" />
            <div className="w-8 md:w-12 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>
        </div>

        {/* Apoio Institucional */}
        <div className={`mb-12 md:mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className="h-3.5 w-3.5 md:h-4 md:w-4 text-semin-blue" />
            <span className="font-body text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold text-semin-blue">
              Apoio Institucional
            </span>
            <Heart className="h-3.5 w-3.5 md:h-4 md:w-4 text-semin-blue" />
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {institutionalSponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className="w-36 h-20 md:w-52 md:h-28 rounded-xl bg-white border border-semin-blue/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center p-3 md:p-5 active:scale-95"
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Patrocinadores por tier */}
        <div
          className={`space-y-10 md:space-y-14 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {sponsorsByTier.map((group) => (
            <div key={group.tier}>
              <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
                <span className="font-body text-xs md:text-sm uppercase tracking-[0.2em] font-semibold text-semin-blue/70">
                  {group.label}
                </span>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6">
                {group.sponsors.map((sponsor) => (
                  <div
                    key={sponsor.name}
                    className={`${logoSizes[group.tier]} rounded-lg md:rounded-xl bg-white border border-semin-blue/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center p-2 md:p-4 active:scale-95`}
                  >
                    {sponsor.logo ? (
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="max-w-full max-h-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="font-body text-[10px] md:text-xs text-semin-blue/30 text-center leading-tight">
                        {sponsor.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 md:mt-10 font-body text-[10px] md:text-xs text-semin-blue/30">
          Substitua os placeholders acima pelas logos reais dos patrocinadores
        </p>
      </div>
    </section>
  );
};

export default SponsorLogosSection;
