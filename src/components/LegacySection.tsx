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
    name: "Angeval Brito",
    role: "Engenheiro de Minas",
    company: "SGB",
    description: "Neste episódio da série O Legado, recebemos o querido Angeval Brito para um papo cheio de nostalgia e gratidão. Formado pela UFBA, Brito abre o coração sobre os tempos de graduação — entre festas memoráveis como o Enferminas e os desafios das greves — e percorre sua jornada desde o \"chão de fábrica\" na Mineração Caraíba até o Serviço Geológico do Brasil.",
    youtubeId: "Fn4TQ-7w9so",
  },
  {
    id: 2,
    title: "O Legado - Capítulo 2",
    name: "Cláudia Rios",
    role: "Engenheira de Minas",
    company: "Consultora",
    description: "Neste episódio da série O Legado, recebemos a querida Engenheira de Minas Cláudia Rios. Formada pela UFBA, Cláudia compartilha sua brilhante trajetória profissional passando pela Vale (CVRD) e Jacobina Mineração, além dos desafios e o imenso orgulho de ter sido uma das poucas mulheres de sua turma, abrindo caminhos e inspirando novas gerações no setor mineral.",
    youtubeId: "k0VBHMXJAao", 
  },
  {
    id: 3,
    title: "O Legado - Capítulo 3",
    name: "Jorge Luiz",
    role: "Engenheiro de Minas",
    company: "Support Mining",
    description: "Neste capítulo da série O Legado, recebemos o querido Engenheiro de Minas Jorge Luiz. Formado pela UFBA, Jorge compartilha sua brilhante trajetória profissional passando por grandes companhias como Vale, RDM e Mineração Caraíba, além dos desafios e o imenso orgulho de ter empreendido no setor mineral com a consolidação da Support Mining, destacando a amizade e a rede de confiança construída no curso como o seu maior patrimônio.",
    youtubeId: "X2-rDmwLN9M",
  },
  {
    id: 4,
    title: "O Legado - Capítulo 4",
    name: "Francisco Sampaio",
    role: "Engenheiro de Minas",
    company: "DrillGeo",
    description: "No quarto episódio da série O Legado, recebemos Francisco Sampaio, Engenheiro de Minas graduado na turma de 2010.2 pela Universidade Federal da Bahia (UFBA). Neste bate-papo, Francisco compartilha detalhes marcantes de sua trajetória acadêmica na Escola Politécnica, destacando sua atuação marcante como bolsista durante quase quatro anos no Projeto Campo Escola (Convênio UFBA/ANP) — iniciativa que reestruturou campos de petróleo doados pela Petrobras para fomento estudantil em bacias de Aracaju, Alagoas e Maranhão, proporcionando uma vivência prática essencial e maturidade antes mesmo da formatura. Além disso, ele relembra a participação ativa na Cristal Mineração e Petróleo Jr., marco de aprendizado em gestão de equipe, liderança e visão empresarial. Francisco detalha também sua transição profissional: os primeiros passos na indústria do petróleo e a consolidação de sua carreira na mineração, especificamente no segmento de sondagem. Hoje, atuando como diretor da DrillGeo Geologia e Sondagens, ele reflete sobre como a formação eclética e os valores de ética, compromisso e responsabilidade absorvidos na UFBA permitiram que ele alcançasse o sucesso empreendedor no mercado.",
    youtubeId: "W0kC3X8Pe-c",
  },
  {
    id: 5,
    title: "O Legado - Capítulo 5",
    name: "Roberto Lima",
    role: "Engenheiro de Minas",
    company: "Grupo Ero",
    description: "No quinto episódio da série O Legado, recebemos Roberto Lima, Engenheiro de Minas graduado na turma de 2003.2 pela Universidade Federal da Bahia. Neste bate-papo inspirador, Roberto compartilha como ingressou no curso em 1997 por incentivo do amigo e colega de profissão Leandro Carlos, e relembra sua sólida trajetória no setor. Desde os primeiros passos como estagiário e engenheiro júnior na Mina de Fazenda Brasileiro, passando pela atuação como engenheiro na Vale (Mina de Onça Puma, no Pará), gerente de planejamento na AngloGold Ashanti (Córrego do Sítio, em Minas Gerais), até sua ida à Mineração Caraíba, onde hoje atua como Gerente Geral de Operações das minas de Vermelhos e Surubim (Grupo Ero). Roberto conta também um episódio marcante e resiliente da sua época de estudante: a determinação para realizar uma prova final de Física na universidade mesmo após sofrer uma lesão grave na mão no ônibus. Além disso, ele faz um agradecimento especial aos professores Paulo Lins e China pelo apoio na iniciação científica e pela oportunidade de participar de seu primeiro congresso em Ouro Preto, reforçando a mensagem principal de seu legado: De que jovens de escola pública e comunidades menos favorecidas podem, sim, alcançar seus sonhos e conquistar o topo no mercado.",
    youtubeId: "S7l_E-UKCBI",
  },
  {
    id: 6,
    title: "O Legado - Capítulo 6",
    name: "Roberto Matos",
    role: "Engenheiro de Minas",
    company: "Grupo Civil",
    description: "No sexto episódio da série O Legado, recebemos Roberto Matos (conhecido carinhosamente como \"Galego\"), Engenheiro de Minas graduado na turma de 1988.1 pela Universidade Federal da Bahia (UFBA). Neste bate-papo, Roberto relembra sua época no Colégio Militar de Salvador e a inusitada decisão de escolher a Engenharia de Minas diretamente na fila de inscrição do vestibular. Ele compartilha memórias marcantes da vida universitária nos anos 80, a origem de seu apelido \"Galego\" por conta dos tempos de surfista e as amizades construídas na Escola Politécnica — laços que abriram portas fundamentais em sua trajetória profissional. Com mais de três décadas de experiência, Roberto detalha sua sólida carreira no setor de agregados e rochas ornamentais: desde o início na Pedreira Carangi passando por 16 anos na Mineração Corcovado, até assumir a diretoria de mineração no Grupo Civil em 2009. Além disso, ele traz reflexões valiosas sobre o valor do networking e a importância da humildade na profissão, destacando o aprendizado diário com os operadores, encarregados e trabalhadores que estão na lida diária do campo.",
    youtubeId: "XBkSbHCHRTU",
  }
];

