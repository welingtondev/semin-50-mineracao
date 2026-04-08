import { Award, Pickaxe, MessageSquare, Users, Gem, HeartHandshake, MapPin, Calendar, Radio, Info, ExternalLink, GraduationCap, Building2, BookOpen } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const AboutSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="sobre" className="py-20 md:py-32 bg-[#F8F9FA] relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-semin-yellow/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-200px] w-[500px] h-[500px] bg-semin-blue/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />

      <div ref={ref} className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
        
        {/* ── Section Header ── */}
        <div className={`text-center mb-16 md:mb-24 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-semin-yellow/30 bg-semin-yellow/10 mb-6 shadow-sm">
            <Gem className="h-4 w-4 text-semin-orange" />
            <span className="font-body text-[10px] md:text-sm uppercase tracking-[0.2em] font-bold text-semin-orange">
              A Essência do Evento
            </span>
          </div>
          
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-semin-blue mb-6">
            O Maior Encontro Acadêmico de <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-semin-yellow to-semin-orange bg-clip-text text-transparent">Mineração da Bahia</span>
          </h2>
          
          <p className="font-body text-base md:text-xl text-semin-blue/70 max-w-3xl mx-auto leading-relaxed">
            Em 2026, celebramos o <strong className="text-semin-blue">Jubileu de Ouro</strong> da Engenharia de Minas da UFBA. Um marco de 50 anos formando líderes, impulsionando a inovação e conectando gerações de profissionais que transformam o cenário mineral.
          </p>
        </div>

        {/* ── Bento Grid Layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
          
          {/* Main Info Card (Spans 8 cols on desktop) */}
          <div className={`md:col-span-8 bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] relative overflow-hidden group transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-semin-yellow/10 to-transparent rounded-bl-[100px] transition-transform duration-700 group-hover:scale-110" />
            
            <h3 className="font-display text-2xl md:text-3xl font-bold text-semin-blue mb-4 relative z-10">O que é o SEMIN?</h3>
            <p className="font-body text-sm md:text-base text-semin-blue/70 leading-relaxed max-w-2xl relative z-10 mb-8">
              A Semana de Mineração (SEMIN) não é apenas um evento, é um marco histórico. Este ano, a edição é inteiramente dedicada a celebrar o grandioso <strong>Jubileu de Ouro — os 50 anos do curso de Engenharia de Minas da UFBA</strong>. 
              <br/><br/>
              Serão quatro dias promovendo o reencontro de gerações através de palestras inspiradoras, debates técnicos sobre nossa realidade e uma oportunidade rara de estar, no mesmo ambiente, com nomes que ajudaram a construir (e que guiarão o futuro) da mineração no Brasil.
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
              <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <Award className="w-8 h-8 text-semin-yellow mb-3 relative z-10 opacity-70 group-hover:scale-110 transition-transform" />
              <div className="font-display text-5xl font-black text-white relative z-10">
                50<span className="text-semin-yellow text-3xl"> anos</span>
              </div>
              <p className="font-body text-white/60 text-sm mt-2 relative z-10">de tradição e excelência</p>
            </div>

            <div className={`bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] flex flex-col justify-center items-center text-center group transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <Users className="w-8 h-8 text-semin-blue mb-3 opacity-30 group-hover:scale-110 transition-transform" />
              <div className="font-display text-4xl font-black text-semin-blue">
                120<span className="text-semin-orange text-2xl">+</span>
              </div>
              <p className="font-body text-semin-blue/60 text-sm mt-2">Participantes previstos por dia</p>
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
              <h4 className="font-display text-xl font-bold text-semin-blue mb-3">{item.title}</h4>
              <p className="font-body text-sm text-semin-blue/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Entrada Solidária Banner ── */}
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgb(0,0,0,0.06)] border border-semin-yellow/10 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12">
            
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-semin-yellow/5 to-transparent pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-semin-orange/5 rounded-full blur-[60px] pointer-events-none" />

            <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-semin-yellow/20 to-semin-orange/10 flex items-center justify-center shadow-inner border border-white relative z-10">
              <HeartHandshake className="w-12 h-12 md:w-16 md:h-16 text-semin-orange" />
            </div>
            
            <div className="text-center md:text-left relative z-10 flex-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-semin-blue/5 text-semin-blue text-xs font-bold uppercase tracking-widest mb-4">
                Impacto Social
              </span>
              <h3 className="font-display text-2xl md:text-4xl font-bold text-semin-blue mb-4">
                Entrada Solidária
              </h3>
              <p className="font-body text-base md:text-lg text-semin-blue/70 leading-relaxed mb-6">
                Sua participação transforma vidas. O acesso ao evento é garantido mediante a doação de <strong className="text-semin-blue">1 kg de alimento não perecível</strong>, que será integralmente destinado ao{" "}
                <a 
                  href="https://investidoresdaesperanca.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-semin-orange font-bold hover:text-amber-500 underline underline-offset-4 decoration-semin-orange/30 transition-colors"
                >
                  Instituto IDE
                  <ExternalLink className="w-4 h-4 ml-0.5" />
                </a>.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 pt-4 border-t border-black/5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-semin-yellow" />
                  <span className="font-body text-sm font-medium text-semin-blue/80">Auditório Leopoldo Amaral - UFBA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-semin-yellow" />
                  <span className="font-body text-sm font-medium text-semin-blue/80">09 a 12 de Nov 2026</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
