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
    { time: "08:30 - 12:00", title: "Sessões de Palestras & Painéis Especiais", type: "palestra" },
    { time: "12:00 - 14:00", title: "Intervalo para Almoço", type: "intervalo" },
    { time: "14:00 - 15:30", title: "Homenagem aos Veteranos & Lançamento de Livro", type: "cerimônia" },
    { time: "15:30 - 17:30", title: "Estreia do Documentário Histórico 50 Anos", type: "cinema" },
  ],
  "14/Nov": [
    { time: "10:00 - 14:00", title: "Celebração Oficial do Jubileu de Ouro", type: "celebração" },
    { time: "14:00 - 18:00", title: "Encontro dos Engenheiros de Minas", type: "painel" },
    { time: "18:00 - 23:30", title: "Festa do Eng. de Minas", type: "celebração" },
  ],
};

const typeColors: Record<string, string> = {
  palestra: "bg-amber-500/10 text-amber-800 border-amber-500/20",
  painel: "bg-cyan-500/10 text-cyan-800 border-cyan-500/20",
  workshop: "bg-emerald-500/10 text-emerald-800 border-emerald-500/20",
  cerimônia: "bg-indigo-500/10 text-indigo-800 border-indigo-500/20",
  intervalo: "bg-zinc-500/10 text-zinc-700 border-zinc-500/20",
  visita: "bg-orange-500/10 text-orange-800 border-orange-500/20",
  lançamento: "bg-fuchsia-500/10 text-fuchsia-800 border-fuchsia-500/20",
  cinema: "bg-sky-500/10 text-sky-800 border-sky-500/20",
  celebração: "bg-rose-500/10 text-rose-800 border-rose-500/20",
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
    <section id="programacao" className="py-20 md:py-36 bg-semin-cream relative overflow-hidden">
      {/* Top gold separator line */}
      <div className="absolute top-0 left-0 w-full h-px bg-[linear-gradient(90deg,transparent_0%,transparent_35%,hsl(var(--semin-yellow))_50%,transparent_65%,transparent_100%)] opacity-35" />
      
      {/* High-end ambient glows - soft and warm for light theme */}
      <div className="absolute top-0 right-0 w-80 md:w-[600px] h-80 md:h-[600px] bg-semin-yellow/15 rounded-full blur-[100px] md:blur-[180px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-semin-orange/10 rounded-full blur-[80px] md:blur-[150px] opacity-40 pointer-events-none" />

      <div ref={ref} className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
        
        {/* Header Section */}
        <div className={`text-center mb-14 md:mb-24 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2.5 font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-semin-orange font-semibold mb-4 md:mb-5">
            <Pickaxe className="h-3.5 w-3.5 animate-pulse" />
            Eixos Temáticos & Cronograma
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 tracking-tight leading-tight text-semin-blue">
            Nossa <span className="bg-gradient-to-r from-semin-orange to-amber-500 bg-clip-text text-transparent font-extrabold">Programação</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-5 md:mb-7">
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-r from-transparent via-semin-yellow/50 to-semin-yellow rounded-full" />
            <Gem className="h-4 w-4 md:h-5 md:w-5 text-semin-orange/70" />
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-l from-transparent via-semin-yellow/50 to-semin-yellow rounded-full" />
          </div>
          <p className="font-body text-sm md:text-base text-semin-blue/70 max-w-2xl mx-auto leading-relaxed font-medium">
            O evento será realizado de <b>9 a 14 de Novembro</b> (com palestras na sexta, dia 13, e o grande Encontro e Festa no sábado, dia 14), no tradicional <b>Auditório Leopoldo Amaral</b> da Escola Politécnica da UFBA.
          </p>
        </div>

        {/* Dynamic Scheduler Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          
          {/* Glassmorphic Tabs Selection Bar (aligned to light theme) */}
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto w-full max-w-2xl mx-auto bg-white border border-black/5 shadow-md mb-10 md:mb-16 p-1.5 rounded-2xl gap-1">
            {Object.keys(schedule).map((day) => {
              const isActive = activeTab === day;
              return (
                <TabsTrigger
                  key={day}
                  value={day}
                  className={`font-body text-xs md:text-base font-bold rounded-xl py-3 md:py-3.5 transition-all duration-300 ${
                    isActive 
                      ? "bg-gradient-to-r from-semin-yellow to-semin-orange text-semin-dark shadow-md scale-105" 
                      : "text-semin-blue/50 hover:text-semin-blue/80 hover:bg-black/[0.02]"
                  }`}
                >
                  {day}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Schedule List Content */}
          {Object.entries(schedule).map(([day, items]) => (
            <TabsContent key={day} value={day} className="relative pl-0 md:pl-10 ml-0 md:ml-10 border-l border-black/10 space-y-5 md:space-y-6">
              {items.map((item, i) => {
                const Icon = typeIcons[item.type] || Presentation;
                return (
                  <div
                    key={i}
                    className={`relative transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    
                    {/* Glowing timeline node (Desktop only) */}
                    <div className="absolute left-[-51px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-white border-2 border-black/10 shadow-sm group flex items-center justify-center z-20 hidden md:flex transition-all duration-300 hover:scale-125 hover:border-semin-orange">
                      <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        item.type === "intervalo" ? "bg-zinc-400" : "bg-semin-orange animate-pulse"
                      }`} />
                    </div>

                    {/* Timeline card row - White background, clean shadow */}
                    <Card className="bg-white hover:bg-white/[0.98] border-0 border-l-[4px] border-l-semin-yellow shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl md:rounded-2xl overflow-hidden group">
                      <CardContent className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        {/* Time & Title cluster */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6 flex-1 text-left">
                          
                          {/* Time tag */}
                          <div className="flex items-center gap-2 text-semin-blue/60 bg-semin-cream border border-black/[0.03] px-3 py-1.5 rounded-lg w-fit shrink-0">
                            <Clock className="h-3.5 w-3.5 text-semin-orange group-hover:rotate-12 transition-transform" />
                            <span className="font-body text-xs md:text-sm font-semibold tracking-wide text-semin-blue">{item.time}</span>
                          </div>

                          {/* Event title */}
                          <div className="space-y-1">
                            <h4 className="font-body text-base md:text-lg font-bold text-semin-blue group-hover:text-semin-orange transition-colors duration-300 leading-snug">
                              {item.title}
                            </h4>
                          </div>

                        </div>

                        {/* Interactive custom status / type badge */}
                        <div className="flex items-center gap-2.5 shrink-0">
                          <Badge className={`${typeColors[item.type]} border font-body font-bold text-[10px] md:text-xs tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-2 border-current`}>
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
