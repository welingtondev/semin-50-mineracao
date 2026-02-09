import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Clock } from "lucide-react";

const schedule = {
  "Dia 1": [
    { time: "08:00 - 09:00", title: "Credenciamento e Abertura Oficial", type: "cerimônia" },
    { time: "09:00 - 10:30", title: "Panorama da Mineração no Brasil: 50 anos de evolução", type: "palestra" },
    { time: "10:30 - 12:00", title: "Sustentabilidade e ESG na Indústria Mineral", type: "mesa-redonda" },
    { time: "14:00 - 15:30", title: "Tecnologias de Lavra e Beneficiamento", type: "workshop" },
    { time: "15:30 - 17:00", title: "Inteligência Artificial Aplicada à Mineração", type: "palestra" },
  ],
  "Dia 2": [
    { time: "08:30 - 10:00", title: "Geotecnia e Segurança de Barragens", type: "palestra" },
    { time: "10:00 - 12:00", title: "Carreira em Engenharia de Minas: desafios e oportunidades", type: "mesa-redonda" },
    { time: "14:00 - 15:30", title: "Geoprocessamento e Modelagem 3D", type: "workshop" },
    { time: "15:30 - 17:00", title: "Economia Mineral e Mercado Global", type: "palestra" },
    { time: "17:00 - 18:00", title: "Encerramento e Confraternização", type: "cerimônia" },
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
    <section id="programacao" className="py-20 md:py-28 bg-white">
      <div ref={ref} className="container mx-auto px-4">
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-semin-blue mb-4">
            Programação
          </h2>
          <p className="font-body text-semin-blue/60 max-w-xl mx-auto">
            Confira o cronograma completo com palestras, mesas-redondas e workshops.
          </p>
        </div>

        <Tabs defaultValue="Dia 1" className="max-w-3xl mx-auto">
          <TabsList className="w-full bg-semin-cream/50 mb-8">
            {Object.keys(schedule).map((day) => (
              <TabsTrigger
                key={day}
                value={day}
                className="flex-1 font-body font-semibold data-[state=active]:bg-semin-blue data-[state=active]:text-white"
              >
                {day}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(schedule).map(([day, items]) => (
            <TabsContent key={day} value={day} className="space-y-4">
              {items.map((item, i) => (
                <Card
                  key={i}
                  className={`border-l-4 border-l-semin-yellow border-t-0 border-r-0 border-b-0 shadow-sm hover:shadow-md transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2 text-semin-blue/60 min-w-[140px]">
                      <Clock className="h-4 w-4" />
                      <span className="font-body text-sm font-medium">{item.time}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-body font-semibold text-semin-blue">{item.title}</h4>
                    </div>
                    <Badge className={`${typeColors[item.type]} border text-xs capitalize`}>
                      {item.type}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ScheduleSection;
