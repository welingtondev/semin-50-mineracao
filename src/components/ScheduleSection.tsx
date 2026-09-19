import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, Pickaxe, Gem, Presentation, Calendar, 
  Coffee, Film, Sparkles, Award, PlayCircle, Flame, 
  ArrowRight, ShieldCheck, Cpu, Leaf
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const panelsData = [
  {
    number: "01",
    day: "12 de Novembro",
    period: "Fim da Tarde (15:30 - 17:00)",
    title: "Desmonte de Rochas & Operações de Lavra",
    description: "Técnicas de desmonte por explosivos, controle de vibrações sismográficas, segurança operacional e fragmentação.",
    icon: Flame,
    color: "from-amber-500 to-orange-600",
    badge: "12/Nov · Tarde",
    tabKey: "12/Nov"
  },
  {
    number: "02",
    day: "13 de Novembro",
    period: "Fim da Tarde (15:30 - 17:00)",
    title: "Desafios para Terras Raras & Minerais Críticos",
    description: "Papel geopolítico do Brasil e da Bahia na transição energética global, processamento mineral e agregação de valor.",
    icon: Gem,
    color: "from-sky-500 to-blue-600",
    badge: "13/Nov · Tarde",
    tabKey: "13/Nov"
  },
  {
    number: "03",
    day: "14 de Novembro",
    period: "Fim da Manhã (10:30 - 12:00)",
    title: "Gestão, Sustentabilidade & Governança Mineral (ESG)",
    description: "Descaracterização de barragens, filtragem de rejeitos a seco, licenciamento socioambiental e relacionamento com comunidades.",
    icon: Leaf,
    color: "from-emerald-500 to-teal-600",
    badge: "14/Nov · Manhã",
    tabKey: "14/Nov"
  },
  {
    number: "04",
    day: "14 de Novembro",
    period: "Fim da Tarde (14:00 - 15:30)",
    title: "Inovação, Inteligência de Processos & Futuro da Mineração",
    description: "Automação, IA aplicada a plantas de beneficiamento, transição geracional e a formação do engenheiro para as próximas cinco décadas.",
    icon: Cpu,
    color: "from-purple-500 to-indigo-600",
    badge: "14/Nov · Tarde",
    tabKey: "14/Nov"
  },
];

