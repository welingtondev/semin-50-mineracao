import { BookOpen, Film, PartyPopper, Award, Gem, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const JubileeSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="jubileu" className="py-16 md:py-32 bg-semin-dark relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-64 md:w-[500px] h-64 md:h-[500px] bg-semin-yellow/5 rounded-full blur-[40px] md:blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 md:w-[400px] h-48 md:h-[400px] bg-semin-orange/5 rounded-full blur-[30px] md:blur-[100px] mix-blend-screen pointer-events-none" />
      
      {/* Gold line top */}
      <div className="absolute top-0 left-0 w-full h-px bg-[linear-gradient(90deg,#06080c_0%,#06080c_35%,#d29b21_50%,#06080c_65%,#06080c_100%)] opacity-80" />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 md:mb-24 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-semin-yellow/30 bg-semin-yellow/10 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(210,155,33,0.2)]">
            <Sparkles className="h-4 w-4 text-semin-yellow" />
            <span className="font-body text-xs md:text-sm uppercase tracking-[0.2em] font-bold bg-gradient-to-r from-semin-yellow to-semin-orange bg-clip-text text-transparent">
              13 de Novembro
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 md:mb-8 tracking-tight leading-tight">
            Jubileu de <span className="text-semin-yellow">Ouro</span>
          </h2>
          
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 md:w-20 h-[1px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Gem className="h-5 w-5 text-semin-yellow" />
            <div className="w-12 md:w-20 h-[1px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>
          
          <p className="font-body text-sm md:text-xl text-white/60 max-w-4xl mx-auto leading-relaxed px-2">
            O encerramento do SEMIN UFBA será a consagração de meio século de história. Uma programação monumental desenhada para documentar e celebrar o impacto da Engenharia de Minas da UFBA no desenvolvimento mineral da Bahia, honrando quem construiu o passado e inspirando quem herdará o futuro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-6xl mx-auto">
          {/* Card 1: Homenagem */}
          <div className={`transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <Card className="h-full bg-white/5 md:backdrop-blur-md border border-white/10 hover:border-semin-yellow/40 hover:shadow-[0_0_30px_rgba(210,155,33,0.15)] group-hover:bg-white/10 transition-all duration-500 overflow-hidden group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-semin-yellow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 md:p-10 relative z-10">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-semin-yellow/20 to-semin-orange/20 flex items-center justify-center mb-6 border border-semin-yellow/30 group-hover:scale-110 transition-transform duration-500">
                  <Award className="h-7 w-7 md:h-8 md:w-8 text-semin-yellow" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Homenagem aos Veteranos</h3>
                <p className="text-sm md:text-base text-white/60 leading-relaxed">
                  Um tributo emocionante aos pioneiros que desbravaram o curso de Engenharia de Minas da UFBA em seus primeiros anos. Este momento também contará com um doloroso *In Memoriam* àqueles que deixaram marcas inesquecíveis na história da Escola Politécnica e na mineração brasileira.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Card 2: Livro */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <Card className="h-full bg-white/5 md:backdrop-blur-md border border-white/10 hover:border-semin-yellow/40 hover:shadow-[0_0_30px_rgba(210,155,33,0.15)] group-hover:bg-white/10 transition-all duration-500 overflow-hidden group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-semin-yellow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 md:p-10 relative z-10">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-semin-yellow/20 to-semin-orange/20 flex items-center justify-center mb-6 border border-semin-yellow/30 group-hover:scale-110 transition-transform duration-500">
                  <BookOpen className="h-7 w-7 md:h-8 md:w-8 text-semin-yellow" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Lançamento do livro do Prof. China</h3>
                <p className="font-body text-sm md:text-base text-white/60 leading-relaxed">
                  O grandioso lançamento da segunda edição da obra do Prof. José Baptista de Oliveira Júnior. Mais do que um registro acadêmico, o livro reúne "causos" históricos da primeira década, eternizando a vivência de fundação da Engenharia de Minas na universidade através de uma narrativa única.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Card 3: Documentário */}
          <div className={`transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <Card className="h-full bg-white/5 md:backdrop-blur-md border border-white/10 hover:border-semin-yellow/40 hover:shadow-[0_0_30px_rgba(210,155,33,0.15)] group-hover:bg-white/10 transition-all duration-500 overflow-hidden group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-semin-yellow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6 md:p-10 relative z-10">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-semin-yellow/20 to-semin-orange/20 flex items-center justify-center mb-6 border border-semin-yellow/30 group-hover:scale-110 transition-transform duration-500">
                  <Film className="h-7 w-7 md:h-8 md:w-8 text-semin-yellow" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Documentário Histórico</h3>
                <p className="font-body text-sm md:text-base text-white/60 leading-relaxed">
                  A estreia do filme em comemoração aos 50 anos do curso. Através de depoimentos de figuras marcantes, imagens de arquivo e filmagens de campo, o documentário imortaliza o legado e a vanguarda tecnológica da UFBA na formação de lideranças para a mineração nacional.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Card 4: Festa */}
          <div className={`transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <Card className="h-full bg-white/5 md:backdrop-blur-md border border-white/10 hover:border-semin-yellow/40 hover:shadow-[0_0_30px_rgba(210,155,33,0.15)] group-hover:bg-white/10 transition-all duration-500 overflow-hidden group relative">
              {/* Highlight gradient for party */}
              <div className="absolute inset-0 bg-gradient-to-br from-semin-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 md:p-10 relative z-10">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-semin-yellow/20 to-semin-orange/20 flex items-center justify-center mb-6 border border-semin-yellow/30 group-hover:scale-110 transition-transform duration-500">
                  <PartyPopper className="h-7 w-7 md:h-8 md:w-8 text-semin-yellow" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Festa do Eng. de Minas</h3>
                <p className="font-body text-sm md:text-base text-white/60 leading-relaxed">
                  A clássica festa encerrará as celebrações! O evento noturno será o ponto de relaxamento e de um robusto e alegre networking orgânico entre todas as gerações. Veteranos da primeira década e futuros engenheiros celebrarão a sintonia inquebrável da comunidade politécnica.
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
};

export default JubileeSection;
