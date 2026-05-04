import { Award, Pickaxe, MessageSquare, Users, Gem, Radio, Info, GraduationCap, Building2, BookOpen } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const AboutSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="sobre" className="py-20 md:py-32 bg-[#F8F9FA] relative overflow-hidden">
      {/* Premium Background Elements — reduced on mobile */}
      <div className="absolute top-0 right-0 w-48 md:w-[600px] h-48 md:h-[600px] bg-semin-yellow/5 rounded-full blur-[40px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-200px] hidden md:block md:w-[500px] md:h-[500px] bg-semin-blue/5 rounded-full md:blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] hidden md:block" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' fill='none' stroke='%23999' stroke-width='0.5'/%3E%3C/svg%3E\")"}} />

      <div ref={ref} className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
        
        {/* ── Section Header ── */}
        <div className={`text-center mb-16 md:mb-24 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-semin-yellow/30 bg-semin-yellow/10 mb-6 shadow-sm">
            <Gem className="h-4 w-4 text-semin-orange" />
            <span className="font-body text-[10px] md:text-sm uppercase tracking-[0.2em] font-bold text-semin-orange">
              A Essência do Evento
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-semin-blue mb-6 tracking-tight">
            Meio Século Formando os Líderes da <br className="hidden md:block" />
            <span className="text-semin-yellow">Mineração Baiana</span>
          </h2>
          
          <p className="font-sans text-base md:text-xl text-semin-blue/70 max-w-3xl mx-auto leading-relaxed font-medium">
            Em 2026, celebramos a força e a tradição de um curso que é o pilar do setor mineral na Bahia. Documentamos 50 anos de excelência acadêmica, inovação tecnológica e o compromisso inabalável com o desenvolvimento do nosso estado.
          </p>
        </div>

        {/* ── Bento Grid Layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
          
          {/* Main Info Card (Spans 8 cols on desktop) */}
          <div className={`md:col-span-8 bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] relative overflow-hidden group transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="absolute -top-10 -right-10 w-48 md:w-80 h-48 md:h-80 bg-semin-yellow/15 rounded-full blur-[30px] md:blur-[80px] pointer-events-none transition-transform duration-1000 group-hover:scale-125" />
            
            <h3 className="font-display text-2xl md:text-3xl font-bold text-semin-blue mb-4 relative z-10">Meio Século de Protagonismo Mineral</h3>
            <p className="text-sm md:text-base text-semin-blue/70 leading-relaxed max-w-2xl relative z-10 mb-8 font-medium"
               style={{ fontFamily: "'Outfit', 'Inter', system-ui, sans-serif" }}>
              O SEMIN UFBA 2026 marca o ápice de uma trajetória extraordinária: o <strong>Jubileu de Ouro da Engenharia de Minas da UFBA</strong>. Mais do que uma celebração, este evento é o registro histórico de um curso que nasceu para desbravar o potencial mineral da Bahia e acabou por moldar a própria identidade da mineração brasileira.
              <br/><br/>
              Ao longo de 50 anos, a Escola Politécnica foi o berço das lideranças que hoje comandam as maiores operações minerais do estado. Este encontro documenta esse legado vivo, unindo veteranos que ergueram os alicerces da indústria e jovens talentos que liderarão a próxima fronteira tecnológica e sustentável do setor.
            </p>

            <div className="flex flex-wrap gap-3 relative z-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-semin-blue/5 text-semin-blue font-medium text-sm">
                <GraduationCap className="w-4 h-4 text-semin-orange" />
                Estudantes
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-semin-blue/5 text-semin-blue font-medium text-sm">
                <Building2 className="w-4 h-4 text-semin-orange" />
                Profissionais
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-semin-blue/5 text-semin-blue font-medium text-sm">
                <BookOpen className="w-4 h-4 text-semin-orange" />
                Pesquisadores
              </div>
            </div>
          </div>

          {/* Stats Column (Spans 4 cols on desktop) */}
          <div className="md:col-span-4 grid grid-rows-2 gap-6">
            <div className={`bg-gradient-to-br from-semin-blue to-semin-dark rounded-[2rem] p-8 shadow-lg relative overflow-hidden flex flex-col justify-center items-center text-center group transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="absolute inset-0 opacity-10" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' fill='none' stroke='%23999' stroke-width='0.5'/%3E%3C/svg%3E\")"}} />
              <Award className="w-8 h-8 text-semin-yellow mb-3 relative z-10 opacity-70 group-hover:scale-110 transition-transform" />
              <div className="font-display text-5xl font-black text-white relative z-10">
                50<span className="text-semin-yellow text-3xl"> anos</span>
              </div>
              <p className="font-sans text-white/60 text-sm mt-2 relative z-10 font-medium">Liderando a Mineração Baiana</p>
            </div>

            <div className={`bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] flex flex-col justify-center items-center text-center group transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <Users className="w-8 h-8 text-semin-blue mb-3 opacity-30 group-hover:scale-110 transition-transform" />
              <div className="font-display text-4xl font-black text-semin-blue">
                120<span className="text-semin-orange text-2xl">+</span>
              </div>
              <p className="font-sans text-semin-blue/60 text-sm mt-2 font-medium">Participantes previstos por dia</p>
            </div>
          </div>

        </div>

        {/* ── Pillars ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Pickaxe, title: "Grandes Projetos", desc: "Visão aprofundada dos maiores empreendimentos minerais em desenvolvimento." },
            { icon: MessageSquare, title: "Debate Técnico", desc: "Diálogos francos sobre os desafios tecnológicos e ambientais da atualidade." },
            { icon: Users, title: "Networking", desc: "Prospecção de talentos e conexão direta com os tomadores de decisão do setor." }
          ].map((item, i) => (
            <div 
              key={item.title} 
              className={`bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] hover:-translate-y-2 transition-all duration-500 group ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${(i + 4) * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-semin-yellow/20 to-semin-orange/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <item.icon className="w-6 h-6 text-semin-orange" />
              </div>
              <h4 className="text-xl font-bold text-semin-blue mb-3">{item.title}</h4>
              <p className="text-sm text-semin-blue/60 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Entrada Solidária Banner ── */}


      </div>
    </section>
  );
};

export default AboutSection;