const schedule = {
  "09/Nov": [
    { time: "08:00 - 12:00", title: "Minicursos e Capacitação Prática Inicial", type: "workshop" },
    { time: "14:00 - 18:00", title: "Workshops de Otimização e Softwares Minerais", type: "workshop" },
  ],
  "10/Nov": [
    { time: "08:00 - 12:00", title: "Minicursos Avançados de Modelagem Geológica e de Mina", type: "workshop" },
    { time: "14:00 - 18:00", title: "Capacitação Tecnológica e Análise Geotécnica", type: "workshop" },
  ],
  "11/Nov": [
    { time: "08:00 - 08:30", title: "Solenidade de Abertura Oficial do SEMIN 2026", type: "cerimônia" },
    { time: "08:30 - 12:00", title: "Sessões de Palestras Magnas com Lideranças do Setor", type: "palestra" },
    { time: "12:00 - 14:00", title: "Intervalo para Almoço & Networking Executivo", type: "intervalo" },
    { time: "14:00 - 17:30", title: "Continuação dos Eixos Técnicos e Cases da Indústria", type: "palestra" },
  ],
  "12/Nov": [
    { time: "08:30 - 12:00", title: "Palestras Técnicas: Lavra, Perfuração e Operações de Mina", type: "palestra" },
    { time: "12:00 - 14:00", title: "Intervalo para Almoço", type: "intervalo" },
    { time: "14:00 - 15:30", title: "Palestras de Geotecnia Operacional, Segurança e Equipamentos", type: "palestra" },
    { time: "15:30 - 17:00", title: "PAINEL 1: Desmonte de Rochas & Operações de Lavra (Mediação Especializada)", type: "painel" },
    { time: "17:00 - 17:30", title: "Encerramento da Sessão Técnica & Networking", type: "cerimônia" },
  ],
  "13/Nov": [
    { time: "08:30 - 12:00", title: "Palestras Técnicas: Exploração Mineral, Geologia e Metalurgia", type: "palestra" },
    { time: "12:00 - 14:00", title: "Intervalo para Almoço", type: "intervalo" },
    { time: "14:00 - 15:30", title: "Homenagem aos Veteranos & Lançamento de Livro", type: "cerimônia" },
    { time: "15:30 - 17:00", title: "PAINEL 2: Desafios para as Terras Raras & Minerais Críticos (Mediação Especializada)", type: "painel" },
    { time: "17:00 - 18:00", title: "Estreia do Documentário Histórico 50 Anos de Engenharia de Minas", type: "cinema" },
  ],
  "14/Nov": [
    { time: "09:00 - 10:30", title: "Sessão Solene de Abertura do Jubileu de Ouro (50 Anos)", type: "cerimônia" },
    { time: "10:30 - 12:00", title: "PAINEL 3: Gestão, Sustentabilidade & Governança Mineral (ESG) (Mediação Especializada)", type: "painel" },
    { time: "12:00 - 14:00", title: "Intervalo para Almoço", type: "intervalo" },
    { time: "14:00 - 15:30", title: "PAINEL 4: Inovação, Inteligência de Processos & Futuro da Mineração (Mediação Especializada)", type: "painel" },
    { time: "15:30 - 18:00", title: "Grande Encontro dos Engenheiros de Minas da UFBA", type: "celebração" },
    { time: "18:00 - 23:30", title: "Festa Oficial do Engenheiro de Minas", type: "celebração" },
  ],
};

