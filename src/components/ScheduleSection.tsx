import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Pickaxe, Gem } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const schedule = {
  "Dia 1": [
    { time: "08:00 - 09:00", title: "XXXXXXX", type: "cerimônia" },
    { time: "09:00 - 10:30", title: "XXXXXXX", type: "palestra" },
    { time: "10:30 - 12:00", title: "XXXXXXX", type: "mesa-redonda" },
    { time: "14:00 - 15:30", title: "XXXXXXX", type: "workshop" },
    { time: "15:30 - 17:00", title: "XXXXXXX", type: "palestra" },
  ],
  "Dia 2": [
    { time: "08:30 - 10:00", title: "XXXXXXX", type: "palestra" },
    { time: "10:00 - 12:00", title: "XXXXXXX", type: "mesa-redonda" },
    { time: "14:00 - 15:30", title: "XXXXXXX", type: "workshop" },
    { time: "15:30 - 17:00", title: "XXXXXXX", type: "palestra" },
    { time: "17:00 - 18:00", title: "XXXXXXX", type: "cerimônia" },
  ],
};

const typeColors: Record<string, string> = {
  palestra: "bg-semin-yellow/20 text-semin-orange border-semin-yellow/30",
  "mesa-redonda": "bg-semin-blue/10 text-semin-blue border-semin-blue/20",
  workshop: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cerimônia: "bg-semin-cream text-semin-dark border-semin-orange/20",
};

const ScheduleSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="programacao" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-semin-yellow via-semin-orange to-semin-yellow" />

      <div ref={ref} className="container mx-auto px-4">
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.3em] text-semin-orange font-semibold mb-4">
            <Pickaxe className="h-3.5 w-3.5" />
            Cronograma
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-semin-blue mb-4">
            Programação
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-semin-yellow rounded-full" />
            <Gem className="h-4 w-4 text-semin-yellow" />
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-semin-yellow rounded-full" />
          </div>
          <p className="font-body text-semin-blue/60 max-w-xl mx-auto">
            Confira o cronograma completo com palestras, mesas-redondas e workshops.
          </p>
        </div>

        <Tabs defaultValue="Dia 1" className="max-w-3xl mx-auto">
          <TabsList className="w-full bg-semin-cream/60 mb-8 p-1.5 rounded-xl">
            {Object.keys(schedule).map((day) => (
              <TabsTrigger
                key={day}
                value={day}
                className="flex-1 font-body font-semibold rounded-lg data-[state=active]:bg-semin-blue data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                {day}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(schedule).map(([day, items]) => (
            <TabsContent key={day} value={day} className="space-y-4">
              {items.map((item, i) => (
                <div
                  key={i}
                  className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                  style={{ transitionDelay: `${i * 60 + 200}ms` }}
                >
                  <Card className="border-l-4 border-l-semin-yellow border-t-0 border-r-0 border-b-0 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                    <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-2 text-semin-blue/50 min-w-[150px]">
                        <Clock className="h-4 w-4 group-hover:text-semin-yellow transition-colors" />
                        <span className="font-body text-sm font-medium">{item.time}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-body font-semibold text-semin-blue group-hover:text-semin-orange transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <Badge className={`${typeColors[item.type]} border text-xs capitalize`}>
                        {item.type}
                      </Badge>
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