const LegacySection = () => {
  const [activeEpisode, setActiveEpisode] = useState<Episode>(episodes[0]);
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="legado" className="py-20 md:py-36 bg-semin-cream relative overflow-hidden">
      {/* Top gold separator line that blends with light background */}
      <div className="absolute top-0 left-0 w-full h-px bg-[linear-gradient(90deg,transparent_0%,transparent_35%,hsl(var(--semin-yellow))_50%,transparent_65%,transparent_100%)] opacity-30" />

      {/* Background Ornaments */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-48 md:w-96 h-48 md:h-96 bg-semin-yellow/15 rounded-full blur-[30px] md:blur-[100px] opacity-70" />
        <div className="absolute bottom-[10%] left-[-5%] w-40 md:w-80 h-40 md:h-80 bg-semin-orange/10 rounded-full blur-[25px] md:blur-[80px] opacity-70" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(40 73% 48%) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 md:mb-24 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2.5 font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-semin-orange font-semibold mb-4">
            <History className="h-3.5 w-3.5 text-semin-orange" />
            Série Especial
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 text-semin-blue tracking-tight leading-tight">
            O <span className="bg-gradient-to-r from-semin-orange to-amber-500 bg-clip-text text-transparent font-extrabold">Legado</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent via-semin-orange/20 to-semin-orange/30" />
            <Sparkles className="h-4 w-4 text-semin-orange/55" />
            <div className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent via-semin-orange/20 to-semin-orange/30" />
          </div>
          <p className="font-body text-sm md:text-base text-semin-blue/70 max-w-3xl mx-auto leading-relaxed font-medium">
            Uma série documental emocionante que registra as histórias, memórias e trajetórias de superação que moldaram os 50 anos da Engenharia de Minas na UFBA. Mais do que uma formação técnica de excelência, o curso tornou-se o grande alicerce de vida para cada participante: um divisor de águas que forjou carreiras brilhantes, gerou conexões indestrutíveis, inspirou propósitos profundos e deixou um legado eterno de orgulho, amizade e transformação pessoal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start max-w-7xl mx-auto">
          {/* Main Video Player Area */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            <div 
              className={cn(
                "relative aspect-video rounded-3xl overflow-hidden bg-black/5 ring-1 ring-black/[0.03] shadow-2xl transition-all duration-700",
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
                  loading="lazy"
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-semin-cream via-white to-semin-cream">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-semin-orange/10 flex items-center justify-center mb-6 ring-1 ring-semin-orange/20 animate-pulse">
                    <Video className="h-10 w-10 md:h-12 md:w-12 text-semin-orange/60" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-semin-blue mb-2">Episódio em Breve</h3>
                  <p className="text-semin-blue/55 font-body text-sm md:text-base max-w-md">
                    O vídeo via YouTube será integrado aqui nesta seção.
                  </p>
                </div>
              )}
            </div>

            {/* Episode Info Area (Below Video on Mobile/Middle, Next to it on Desktop) */}
            <div className={cn(
              "p-6 md:p-10 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-black/[0.05] pb-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-semin-blue mb-2">{activeEpisode.name}</h3>
                  <div className="flex flex-wrap gap-4 text-semin-orange">
                    <span className="flex items-center gap-1.5 text-xs md:text-sm font-body font-semibold uppercase tracking-wider">
                      <User className="h-3.5 w-3.5 text-semin-orange" />
                      {activeEpisode.role}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs md:text-sm font-body font-semibold uppercase tracking-wider">
                      <Building2 className="h-3.5 w-3.5 text-semin-orange" />
                      {activeEpisode.company}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-full border border-semin-orange/20 bg-semin-orange/5 text-semin-orange text-[10px] md:text-xs font-bold uppercase tracking-widest self-start md:self-auto">
                  {activeEpisode.title}
                </div>
              </div>
              
              <div className="relative group">
                <Quote className="absolute -top-4 -left-4 h-8 w-8 text-semin-orange/10 group-hover:text-semin-orange/20 transition-colors" />
                <p className="font-body text-base md:text-lg text-semin-blue/70 leading-relaxed italic relative z-10 font-medium">
                  "{activeEpisode.description}"
                </p>
              </div>
            </div>
          </div>

          {/* Episode Selection Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-display text-lg font-bold text-semin-blue mb-6 flex items-center gap-2">
              <Video className="h-5 w-5 text-semin-orange" />
              Capítulos da Série
            </h4>
            <div className="space-y-4 lg:max-h-[600px] lg:overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-thumb-black/10">
              {episodes.map((episode) => (
                <Card 
                  key={episode.id}
                  className={cn(
                    "cursor-pointer transition-all duration-300 border-black/[0.04] group hover:border-semin-orange/30 bg-white/80 hover:bg-white active:scale-[0.98] shadow-sm hover:shadow-md",
                    activeEpisode.id === episode.id ? "bg-white border-semin-orange/40 ring-1 ring-semin-orange/20 shadow-md" : ""
                  )}
                  onClick={() => setActiveEpisode(episode)}
                >
                  <CardContent className="p-4 flex gap-4">
                    <div className={cn(
                      "w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl bg-semin-cream flex items-center justify-center transition-colors ring-1 ring-black/[0.03]",
                      activeEpisode.id === episode.id ? "bg-semin-orange/15 ring-semin-orange/35" : "group-hover:bg-semin-orange/5"
                    )}>
                      <Play className={cn(
                        "h-6 w-6 transition-all",
                        activeEpisode.id === episode.id ? "text-semin-orange scale-110" : "text-semin-blue/20 group-hover:text-semin-orange/60"
                      )} fill={activeEpisode.id === episode.id ? "currentColor" : "none"} />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <span className="text-[10px] uppercase tracking-widest text-semin-orange/80 font-bold mb-1">{episode.title}</span>
                      <h5 className="text-semin-blue font-display font-bold group-hover:text-semin-orange transition-colors truncate">{episode.name}</h5>
                      <span className="text-[11px] text-semin-blue/50 truncate font-medium">{episode.company}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-semin-orange/10 to-transparent border border-semin-orange/10">
              <p className="text-[11px] md:text-xs text-semin-blue/70 font-body leading-relaxed font-medium">
                A série <strong className="text-semin-orange font-bold">O Legado</strong> continua em produção. Todas as sextas-feiras, um novo capítulo será adicionado, trazendo depoimentos marcantes de grandes personalidades da nossa história.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegacySection;