const typeColors: Record<string, string> = {
  palestra: "bg-blue-500/10 text-blue-800 border-blue-500/20",
  painel: "bg-amber-500/20 text-amber-900 border-amber-500/40 shadow-sm",
  workshop: "bg-emerald-500/10 text-emerald-800 border-emerald-500/20",
  cerimônia: "bg-purple-500/10 text-purple-800 border-purple-500/20",
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
  const [activeTab, setActiveTab] = useState("12/Nov");

  return (
    <section id="programacao" className="py-20 md:py-36 bg-semin-cream relative overflow-hidden">
      {/* Top gold separator line */}
      <div className="absolute top-0 left-0 w-full h-px bg-[linear-gradient(90deg,transparent_0%,transparent_35%,hsl(var(--semin-yellow))_50%,transparent_65%,transparent_100%)] opacity-35" />
      
      {/* High-end ambient glows */}
      <div className="absolute top-0 right-0 w-80 md:w-[600px] h-80 md:h-[600px] bg-semin-yellow/15 rounded-full blur-[100px] md:blur-[180px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-semin-orange/10 rounded-full blur-[80px] md:blur-[150px] opacity-40 pointer-events-none" />

      <div ref={ref} className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
        
        {/* Header Section */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2.5 font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-semin-orange font-semibold mb-4 md:mb-5">
            <Pickaxe className="h-3.5 w-3.5 animate-pulse" />
            Eixos Temáticos, 4 Painéis & Cronograma
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 tracking-tight leading-tight text-semin-blue">
            Nossa <span className="bg-gradient-to-r from-semin-orange to-amber-500 bg-clip-text text-transparent font-extrabold">Programação</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-5 md:mb-7">
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-r from-transparent via-semin-yellow/50 to-semin-yellow rounded-full" />
            <Gem className="h-4 w-4 md:h-5 md:w-5 text-semin-orange/70" />
            <div className="w-10 md:w-16 h-[2px] bg-gradient-to-l from-transparent via-semin-yellow/50 to-semin-yellow rounded-full" />
          </div>
          <p className="font-body text-sm md:text-base text-semin-blue/70 max-w-3xl mx-auto leading-relaxed font-medium">
            De <b>9 a 14 de Novembro</b> no <b>Auditório Leopoldo Amaral</b> (Escola Politécnica da UFBA). Uma semana histórica integrando formação técnica, palestras magnas e 4 grandes painéis de discussão com a indústria.
          </p>
        </div>

        {/* ── 4 GRANDES PAINÉIS DE DISCUSSÃO (SHOWCASE ESTRATÉGICO) ── */}
        <div className={`mb-16 md:mb-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="bg-white/90 backdrop-blur-md border border-amber-500/20 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-black/5 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-semin-orange" />
                  Eixo de Debates & Liderança
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-semin-blue">
                  Os 4 Grandes Painéis de Discussão
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a href="/patrocinio" className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-semin-orange hover:text-amber-600 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2 rounded-xl transition-all">
                  <ShieldCheck className="w-4 h-4" />
                  Mediação: Cotas Diamante & Córindon
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {panelsData.map((p) => {
                const Icon = p.icon;
                return (
                  <div 
                    key={p.number}
                    onClick={() => setActiveTab(p.tabKey)}
                    className="cursor-pointer bg-semin-cream/60 hover:bg-white border border-black/5 hover:border-amber-500/40 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-semin-blue/10 text-semin-blue">
                          Painel {p.number}
                        </span>
                        <span className="text-[11px] font-bold text-semin-orange">
                          {p.badge}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-semin-yellow to-semin-orange flex items-center justify-center text-semin-dark mb-3 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm md:text-base text-semin-blue group-hover:text-semin-orange transition-colors mb-2 leading-snug">
                        {p.title}
                      </h4>
                      <p className="text-xs text-semin-blue/70 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] font-semibold text-semin-blue/60 group-hover:text-semin-orange">
                      <span>Ver horário na grade</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Scheduler Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          
          {/* Glassmorphic Tabs Selection Bar */}
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
                const isPanel = item.type === "painel";
                return (
                  <div
                    key={i}
                    className={`relative transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    
                    {/* Glowing timeline node */}
                    <div className="absolute left-[-51px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-white border-2 border-black/10 shadow-sm group flex items-center justify-center z-20 hidden md:flex transition-all duration-300 hover:scale-125 hover:border-semin-orange">
                      <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        isPanel ? "bg-amber-500 scale-125 animate-pulse" : (item.type === "intervalo" ? "bg-zinc-400" : "bg-semin-orange")
                      }`} />
                    </div>

                    {/* Timeline card row */}
                    <Card className={`${
                      isPanel 
                        ? "bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40 border-2 border-amber-400/60 shadow-[0_8px_30px_rgba(234,179,8,0.1)]" 
                        : "bg-white hover:bg-white/[0.98] border-0 border-l-[4px] border-l-semin-yellow shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
                    } hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl md:rounded-2xl overflow-hidden group`}>
                      <CardContent className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        {/* Time & Title cluster */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6 flex-1 text-left">
                          
                          {/* Time tag */}
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit shrink-0 ${
                            isPanel ? "bg-amber-500/15 border border-amber-500/30 text-amber-900 font-bold" : "text-semin-blue/60 bg-semin-cream border border-black/[0.03]"
                          }`}>
                            <Clock className={`h-3.5 w-3.5 ${isPanel ? "text-amber-700" : "text-semin-orange"} group-hover:rotate-12 transition-transform`} />
                            <span className="font-body text-xs md:text-sm font-semibold tracking-wide">{item.time}</span>
                          </div>

                          {/* Event title */}
                          <div className="space-y-1">
                            <h4 className={`font-body text-base md:text-lg font-bold leading-snug transition-colors duration-300 ${
                              isPanel ? "text-amber-950 group-hover:text-amber-700" : "text-semin-blue group-hover:text-semin-orange"
                            }`}>
                              {item.title}
                            </h4>
                            {isPanel && (
                              <p className="text-xs text-amber-800/80 font-medium">
                                Debate estratégico conduzido por mediadores das empresas patrocinadoras (Cotas Diamante & Córindon).
                              </p>
                            )}
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