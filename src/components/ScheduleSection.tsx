import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, Pickaxe, Gem, Presentation, Calendar, 
  Coffee, Film, Sparkles, Award, PlayCircle 
} from "lucide-react";
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
  palestra: "bg-semin-yellow/10 text-semin-yellow border-semin-yellow/25",
  painel: "bg-cyan-500/10 text-cyan-400 border-cyan-500/25",
  workshop: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  cerimônia: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25",
  intervalo: "bg-zinc-500/10 text-zinc-400 border-zinc-500/25",
  visita: "bg-amber-500/10 text-amber-400 border-amber-500/25",
  lançamento: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/25",
  cinema: "bg-sky-500/10 text-sky-400 border-sky-500/25",
  celebração: "bg-rose-500/10 text-rose-400 border-rose-500/25",
};

const typeIcons: Record<string, any> = {
  palestra: Presentation,
  painel: Pickaxe,
  workshop: Gem,
  cerimônia: Award,
  intervalo: Coffee,
  visita: Calendar,
  lançamento: Sparkles,
  cinema: Film,
  celebração: PlayCircle,
};

const ScheduleSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [activeTab, setActiveTab] = useState("11/Nov");

  return (
    <section id="programacao" className="py-20 md:py-36 bg-semin-dark relative overflow-hidden">
      {/* Top gold separator line */}
      <div className="absolute top-0 left-0 w-full h-px bg-[linear-gradient(90deg,transparent_0%,transparent_35%,hsl(var(--semin-yellow))_50%,transparent_65%,transparent_100%)] opacity-30" />
      
      {/* High-end ambient glows */}
      <div className="absolute top-0 right-0 w-80 md:w-[600px] h-80 md:h-[600px] bg-semin-yellow/5 rounded-full blur-[100px] md:blur-[180px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-semin-orange/5 rounded-full blur-[80px] md:blur-[150px] opacity-30 pointer-events-none" />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        
        {/* Header Section */}
        <div className={`text-center mb-14 md:mb-24 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2.5 font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-semin-orange font-semibold mb-4 md:mb-5">
            <Pickaxe className="h-3.5 w-3.5 animate-pulse" />
            Eixos Temáticos & Cronograma
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 tracking-tight leading-tight text-white">
            Nossa <span className="text-semin-yellow">Programação</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-5 md:mb-7">
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-r from-transparent via-semin-yellow/50 to-semin-yellow rounded-full" />
            <Gem className="h-4 w-4 md:h-5 md:w-5 text-semin-yellow/70" />
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-l from-transparent via-semin-yellow/50 to-semin-yellow rounded-full" />
          </div>
          <p className="font-body text-sm md:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
            O evento será realizado de <b>9 a 12 de Novembro</b> (com atividades especiais no dia 13), no tradicional <b>Auditório Leopoldo Amaral</b> da Escola Politécnica da UFBA.
          </p>
        </div>

        {/* Dynamic Scheduler Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          
          {/* Glassmorphic Tabs Selection Bar */}
          <TabsList className="w-full bg-white/[0.02] border border-white/5 backdrop-blur-md mb-10 md:mb-16 p-1.5 rounded-2xl grid grid-cols-5 gap-1 shadow-2xl">
            {Object.keys(schedule).map((day) => {
              const isActive = activeTab === day;
              return (
                <TabsTrigger
                  key={day}
                  value={day}
                  className={`font-body text-xs md:text-base font-bold rounded-xl py-3.5 transition-all duration-300 relative ${
                    isActive 
                      ? "bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark shadow-xl shadow-semin-yellow/15 scale-105" 
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.02]"
                  }`}
                >
                  {day}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Schedule List Content */}
          {Object.entries(schedule).map(([day, items]) => (
            <TabsContent key={day} value={day} className="relative pl-0 md:pl-10 ml-0 md:ml-10 border-l border-white/5 md:border-white/10 space-y-5 md:space-y-6">
              {items.map((item, i) => {
                const Icon = typeIcons[item.type] || Presentation;
                return (
                  <div
                    key={i}
                    className={`relative transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    
                    {/* Glowing timeline node (Desktop only) */}
                    <div className="absolute left-[-51px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-semin-dark border-2 border-white/15 group flex items-center justify-center z-20 hidden md:flex transition-all duration-300 hover:scale-125 hover:border-semin-yellow">
                      <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        item.type === "intervalo" ? "bg-zinc-500" : "bg-semin-yellow animate-pulse"
                      }`} />
                    </div>

                    {/* Timeline card row */}
                    <Card className="bg-white/[0.01] hover:bg-white/[0.03] border-0 border-l-[3px] border-l-semin-yellow shadow-xl shadow-black/15 ring-1 ring-white/5 hover:ring-white/10 transition-all duration-300 rounded-xl md:rounded-2xl overflow-hidden group">
                      <CardContent className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        {/* Time & Title cluster */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6 flex-1">
                          
                          {/* Time tag */}
                          <div className="flex items-center gap-2 text-white/50 bg-white/[0.03] border border-white/5 px-3 py-1.5 rounded-lg w-fit shrink-0">
                            <Clock className="h-3.5 w-3.5 text-semin-yellow group-hover:rotate-12 transition-transform" />
                            <span className="font-body text-xs md:text-sm font-semibold tracking-wide text-white/80">{item.time}</span>
                          </div>

                          {/* Event title with dynamic color change on card hover */}
                          <div className="space-y-1">
                            <h4 className="font-body text-base md:text-lg font-bold text-white/90 group-hover:text-semin-yellow transition-colors duration-300 leading-snug">
                              {item.title}
                            </h4>
                          </div>

                        </div>

                        {/* Interactive custom status / type badge */}
                        <div className="flex items-center gap-2.5 shrink-0">
                          <Badge className={`${typeColors[item.type]} border font-body font-bold text-[10px] md:text-xs tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-inner flex items-center gap-2`}>
                            <Icon className="h-3.5 w-3.5" />
                            {item.type}
                          </Badge>
                        </div>

                      </CardContent>
                    </Card>

                  </div>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ScheduleSection;
