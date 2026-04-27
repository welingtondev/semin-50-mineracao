import { useState } from "react";
import { Play, Video, User, Building2, Quote, History, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Episode = {
  id: number;
  title: string;
  name: string;
  role: string;
  company: string;
  description: string;
  youtubeId: string; // Placeholder for YouTube ID
};

const episodes: Episode[] = [
  {
    id: 1,
    title: "O Legado - Capítulo 1",
    name: "Nome do Convidado 1",
    role: "Engenheiro de Minas",
    company: "Empresa Exemplo",
    description: "Espaço reservado para a descrição da história e o impacto do legado desta pessoa na engenharia de minas. Clique para assistir ao episódio completo.",
    youtubeId: "", // Empty for now
  },
  {
    id: 2,
    title: "O Legado - Capítulo 2",
    name: "Nome do Convidado 2",
    role: "Especialista em Mineração",
    company: "Instituição Exemplo",
    description: "Relato sobre os desafios e conquistas ao longo de décadas de atuação no setor mineral baiano.",
    youtubeId: "", 
  },
  {
    id: 3,
    title: "O Legado - Capítulo 3",
    name: "Nome do Convidado 3",
    role: "Pesquisador",
    company: "UFBA",
    description: "A contribuição acadêmica e a formação de novas gerações de profissionais que mantêm vivo o legado do curso.",
    youtubeId: "",
  }
];

const LegacySection = () => {
  const [activeEpisode, setActiveEpisode] = useState<Episode>(episodes[0]);
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="legado" className="py-20 md:py-36 bg-semin-dark relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-48 md:w-96 h-48 md:h-96 bg-semin-yellow/5 rounded-full blur-[30px] md:blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-40 md:w-80 h-40 md:h-80 bg-semin-orange/5 rounded-full blur-[25px] md:blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(40 73% 48%) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 md:mb-24 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2.5 font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-semin-yellow/80 font-semibold mb-4">
            <History className="h-3.5 w-3.5" />
            Série Especial
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-semin-cream to-white bg-clip-text text-transparent">
            O Legado
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent via-semin-yellow/40 to-semin-yellow/60" />
            <Sparkles className="h-4 w-4 text-semin-yellow/50" />
            <div className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent via-semin-yellow/40 to-semin-yellow/60" />
          </div>
          <p className="font-body text-sm md:text-base text-white/40 max-w-2xl mx-auto leading-relaxed">
            Uma série documental registrando as histórias e trajetórias que moldaram os 50 anos da Engenharia de Minas na UFBA.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start max-w-7xl mx-auto">
          {/* Main Video Player Area */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            <div 
              className={cn(
                "relative aspect-video rounded-3xl overflow-hidden bg-black/40 ring-1 ring-white/10 shadow-2xl transition-all duration-700",
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
            >
              {activeEpisode.youtubeId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${activeEpisode.youtubeId}?autoplay=0`}
                  title={activeEpisode.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-semin-dark via-semin-blue/20 to-semin-dark">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-semin-yellow/10 flex items-center justify-center mb-6 ring-1 ring-semin-yellow/20 animate-pulse">
                    <Video className="h-10 w-10 md:h-12 md:w-12 text-semin-yellow/60" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2">Episódio em Breve</h3>
                  <p className="text-white/40 font-body text-sm md:text-base max-w-md">
                    O vídeo via YouTube será integrado aqui nesta seção.
                  </p>
                </div>
              )}
            </div>

            {/* Episode Info Area (Below Video on Mobile/Middle, Next to it on Desktop) */}
            <div className={cn(
              "p-6 md:p-10 rounded-3xl bg-white/[0.03] md:backdrop-blur-xl border border-white/5 transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">{activeEpisode.name}</h3>
                  <div className="flex flex-wrap gap-4 text-semin-yellow/70">
                    <span className="flex items-center gap-1.5 text-xs md:text-sm font-body font-medium uppercase tracking-wider">
                      <User className="h-3.5 w-3.5" />
                      {activeEpisode.role}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs md:text-sm font-body font-medium uppercase tracking-wider">
                      <Building2 className="h-3.5 w-3.5" />
                      {activeEpisode.company}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-full border border-semin-yellow/20 bg-semin-yellow/5 text-semin-yellow text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  {activeEpisode.title}
                </div>
              </div>
              
              <div className="relative group">
                <Quote className="absolute -top-4 -left-4 h-8 w-8 text-semin-yellow/10 group-hover:text-semin-yellow/20 transition-colors" />
                <p className="font-body text-base md:text-lg text-white/50 leading-relaxed italic relative z-10">
                  {activeEpisode.description}
                </p>
              </div>
            </div>
          </div>

          {/* Episode Selection Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-display text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Video className="h-5 w-5 text-semin-yellow" />
              Capítulos da Série
            </h4>
            <div className="space-y-4 lg:max-h-[600px] lg:overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-thumb-white/10">
              {episodes.map((episode) => (
                <Card 
                  key={episode.id}
                  className={cn(
                    "cursor-pointer transition-all duration-300 border-white/5 group hover:border-semin-yellow/30 bg-transparent hover:bg-white/[0.02] active:scale-[0.98]",
                    activeEpisode.id === episode.id ? "bg-white/[0.05] border-semin-yellow/40 ring-1 ring-semin-yellow/20" : ""
                  )}
                  onClick={() => setActiveEpisode(episode)}
                >
                  <CardContent className="p-4 flex gap-4">
                    <div className={cn(
                      "w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl bg-semin-dark flex items-center justify-center transition-colors ring-1 ring-white/5",
                      activeEpisode.id === episode.id ? "bg-semin-yellow/20 ring-semin-yellow/40" : "group-hover:bg-white/10"
                    )}>
                      <Play className={cn(
                        "h-6 w-6 transition-all",
                        activeEpisode.id === episode.id ? "text-semin-yellow scale-110" : "text-white/20 group-hover:text-white/60"
                      )} fill={activeEpisode.id === episode.id ? "currentColor" : "none"} />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <span className="text-[10px] uppercase tracking-widest text-semin-yellow/60 font-bold mb-1">{episode.title}</span>
                      <h5 className="text-white font-display font-bold group-hover:text-semin-yellow transition-colors truncate">{episode.name}</h5>
                      <span className="text-[11px] text-white/30 truncate">{episode.company}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-semin-yellow/10 to-transparent border border-semin-yellow/10">
              <p className="text-[11px] md:text-xs text-white/40 font-body leading-relaxed">
                A série **O Legado** continua em produção. Novos capítulos serão adicionados em breve com depoimentos de grandes personalidades da nossa história.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegacySection;
