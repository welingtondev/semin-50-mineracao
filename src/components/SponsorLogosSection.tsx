import { Crown, Award, Medal, Heart } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type SponsorLogo = {
  name: string;
  logo?: string;
};

const sponsorsByTier: { tier: string; icon: React.ElementType; color: string; borderColor: string; sponsors: SponsorLogo[] }[] = [
  {
    tier: "Ouro",
    icon: Crown,
    color: "text-semin-yellow",
    borderColor: "border-semin-yellow/20",
    sponsors: [
      { name: "Patrocinador Ouro 1" },
      { name: "Patrocinador Ouro 2" },
    ],
  },
  {
    tier: "Prata",
    icon: Award,
    color: "text-gray-400",
    borderColor: "border-gray-200",
    sponsors: [
      { name: "Patrocinador Prata 1" },
      { name: "Patrocinador Prata 2" },
      { name: "Patrocinador Prata 3" },
    ],
  },
  {
    tier: "Bronze",
    icon: Medal,
    color: "text-amber-700",
    borderColor: "border-amber-200",
    sponsors: [
      { name: "Patrocinador Bronze 1" },
      { name: "Patrocinador Bronze 2" },
      { name: "Patrocinador Bronze 3" },
      { name: "Patrocinador Bronze 4" },
    ],
  },
  {
    tier: "Apoiadores",
    icon: Heart,
    color: "text-semin-blue",
    borderColor: "border-semin-blue/10",
    sponsors: [
      { name: "Apoiador 1" },
      { name: "Apoiador 2" },
      { name: "Apoiador 3" },
      { name: "Apoiador 4" },
      { name: "Apoiador 5" },
    ],
  },
];

const logoSizes: Record<string, string> = {
  Ouro: "w-32 h-20 md:w-48 md:h-28",
  Prata: "w-28 h-16 md:w-40 md:h-24",
  Bronze: "w-24 h-14 md:w-32 md:h-20",
  Apoiadores: "w-20 h-12 md:w-28 md:h-16",
};

const SponsorLogosSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="py-14 md:py-28 bg-semin-cream/50 relative">
      <div ref={ref} className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-display text-xl sm:text-2xl md:text-4xl font-bold text-semin-blue mb-3">
            Nossos Patrocinadores
          </h2>
          <div className="w-12 md:w-16 h-[2px] bg-gradient-to-r from-semin-yellow to-semin-orange mx-auto rounded-full" />
        </div>

        <div
          className={`space-y-10 md:space-y-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {sponsorsByTier.map((group) => (
            <div key={group.tier}>
              <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
                <group.icon className={`h-3.5 w-3.5 md:h-4 md:w-4 ${group.color}`} />
                <span className={`font-body text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold ${group.color}`}>
                  {group.tier}
                </span>
                <group.icon className={`h-3.5 w-3.5 md:h-4 md:w-4 ${group.color}`} />
              </div>

              <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6">
                {group.sponsors.map((sponsor) => (
                  <div
                    key={sponsor.name}
                    className={`${logoSizes[group.tier]} rounded-lg md:rounded-xl bg-white border ${group.borderColor} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center p-2 md:p-4 group active:scale-95`}
                  >
                    {sponsor.logo ? (
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
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
