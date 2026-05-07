import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Pickaxe, Gem } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const schedule = {
  "09/Nov": [
    { time: "08:00 - 12:00", title: "Minicursos e Capacitação Prática", type: "workshop" },
    { time: "14:00 - 18:00", title: "Workshops de Otimização", type: "workshop" },
  ],
  "10/Nov": [
    { time: "08:00 - 12:00", title: "Minicursos Avançados", type: "workshop" },
    { time: "14:00 - 18:00", title: "Capacitação Tecnológica", type: "workshop" },
  ],
  "11/Nov": [
    { time: "08:00 - 08:15", title: "Abertura Oficial e Boas-vindas", type: "cerimônia" },
    { time: "08:15 - 12:00", title: "Sessões de Palestras Temáticas e Cases Reais", type: "palestra" },
    { time: "12:00 - 14:00", title: "Intervalo para Almoço", type: "intervalo" },
    { time: "14:00 - 16:00", title: "Continuação das Temáticas Técnicas", type: "palestra" },
    { time: "16:00 - 17:20", title: "Painel de Debates Guiado", type: "painel" },
    { time: "17:20 - 17:30", title: "Agradecimentos e Encerramento", type: "cerimônia" },
  ],
  "12/Nov": [
    { time: "08:00 - 12:00", title: "Palestras Especiais de Egressos", type: "palestra" },
    { time: "12:00 - 14:00", title: "Intervalo para Almoço", type: "intervalo" },
    { time: "14:00 - 16:00", title: "Temáticas de Inovação e Mercado", type: "palestra" },
    { time: "16:00 - 17:20", title: "Painel de Debates de Novos Empreendimentos", type: "painel" },
    { time: "17:20 - 17:30", title: "Agradecimentos Finais", type: "cerimônia" },
  ],
  "13/Nov": [
    { time: "09:00 - 11:00", title: "Homenagem aos Veteranos & In Memoriam", type: "cerimônia" },
    { time: "11:00 - 12:30", title: "Lançamento: Livro Prof. China - 2ª Edição", type: "lançamento" },
    { time: "14:00 - 16:30", title: "Estreia do Documentário Histórico 50 Anos", type: "cinema" },
    { time: "18:00 - 23:00", title: "Festa do Eng. de Minas", type: "celebração" },
  ],
};

const typeColors: Record<string, string> = {
  palestra: "bg-semin-yellow/20 text-semin-orange border-semin-yellow/30",
  painel: "bg-semin-blue/10 text-semin-blue border-semin-blue/20",
  workshop: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cerimônia: "bg-semin-cream text-semin-dark border-semin-orange/20",
  intervalo: "bg-zinc-100 text-zinc-500 border-zinc-200",
  visita: "bg-amber-100 text-amber-700 border-amber-200",
  lançamento: "bg-purple-100 text-purple-700 border-purple-200",
  cinema: "bg-sky-100 text-sky-700 border-sky-200",
  celebração: "bg-rose-100 text-rose-700 border-rose-200",
};

const ScheduleSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="programacao" className="py-16 md:py-32 bg-semin-dark relative overflow-hidden">
      {/* Top gold separator line */}
      <div className="absolute top-0 left-0 w-full h-px bg-[linear-gradient(90deg,transparent_0%,transparent_35%,hsl(var(--semin-yellow))_50%,transparent_65%,transparent_100%)] opacity-30" />
      <div className="absolute top-0 right-0 w-48 md:w-[400px] h-48 md:h-[400px] bg-semin-yellow/10 rounded-full blur-[30px] md:blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 md:w-80 h-40 md:h-80 bg-semin-orange/5 rounded-full blur-[25px] md:blur-[100px] opacity-60 pointer-events-none" />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-10 md:mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-semin-orange font-semibold mb-3 md:mb-4">
            <Pickaxe className="h-3 w-3 md:h-3.5 md:w-3.5" />
            Cronograma
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 tracking-tight leading-tight text-white">
            Nossa <span className="text-semin-yellow">Programação</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
            <div className="w-8 md:w-12 h-[2px] bg-gradient-to-r from-transparent to-semin-orange/30 rounded-full" />
            <Gem className="h-3.5 w-3.5 md:h-4 md:w-4 text-semin-orange/50" />
            <div className="w-8 md:w-12 h-[2px] bg-gradient-to-l from-transparent to-semin-orange/30 rounded-full" />
          </div>
          <p className="font-body text-sm md:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
            O evento será realizado de <b>9 a 12 de Novembro</b> (com atividades especiais no dia 13), no tradicional Auditório Leopoldo Amaral da Escola Politécnica da UFBA. Nossa grade é construída em eixos temáticos focados em inovação e na trajetória de excelência dos nossos egressos.
          </p>
        </div>

        <Tabs defaultValue="11/Nov" className="max-w-4xl mx-auto">
          <TabsList className="w-full bg-white/[0.03] border border-white/5 backdrop-blur-md mb-6 md:mb-8 p-1 md:p-1.5 rounded-xl">
            {Object.keys(schedule).map((day) => (
              <TabsTrigger
                key={day}
                value={day}
                className="flex-1 font-body text-sm md:text-base font-semibold rounded-lg data-[state=active]:bg-semin-yellow data-[state=active]:text-semin-dark data-[state=active]:shadow-lg text-white/60 data-[state=active]:text-semin-dark transition-all duration-300 py-2.5"
              >
                {day}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(schedule).map(([day, items]) => (
            <TabsContent key={day} value={day} className="space-y-3 md:space-y-4">
              {items.map((item, i) => (
                <div
                  key={i}
                  className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-x-4"}`}
                  style={{ transitionDelay: `${i * 60 + 200}ms` }}
                >
                  <Card className="bg-white/[0.02] hover:bg-white/[0.04] border-t-0 border-r-0 border-b-0 border-l-4 border-l-semin-yellow border-white/5 hover:border-white/10 shadow-lg shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 group active:scale-[0.99]">
                    <CardContent className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                      <div className="flex items-center gap-2 text-white/40 sm:min-w-[150px]">
                        <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 group-hover:text-semin-yellow transition-colors shrink-0" />
                        <span className="font-body text-xs md:text-sm font-medium">{item.time}</span>
                      </div>
                      <div className="flex-1 flex items-center justify-between gap-2">
                        <h4 className="font-body text-sm md:text-base font-semibold text-white/80 group-hover:text-semin-yellow transition-colors">
                          {item.title}
                        </h4>
                        <Badge className={`${typeColors[item.type]} border text-[10px] md:text-xs capitalize shrink-0`}>
                          {item.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ScheduleSection;
